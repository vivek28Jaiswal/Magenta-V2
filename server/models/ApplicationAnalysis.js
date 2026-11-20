import mongoose from 'mongoose';

const applicationAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  jobDetails: {
    title: { type: String, default: 'Untitled Position' },
    company: { type: String, default: 'Unknown Company' },
    location: { type: String, default: 'Unspecified' },
    workMode: { type: String, default: 'Unspecified' },
    originalUrl: { type: String, default: '' },
  },
  jobDescription: {
    type: String,
    required: true,
  },
  overview: {
    title: String,
    company: String,
    location: String,
    employmentType: String,
    experienceExpectations: String,
    educationExpectations: String,
    summary: String,
  },
  mandatoryRequirements: [{
    name: String,
    category: String,
    employerClassification: { type: String, default: 'Mandatory' },
    evidenceInJD: String,
    resumeStatus: {
      type: String,
      enum: ['Evidence Found', 'Partial Evidence', 'Not Found in Resume', 'Unclear'],
      required: true,
    },
    resumeEvidence: String,
    matchExplanation: String,
    missingInformation: String,
  }],
  preferredRequirements: [{
    name: String,
    category: String,
    employerClassification: { type: String, default: 'Preferred' },
    evidenceInJD: String,
    resumeStatus: {
      type: String,
      enum: ['Evidence Found', 'Partial Evidence', 'Not Found in Resume', 'Unclear'],
      required: true,
    },
    resumeEvidence: String,
    matchExplanation: String,
    missingInformation: String,
  }],
  unclearRequirements: [{
    name: String,
    category: String,
    employerClassification: { type: String, default: 'Unclear' },
    evidenceInJD: String,
    resumeStatus: {
      type: String,
      enum: ['Evidence Found', 'Partial Evidence', 'Not Found in Resume', 'Unclear'],
      required: true,
    },
    resumeEvidence: String,
    matchExplanation: String,
    missingInformation: String,
  }],
  contradictions: [{
    issue: String,
    explanation: String,
    recommendation: String,
  }],
  experienceComparison: {
    jdExpectation: String,
    candidateExperience: String,
    alignmentExplanation: String,
    potentialUncertainty: String,
  },
  educationComparison: {
    jdExpectation: String,
    candidateEducation: String,
    alignmentExplanation: String,
  },
  projectAlignment: [{
    projectTitle: String,
    relevantJdAspect: String,
    alignmentNotes: String,
  }],
  recruiterQuestions: [{
    question: String,
    context: String,
    whyAsk: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ApplicationAnalysis = mongoose.model('ApplicationAnalysis', applicationAnalysisSchema);
