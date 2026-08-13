import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { AdminProfile, AdminLoginRequest } from '../types/auth';
import { loginApi, logoutApi, getProfileApi } from '../services/api';
import { authStorage } from '../services/authStorage';
import { authEvents } from '../services/authEvents';

export interface AuthContextType {
  token: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setAdminProfile: (updated: AdminProfile) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [admin, setAdmin] = useState<AdminProfile | null>(() => authStorage.getAdmin());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
    }
    setToken(null);
    setAdmin(null);
    authStorage.clearSession();
  }, []);

  const setAdminProfile = useCallback((updated: AdminProfile) => {
    setAdmin(updated);
    const currentToken = authStorage.getToken();
    if (currentToken) {
      authStorage.setSession(currentToken, updated);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfileApi();
      setAdminProfile(profile);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, [setAdminProfile]);

  useEffect(() => {
    authEvents.onUnauthorized(() => {
      logout();
    });
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = authStorage.getToken();
      if (savedToken) {
        try {
          const profile = await getProfileApi();
          setAdmin(profile);
          authStorage.setSession(savedToken, profile);
        } catch {
          setToken(null);
          setAdmin(null);
          authStorage.clearSession();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: AdminLoginRequest) => {
    console.log('Logging in with credentials:', credentials);
    const response = await loginApi(credentials);
    setToken(response.token);
    setAdmin(response.admin);
    authStorage.setSession(response.token, response.admin);
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
        refreshProfile,
        setAdminProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};