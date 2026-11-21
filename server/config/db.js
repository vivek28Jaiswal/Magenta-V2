import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let mongodInstance = null;
let cachedPromise = null;

export const connectDB = async () => {
  // 1. Return immediately if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. Return pending connection promise if in progress
  if (cachedPromise && mongoose.connection.readyState === 2) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/magenta';
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production');

  cachedPromise = (async () => {
    try {
      logger.info('Connecting to MongoDB...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info('Connected to MongoDB successfully');
      return mongoose.connection;
    } catch (error) {
      cachedPromise = null;

      // In Vercel serverless or production, fail fast and clear rather than hanging
      if (isServerless) {
        logger.error(`MongoDB connection failed in serverless/production: ${error.message}`);
        throw error;
      }

      logger.warn(`Could not connect to external MongoDB (${error.message}). Initializing embedded in-memory MongoDB...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const inMemoryUri = mongodInstance.getUri();
        await mongoose.connect(inMemoryUri);
        logger.info(`Connected to embedded in-memory MongoDB at: ${inMemoryUri}`);
        return mongoose.connection;
      } catch (memErr) {
        logger.error('Failed to start in-memory MongoDB:', memErr.message);
        throw memErr;
      }
    }
  })();

  return cachedPromise;
};

export const closeDB = async () => {
  await mongoose.disconnect();
  cachedPromise = null;
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
