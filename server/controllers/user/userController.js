import User from '../../models/User.js';
import { generateToken, verifyToken } from '../../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'resident',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role, user.society);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account is inactive',
      });
    }

    // Compare password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role, user.society);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        society: user.society,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('society', 'name societyCode city')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('❌ Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile',
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, profileImage, emergencyContact } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (profileImage) updateData.profileImage = profileImage;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

// Logout User
export const logout = async (req, res) => {
  try {
    // In JWT-based systems, logout is typically handled on the client side
    // by removing the token. This endpoint can be used for audit purposes.
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Logout failed',
    });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const newToken = generateToken(user._id, user.role, user.society);

    res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Token refresh failed',
    });
  }
};

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If email exists, password reset link has been sent',
      });
    }

    // Generate reset token (in real app, send via email)
    const resetToken = generateToken(user._id, 'reset', null);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      resetToken, // In production, this should be sent via email only
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Password reset request failed',
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    const decoded = verifyToken(resetToken);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Password reset failed',
    });
  }
};
