import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ redirectPath = "/login", children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  console.log(isAuthenticated, token);
  if (!isAuthenticated && !token) {
    console.log("Redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
