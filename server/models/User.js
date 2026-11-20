import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    default: null,
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  preferences: {
    preferredRoles: [String],
    preferredLocations: [String],
    workModes: [{
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);
