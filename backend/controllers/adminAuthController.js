import { handleOTPRequest, handleOTPVerification, validateAdminCredentials } from '../middleware/adminAuth.js';

export const adminAuthController = {
  async requestOTP(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      if (!validateAdminCredentials(email, password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      await handleOTPRequest(email, password);
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP required' });
      }

      const token = await handleOTPVerification(email, otp);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
};