import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowRoles }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login/user" replace state={{ from: location.pathname }} />;
  }

  if (allowRoles?.length) {
    const user = getCurrentUser();
    if (!user || !allowRoles.includes(user.role)) {
      if (user?.role === "admin") {
        return <Navigate to="/admin/users" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
