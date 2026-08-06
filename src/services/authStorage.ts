import type { AdminProfile } from '../types/auth';

const TOKEN_KEY = 'teacher_token';
const ADMIN_KEY = 'teacher_admin';

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getAdmin: (): AdminProfile | null => {
    const saved = localStorage.getItem(ADMIN_KEY);
    return saved ? JSON.parse(saved) : null;
  },
  setSession: (token: string, admin: AdminProfile) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },
};