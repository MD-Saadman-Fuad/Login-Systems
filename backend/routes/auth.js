import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Test endpoint for MongoDB connection
router.get('/test', async (req, res) => {
  try {
    // Simple database test
    const userCount = await User.countDocuments();
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount: userCount
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Module-specific registration route
router.post('/register', async (req, res) => {
  try {
    const { registrationModule, ...userData } = req.body;

    // Validate module number
    if (!registrationModule || registrationModule < 1 || registrationModule > 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid registration module' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Generate serial number
    const serialNumber = await User.generateSerialNumber();

    // Prepare user data based on module
    const newUserData = {
      serialNumber,
      registrationModule,
      email: userData.email,
      ...userData
    };

    // Module-specific field mapping
    switch (registrationModule) {
      case 1:
        // Complete Profile - all fields
        break;
      case 2:
        // Basic Registration - map fullName to firstName/lastName
        if (userData.fullName) {
          const names = userData.fullName.split(' ');
          newUserData.firstName = names[0];
          newUserData.lastName = names.slice(1).join(' ') || '';
          delete newUserData.fullName;
        }
        break;
      case 3:
        // Professional - map fullName to firstName/lastName
        if (userData.fullName) {
          const names = userData.fullName.split(' ');
          newUserData.firstName = names[0];
          newUserData.lastName = names.slice(1).join(' ') || '';
          delete newUserData.fullName;
        }
        break;
      case 4:
        // Email Focused - minimal data
        break;
      case 5:
        // Social Login - store social provider information
        if (userData.socialProvider) {
          newUserData.socialProvider = userData.socialProvider;
          newUserData.socialId = userData.socialId || `${userData.socialProvider}_${Date.now()}`;
          newUserData.profilePicture = userData.profilePicture;
          
          // Store provider-specific ID
          switch (userData.socialProvider) {
            case 'google':
              newUserData.googleId = userData.socialId || `google_${Date.now()}`;
              break;
            case 'facebook':
              newUserData.facebookId = userData.socialId || `facebook_${Date.now()}`;
              break;
            case 'github':
              newUserData.githubId = userData.socialId || `github_${Date.now()}`;
              break;
            case 'linkedin':
              newUserData.linkedinId = userData.socialId || `linkedin_${Date.now()}`;
              break;
          }
          
          // For social login, automatically verify email
          newUserData.isEmailVerified = true;
          
          // Store additional social profile data
          newUserData.socialProfile = {
            provider: userData.socialProvider,
            providerId: userData.socialId,
            profileUrl: userData.profilePicture,
            connectedAt: new Date()
          };
        }
        break;
      case 6:
        // OTP Verification - store OTP verification data
        if (userData.otp) {
          newUserData.otp = userData.otp;
          newUserData.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
          newUserData.isOtpVerified = userData.isOtpVerified || false;
          newUserData.otpAttempts = 0;
        }
        
        // If OTP was verified, mark email and phone as verified
        if (userData.isOtpVerified) {
          newUserData.isEmailVerified = true;
          newUserData.isPhoneVerified = true;
        }
        break;
    }

    // Create new user
    const user = new User(newUserData);
    await user.save();

    // Generate JWT token (skip for social login if no password)
    let token = null;
    if (registrationModule !== 5) {
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    }

    // Return success response
    const responseUser = {
      id: user._id,
      serialNumber: user.serialNumber,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      registrationModule: user.registrationModule
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: responseUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false,
        message: `${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
});

// Traditional login route (updated for new schema)
router.post('/login', [
  body('login').notEmpty().withMessage('Username or email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { login, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        serialNumber: user.serialNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        registrationModule: user.registrationModule
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// Get user profile (protected route)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get user statistics (admin route)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$registrationModule',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const lastSerialNumber = await User.findOne({}, { serialNumber: 1 }, { sort: { createdAt: -1 } });

    res.json({
      success: true,
      stats: {
        totalUsers,
        lastSerialNumber: lastSerialNumber?.serialNumber || '0000',
        moduleBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

export default router;