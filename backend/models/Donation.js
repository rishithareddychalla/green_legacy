import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentId: { type: String, required: true },
  },
  { timestamps: { createdAt: 'date', updatedAt: false } }
);

export const Donation = mongoose.model('Donation', DonationSchema);