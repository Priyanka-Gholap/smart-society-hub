import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.substring(7);

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production'
      );
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      req.user = user;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
      error: error.message,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this action',
        requiredRole: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

export const requireSocietyAdmin = async (req, res, next) => {
  try {
    if (req.user.role === 'super_admin') {
      next();
    } else if (req.user.role === 'society_admin') {
      // Verify user is admin of the requested society
      if (req.body.society || req.params.societyId) {
        const societyId = req.body.society || req.params.societyId;
        if (req.user.society.toString() !== societyId) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized for this society',
          });
        }
      }
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only society admin can perform this action',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message,
    });
  }
};
