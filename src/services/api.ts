import type { AdminLoginRequest, AdminProfile, AdminRegisterRequest, LoginResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/admin';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function loginApi(data: AdminLoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = 'Login failed. Please check your credentials.';
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.message) message = errJson.message;
    } catch {
      if (errorText) message = errorText;
    }
    throw new ApiError(message, response.status);
  }

  return response.json();
}

export async function logoutApi(token: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.warn('Logout request completed with warning:', err);
  }
}

export async function getProfileApi(token: string): Promise<AdminProfile> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError('Failed to fetch profile', response.status);
  }

  return response.json();
}

export async function registerApi(data: AdminRegisterRequest): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Account for ${data.email} registered successfully. You can now login.`,
      });
    }, 600);
  });
}
