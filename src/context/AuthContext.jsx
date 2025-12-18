import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { authService } from "../lib/authService";

export const AuthContext = createContext(null);

const LS_KEYS = {
  jwt: "auth_jwt",
  user: "auth_user",
  redirect: "auth_redirect",
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lade Session aus localStorage beim Start.
  useEffect(() => {
    const storedJwt = localStorage.getItem(LS_KEYS.jwt);
    const storedUser = localStorage.getItem(LS_KEYS.user);
    if (storedJwt && storedUser) {
      setJwt(storedJwt);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common.Authorization = `Bearer ${storedJwt}`;
    }
    setLoading(false);
  }, []);

  // Aktualisiere axios Header bei Token-Änderung.
  useEffect(() => {
    if (jwt) {
      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [jwt]);

  const persistSession = (nextJwt, nextUser) => {
    setJwt(nextJwt);
    setUser(nextUser);
    localStorage.setItem(LS_KEYS.jwt, nextJwt);
    localStorage.setItem(LS_KEYS.user, JSON.stringify(nextUser));
  };

  const clearSession = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem(LS_KEYS.jwt);
    localStorage.removeItem(LS_KEYS.user);
  };

  const login = async ({ identifier, password }) => {
    const { jwt: token, user: profile } = await authService.login({ identifier, password });
    persistSession(token, profile);
    return profile;
  };

  const register = async ({ username, email, password }) => {
    const { jwt: token, user: profile } = await authService.register({ username, email, password });
    persistSession(token, profile);
    return profile;
  };

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  const setRedirectPath = (path) => {
    if (path) localStorage.setItem(LS_KEYS.redirect, path);
  };

  const consumeRedirectPath = () => {
    const path = localStorage.getItem(LS_KEYS.redirect);
    if (path) localStorage.removeItem(LS_KEYS.redirect);
    return path;
  };

  const updateProfile = async (payload) => {
    // Strapi Users-Permissions unterstützt username/email out of the box.
    const res = await api.put("/users/me", payload);
    const updated = res.data;
    persistSession(jwt, updated);
    return updated;
  };

  const value = useMemo(
    () => ({
      user,
      jwt,
      isAuthenticated: Boolean(jwt && user),
      loading,
      login,
      register,
      logout,
      updateProfile,
      setRedirectPath,
      consumeRedirectPath,
    }),
    [user, jwt, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
