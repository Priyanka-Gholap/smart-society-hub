import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: [
        'flood',
        'fire',
        'gas_leak',
        'medical_emergency',
        'storm_warning',
        'earthquake',
        'power_outage',
        'water_shortage',
        'security_threat',
        'other',
      ],
      required: true,
    },
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'cancelled'],
      default: 'active',
    },
    affectedAreas: [String],
    recommendedActions: [String],
    location: {
      latitude: Number,
      longitude: Number,
      radius: Number,
    },
    resourcesNeeded: [String],
    estimatedDuration: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attachments: [String],
    emergencyContacts: [
      {
        name: String,
        phone: String,
        role: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ society: 1, status: 1 });
alertSchema.index({ level: 1 });
alertSchema.index({ type: 1 });
alertSchema.index({ createdAt: -1 });

export default mongoose.model('Alert', alertSchema);
