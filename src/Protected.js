import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuthToken = () => {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined && token;
};

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const token = useAuthToken();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return token ? children : null;
};

const ProtectedAdmin = ({ children }) => {
  const navigate = useNavigate();
  const token = useAuthToken();
  const issuperadmin = localStorage.getItem("issuperuser") === "true";

  useEffect(() => {
    if (!token || !issuperadmin) {
      navigate("/");
    }
  }, [token, issuperadmin, navigate]);

  return token && issuperadmin ? children : null;
};

const UnProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthToken();

  useEffect(() => {
    if (token && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [token, location.pathname, navigate]);

  return token && location.pathname === "/" ? null : children;
};

export { Protected, ProtectedAdmin, UnProtectedRoute };
