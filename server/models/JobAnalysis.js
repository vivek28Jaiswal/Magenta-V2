import mongoose from 'mongoose';

const jobAnalysisSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    unique: true,
  },
  mandatoryRequirements: [{
    name: String,
    category: String,
    evidenceInJD: String,
    explanation: String,
  }],
  preferredRequirements: [{
    name: String,
    category: String,
    evidenceInJD: String,
    explanation: String,
  }],
  unclearRequirements: [{
    name: String,
    category: String,
    evidenceInJD: String,
    explanation: String,
  }],
  responsibilities: [String],
  experienceRequirements: String,
  educationRequirements: String,
  contradictions: [String],
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

export const JobAnalysis = mongoose.model('JobAnalysis', jobAnalysisSchema);
