import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, setRedirectPath } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    setRedirectPath(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  return children;
}
