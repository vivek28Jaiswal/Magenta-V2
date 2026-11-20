import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  originalFileReference: {
    type: String,
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff', 'image'],
    required: true,
  },
  fileSize: {
    type: Number,
  },
  pageCount: {
    type: Number,
    default: 1,
  },
  ocrApplied: {
    type: Boolean,
    default: false,
  },
  ocrConfidence: {
    type: Number,
    default: null,
  },
  extractionQuality: {
    type: String,
    enum: ['high', 'adequate', 'partial', 'low'],
    default: 'high',
  },
  extractedText: {
    type: String,
    required: true,
  },
  structuredProfile: {
    professionalProfile: {
      fullName: { type: String, default: null },
      headline: { type: String, default: null },
      currentRole: { type: String, default: null },
      summary: { type: String, default: null },
      preferredRoles: { type: [String], default: [] },
      location: { type: String, default: null },
      email: { type: String, default: null },
      phone: { type: String, default: null },
      links: { type: [String], default: [] },
    },
    technicalSkills: {
      languages: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      frontend: { type: [String], default: [] },
      backend: { type: [String], default: [] },
      databases: { type: [String], default: [] },
      cloudDevOps: { type: [String], default: [] },
      aiMachineLearning: { type: [String], default: [] },
      designTools: { type: [String], default: [] },
      devTools: { type: [String], default: [] },
      testingQa: { type: [String], default: [] },
      other: { type: [String], default: [] },
      skillContexts: [{
        skill: String,
        category: String,
        contextFound: String,
        evidenceQuote: String,
      }],
    },
    softSkills: [{
      name: String,
      evidenceQuote: String,
    }],
    workExperience: [{
      company: String,
      jobTitle: String,
      dates: String,
      duration: String,
      location: String,
      employmentType: String,
      responsibilities: [String],
      technologies: [String],
      achievements: [String],
      evidenceQuotes: [String],
    }],
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      contribution: String,
      outcomes: String,
      measurableAchievements: String,
      liveUrl: String,
      evidenceQuotes: [String],
    }],
    education: [{
      degree: String,
      institution: String,
      graduationYear: String,
      dates: String,
      academicInfo: String,
      gpaOrGrade: String,
      honors: [String],
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      credentialId: String,
    }],
    additional: {
      awards: { type: [String], default: [] },
      achievements: { type: [String], default: [] },
      languages: { type: [String], default: [] },
      activities: { type: [String], default: [] },
    },
    completenessCheck: {
      completenessScore: { type: Number, default: 100 },
      overallRating: {
        type: String,
        enum: ['complete', 'adequate', 'partially_unreadable', 'missing_critical_info'],
        default: 'complete',
      },
      missingSections: { type: [String], default: [] },
      flaggedIssues: [{
        section: String,
        issue: String,
        recommendation: String,
        severity: { type: String, enum: ['warning', 'info', 'critical'], default: 'info' },
      }],
      extractionNotes: { type: String, default: '' },
    },
  },
  version: {
    type: Number,
    default: 1,
  },
  analysisStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Resume = mongoose.model('Resume', resumeSchema);
