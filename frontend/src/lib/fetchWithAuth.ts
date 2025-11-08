// src/lib/fetchWithAuth.ts
const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL) ? String(import.meta.env.VITE_API_URL) : '';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const adminToken = typeof window !== 'undefined' ? (localStorage.getItem('adminAuth') || sessionStorage.getItem('adminAuth')) : null;
  const headers = new Headers(options.headers || {});

  // Prefer admin token for admin API calls if present
  if (adminToken) {
    headers.set('Authorization', `Bearer ${adminToken}`);
  } else if (userToken) {
    headers.set('Authorization', `Bearer ${userToken}`);
  }

  options.headers = headers;

  // If the URL is a relative API path, prefix with API_BASE to reach backend in dev
  const finalUrl = url.startsWith('/api') && API_BASE ? `${API_BASE}${url}` : url;

  return fetch(finalUrl, options);
};
