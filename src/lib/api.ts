import { getToken } from "@/lib/auth";
import type {
  AdminLogsResponse,
  AdminStatsResponse,
  AuthResponse,
  ManagedUser,
  UsersListResponse,
} from "@/types/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
};

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getUsers: (params: { search?: string; role?: "all" | "user" | "admin"; page?: number; limit?: number; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.role) searchParams.set("role", params.role);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    return request<UsersListResponse>(`/users?${searchParams.toString()}`);
  },
  createUser: (payload: { name: string; email: string; password: string; role: "user" | "admin" }) =>
    request<ManagedUser>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateUser: (
    id: string,
    payload: { name: string; email: string; role: "user" | "admin"; password?: string }
  ) =>
    request<ManagedUser>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteUser: (id: string) =>
    request<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    }),
  resetUserPassword: (id: string, password: string) =>
    request<{ message: string }>(`/users/${id}/reset-password`, {
      method: "PUT",
      body: JSON.stringify({ password }),
    }),
  getAdminStats: () => request<AdminStatsResponse>("/admin/stats"),
  getAdminLogs: (page = 1, limit = 20) => request<AdminLogsResponse>(`/admin/logs?page=${page}&limit=${limit}`),
  exportUsersCsv: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE}/users/export`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      throw new Error("Failed to export users");
    }
    return response.blob();
  },
};
