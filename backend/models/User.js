import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Universal fields
  serialNumber: {
    type: String,
    unique: true,
    required: true
  },
  registrationModule: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return this.registrationModule !== 5; // Social login doesn't need password
    }
  },
  
  // Optional fields based on module
  username: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null values
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  dateOfBirth: {
    type: Date
  },
  
  // Social login fields
  socialProvider: {
    type: String,
    enum: ['google', 'facebook', 'github', 'linkedin', 'manual'],
    default: 'manual'
  },
  socialId: {
    type: String,
    sparse: true // Allows multiple null values, but unique when not null
  },
  googleId: {
    type: String,
    sparse: true
  },
  facebookId: {
    type: String,
    sparse: true
  },
  githubId: {
    type: String,
    sparse: true
  },
  linkedinId: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String
  },
  socialProfile: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Module 6: OTP Verification fields
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  otpAttempts: {
    type: Number,
    default: 0,
    max: 3
  },
  
  // Verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  phoneVerificationToken: String,
  
  // System fields
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving (only if password is provided and modified)
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to generate next serial number
userSchema.statics.generateSerialNumber = async function() {
  const lastUser = await this.findOne({}, {}, { sort: { 'createdAt': -1 } });
  
  if (!lastUser || !lastUser.serialNumber) {
    return '0001';
  }
  
  const lastNumber = parseInt(lastUser.serialNumber);
  const nextNumber = lastNumber + 1;
  return nextNumber.toString().padStart(4, '0');
};

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ serialNumber: 1 });
userSchema.index({ registrationModule: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ facebookId: 1 }, { sparse: true });

export default mongoose.model('User', userSchema);