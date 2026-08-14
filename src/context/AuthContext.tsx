import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { AdminProfile, AdminLoginRequest, AdminType } from '../types/auth';
import { loginApi, logoutApi, getProfileApi } from '../services/api';
import { authStorage } from '../services/authStorage';
import { authEvents } from '../services/authEvents';

export interface AuthContextType {
  token: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
  roleType: AdminType | null;
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
      // Ignore API logout errors and proceed to clean local state
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
      setAdminProfile({
        ...profile,
        permissions: admin?.permissions || profile.permissions,
      });
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, [admin?.permissions, setAdminProfile]);

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
          const savedAdmin = authStorage.getAdmin();
          const mergedProfile: AdminProfile = {
            ...profile,
            permissions: savedAdmin?.permissions || profile.permissions,
          };
          setAdmin(mergedProfile);
          authStorage.setSession(savedToken, mergedProfile);
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
    const response = await loginApi(credentials);
    const fullAdminProfile: AdminProfile = {
      ...response.admin,
      permissions: response.permissions || [],
    };
    setToken(response.token);
    setAdmin(fullAdminProfile);
    authStorage.setSession(response.token, fullAdminProfile);
  };

  const isSuperAdmin = admin?.type === 'SUPER_ADMIN';
  const permissions = admin?.permissions || [];
  const roleType = admin?.type || null;

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        isSuperAdmin,
        permissions,
        roleType,
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