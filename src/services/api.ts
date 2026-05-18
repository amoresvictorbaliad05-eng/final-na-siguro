const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const token = localStorage.getItem("auth_token");

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // IMPORTANT: handle HTML responses (fix your error)
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // fallback safety (prevents "<!doctype html>" crash)
  const text = await response.text();
  throw new Error(text);
}

// ========================
// AUTH
// ========================
export const api = {
  login: async (email: string, password: string) => {
    return request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  register: async (data: any) => {
    return request("/auth/register", {
      method: "POST",
      body: data,
    });
  },

  getProfile: async () => {
    return request("/auth/me");
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("barangay_auth");
  },

  // ========================
  // REPORTS
  // ========================
  getReports: async () => {
    return request("/reports");
  },

  createReport: async (data: any) => {
    return request("/reports", {
      method: "POST",
      body: data,
    });
  },

  updateReportStatus: async (id: string, status: string) => {
    return request(`/reports/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  // ========================
  // USERS
  // ========================
  getUsers: async () => {
    return request("/users");
  },

  // ========================
  // ANALYTICS
  // ========================
  getAnalytics: async () => {
    return request("/analytics");
  },

  // ========================
  // LOGS
  // ========================
  getLogs: async () => {
    return request("/logs");
  },

  // ========================
  // NOTIFICATIONS
  // ========================
  getNotifications: async () => {
    return request("/notifications");
  },
};

export default api;