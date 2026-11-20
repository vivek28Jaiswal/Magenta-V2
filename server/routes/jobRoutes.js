import express from 'express';
import {
  getRecommendations,
  getJobs,
  getJobById,
  saveJobHandler,
  unsaveJobHandler,
  updateApplicationStatusHandler,
  getSavedJobsHandler,
  getSourcesStatusHandler,
} from '../controllers/jobController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/sources/status', getSourcesStatusHandler);
router.get('/recommendations', authenticate, getRecommendations);
router.get('/saved', authenticate, getSavedJobsHandler);
router.get('/', getJobs);
router.get('/:id', authenticate, getJobById);
router.post('/:id/save', authenticate, saveJobHandler);
router.delete('/:id/save', authenticate, unsaveJobHandler);
router.patch('/:id/application-status', authenticate, updateApplicationStatusHandler);

export default router;
