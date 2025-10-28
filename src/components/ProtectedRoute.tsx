import { Navigate } from "react-router-dom";
import { isLoggedIn } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
