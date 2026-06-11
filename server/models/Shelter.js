import mongoose from 'mongoose';

const shelterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Shelter name is required'],
      trim: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    type: {
      type: String,
      enum: ['assembly_point', 'shelter', 'medical_center', 'distribution_center'],
      required: true,
    },
    capacity: {
      total: {
        type: Number,
        required: true,
        min: 1,
      },
      current: {
        type: Number,
        default: 0,
      },
    },
    location: {
      address: String,
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    contactPerson: {
      name: String,
      phone: String,
      email: String,
    },
    facilities: [String],
    resourcesAvailable: {
      beds: Number,
      blankets: Number,
      food_packets: Number,
      water_liters: Number,
      medical_kits: Number,
      power_backup: Boolean,
      internet: Boolean,
    },
    staffCount: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    operatingHours: {
      open: String,
      close: String,
    },
    amenities: [String],
  },
  {
    timestamps: true,
  }
);

shelterSchema.index({ society: 1, type: 1 });
shelterSchema.index({ isActive: 1 });

export default mongoose.model('Shelter', shelterSchema);
