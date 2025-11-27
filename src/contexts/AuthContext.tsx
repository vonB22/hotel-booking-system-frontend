import React from 'react';
import type { AuthState } from '../services/auth';

export const AuthContext = React.createContext<AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  logout: async () => {},
  hasRole: () => false,
  hasPermission: () => false,
});
