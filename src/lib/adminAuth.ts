const ADMIN_EMAIL = "mamidipranay07@gmail.com";
const ADMIN_PASSWORD = "2025@Legacy";

export const isAdmin = (): boolean => {
  const adminToken = localStorage.getItem('adminToken');
  return !!adminToken;
};

export const adminLogin = async (email: string, password: string): Promise<boolean> => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem('adminToken', 'true');
    return true;
  }
  throw new Error('Invalid admin credentials');
};

export const adminLogout = (): void => {
  localStorage.removeItem('adminToken');
};