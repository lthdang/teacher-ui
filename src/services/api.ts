import { AxiosError } from 'axios';
import { apiClient } from './apiClient';
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminRegisterRequest,
  AdminProfile,
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