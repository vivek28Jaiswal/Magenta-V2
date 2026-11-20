import { Resume } from '../models/Resume.js';
import { ApplicationAnalysis } from '../models/ApplicationAnalysis.js';
import { generateApplicationClarityReport } from '../services/analysis/applicationClarityService.js';
import { extractJobFromUrl } from '../services/scraper/jobScraperService.js';
import { logger } from '../utils/logger.js';

export const extractJobUrlHandler = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || url.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid job posting URL.',
      });
    }

    const result = await extractJobFromUrl(url.trim());
    if (!result.success) {
      return res.status(422).json({
        success: false,
        isProtected: result.isProtected || false,
        portalName: result.portalName || '',
        message: result.message,
      });
    }

    res.json({
      success: true,
      job: {
        title: result.title,
        company: result.company,
        location: result.location,
        description: result.description,
        originalUrl: result.originalUrl,
      },
    });
  } catch (error) {
    logger.error('Error in extractJobUrlHandler:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to extract job details from this URL. Please copy and paste the text directly.',
    });
  }
};

export const analyzeOpportunity = async (req, res, next) => {
  try {
    let { jobDescription, jobDetails = {}, title, company, location, workMode, originalUrl } = req.body;
    const userId = req.user._id;

    if (!jobDescription || typeof jobDescription !== 'string') {
      return res.status(400).json({
        message: 'Please provide a job description or job posting URL.',
      });
    }

    let cleanDescription = jobDescription.trim();

    // If jobDescription is a URL, attempt automatic extraction
    if (/^https?:\/\//i.test(cleanDescription) && !cleanDescription.includes('\n')) {
      logger.info(`Detected URL in jobDescription: ${cleanDescription}. Attempting extraction...`);
      originalUrl = originalUrl || cleanDescription;
      const extracted = await extractJobFromUrl(cleanDescription);
      
      if (!extracted.success) {
        return res.status(400).json({
          message: extracted.message || 'Could not automatically load this URL. Please copy the job description text and paste it directly into the box.',
          isProtected: extracted.isProtected || false,
        });
      }

      cleanDescription = extracted.description;
      title = title || extracted.title;
      company = company || extracted.company;
      location = location || extracted.location;
    }

    if (cleanDescription.length < 50) {
      return res.status(400).json({
        message: 'The job description is too short (minimum 50 characters). Please paste the complete job description text including responsibilities and requirements.',
      });
    }

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(400).json({
        message: 'You have not uploaded a resume yet. Please upload or paste your resume first so Application Clarity can verify evidence.',
      });
    }

    if (!resume.structuredProfile) {
      return res.status(400).json({
        message: 'Your resume is still being processed. Please try again in a few moments.',
      });
    }

    // Merge metadata
    const mergedDetails = {
      title: title || jobDetails.title || 'Target Position',
      company: company || jobDetails.company || 'Target Organization',
      location: location || jobDetails.location || 'Remote',
      workMode: workMode || jobDetails.workMode || 'remote',
      originalUrl: originalUrl || jobDetails.originalUrl || '',
    };

    logger.info(`Analyzing opportunity for user: ${userId} (${mergedDetails.title} @ ${mergedDetails.company})`);

    const report = await generateApplicationClarityReport({
      userId,
      resumeId: resume._id,
      jobDescription: cleanDescription,
      jobDetails: mergedDetails,
    });

    res.status(201).json({
      message: 'Application Clarity Report generated successfully.',
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAnalyses = async (req, res, next) => {
  try {
    const analyses = await ApplicationAnalysis.find({ userId: req.user._id })
      .select('jobDetails overview createdAt')
      .sort({ createdAt: -1 });

    res.json({ analyses });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await ApplicationAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Application analysis report not found.' });
    }

    res.json({ report: analysis });
  } catch (error) {
    next(error);
  }
};
