const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://final1website-for-barangay.onrender.com";

const BASE = `${API_BASE_URL}/api`;

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
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

const api = {
  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (data: any) =>
    request("/auth/register", {
      method: "POST",
      body: data,
    }),

  getProfile: () => request("/auth/me"),

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("barangay_auth");
  },

  getReports: () => request("/reports"),

  createReport: (data: any) =>
    request("/reports", {
      method: "POST",
      body: data,
    }),

  getUsers: () => request("/users"),

  getAnalytics: () => request("/analytics"),

  getLogs: () => request("/logs"),

  getNotifications: () => request("/notifications"),

  // ✅ FIXED: now INSIDE api object + correct BASE
  updateProfile: (data: {
    name: string;
    phone: string;
    address: string;
  }) =>
    request("/users/profile", {
      method: "PATCH",
      body: data,
    }),
};

export default api;