// server/routes/authRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateLocation,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getProfile);
router.put('/location', authMiddleware, updateLocation);

export default router;
