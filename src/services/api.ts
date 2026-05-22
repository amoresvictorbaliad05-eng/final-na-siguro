const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://final1website-for-barangay.onrender.com";

const BASE = `${API_BASE_URL}/api`;

function normalizeUser(user: any) {
  return {
    ...user,
    isVerified: user.isVerified ?? user.is_verified,
    createdAt: user.createdAt ?? user.created_at,
  };
}

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Generic request helper
 */
async function request(
  endpoint: string,
  options: RequestOptions = {}
) {
  const token = localStorage.getItem("auth_token");

  const config: RequestInit = {
    method: options.method || "GET",

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(
      options.body
    );
  }

  const response = await fetch(
    `${BASE}${endpoint}`,
    config
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Request failed"
    );
  }

  return data;
}

const api = {
  /**
   * AUTH
   */

  login: (
    email: string,
    password: string
  ) =>
    request("/auth/login", {
      method: "POST",

      body: {
        email,
        password,
      },
    }),

  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) =>
    request("/auth/register", {
      method: "POST",
      body: data,
    }),

  getProfile: () =>
    request("/auth/me"),

  logout: () => {
    localStorage.removeItem(
      "auth_token"
    );

    localStorage.removeItem(
      "barangay_auth"
    );
  },

  /**
   * PROFILE UPDATE
   */

  updateProfile: (data: {
    name: string;
    phone: string;
    address: string;
  }) =>
    request("/auth/profile", {
      method: "PUT",
      body: data,
    }),

  /**
   * REPORTS
   */

  getReports: () =>
    request("/reports"),

  createReport: (data: any) =>
    request("/reports", {
      method: "POST",
      body: data,
    }),

  getReportById: (id: string) =>
    request(`/reports/${id}`),

  updateReport: (
    id: string,
    data: any
  ) =>
    request(`/reports/${id}/status`, {
      method: "PATCH",
      body: data,
    }),

  deleteReport: (id: string) =>
    request(`/reports/${id}`, {
      method: "DELETE",
    }),

  /**
   * USERS
   */

  getUsers: async () => {
    const data = await request("/users");
    return {
      ...data,
      users: (data.users || []).map((user: any) => normalizeUser(user)),
    };
  },

  getUserById: async (id: string) => {
    const data = await request(`/users/${id}`);
    return {
      ...data,
      user: normalizeUser(data.user),
    };
  },

  updateUser: (
    id: string,
    data: any
  ) =>
    request(`/users/${id}`, {
      method: "PUT",
      body: data,
    }),

  verifyUser: (id: string, isVerified: boolean) =>
    request(`/users/${id}/verify`, {
      method: "PATCH",
      body: { isVerified },
    }),

  deleteUser: (id: string) =>
    request(`/users/${id}`, {
      method: "DELETE",
    }),

  /**
   * ANALYTICS
   */

  getAnalytics: () =>
    request("/analytics"),

  /**
   * LOGS
   */

  getLogs: () =>
    request("/logs"),

  /**
   * NOTIFICATIONS
   */

  getNotifications: () =>
    request("/notifications"),
};

export default api;