// server/models/Society.js
import mongoose from 'mongoose';

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Society name is required'],
      trim: true,
      unique: true,
    },
    societyType: {
      type: String,
      enum: ['apartment_complex', 'gated_community', 'housing_society', 'residential_association'],
      required: [true, 'Society type is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
    },
    // Geolocation Fields (NEW)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function(v) {
            return v.length === 2 && 
                   v[0] >= -180 && v[0] <= 180 && 
                   v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates format',
        },
      },
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    numberOfBuildings: {
      type: Number,
      required: true,
      min: 1,
    },
    numberOfFlats: {
      type: Number,
      required: true,
      min: 1,
    },
    occupiedFlats: {
      type: Number,
      default: 0,
      min: 0,
    },
    societyCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    pendingRequests: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      requestedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'approved',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    disasterModeEnabled: {
      type: Boolean,
      default: false,
    },
    disasterModeStatus: {
      type: String,
      enum: ['inactive', 'active', 'critical'],
      default: 'inactive',
    },
    emergencyContacts: [
      {
        name: String,
        role: String,
        phone: String,
        email: String,
      },
    ],
    description: String,
    logo: String,
    contactPerson: {
      name: String,
      phone: String,
      email: String,
    },
    totalResidents: {
      type: Number,
      default: 0,
    },
    amenities: [String],
    statistics: {
      totalComplaints: { type: Number, default: 0 },
      resolvedComplaints: { type: Number, default: 0 },
      activeAlerts: { type: Number, default: 0 },
      volunteers: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial Indexes (CRITICAL)
societySchema.index({ 'location': '2dsphere' }); // For geospatial queries
societySchema.index({ societyCode: 1 });
societySchema.index({ admin: 1 });
societySchema.index({ city: 1, state: 1 });
societySchema.index({ disasterModeEnabled: 1 });
societySchema.index({ status: 1 });
societySchema.index({ pincode: 1 });

export default mongoose.model('Society', societySchema);