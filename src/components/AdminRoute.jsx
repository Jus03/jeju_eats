import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

// Route guard: only lets `admin` (and optionally `staff`) reach the child page.
// While the AuthContext is still loading, we render nothing to avoid a flash.
export default function AdminRoute({ children, allowStaff = true }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const allowed = role === "admin" || (allowStaff && role === "staff");
  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
