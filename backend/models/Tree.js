import mongoose from 'mongoose';

const TreeSchema = new mongoose.Schema(
  {
    donor_name: { type: String, required: true },
    species_name: { type: String, required: true },
    tree_id: { type: String, required: true, unique: true },
    location: { type: String, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: false },
    payment_id: { type: String, required: false },
  },
  { timestamps: { createdAt: 'date', updatedAt: false } }
);

export const Tree = mongoose.model('Tree', TreeSchema);