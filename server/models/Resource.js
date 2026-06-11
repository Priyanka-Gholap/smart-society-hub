import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'drinking_water',
        'food',
        'medical_supplies',
        'blankets',
        'power_backup',
        'fuel',
        'transportation',
        'communication_devices',
        'first_aid_kits',
        'other',
      ],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      current: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ['pieces', 'liters', 'kg', 'packets', 'boxes', 'units'],
        required: true,
      },
    },
    location: {
      shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shelter',
      },
      latitude: Number,
      longitude: Number,
      description: String,
    },
    responsiblePerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['available', 'depleted', 'damaged', 'in_transit'],
      default: 'available',
    },
    updates: [
      {
        quantity: Number,
        updateType: {
          type: String,
          enum: ['added', 'used', 'damaged', 'donated'],
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    expiry: Date,
    criticalThreshold: Number,
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ society: 1, type: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ 'location.shelter': 1 });

export default mongoose.model('Resource', resourceSchema);
