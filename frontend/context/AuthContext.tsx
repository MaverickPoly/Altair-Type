"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/axios";
import { AuthContextType, User } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn == "true") {
      const fetchProfile = async () => {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch (e) {
          console.info(`Failed to fetch profile: ${e}`);
          localStorage.removeItem("isLoggedIn");
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      await api.post("/auth/login", { username, password });
      const res = await api.get("/auth/me");
      setUser(res.data);

      localStorage.setItem("isLoggedIn", "true");
      return { success: true, message: "Logged in successfully!" };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Login failed!",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });
      setLoading(false);
      return { success: true, message: "Created user successfully!" };
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        message: error?.response?.data?.message || "Login failed!",
      };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      setUser(null);

      localStorage.removeItem("isLoggedIn");
      return { success: true, message: "Logged out successfully!" };
    } catch (e) {
      return { success: false, message: "Logout failed!" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider!");
  }
  return context;
};
