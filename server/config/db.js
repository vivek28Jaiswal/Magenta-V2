import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/magenta';

  try {
    // Attempt standard connection first with a short timeout
    logger.info(`Attempting MongoDB connection to: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.warn(`Could not connect to external/local MongoDB (${error.message}). Initializing embedded in-memory MongoDB...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      await mongoose.connect(inMemoryUri);
      logger.info(`Connected to embedded in-memory MongoDB at: ${inMemoryUri}`);
    } catch (memErr) {
      logger.error('Failed to start in-memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
