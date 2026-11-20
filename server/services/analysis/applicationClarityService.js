import { Resume } from '../../models/Resume.js';
import { ApplicationAnalysis } from '../../models/ApplicationAnalysis.js';
import { analyzeJobDescription } from './jobDescriptionAnalysisService.js';
import { generateApplicationClarityAI } from '../ai/aiProvider.js';
import { logger } from '../../utils/logger.js';

export const generateApplicationClarityReport = async ({
  userId,
  resumeId,
  jobDescription,
  jobDetails = {},
}) => {
  logger.info(`Generating Application Clarity Report for user ${userId}`);

  // Fetch candidate's resume
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    throw new Error('Candidate resume not found or does not belong to this account.');
  }

  if (resume.analysisStatus !== 'completed' || !resume.structuredProfile) {
    throw new Error('Resume has not finished processing. Please wait for analysis to complete.');
  }

  // 1. Analyze Job Description
  const jdAnalysis = await analyzeJobDescription(jobDescription, jobDetails);

  // 2. Perform Evidence-based Comparison
  const clarityData = await generateApplicationClarityAI(
    jdAnalysis,
    resume.structuredProfile,
    resume.extractedText
  );

  // 3. Save Application Analysis Report in MongoDB
  const applicationReport = await ApplicationAnalysis.create({
    userId,
    resumeId,
    jobDetails: {
      title: jobDetails.title || clarityData.overview?.title || 'Position',
      company: jobDetails.company || clarityData.overview?.company || 'Company',
      location: jobDetails.location || clarityData.overview?.location || 'Unspecified',
      workMode: jobDetails.workMode || 'Unspecified',
      originalUrl: jobDetails.originalUrl || '',
    },
    jobDescription,
    overview: clarityData.overview,
    mandatoryRequirements: clarityData.mandatoryRequirements,
    preferredRequirements: clarityData.preferredRequirements,
    unclearRequirements: clarityData.unclearRequirements,
    contradictions: clarityData.contradictions,
    experienceComparison: clarityData.experienceComparison,
    educationComparison: clarityData.educationComparison,
    projectAlignment: clarityData.projectAlignment,
    recruiterQuestions: clarityData.recruiterQuestions,
  });

  logger.info(`Application Clarity Report created with ID: ${applicationReport._id}`);
  return applicationReport;
};
