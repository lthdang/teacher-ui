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

export interface AdminLoginResponse {
  token: string;
  expiresAt: string;
  admin: AdminProfile;
}

export interface AdminRegisterRequest {
  email: string;
  surname: string;
  firstName: string;
  password: string;
}

export interface AdminUpdateRequest {
  surname?: string | null;
  firstName?: string | null;
  avatar?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

