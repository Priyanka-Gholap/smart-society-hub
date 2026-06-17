// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    role: {
      type: String,
      enum: ['super_admin', 'society_admin', 'resident'],
      default: 'resident',
    },
    // Location Fields (NEW)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    latitude: Number,
    longitude: Number,
    lastLocationUpdate: Date,
    allowLocationTracking: {
      type: Boolean,
      default: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    flat: {
      type: String,
      trim: true,
    },
    building: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ society: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location': '2dsphere' }); // Geospatial index

export default mongoose.model('User', userSchema);