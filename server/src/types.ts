// server/src/types.ts
export interface Tweet {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  userId: string; // Link tweet to user
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed password
  createdAt: string;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}