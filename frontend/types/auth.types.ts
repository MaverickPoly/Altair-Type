export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnPayload {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<ReturnPayload>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<ReturnPayload>;
  logout: () => Promise<ReturnPayload>;
}
