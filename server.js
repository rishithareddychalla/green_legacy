import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import XLSX from 'xlsx';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from './email.js';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set in .env');
}

mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Import Models
import { Contact } from './models/Contact.js';
import { Volunteer } from './models/Volunteer.js';
import { CSR } from './models/CSR.js';
import { Login } from './models/Login.js';
import { Signup } from './models/Signup.js';
import { Donation } from './models/Donation.js';
import { Tree } from './models/Tree.js';

// Helpers
function sendAsExcel(res, data, filename) {
  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(buffer);
}

// Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Routes - POST
app.post('/contact', async (req, res) => {
  try {
    const doc = await Contact.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/volunteer', async (req, res) => {
  try {
    const doc = await Volunteer.create(req.body);

    // Send volunteer email
    const { name, email } = req.body;
    const subject = 'Welcome to Green Legacy 🌱';
    const html = `
      Hi ${name},
      <br><br>
      🌱 Thank you for signing up as a volunteer with Green Legacy!
      <br><br>
      Your details have been successfully recorded and forwarded to our team. We truly appreciate your willingness to contribute your time and energy towards building a greener future.
      <br><br>
      Our team will review your response and reach out to you shortly with the next steps, updates, and opportunities to get involved. Please keep an eye on your inbox for further communication.
      <br><br>
      Together, we can make a lasting impact. 💚
      <br><br>
      Warm regards,
      <br>
      The Green Legacy Team
    `;
    await sendEmail(email, subject, html);

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/csr', async (req, res) => {
  try {
    const doc = await CSR.create(req.body);

    // Send CSR email
    const { company, contactPerson, email } = req.body;
    const name = contactPerson || company;
    const subject = 'Welcome to Green Legacy 🌱';
    const html = `
      Hi ${name},
      <br><br>
      🌱 Thank you for registering your organization with Green Legacy under our CSR initiative.
      <br><br>
      Your details have been successfully recorded and forwarded to our team. We deeply value your commitment to sustainability and social responsibility. Our team will review your response and reach out shortly with partnership opportunities, project updates, and ways your contribution will make an impact.
      <br><br>
      We look forward to working together to create a lasting positive change.
      <br><br>
      Warm regards,
      <br>
      The Green Legacy Team
    `;
    await sendEmail(email, subject, html);

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await Signup.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new Signup({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Send welcome email
    const subject = 'Welcome to Green Legacy 🌱';
    const html = `
      Hi ${name},
      <br><br>
      Thank you for signing up with Green Legacy! We are very glad to have you join our community.
      <br><br>
      Your signup has been successfully recorded, and our team has been notified of your interest. We truly appreciate your willingness to be part of our mission to create a greener and more sustainable future.
      <br><br>
      Our team will be reaching out to you soon with updates, opportunities, and ways you can get involved. Please keep an eye on your inbox for further communication.
      <br><br>
      Together, we can make a lasting impact. 💚
      <br><br>
      Warm regards,
      <br>
      The Green Legacy Team
    `;
    await sendEmail(email, subject, html);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/donation', async (req, res) => {
  try {
    const { name, email, amount, paymentId, donationData } = req.body;
    const doc = await Donation.create({ name, email, amount, paymentId });
    const { donor_name, species_name, tree_id, location, user_id } = donationData;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    await Tree.create({
      donor_name,
      species_name,
      tree_id,
      location,
      user_id,
      payment_id: paymentId,
    });
    try {
      const { name, email, amount } = req.body;
      await axios.post('https://urtgpcvolblctqdugbtl.supabase.co/functions/v1/send-certificate', {
        donorName: name,
        email,
        treeSpecies: 'Mixed Species',
        treeId: `TREE-${Date.now()}`,
        plantingDate: new Date().toLocaleDateString(),
        amount,
      });
    } catch (emailError) {
      console.error('Failed to send certificate email:', emailError.message);
    }

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Routes - GET export
app.get('/my-trees', auth, async (req, res) => {
  try {
    const trees = await Tree.find({ user_id: req.user.id });
    res.json(trees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/export-contacts', auth, async (_req, res) => {
  try {
    const rows = await Contact.find().lean();
    sendAsExcel(res, rows, 'contacts.xlsx');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', auth, async (_req, res) => {
  try {
    const rows = await Volunteer.find().lean();
    sendAsExcel(res, rows, 'volunteers.xlsx');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/export-csrs', auth, async (_req, res) => {
  try {
    const rows = await CSR.find().lean();
    sendAsExcel(res, rows, 'csrs.xlsx');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/export-logins', auth, async (_req, res) => {
  try {
    const rows = await Login.find().lean();
    sendAsExcel(res, rows, 'logins.xlsx');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/export-signups', auth, async (_req, res) => {
  try {
    const rows = await Signup.find().lean();
    sendAsExcel(res, rows, 'signups.xlsx');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/export-donations', auth, async (_req, res) => {
  try {
    const rows = await Donation.find().lean();
    sendAsExcel(res, rows, 'donations.xlsx');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Routes
import { adminAuth } from './middleware/adminAuth.js';
import { adminController } from './controllers/adminController.js';

app.get('/api/admin/stats', adminAuth, adminController.getStats);
app.get('/api/admin/users', adminAuth, adminController.getUsers);
app.get('/api/admin/donations', adminAuth, adminController.getDonations);
app.get('/api/admin/contacts', adminAuth, adminController.getContacts);
app.get('/api/admin/csr', adminAuth, adminController.getCSRInquiries);
app.get('/api/admin/trees', adminAuth, adminController.getTrees);
app.get('/api/admin/volunteers', adminAuth, adminController.getVolunteers);
app.get('/api/admin/logins', adminAuth, adminController.getLogins);
app.get('/api/admin/signups', adminAuth, adminController.getSignups);

app.get('/', (_req, res) => {
  res.send({ status: 'OK', service: 'Green Legacy Backend', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
