import fs from 'fs';
import path from 'path';
import { Resume } from '../models/Resume.js';
import { User } from '../models/User.js';
import { extractTextFromFile } from '../services/resume/resumeParserService.js';
import { processAndSaveResumeAnalysis } from '../services/resume/resumeAnalysisService.js';
import { logger } from '../utils/logger.js';

export const uploadResumeHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file (PDF, Word, or Image).' });
    }

    const userId = req.user._id;
    const { path: filePath, originalname, size } = req.file;
    const ext = path.extname(originalname).replace('.', '').toLowerCase();

    logger.info(`Received resume upload for user ${userId}: ${originalname}`);

    // 1. Extract text and metadata from uploaded document (with OCR support)
    const extractionResult = await extractTextFromFile(filePath, originalname);
    const extractedText = extractionResult.text;
    const detectedFileType = extractionResult.fileType || ext;
    const pageCount = extractionResult.pageCount || 1;
    const ocrApplied = extractionResult.ocrApplied || false;
    const ocrConfidence = extractionResult.ocrConfidence || null;
    const extractionQuality = extractionResult.extractionQuality || 'high';

    // 2. Create initial Resume document
    const resume = await Resume.create({
      userId,
      originalFileReference: filePath,
      originalFileName: originalname,
      fileType: detectedFileType,
      fileSize: size,
      extractedText,
      pageCount,
      ocrApplied,
      ocrConfidence,
      extractionQuality,
      analysisStatus: 'pending',
    });

    // 3. Process Advanced Deep AI Resume Analysis
    const completedResume = await processAndSaveResumeAnalysis(resume._id, extractedText, {
      fileType: detectedFileType,
      pageCount,
      ocrApplied,
      ocrConfidence,
      extractionQuality,
    });

    res.status(201).json({
      message: 'Resume uploaded and analyzed successfully.',
      resume: completedResume,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

export const pasteResumeTextHandler = async (req, res, next) => {
  try {
    const { text, title } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length < 40) {
      return res.status(400).json({
        message: 'Please paste your resume text (at least 40 characters) containing your skills and background.',
      });
    }

    const cleanedText = text.trim();
    const docName = title?.trim() || 'Pasted_Resume_Profile.txt';

    const existingResume = await Resume.findOne({ userId });

    let updatedResume;
    if (existingResume) {
      existingResume.originalFileReference = 'pasted_text';
      existingResume.originalFileName = docName;
      existingResume.fileType = 'doc';
      existingResume.fileSize = Buffer.byteLength(cleanedText, 'utf-8');
      existingResume.extractedText = cleanedText;
      existingResume.version += 1;
      existingResume.analysisStatus = 'pending';
      await existingResume.save();

      updatedResume = await processAndSaveResumeAnalysis(existingResume._id, cleanedText);
    } else {
      const newResume = await Resume.create({
        userId,
        originalFileReference: 'pasted_text',
        originalFileName: docName,
        fileType: 'doc',
        fileSize: Buffer.byteLength(cleanedText, 'utf-8'),
        extractedText: cleanedText,
        analysisStatus: 'pending',
      });
      updatedResume = await processAndSaveResumeAnalysis(newResume._id, cleanedText);
    }

    res.status(201).json({
      message: 'Resume text processed and analyzed successfully.',
      resume: updatedResume,
    });
  } catch (error) {
    next(error);
  }
};

export const getResumeHandler = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found for this user.' });
    }

    res.json({ resume });
  } catch (error) {
    next(error);
  }
};

export const replaceResumeHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a replacement resume file.' });
    }

    const userId = req.user._id;
    const { path: filePath, originalname, size } = req.file;
    const ext = path.extname(originalname).replace('.', '').toLowerCase();

    const existingResume = await Resume.findOne({ userId });

    // Extract text and metadata from new file first
    const extractionResult = await extractTextFromFile(filePath, originalname);
    const extractedText = extractionResult.text;
    const detectedFileType = extractionResult.fileType || ext;
    const pageCount = extractionResult.pageCount || 1;
    const ocrApplied = extractionResult.ocrApplied || false;
    const ocrConfidence = extractionResult.ocrConfidence || null;
    const extractionQuality = extractionResult.extractionQuality || 'high';

    // If successful, remove previous physical file
    if (existingResume?.originalFileReference && fs.existsSync(existingResume.originalFileReference)) {
      try { fs.unlinkSync(existingResume.originalFileReference); } catch (e) {}
    }

    let updatedResume;
    if (existingResume) {
      existingResume.originalFileReference = filePath;
      existingResume.originalFileName = originalname;
      existingResume.fileType = detectedFileType;
      existingResume.fileSize = size;
      existingResume.pageCount = pageCount;
      existingResume.ocrApplied = ocrApplied;
      existingResume.ocrConfidence = ocrConfidence;
      existingResume.extractionQuality = extractionQuality;
      existingResume.extractedText = extractedText;
      existingResume.version += 1;
      existingResume.analysisStatus = 'pending';
      await existingResume.save();

      updatedResume = await processAndSaveResumeAnalysis(existingResume._id, extractedText, {
        fileType: detectedFileType,
        pageCount,
        ocrApplied,
        ocrConfidence,
        extractionQuality,
      });
    } else {
      const newResume = await Resume.create({
        userId,
        originalFileReference: filePath,
        originalFileName: originalname,
        fileType: detectedFileType,
        fileSize: size,
        pageCount,
        ocrApplied,
        ocrConfidence,
        extractionQuality,
        extractedText,
        analysisStatus: 'pending',
      });
      updatedResume = await processAndSaveResumeAnalysis(newResume._id, extractedText, {
        fileType: detectedFileType,
        pageCount,
        ocrApplied,
        ocrConfidence,
        extractionQuality,
      });
    }

    res.json({
      message: 'Resume replaced and re-analyzed successfully.',
      resume: updatedResume,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

export const deleteResumeHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const resume = await Resume.findOne({ userId });

    if (resume) {
      if (resume.originalFileReference && fs.existsSync(resume.originalFileReference)) {
        try { fs.unlinkSync(resume.originalFileReference); } catch (e) {}
      }
      await Resume.deleteOne({ _id: resume._id });
    }

    await User.findByIdAndUpdate(userId, {
      resume: null,
      onboardingCompleted: false,
    });

    res.json({ message: 'Resume and extracted profile successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

export const reanalyzeResumeHandler = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found to re-analyze.' });
    }

    resume.analysisStatus = 'pending';
    await resume.save();

    const updatedResume = await processAndSaveResumeAnalysis(resume._id, resume.extractedText, {
      fileType: resume.fileType,
      pageCount: resume.pageCount,
      ocrApplied: resume.ocrApplied,
      ocrConfidence: resume.ocrConfidence,
      extractionQuality: resume.extractionQuality,
    });

    res.json({
      message: 'Resume re-analyzed successfully.',
      resume: updatedResume,
    });
  } catch (error) {
    next(error);
  }
};
