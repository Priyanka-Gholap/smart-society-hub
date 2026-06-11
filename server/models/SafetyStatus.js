import mongoose from 'mongoose';

const safetyStatusSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['safe', 'need_assistance', 'emergency'],
      required: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
      building: String,
      flat: String,
    },
    description: String,
    needsAssistanceReason: String,
    emergencyDetails: {
      type: String,
      severity: {
        type: String,
        enum: ['minor', 'moderate', 'severe'],
      },
      injuries: Boolean,
      medicalHelp: Boolean,
      rescue: Boolean,
    },
    assistanceProvided: [
      {
        type: String,
        providedAt: Date,
        providedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

safetyStatusSchema.index({ society: 1, status: 1 });
safetyStatusSchema.index({ resident: 1 });
safetyStatusSchema.index({ updatedAt: -1 });

export default mongoose.model('SafetyStatus', safetyStatusSchema);
