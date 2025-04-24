import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/" }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;