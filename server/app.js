import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import os from 'os';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const app = express();

// Security headers
app.use(helmet());

// Flexible CORS configuration for Vercel, production & local dev
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null;

      // Allow configured client URL, localhost, and any vercel preview deployment
      if (
        !clientUrl ||
        origin === clientUrl ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Rate limiting (generous, protective against DOS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory (supports /tmp on serverless/Vercel)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsDir = isServerless ? path.join(os.tmpdir(), 'magenta-uploads') : path.resolve('uploads');
app.use('/uploads', express.static(uploadsDir));

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Magenta API Server',
    environment: process.env.NODE_ENV || 'development',
    serverless: isServerless,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      jobs: '/api/jobs',
      resume: '/api/resume',
      application: '/api/application',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Magenta API Server',
    timestamp: new Date().toISOString(),
    aiProvider: process.env.AI_PROVIDER || 'gemini',
    aiKeyConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
  });
});

// Ensure Database is connected for all API routes (crucial for Vercel Serverless Functions)
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS' || req.path === '/api/health' || req.path === '/') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    logger.error(`Database connection middleware error on ${req.originalUrl}: ${error.message}`);
    return res.status(500).json({
      message: 'Database connection failed. Please ensure MONGODB_URI is configured correctly in Vercel.',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

// Mount Routes (supporting both /api/* and /* so mismatched base URLs never 404)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/resume', resumeRoutes);
app.use('/resume', resumeRoutes);

app.use('/api/application', applicationRoutes);
app.use('/application', applicationRoutes);

app.use('/api/jobs', jobRoutes);
app.use('/jobs', jobRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
