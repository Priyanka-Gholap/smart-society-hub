import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    specialization: {
      type: [String],
      enum: [
        'medical',
        'rescue',
        'transport',
        'communication',
        'coordination',
        'first_aid',
        'counseling',
        'logistics',
        'other',
      ],
      required: true,
    },
    availability: {
      type: String,
      enum: ['always', 'weekends', 'evenings', 'on_call'],
      default: 'on_call',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    certifications: [
      {
        name: String,
        issuedBy: String,
        validTill: Date,
        document: String,
      },
    ],
    emergencyContactPerson: {
      name: String,
      phone: String,
      relation: String,
    },
    medicalConditions: String,
    languages: [String],
    experience: String,
    operationalsHours: {
      startTime: String,
      endTime: String,
    },
    responseCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

volunteerSchema.index({ society: 1, isActive: 1 });
volunteerSchema.index({ specialization: 1 });
volunteerSchema.index({ user: 1 });

export default mongoose.model('Volunteer', volunteerSchema);
