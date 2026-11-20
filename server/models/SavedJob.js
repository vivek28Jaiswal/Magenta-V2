import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema({
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
  applicationStatus: {
    type: String,
    enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected'],
    default: 'saved',
  },
  notes: {
    type: String,
    default: '',
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model('SavedJob', savedJobSchema);
