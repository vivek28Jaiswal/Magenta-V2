import axios from 'axios';
import { logger } from '../../utils/logger.js';

export const fetchRemotiveJobs = async () => {
  try {
    logger.info('Fetching live remote jobs from Remotive API...');
    const response = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=40', {
      timeout: 8000,
    });

    const jobs = response.data?.jobs || [];
    logger.info(`Fetched ${jobs.length} jobs from Remotive API`);

    // Filter jobs open to India or Worldwide
    const eligibleJobs = jobs.filter(job => {
      const loc = (job.candidate_required_location || '').toLowerCase();
      return (
        !loc ||
        loc.includes('worldwide') ||
        loc.includes('anywhere') ||
        loc.includes('india') ||
        loc.includes('apac') ||
        loc.includes('all')
      );
    });

    return eligibleJobs.map(job => ({
      source: 'remotive',
      sourceJobId: String(job.id),
      title: job.title,
      company: job.company_name,
      companyLogo: job.company_logo || null,
      description: job.description,
      location: job.candidate_required_location || 'Remote Worldwide / India Eligible',
      country: 'Remote',
      workMode: 'remote',
      employmentType: (job.job_type || 'full_time').replace('_', '-').toLowerCase(),
      experienceLevel: /senior|lead|principal/i.test(job.title) ? 'senior' : /junior|entry/i.test(job.title) ? 'entry' : 'mid',
      skills: job.tags || [],
      publishedAt: new Date(job.publication_date),
      originalUrl: job.url,
      fetchedAt: new Date(),
      status: 'active',
    }));
  } catch (error) {
    logger.warn(`Remotive API fetch issue (${error.message}). Continuing with local verified feed.`);
    return [];
  }
};
