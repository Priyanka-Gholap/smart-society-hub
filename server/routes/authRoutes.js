import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logout,
  refreshToken,
  requestPasswordReset,
  resetPassword,
} from '../controllers/user/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected Routes
router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/logout', logout);

export default router;