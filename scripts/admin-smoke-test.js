#!/usr/bin/env node
const axios = require('axios');

const API_BASE = process.env.VITE_API_URL ? process.env.VITE_API_URL.replace(/\/$/, '') : (process.env.API_BASE || 'http://localhost:5000');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.ADMIN_USER || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || '';

function getAuthHeader() {
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const token = Buffer.from(JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })).toString('base64');
    return { Authorization: `Bearer ${token}` };
  }
  // otherwise no auth header
  return {};
}

const endpoints = [
  '/api/admin/stats',
  '/api/admin/users',
  '/api/admin/donations',
  '/api/admin/contacts',
  '/api/admin/csr',
  '/api/admin/trees',
  '/api/admin/volunteers',
  '/api/admin/logins',
  '/api/admin/signups'
];

(async function run() {
  console.log(`Using API base: ${API_BASE}`);
  const headers = getAuthHeader();

  for (const ep of endpoints) {
    const url = `${API_BASE}${ep}`;
    try {
      const res = await axios.get(url, { headers, timeout: 10000 });
      const data = res.data;
      if (data && data.pagination && Array.isArray(data.data)) {
        console.log(`${ep} -> OK: ${data.data.length} rows (page ${data.pagination.page}/${data.pagination.pages}, total ${data.pagination.total})`);
      } else if (Array.isArray(data)) {
        console.log(`${ep} -> OK: returned array with ${data.length} items`);
      } else if (ep === '/api/admin/stats') {
        console.log(`${ep} -> OK: stats: ${JSON.stringify(data)}`);
      } else {
        console.log(`${ep} -> OK: received response (shape unknown) - ${Object.keys(data || {}).length} keys`);
      }
    } catch (err) {
      if (err.response) {
        console.error(`${ep} -> ERROR ${err.response.status}: ${JSON.stringify(err.response.data)}`);
      } else {
        console.error(`${ep} -> ERROR: ${err.message}`);
      }
    }
  }
})();
