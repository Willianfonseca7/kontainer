import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Auth mock simples para MVP (somente email, sem backend).
const AuthContext = createContext(null);
const TOKEN_KEY = 'kontainer_token';
const USER_KEY = 'kontainer_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse stored auth data', err);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const login = async (email) => {
    setLoading(true);
    try {
      const fakeToken = `token-${Date.now()}`;
      const fakeUser = { email };
      setToken(fakeToken);
      setUser(fakeUser);
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
      // eslint-disable-next-line no-console
      console.log('Auth user:', fakeUser);
      return fakeUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    // Para o mock, reusa login
    return login(email, password, name);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
