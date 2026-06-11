import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: String,
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    location: {
      venue: String,
      building: String,
      latitude: Number,
      longitude: Number,
    },
    capacity: {
      total: Number,
      registered: {
        type: Number,
        default: 0,
      },
    },
    category: {
      type: String,
      enum: ['social', 'sports', 'educational', 'maintenance', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'cancelled'],
      default: 'planned',
    },
    image: String,
    registrations: [
      {
        resident: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        registeredAt: Date,
        attended: Boolean,
      },
    ],
    announcements: [
      {
        text: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ society: 1, startDate: 1 });
eventSchema.index({ status: 1 });

export default mongoose.model('Event', eventSchema);
