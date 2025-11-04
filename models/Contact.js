import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: 'date', updatedAt: false } }
);

export const Contact = mongoose.model('Contact', ContactSchema);