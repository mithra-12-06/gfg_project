import type { AuthUser } from "@/types/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const setAuthSession = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getCurrentUser = (): AuthUser | null => {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getToken() && getCurrentUser());
