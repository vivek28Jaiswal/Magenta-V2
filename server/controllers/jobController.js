import { Job } from '../models/Job.js';
import { Resume } from '../models/Resume.js';
import { SavedJob } from '../models/SavedJob.js';
import { getOrCalculateJobRelevance } from '../services/jobs/jobRelevanceService.js';
import { ingestJobs } from '../services/jobs/jobIngestionService.js';
import { logger } from '../utils/logger.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { timeframe = '24h', workMode, role, location, relevanceCategory, fit } = req.query;

    const resume = await Resume.findOne({ userId });
    
    // If user does not have a resume yet, handle gracefully with a warm message
    if (!resume || !resume.structuredProfile) {
      return res.json({
        timeframe,
        hasResume: false,
        count: 0,
        jobs: [],
        friendlyMessage: "Hey! Drop your resume or portfolio in first, and I'll find jobs that actually fit what you know.",
      });
    }

    // Determine publication date cutoff
    const now = new Date();
    let cutoffDate;
    if (timeframe === '24h') {
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (timeframe === '3d') {
      cutoffDate = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    } else {
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Query filter
    const query = {
      status: 'active',
      publishedAt: { $gte: cutoffDate },
    };

    if (workMode && workMode !== 'all') {
      query.workMode = workMode;
    }

    if (location && location.trim()) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (role && role.trim()) {
      query.title = { $regex: role.trim(), $options: 'i' };
    }

    let jobs = await Job.find(query).sort({ publishedAt: -1 }).limit(50);

    // If database is empty, run auto-ingestion
    if (jobs.length === 0) {
      logger.info('No jobs in queried timeframe. Triggering initial ingestion...');
      await ingestJobs();
      jobs = await Job.find(query).sort({ publishedAt: -1 }).limit(50);
    }

    // Calculate candidate relevance and fetch saved job records
    const savedJobs = await SavedJob.find({ userId });
    const savedMap = new Map();
    savedJobs.forEach(s => savedMap.set(String(s.jobId), s.applicationStatus));

    const enrichedJobs = await Promise.all(
      jobs.map(async job => {
        const relevance = await getOrCalculateJobRelevance(
          userId,
          resume.structuredProfile,
          job
        );

        return {
          id: job._id,
          title: job.title,
          company: job.company,
          companyLogo: job.companyLogo,
          location: job.location,
          country: job.country,
          workMode: job.workMode,
          employmentType: job.employmentType,
          experienceLevel: job.experienceLevel,
          skills: job.skills,
          description: job.description,
          publishedAt: job.publishedAt,
          originalUrl: job.originalUrl,
          source: job.source,
          matchScore: relevance.matchScore || 0,
          friendlyHeadline: relevance.friendlyHeadline || '',
          whyPicked: relevance.whyPicked || '',
          beforeYouApply: relevance.beforeYouApply || '',
          relevance: {
            category: relevance.relevanceCategory,
            explanation: relevance.explanation,
            matchingSkills: relevance.matchingSkills,
            missingImportantSkills: relevance.missingImportantSkills,
            relevantExperienceEvidence: relevance.relevantExperienceEvidence,
          },
          savedStatus: savedMap.get(String(job._id)) || null,
        };
      })
    );

    let results = enrichedJobs;

    // Filter by fit if requested (e.g. 90%+ match)
    if (fit === 'strong') {
      results = results.filter(j => j.matchScore >= 90);
    } else if (fit === 'good') {
      results = results.filter(j => j.matchScore >= 75);
    }

    // Filter by relevance category if requested
    if (relevanceCategory && relevanceCategory !== 'all') {
      results = results.filter(j => j.relevance.category === relevanceCategory);
    }

    // Prioritize high match scores (90%+ first), then by recency
    results.sort((a, b) => {
      const scoreDiff = (b.matchScore || 0) - (a.matchScore || 0);
      if (Math.abs(scoreDiff) >= 5) {
        return scoreDiff;
      }
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    res.json({
      timeframe,
      hasResume: true,
      count: results.length,
      jobs: results,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { timeframe = '24h', workMode, search } = req.query;
    const now = new Date();
    const cutoff = timeframe === '3d' 
      ? new Date(now.getTime() - 72 * 3600 * 1000) 
      : new Date(now.getTime() - 24 * 3600 * 1000);

    const filter = { status: 'active', publishedAt: { $gte: cutoff } };
    if (workMode && workMode !== 'all') filter.workMode = workMode;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter).sort({ publishedAt: -1 }).limit(50);
    res.json({ count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found.' });
    }
    res.json({ job });
  } catch (error) {
    next(error);
  }
};

export const saveJob = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const saved = await SavedJob.findOneAndUpdate(
      { userId, jobId },
      { $setOnInsert: { userId, jobId, savedAt: new Date(), applicationStatus: 'saved' } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Job saved to your list.', savedJob: saved });
  } catch (error) {
    next(error);
  }
};

export const unsaveJob = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    await SavedJob.findOneAndDelete({ userId, jobId });
    res.json({ message: 'Job removed from your saved list.' });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;
    const { status, notes } = req.body;

    const allowed = ['saved', 'reviewing', 'applied', 'interviewing', 'rejected', 'offer'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid application status value.' });
    }

    const updated = await SavedJob.findOneAndUpdate(
      { userId, jobId },
      { $set: { applicationStatus: status, notes, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.json({ message: 'Application status updated.', savedJob: updated });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const saved = await SavedJob.find({ userId })
      .populate('jobId')
      .sort({ updatedAt: -1 });

    const formatted = saved
      .filter(s => s.jobId)
      .map(s => ({
        id: s.jobId._id,
        savedId: s._id,
        title: s.jobId.title,
        company: s.jobId.company,
        companyLogo: s.jobId.companyLogo,
        location: s.jobId.location,
        workMode: s.jobId.workMode,
        employmentType: s.jobId.employmentType,
        experienceLevel: s.jobId.experienceLevel,
        skills: s.jobId.skills,
        description: s.jobId.description,
        publishedAt: s.jobId.publishedAt,
        originalUrl: s.jobId.originalUrl,
        applicationStatus: s.applicationStatus,
        notes: s.notes,
        savedAt: s.savedAt,
      }));

    res.json({ count: formatted.length, savedJobs: formatted });
  } catch (error) {
    next(error);
  }
};

export const getSourcesStatus = async (req, res, next) => {
  try {
    const now = new Date();
    const cutoff24h = new Date(now.getTime() - 24 * 3600 * 1000);
    const cutoff3d = new Date(now.getTime() - 72 * 3600 * 1000);

    const [totalActive, fresh24h, fresh3d] = await Promise.all([
      Job.countDocuments({ status: 'active' }),
      Job.countDocuments({ status: 'active', publishedAt: { $gte: cutoff24h } }),
      Job.countDocuments({ status: 'active', publishedAt: { $gte: cutoff3d } }),
    ]);

    res.json({
      totalActive,
      freshLast24Hours: fresh24h,
      freshLast3Days: fresh3d,
      sources: [
        { name: 'Verified Engineering Feed (India & Remote)', status: 'operational', activeJobs: fresh3d },
        { name: 'Remotive Live Developer API', status: 'operational', activeJobs: fresh24h },
      ],
    });
  } catch (error) {
    next(error);
  }
};

export {
  saveJob as saveJobHandler,
  unsaveJob as unsaveJobHandler,
  updateApplicationStatus as updateApplicationStatusHandler,
  getSavedJobs as getSavedJobsHandler,
  getSourcesStatus as getSourcesStatusHandler,
};
