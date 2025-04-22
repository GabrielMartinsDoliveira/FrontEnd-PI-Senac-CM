import { Outlet, useNavigate } from "react-router-dom";
import { goToLogin } from "../../router/Coordinator";

const ProtectedRoute = ({ redirectPath = "/", children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  if (!token) {
    goToLogin(navigate)
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
