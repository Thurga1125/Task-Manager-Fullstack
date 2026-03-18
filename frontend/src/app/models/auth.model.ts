export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  userId: string;
  profilePicture?: string;
}

export interface User {
  token: string;
  username: string;
  email: string;
  userId: string;
  profilePicture?: string;
}
