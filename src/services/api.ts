// API Service Layer - Centralized configuration and methods for all API calls

const API_BASE_URL = 'https://hotel-booking-system-backend-0tc6.onrender.com/api';

interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
}

interface HotelData extends Record<string, unknown> {
  name: string;
  detail: string;
  price?: number;
  location?: string;
  rating?: number;
  rooms?: number;
  amenities?: string[];
}

interface BookingData extends Record<string, unknown> {
  product_id?: number;
  product_name?: string;
  check_in: string;
  check_out: string;
  guests: number;
  price?: number;
  notes?: string;
}

interface BookingUpdateData extends Record<string, unknown> {
  product_id?: number;
  check_in: string;
  check_out: string;
  guests: number;
  notes?: string;
  status?: string;
}

interface UserData extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface UserUpdateData extends Record<string, unknown> {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

interface RoleData extends Record<string, unknown> {
  name: string;
  permissions?: string[];
}

interface StatsData extends Record<string, unknown> {
  totalBookings: number;
  totalHotels: number;
  totalUsers: number;
  revenue: number;
  users?: number;
  hotels?: number;
  bookings?: number;
  roles?: number;
  bookings_pending?: number;
  booking_status?: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  monthly_bookings?: number[];
}

interface OverviewData extends Record<string, unknown> {
  recentBookings: Array<{
    id: string | number;
    user_name?: string;
    hotel_name?: string;
    check_in?: string;
    status?: string;
    [key: string]: any;
  }>;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('api_token');
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T = Record<string, unknown>>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body = null,
      headers: customHeaders = {},
    } = options;

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(customHeaders);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        console.error(`API Error [${response.status}] ${endpoint}:`, data);
        throw {
          status: response.status,
          ...data,
        };
      }

      console.log(`API Success [${response.status}] ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API Request failed [${endpoint}]:`, error);
      // Handle different error types
      if (error instanceof Error) {
        if ('status' in error) {
          throw error;
        }
        throw {
          success: false,
          message: 'Network error',
          error: error.message || 'An unexpected error occurred',
        };
      }
      throw {
        success: false,
        message: 'Network error',
        error: 'An unexpected error occurred',
      };
    }
  }

  // ==================== HOTELS ====================

  async getHotels(): Promise<ApiResponse> {
    return this.request('/hotels', {
      method: 'GET',
    });
  }

  async getHotel(id: string | number): Promise<ApiResponse> {
    return this.request(`/hotels/${id}`, {
      method: 'GET',
    });
  }

  async createHotel(data: HotelData): Promise<ApiResponse> {
    return this.request('/hotels', {
      method: 'POST',
      body: data,
    });
  }

  async updateHotel(
    id: string | number,
    data: HotelData
  ): Promise<ApiResponse> {
    return this.request(`/hotels/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteHotel(id: string | number): Promise<ApiResponse> {
    return this.request(`/hotels/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== BOOKINGS ====================

  async getBookings(page: number = 1, perPage: number = 15): Promise<ApiResponse> {
    return this.request(`/bookings?page=${page}&per_page=${perPage}`, {
      method: 'GET',
    });
  }

  async getBooking(id: string | number): Promise<ApiResponse> {
    return this.request(`/bookings/${id}`, {
      method: 'GET',
    });
  }

  async createBooking(data: BookingData): Promise<ApiResponse> {
    return this.request('/bookings', {
      method: 'POST',
      body: data,
    });
  }

  async updateBooking(
    id: string | number,
    data: BookingUpdateData
  ): Promise<ApiResponse> {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteBooking(id: string | number): Promise<ApiResponse> {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  async confirmBooking(id: string | number): Promise<ApiResponse> {
    return this.request(`/bookings/${id}/confirm`, {
      method: 'PATCH',
    });
  }

  async cancelBooking(id: string | number): Promise<ApiResponse> {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  // ==================== AUTH ====================

  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request('/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse> {
    return this.request('/register', {
      method: 'POST',
      body: data,
    });
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request('/user', {
      method: 'GET',
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  // ==================== USERS ====================

  async getUsers(page: number = 1, perPage: number = 15): Promise<ApiResponse> {
    return this.request(`/users?page=${page}&per_page=${perPage}`, {
      method: 'GET',
    });
  }

  async getUser(id: string | number): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'GET',
    });
  }

  async createUser(data: UserData): Promise<ApiResponse> {
    return this.request('/users', {
      method: 'POST',
      body: data,
    });
  }

  async updateUser(
    id: string | number,
    data: UserUpdateData
  ): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteUser(id: string | number): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ROLES ====================

  async getRoles(page: number = 1, perPage: number = 15): Promise<ApiResponse> {
    return this.request(`/roles?page=${page}&per_page=${perPage}`, {
      method: 'GET',
    });
  }

  async getRole(id: string | number): Promise<ApiResponse> {
    return this.request(`/roles/${id}`, {
      method: 'GET',
    });
  }

  async createRole(data: RoleData): Promise<ApiResponse> {
    return this.request('/roles', {
      method: 'POST',
      body: data,
    });
  }

  async updateRole(
    id: string | number,
    data: RoleData
  ): Promise<ApiResponse> {
    return this.request(`/roles/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteRole(id: string | number): Promise<ApiResponse> {
    return this.request(`/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== OVERVIEW/DASHBOARD ====================

  async getOverviewStats(): Promise<ApiResponse> {
    return this.request<StatsData>('/overview/stats', {
      method: 'GET',
    });
  }

  async getOverview(): Promise<ApiResponse> {
    return this.request<OverviewData>('/overview', {
      method: 'GET',
    });
  }

  // Debug endpoint (helper) - returns user's roles and debug info
  async getDebugUserRoles(): Promise<ApiResponse> {
    return this.request('/debug/user-roles', {
      method: 'GET',
    });
  }

  // ==================== TOKEN MANAGEMENT ====================

  setToken(token: string): void {
    localStorage.setItem('api_token', token);
  }

  clearToken(): void {
    localStorage.removeItem('api_token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}

export default new ApiService();
