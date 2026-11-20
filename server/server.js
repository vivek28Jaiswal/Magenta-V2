import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { ingestJobs } from './services/jobs/jobIngestionService.js';
import { seedDemoUser } from './services/seedDemoUser.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Ensure demo user with valid credentials & profile exists
    await seedDemoUser();

    // Trigger initial job ingestion to ensure fresh 24h & 3d jobs
    ingestJobs().catch(err => {
      logger.warn(`Background job ingestion deferred: ${err.message}`);
    });

    app.listen(PORT, () => {
      logger.info(`================================================`);
      logger.info(`  Magenta API Server running on port ${PORT}`);
      logger.info(`  Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      logger.info(`  Health check: http://localhost:${PORT}/api/health`);
      logger.info(`  Demo Login: vivek@example.com / password123`);
      logger.info(`================================================`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
