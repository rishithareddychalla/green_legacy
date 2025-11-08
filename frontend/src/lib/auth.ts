const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Invalid credentials");
  }
  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.removeItem("isSoftLoggedOut");
  return data;
};

export const signup = async (name, email, password) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Could not create account");
  }
  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.removeItem("isSoftLoggedOut");
  return data;
};

export const logout = () => {
  localStorage.setItem("isSoftLoggedOut", "true");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isLoggedIn = () => {
  const token = !!localStorage.getItem("token");
  const softLoggedOut = localStorage.getItem("isSoftLoggedOut") === "true";
  return token && !softLoggedOut;
};
