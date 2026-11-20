import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['remotive', 'adzuna', 'greenhouse', 'lever', 'manual', 'verified_feed'],
    default: 'verified_feed',
  },
  sourceJobId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  companyLogo: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: 'Remote / India',
  },
  country: {
    type: String,
    default: 'India',
  },
  workMode: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site'],
    default: 'remote',
    index: true,
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time',
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'unspecified'],
    default: 'mid',
  },
  skills: {
    type: [String],
    default: [],
  },
  publishedAt: {
    type: Date,
    required: true,
    index: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active',
  },
});

jobSchema.index({ source: 1, sourceJobId: 1 }, { unique: true });

export const Job = mongoose.model('Job', jobSchema);
