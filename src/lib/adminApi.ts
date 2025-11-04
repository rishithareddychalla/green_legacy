import axios from 'axios';

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) ? `${String(import.meta.env.VITE_API_URL)}/api` : '/api';

export const adminApi = {
  // Users
  async getUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      // older callers expect an array, updated endpoints return { users, pagination }
      return response.data.users ?? response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Donations
  async getDonations() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/donations`);
      // newer endpoint returns { donations, pagination }
      return response.data.donations ?? response.data;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Get total stats
  async getOverviewStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      throw error;
    }
  }
};