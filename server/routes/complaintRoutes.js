import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addComplaintUpdate,
  getComplaintAnalytics,
} from '../controllers/complaint/complaintController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/analytics', getComplaintAnalytics);
router.get('/:id', getComplaintById);
router.put('/:id/status', updateComplaintStatus);
router.post('/:id/update', addComplaintUpdate);

export default router;
