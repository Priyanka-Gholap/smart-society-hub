import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: [
        'electrical',
        'plumbing',
        'security',
        'maintenance',
        'flooding',
        'fire',
        'gas_leak',
        'noise',
        'parking',
        'other',
      ],
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'rejected'],
      default: 'pending',
    },
    complainant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    images: [String],
    attachments: [String],
    location: {
      building: String,
      flat: String,
      description: String,
    },
    updates: [
      {
        text: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        updatedAt: Date,
      },
    ],
    resolution: {
      description: String,
      resolvedDate: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
    },
    aiClassification: {
      predictedCategory: String,
      confidence: Number,
    },
    aiPriority: {
      predictedLevel: String,
      confidence: Number,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ society: 1, status: 1 });
complaintSchema.index({ complainant: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ createdAt: -1 });

export default mongoose.model('Complaint', complaintSchema);
