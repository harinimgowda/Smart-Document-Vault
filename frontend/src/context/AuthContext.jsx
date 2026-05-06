import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const decodeTokenPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const getAuthState = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { token: null, role: "guest", userId: null };
  }

  const decoded = decodeTokenPayload(token);
  return {
    token,
    role: decoded?.role || "guest",
    userId: decoded?.id || null,
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getAuthState());

  useEffect(() => {
    const handleStorageChange = () => setAuth(getAuthState());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeTokenPayload(token);
    if (decoded?.role) {
      localStorage.setItem("role", decoded.role);
    }
    setAuth(getAuthState());
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ token: null, role: "guest", userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
