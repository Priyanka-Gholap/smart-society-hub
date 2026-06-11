import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'medical',
        'fire',
        'security',
        'rescue',
        'flood',
        'gas_leak',
        'other',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'severe'],
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      building: String,
      flat: String,
      description: String,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'acknowledged', 'resolved', 'cancelled'],
      default: 'active',
    },
    respondents: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        arrivedAt: Date,
        status: String,
      },
    ],
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolution: String,
    emergencyServices: [
      {
        type: String,
        contacted: Boolean,
        arrivedAt: Date,
        referenceNumber: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

sosSchema.index({ society: 1, status: 1 });
sosSchema.index({ resident: 1 });
sosSchema.index({ createdAt: -1 });

export default mongoose.model('SOS', sosSchema);
