"use client";

import { createContext, ReactNode, useContext } from "react";
import { UserContextType } from "@/types/user.types";
import api from "@/lib/axios";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Fetch Profile for user with userId
  const fetchProfile = async (userId: string) => {
    try {
      const res = await api.get(`/auth/user/${userId}/`);
      return {
        success: true,
        message: "Fetched profile successfully!",
        data: res.data,
      };
    } catch (e) {
      return { success: false, message: "Error fetching profile!" };
    }
  };

  // User Edits profile
  const editProfile = async () => {};

  // Fetch All Users
  const allUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      return {
        success: true,
        message: "Fetched Users successfully!",
        data: res.data,
      };
    } catch (error: any) {
      return { success: false, message: "Error fetching users!" };
    }
  };

  // Fetch Leaderboard Stats
  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/tests/leaderboard");
      return {
        success: true,
        message: "Fetched leaderboard successfully!",
        data: res.data,
      };
    } catch (error: any) {
      return { success: false, message: "Error fetching leaderboard!" };
    }
  };

  // Fetch User Test Stats
  const fetchUserStats = async (userId: string) => {
    try {
      const res = await api.get(`/auth/user/${userId}/stats`);
      return {
        success: true,
        message: "Fetched user test stats successfully!",
        data: res.data,
      };
    } catch (error: any) {
      return { success: false, message: "Error fetching user test stats!" };
    }
  };

  return (
    <UserContext.Provider
      value={{ fetchProfile, allUsers, fetchLeaderboard, fetchUserStats }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser should be used inside UserProvider!");
  }
  return context;
};
