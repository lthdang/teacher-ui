export type AdminType = 'SUPER_ADMIN' | 'SUB_ADMIN';

export interface AdminProfile {
  id: string;
  email: string;
  surname?: string | null;
  firstName?: string | null;
  avatar?: string | null;
  type?: AdminType;
  permissions?: string[];
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
  permissions?: string[];
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

export interface PermissionItem {
  id: number;
  name: string;
  permissionCode: string;
  endpoint?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubAdminDetail {
  id: string;
  email: string;
  surname?: string | null;
  firstName?: string | null;
  avatar?: string | null;
  type: AdminType;
  lastLogin?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  permissions: PermissionItem[];
}

export interface UpdateSubAdminPermissionsRequest {
  permissionIds: number[];
}

export interface UpdatePermissionRequest {
  name: string;
}

