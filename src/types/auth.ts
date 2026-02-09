export enum Role {
  Owner = "OWNER",
  Accountant = "ACCOUNTANT",
  User = "USER"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Session object as returned by /login and /currentuser
export interface AuthSession {
  sessionId: string;
  userId: string;
  email: string;
  fullname?: string;
  roleId?: string;
  accessToken: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

