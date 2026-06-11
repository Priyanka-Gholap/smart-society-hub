import express from 'express';
import {
  createSociety,
  getSocieties,
  getSocietyById,
  updateSociety,
  deleteSociety,
  joinSociety,
  getSocietyMembers,
  approveSociety,
  getSocietyStatistics,
} from '../controllers/society/societyController.js';
import { authMiddleware, authorize, requireSocietyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/join', authMiddleware, joinSociety);

// Protected Routes
router.use(authMiddleware);

router.post('/create', createSociety);
router.get('/', getSocieties);
router.get('/:id', getSocietyById);
router.get('/:id/members', getSocietyMembers);
router.get('/:id/statistics', getSocietyStatistics);

// Admin Routes
router.put('/:id', requireSocietyAdmin, updateSociety);
router.delete('/:id', requireSocietyAdmin, deleteSociety);

// Super Admin Routes
router.put('/:id/approve', authorize('super_admin'), approveSociety);

export default router;