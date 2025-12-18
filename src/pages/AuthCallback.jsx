import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, consumeRedirectPath } = useAuth();

  useEffect(() => {
    const jwt = params.get("jwt");
    const rawUser = params.get("user");
    if (jwt && rawUser) {
      try {
        const user = JSON.parse(rawUser);
        localStorage.setItem("auth_jwt", jwt);
        localStorage.setItem("auth_user", JSON.stringify(user));
        navigate(consumeRedirectPath() || "/", { replace: true });
        return;
      } catch (err) {
        // fallback para login em caso de erro
      }
    }
    navigate("/login", { replace: true });
  }, [params, navigate, consumeRedirectPath, isAuthenticated]);

  return null;
}
