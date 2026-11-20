import { Resume } from '../../models/Resume.js';
import { User } from '../../models/User.js';
import { analyzeResumeAI } from '../ai/aiProvider.js';
import { logger } from '../../utils/logger.js';

export const processAndSaveResumeAnalysis = async (resumeId, extractedText, metadata = {}) => {
  logger.info(`Starting resume profile analysis for resume ID: ${resumeId}`);
  try {
    const structuredProfile = await analyzeResumeAI(extractedText, metadata);

    const updateFields = {
      structuredProfile,
      analysisStatus: 'completed',
      updatedAt: new Date(),
    };

    if (metadata.ocrApplied !== undefined) updateFields.ocrApplied = metadata.ocrApplied;
    if (metadata.ocrConfidence !== undefined) updateFields.ocrConfidence = metadata.ocrConfidence;
    if (metadata.pageCount !== undefined) updateFields.pageCount = metadata.pageCount;
    if (metadata.extractionQuality) updateFields.extractionQuality = metadata.extractionQuality;
    if (metadata.fileType) updateFields.fileType = metadata.fileType;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      updateFields,
      { new: true }
    );

    if (resume) {
      await User.findByIdAndUpdate(resume.userId, {
        resume: resume._id,
        onboardingCompleted: true,
      });
    }

    logger.info(`Successfully completed and persisted resume profile for ID: ${resumeId}`);
    return resume;
  } catch (error) {
    logger.error(`Resume analysis failed for ID ${resumeId}:`, error.message);
    await Resume.findByIdAndUpdate(resumeId, {
      analysisStatus: 'failed',
      updatedAt: new Date(),
    });
    throw error;
  }
};
