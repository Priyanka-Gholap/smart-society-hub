import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'maintenance',
        'event',
        'security',
        'emergency',
        'general',
        'rules',
        'billing',
      ],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    attachments: [String],
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    views: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        viewedAt: Date,
      },
    ],
    targetAudience: {
      type: String,
      enum: ['all_residents', 'flat_owners', 'tenants', 'admin'],
      default: 'all_residents',
    },
  },
  {
    timestamps: true,
  }
);

noticeSchema.index({ society: 1, isActive: 1 });
noticeSchema.index({ isPinned: 1 });
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ expiryDate: 1 });

export default mongoose.model('Notice', noticeSchema);
