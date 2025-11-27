// Authentication Service - Manages user authentication state and operations

import apiService from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  roles?: string[];
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private listeners: Set<(state: AuthState) => void> = new Set();
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Check if token exists in localStorage and try to restore session
    if (apiService.hasToken()) {
      // Set loading state while checking token validity
      this.updateState({ isLoading: true });
      // Don't await here - let the getCurrentUser happen asynchronously
      this.getCurrentUser();
    }
  }

  private updateState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): AuthState {
    return this.state;
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    this.updateState({ isLoading: true, error: null });

    try {
      const response = await apiService.login(email, password);

      if (!response.success) {
        this.updateState({
          isLoading: false,
          error: response.message,
        });
        return { success: false, message: response.message };
      }

      // Store token
      const token = (response.data as Record<string, unknown>)?.plainTextToken || (response.data as Record<string, unknown>)?.token;
      if (token) {
        apiService.setToken(token as string);
      }

      // Fetch current user
      await this.getCurrentUser();

      this.updateState({ isLoading: false });
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.updateState({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    this.updateState({ isLoading: true, error: null });

    try {
      const response = await apiService.register(data);

      if (!response.success) {
        this.updateState({
          isLoading: false,
          error: response.message,
        });
        return { success: false, message: response.message };
      }

      // Store token if provided
      const responseData = response.data as Record<string, unknown> | undefined;
      const token = responseData?.plainTextToken || responseData?.token;
      if (token && typeof token === 'string') {
        apiService.setToken(token);
      }

      // Fetch current user
      if (token) {
        await this.getCurrentUser();
      }

      this.updateState({ isLoading: false });
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      this.updateState({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  }

  async getCurrentUser(): Promise<void> {
    if (!apiService.hasToken()) {
      this.updateState({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    try {
      const response = await apiService.getCurrentUser();

      if (response.success && response.data) {
        const userData = response.data as unknown as User;
        this.updateState({
          user: userData,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
      } else {
        // Token is invalid
        this.logout();
      }
    } catch (error) {
      // Token is invalid or expired
      console.error('Failed to fetch current user:', error instanceof Error ? error.message : String(error));
      this.logout();
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    apiService.clearToken();
    this.updateState({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  getUser(): User | null {
    return this.state.user;
  }

  hasRole(role: string): boolean {
    if (!this.state.user || !this.state.user.roles) {
      return false;
    }
    return this.state.user.roles.includes(role);
  }

  hasPermission(permission: string): boolean {
    if (!this.state.user || !this.state.user.permissions) {
      return false;
    }
    return this.state.user.permissions.includes(permission);
  }
}

export default new AuthService();
