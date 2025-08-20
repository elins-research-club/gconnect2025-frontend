// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

// Kredensial hardcode untuk demo. Dalam aplikasi nyata, ini harus dari database.
const HARDCODED_USER = {
  email: "admin@example.com",
  password: "password123",
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Memuat status autentikasi dari localStorage saat aplikasi dimuat
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("is-authenticated");
      const storedUser = localStorage.getItem("current-user");
      if (storedAuth === "true" && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth state from local storage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (
      email === HARDCODED_USER.email &&
      password === HARDCODED_USER.password
    ) {
      const loggedInUser = { email: HARDCODED_USER.email };
      setIsAuthenticated(true);
      setUser(loggedInUser);
      // Menyimpan status ke localStorage
      localStorage.setItem("is-authenticated", "true");
      localStorage.setItem("current-user", JSON.stringify(loggedInUser));
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    // Menghapus status dari localStorage
    localStorage.removeItem("is-authenticated");
    localStorage.removeItem("current-user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
