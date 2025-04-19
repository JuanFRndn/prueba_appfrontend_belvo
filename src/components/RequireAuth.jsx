import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirige al login, guardando la ubicación desde donde vinieron
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
