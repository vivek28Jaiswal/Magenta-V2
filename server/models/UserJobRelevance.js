import mongoose from 'mongoose';

const userJobRelevanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  relevanceCategory: {
    type: String,
    enum: ['Relevant', 'Potentially Relevant', 'Low Relevance'],
    required: true,
    index: true,
  },
  matchScore: {
    type: Number,
    required: true,
    default: 0,
  },
  friendlyHeadline: {
    type: String,
    default: '',
  },
  whyPicked: {
    type: String,
    default: '',
  },
  beforeYouApply: {
    type: String,
    default: '',
  },
  explanation: {
    type: String,
    required: true,
  },
  matchingSkills: {
    type: [String],
    default: [],
  },
  missingImportantSkills: {
    type: [String],
    default: [],
  },
  relevantExperienceEvidence: {
    type: [String],
    default: [],
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
});

userJobRelevanceSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const UserJobRelevance = mongoose.model('UserJobRelevance', userJobRelevanceSchema);
