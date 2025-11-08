import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  pendingVerification: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const existingToken = (typeof window !== 'undefined')
    ? (localStorage.getItem('adminAuth') || sessionStorage.getItem('adminAuth'))
    : null;
  // Ensure axios points to backend API (Vite exposes VITE_API_URL)
  const apiBase = (import.meta as any).env?.VITE_API_URL || '';
  if (apiBase) axios.defaults.baseURL = apiBase;
  const [isAuthenticated, setIsAuthenticated] = useState(!!existingToken);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const navigate = useNavigate();

  if (existingToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Delegate credential validation to the backend. Backend will validate credentials
      // and send an OTP if valid. This avoids hardcoding credentials on the client.
      const response = await axios.post('/api/admin/request-otp', { email, password });
      if (response.status === 200) {
        setTempEmail(email);
        setPendingVerification(true);
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      // Surface backend error message when available
      const msg = (error as any)?.response?.data?.error || (error as Error).message || 'Login failed';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/admin/verify-otp', {
        email: tempEmail,
        otp
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('adminAuth', token);
        sessionStorage.setItem('adminAuth', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setPendingVerification(false);
        setTempEmail("");
        navigate('/admin/dashboard', { replace: true });
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      throw new Error('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminAuth');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setPendingVerification(false);
    setTempEmail("");
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      verifyOtp,
      pendingVerification 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}