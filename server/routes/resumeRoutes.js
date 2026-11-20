import express from 'express';
import {
  uploadResumeHandler,
  pasteResumeTextHandler,
  getResumeHandler,
  replaceResumeHandler,
  deleteResumeHandler,
  reanalyzeResumeHandler,
} from '../controllers/resumeController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/upload', uploadResume.single('resume'), uploadResumeHandler);
router.post('/paste-text', pasteResumeTextHandler);
router.get('/', getResumeHandler);
router.put('/replace', uploadResume.single('resume'), replaceResumeHandler);
router.delete('/', deleteResumeHandler);
router.post('/reanalyze', reanalyzeResumeHandler);

export default router;
