import express from 'express';
import {
  analyzeOpportunity,
  getAllAnalyses,
  getAnalysisById,
  extractJobUrlHandler,
} from '../controllers/applicationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/extract-url', extractJobUrlHandler);
router.post('/analyze', analyzeOpportunity);
router.get('/', getAllAnalyses);
router.get('/:id', getAnalysisById);

export default router;
