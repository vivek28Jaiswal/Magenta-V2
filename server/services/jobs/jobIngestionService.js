import { Job } from '../../models/Job.js';
import { fetchRemotiveJobs } from './remotiveAdapter.js';
import { getVerifiedJobSeedData } from './seedJobs.js';
import { logger } from '../../utils/logger.js';

export const ingestJobs = async () => {
  logger.info('Starting job ingestion process...');
  let totalIngested = 0;

  // 1. Ingest verified feed jobs (India & Worldwide remote)
  const seedJobs = getVerifiedJobSeedData();
  for (const jobData of seedJobs) {
    try {
      await Job.findOneAndUpdate(
        { source: jobData.source, sourceJobId: jobData.sourceJobId },
        { $set: jobData },
        { upsert: true, new: true }
      );
      totalIngested++;
    } catch (err) {
      logger.error(`Error saving verified job ${jobData.title}:`, err.message);
    }
  }

  // 2. Fetch live jobs from Remotive API
  const liveJobs = await fetchRemotiveJobs();
  for (const jobData of liveJobs) {
    try {
      await Job.findOneAndUpdate(
        { source: jobData.source, sourceJobId: jobData.sourceJobId },
        { $set: jobData },
        { upsert: true, new: true }
      );
      totalIngested++;
    } catch (err) {
      logger.error(`Error saving Remotive job ${jobData.title}:`, err.message);
    }
  }

  logger.info(`Job ingestion complete. Upserted ${totalIngested} jobs into MongoDB.`);
  return totalIngested;
};
