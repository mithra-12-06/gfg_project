export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ManagedUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  lastLogin?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersListResponse {
  users: ManagedUser[];
  pagination: PaginationMeta;
}

export interface AdminStatsResponse {
  cards: {
    totalUsers: number;
    activeUsers: number;
    adminCount: number;
  };
  registrationsTrend: { date: string; count: number }[];
  roleDistribution: { role: UserRole; count: number }[];
}

export interface AdminLogItem {
  _id: string;
  action: string;
  targetEmail: string;
  meta: string;
  createdAt: string;
  performedBy?: {
    name?: string;
    email?: string;
    role?: UserRole;
  };
}

export interface AdminLogsResponse {
  logs: AdminLogItem[];
  pagination: PaginationMeta;
}
