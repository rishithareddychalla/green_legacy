import jwt from 'jsonwebtoken';
import { requestOTP, verifyOTP } from './adminOTP.js';

const ADMIN_EMAIL = 'mamidipranay07@gmail.com';
const ADMIN_PASSWORD = '2025@Legacy';

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
        throw new Error('Not an admin');
      }
      req.admin = decoded;
      next();
    } catch (error) {
      throw new Error('Invalid token');
    }
  } catch (err) {
    res.status(401).json({ error: err.message || 'Not authorized as admin' });
  }
};

export const validateAdminCredentials = (email, password) => {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
};

export async function handleOTPRequest(email, password) {
  if (!validateAdminCredentials(email, password)) {
    throw new Error('Invalid credentials');
  }
  
  await requestOTP(email);
}

export async function handleOTPVerification(email, otp) {
  const verified = await verifyOTP(email, otp);
  
  if (verified) {
    // Generate JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return token;
  }
  
  throw new Error('OTP verification failed');
}