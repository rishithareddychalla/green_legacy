import mongoose from 'mongoose';
import { Signup } from '../models/Signup.js';
import { Login } from '../models/Login.js';
import { Donation } from '../models/Donation.js';
import { Contact } from '../models/Contact.js';
import { CSR } from '../models/CSR.js';
import { Tree } from '../models/Tree.js';
import { Volunteer } from '../models/Volunteer.js';

// Utility function for pagination
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};

// Utility function for search filtering
const getSearchFilter = (searchTerm, fields) => {
  if (!searchTerm) return {};
  
  const searchRegex = new RegExp(searchTerm, 'i');
  return {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
};

export const adminController = {
  // Get Dashboard Overview Stats
  async getStats(req, res) {
    try {
      const [
        userCount,
        donationSum,
        treeCount,
        volunteerCount,
        csrCount,
        contactCount
      ] = await Promise.all([
        Signup.countDocuments(),
        Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
        Tree.countDocuments(),
        Volunteer.countDocuments(),
        CSR.countDocuments(),
        Contact.countDocuments()
      ]);

      res.json({
        totalUsers: userCount,
        totalDonations: donationSum[0]?.total || 0,
        totalTrees: treeCount,
        totalVolunteers: volunteerCount,
        totalCSR: csrCount,
        totalContacts: contactCount
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get Users with Pagination and Search
  async getUsers(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, ['name', 'email']);

      const [users, total] = await Promise.all([
        Signup.find(searchFilter)
          .select('-password')
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Signup.countDocuments(searchFilter)
      ]);

      res.json({
        data: users,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get Donations with Pagination and Search
  async getDonations(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, ['name', 'email']);

      const [donations, total] = await Promise.all([
        Donation.aggregate([
          { $match: searchFilter },
          {
            $lookup: {
              from: 'trees',
              localField: 'paymentId',
              foreignField: 'payment_id',
              as: 'trees'
            }
          },
          { $sort: { date: -1 } },
          { $skip: skip },
          { $limit: limit }
        ]),
        Donation.countDocuments(searchFilter)
      ]);

      res.json({
        data: donations,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get Contact Submissions with Pagination and Search
  async getContacts(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, ['name', 'email', 'message']);

      const [contacts, total] = await Promise.all([
        Contact.find(searchFilter)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Contact.countDocuments(searchFilter)
      ]);

      res.json({
        data: contacts,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get CSR Inquiries with Pagination and Search
  async getCSRInquiries(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, 
        ['company', 'contactPerson', 'email', 'proposal']);

      const [inquiries, total] = await Promise.all([
        CSR.find(searchFilter)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        CSR.countDocuments(searchFilter)
      ]);

      res.json({
        data: inquiries,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get Trees with Pagination and Search
  async getTrees(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, 
        ['donor_name', 'species_name', 'tree_id', 'location']);

      const [trees, total] = await Promise.all([
        Tree.find(searchFilter)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Tree.countDocuments(searchFilter)
      ]);

      res.json({
        data: trees,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get Volunteers with Pagination and Search
  async getVolunteers(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, 
        ['name', 'email', 'phone', 'interest']);

      const [volunteers, total] = await Promise.all([
        Volunteer.find(searchFilter)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Volunteer.countDocuments(searchFilter)
      ]);

      res.json({
        data: volunteers,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get Login records with Pagination and Search
  async getLogins(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, ['email']);

      const [logins, total] = await Promise.all([
        Login.find(searchFilter)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Login.countDocuments(searchFilter)
      ]);

      res.json({
        data: logins,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get Signups with Pagination and Search
  async getSignups(req, res) {
    try {
      const { skip, limit, page } = getPaginationParams(req.query);
      const searchFilter = getSearchFilter(req.query.search, ['name', 'email']);

      const [signups, total] = await Promise.all([
        Signup.find(searchFilter)
          .select('-password')
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Signup.countDocuments(searchFilter)
      ]);

      res.json({
        data: signups,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};