export interface AdminProfile {
  id: string;
  email: string;
  surname?: string | null;
  firstName?: string | null;
  avatar?: string | null;
  lastLogin?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminLoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  admin: AdminProfile;
}

export interface AdminRegisterRequest {
  email: string;
  password?: string;
  surname?: string;
  firstName?: string;
}
