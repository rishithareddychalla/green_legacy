import jwt from 'jsonwebtoken';

// Admin middleware to protect routes
export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify admin credentials from token
    const credentials = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (credentials.email === process.env.ADMIN_EMAIL && 
        credentials.password === process.env.ADMIN_PASSWORD) {
      req.admin = credentials;
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).json({ error: 'Not authorized as admin' });
  }
};