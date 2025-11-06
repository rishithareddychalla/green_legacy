import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOTP(email) {
  const otp = generateOTP();
  
  // Store OTP with timestamp (expires in 5 minutes)
  otpStore.set(email, {
    otp,
    timestamp: Date.now(),
    attempts: 0
  });

  // Log OTP to server console for development/testing (remove in production)
  console.log(`Admin OTP for ${email}: ${otp}`);

  // Send OTP email
  await transporter.sendMail({
    from: '"Green Legacy Admin" <noreply@greenlegacy.org>',
    to: email,
    subject: 'Admin Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #166534; text-align: center;">Green Legacy Admin Login</h1>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 16px; color: #374151;">Your verification code is:</p>
          <h2 style="text-align: center; color: #166534; font-size: 32px; letter-spacing: 4px;">${otp}</h2>
          <p style="color: #4b5563; font-size: 14px;">This code will expire in 5 minutes.</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `
  });

  return true;
}

export function verifyOTP(email, otp) {
  const storedData = otpStore.get(email);

  if (!storedData) {
    throw new Error('No OTP found');
  }

  // Check if OTP is expired (5 minutes)
  if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
    otpStore.delete(email);
    throw new Error('OTP expired');
  }

  // Check attempts
  if (storedData.attempts >= 3) {
    otpStore.delete(email);
    throw new Error('Too many attempts');
  }

  // Verify OTP
  if (storedData.otp !== otp) {
    storedData.attempts++;
    throw new Error('Invalid OTP');
  }

  // OTP verified successfully
  otpStore.delete(email);
  return true;
}