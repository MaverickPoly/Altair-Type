import { User } from "@/types/auth.types";

export interface LeaderboardEntry {
  username: string;
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  totalWords: number;
}

export interface UserStats {
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  totalWords: number;
}

export interface FetchUserProfilePayload {
  success: boolean;
  message: string;
  data?: User;
}
export interface FetchUsersPayload {
  success: boolean;
  message: string;
  data?: User[];
}

export interface FetchLeaderboardPayload {
  success: boolean;
  message: string;
  data?: LeaderboardEntry[];
}

export interface FetchUserStatsPayload {
  success: boolean;
  message: string;
  data?: UserStats;
}

export interface UserContextType {
  fetchProfile: (userId: string) => Promise<FetchUserProfilePayload>;
  allUsers: () => Promise<FetchUsersPayload>;
  fetchLeaderboard: () => Promise<FetchLeaderboardPayload>;
  fetchUserStats: (userId: string) => Promise<FetchUserStatsPayload>;
}
