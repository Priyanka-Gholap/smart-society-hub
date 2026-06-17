// server/routes/societyRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createSociety,
  getNearby,
  joinSociety,
  getMySociety,
  searchSocieties,
} from '../controllers/societyController.js';

const router = express.Router();

// Public routes
router.get('/nearby', getNearby); // GET /api/societies/nearby?latitude=X&longitude=Y&radius=5
router.get('/search', searchSocieties); // GET /api/societies/search?query=name&city=city

// Protected routes
router.post('/create', authMiddleware, createSociety);
router.post('/join', authMiddleware, joinSociety);
router.get('/my-society', authMiddleware, getMySociety);

export default router;