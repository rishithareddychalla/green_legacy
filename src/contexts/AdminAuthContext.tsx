import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // Initialize auth state synchronously from storage to avoid redirect race
  const existingToken = (typeof window !== 'undefined')
    ? (localStorage.getItem('adminAuth') || sessionStorage.getItem('adminAuth'))
    : null;
  const [isAuthenticated, setIsAuthenticated] = useState(!!existingToken);
  const navigate = useNavigate();

  // Ensure axios has the header if token exists
  if (existingToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
  }

  const login = async (email: string, password: string) => {
    if (email === 'panelgreenlegacy@gmail.com' && password === '2025@Legacy') {
      const token = btoa(JSON.stringify({ email, password }));
      localStorage.setItem('adminAuth', token);
      sessionStorage.setItem('adminAuth', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      navigate('/admin/dashboard', { replace: true });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminAuth');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
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