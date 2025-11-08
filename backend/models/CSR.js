import mongoose from 'mongoose';

const CSRSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    proposal: { type: String, required: false },
  },
  { timestamps: { createdAt: 'date', updatedAt: false } }
);

export const CSR = mongoose.model('CSR', CSRSchema);