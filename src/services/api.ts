const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    barangay?: string;
  }) {
    const data = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: userData,
    });
    this.setToken(data.token);
    return data;
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/me');
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('barangay_auth');
  }

  // Reports endpoints
  async getReports(params?: {
    status?: string;
    category?: string;
    severity?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.set(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return this.request<{ reports: any[]; pagination: any }>(`/reports${query ? `?${query}` : ''}`);
  }

  async getReportById(id: string) {
    return this.request<{ report: any }>(`/reports/${id}`);
  }

  async createReport(reportData: {
    title: string;
    description: string;
    category: string;
    severity: string;
    location: string;
    barangay: string;
    evidenceDescription?: string;
    witnessName?: string;
    witnessContact?: string;
    isAnonymous?: boolean;
  }) {
    return this.request<{ report: any }>('/reports', {
      method: 'POST',
      body: reportData,
    });
  }

  async updateReportStatus(id: string, status: string, reviewNotes?: string) {
    return this.request<{ report: any }>(`/reports/${id}/status`, {
      method: 'PATCH',
      body: { status, reviewNotes },
    });
  }

  // Users endpoints
  async getUsers(params?: { role?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.set(key, value);
        }
      });
    }
    const query = queryParams.toString();
    return this.request<{ users: any[] }>(`/users${query ? `?${query}` : ''}`);
  }

  async verifyUser(id: string, isVerified: boolean) {
    return this.request<{ user: any }>(`/users/${id}/verify`, {
      method: 'PATCH',
      body: { isVerified },
    });
  }

  // Analytics endpoints
  async getAnalyticsOverview() {
    return this.request<any>('/analytics/overview');
  }

  async getAnalyticsCategories() {
    return this.request<{ categories: any[] }>('/analytics/categories');
  }

  async getAnalyticsStatusDistribution() {
    return this.request<{ statuses: any[] }>('/analytics/status-distribution');
  }

  async getAnalyticsMonthlyTrend() {
    return this.request<{ trend: any[] }>('/analytics/monthly-trend');
  }

  async getAnalyticsBarangayDistribution() {
    return this.request<{ barangays: any[] }>('/analytics/barangay-distribution');
  }

  async getAnalyticsSeverityDistribution() {
    return this.request<{ severities: any[] }>('/analytics/severity-distribution');
  }

  async getAnalyticsDayOfWeek() {
    return this.request<{ days: any[] }>('/analytics/day-of-week');
  }

  async getAnalyticsCategoryByStatus() {
    return this.request<{ data: Record<string, Record<string, number>> }>('/analytics/category-by-status');
  }

  // Logs endpoints
  async getActivityLogs(limit?: number) {
    return this.request<{ logs: any[] }>(`/logs${limit ? `?limit=${limit}` : ''}`);
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request<{ notifications: any[]; unreadCount: number }>('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', { method: 'PATCH' });
  }
}

export const api = new ApiService();
export default api;
