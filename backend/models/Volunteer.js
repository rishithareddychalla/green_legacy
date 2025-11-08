import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    interest: { type: String, required: false },
  },
  { timestamps: { createdAt: 'date', updatedAt: false } }
);

export const Volunteer = mongoose.model('Volunteer', VolunteerSchema);