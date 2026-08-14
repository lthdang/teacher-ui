import { AxiosError } from 'axios';
import { apiClient } from './apiClient';
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminRegisterRequest,
  AdminUpdateRequest,
  ChangePasswordRequest,
  AdminProfile,
  SubAdminDetail,
  PermissionItem,
} from '../types/auth';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface BackendErrorShape {
  message?: string;
}

function toApiError(err: unknown, fallbackMessage: string): ApiError {
  if (err instanceof AxiosError) {
    const data = err.response?.data as BackendErrorShape | string | undefined;
    const message =
      (typeof data === 'object' && data?.message) ||
      (typeof data === 'string' && data) ||
      fallbackMessage;
    return new ApiError(message, err.response?.status ?? 0);
  }
  return new ApiError(fallbackMessage, 0);
}

export async function registerApi(data: AdminRegisterRequest): Promise<AdminProfile> {
  try {
    const response = await apiClient.post<AdminProfile>('/auth/register', data);
    return response.data;
  } catch (err) {
    throw toApiError(err, 'Registration failed. Please try again.');
  }
}

export async function loginApi(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
  try {
    const response = await apiClient.post<AdminLoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (err) {
    throw toApiError(err, 'Login failed. Please check your credentials.');
  }
}

export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (err) {
    throw toApiError(err, 'Logout failed.');
  }
}

export async function getProfileApi(): Promise<AdminProfile> {
  try {
    const response = await apiClient.get<AdminProfile>('/auth/profile');
    return response.data;
  } catch (err) {
    throw toApiError(err, 'Failed to load profile.');
  }
}

export async function updateProfileApi(data: AdminUpdateRequest): Promise<AdminProfile> {
  try {
    const response = await apiClient.put<AdminProfile>('/auth/profile', data);
    return response.data;
  } catch (err) {
    throw toApiError(err, 'Failed to update profile.');
  }
}

export async function changePasswordApi(data: ChangePasswordRequest): Promise<void> {
  try {
    await apiClient.put('/auth/password', data);
  } catch (err) {
    throw toApiError(err, 'Failed to change password.');
  }
}

export async function getSubAdminsApi(): Promise<AdminProfile[]> {
  try {
    const response = await apiClient.get<AdminProfile[]>('/auth/sub-admins');
    return response.data;
  } catch (err) {
    throw toApiError(err, 'Failed to fetch sub-admins list.');
  }
}

export async function getSubAdminDetailApi(id: string): Promise<SubAdminDetail> {
  try {
    const response = await apiClient.get<SubAdminDetail>(`/auth/sub-admins/${id}`);
    return response.data;
  } catch (err) {
    throw toApiError(err, 'Failed to fetch sub-admin details.');
  }
}

export async function deleteSubAdminApi(id: string): Promise<void> {
  try {
    await apiClient.delete(`/auth/sub-admins/${id}`);
  } catch (err) {
    throw toApiError(err, 'Failed to delete sub-admin.');
  }
}

export async function updateSubAdminPermissionsApi(
  id: string,
  permissionIds: number[]
): Promise<PermissionItem[]> {
  try {
    const response = await apiClient.put<PermissionItem[]>(
      `/auth/sub-admins/${id}/permissions`,
      { permissionIds }
    );
    return response.data;
  } catch (err) {
    throw toApiError(err, 'Failed to update sub-admin permissions.');
  }
}

export async function getAllPermissionsApi(): Promise<PermissionItem[]> {
  try {
    const response = await apiClient.get<PermissionItem[]>('/permissions');
    return response.data;
  } catch (err) {
    // If /permissions fails, try /auth/permissions as fallback
    try {
      const fallbackResponse = await apiClient.get<PermissionItem[]>('/auth/permissions');
      return fallbackResponse.data;
    } catch {
      throw toApiError(err, 'Failed to fetch system permissions.');
    }
  }
}