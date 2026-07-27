import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AdminProfile, AdminLoginRequest } from '../types/auth';
import { loginApi, logoutApi, getProfileApi } from '../services/api';

interface AuthContextType {
  token: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = 'teacher_management_token';
const ADMIN_KEY = 'teacher_management_admin';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [admin, setAdmin] = useState<AdminProfile | null>(() => {
    const savedAdmin = localStorage.getItem(ADMIN_KEY);
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const profile = await getProfileApi(savedToken);
          setAdmin(profile);
          localStorage.setItem(ADMIN_KEY, JSON.stringify(profile));
        } catch {
          setToken(null);
          setAdmin(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(ADMIN_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: AdminLoginRequest) => {
    const response = await loginApi(credentials);
    setToken(response.token);
    setAdmin(response.admin);
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(response.admin));
  };

  const logout = async () => {
    if (token) {
      await logoutApi(token);
    }
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
