import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { barbeiro } = useAuth();

  if (!barbeiro) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
