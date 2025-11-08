import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: 'date', updatedAt: false } }
);

export const Login = mongoose.model('Login', LoginSchema);