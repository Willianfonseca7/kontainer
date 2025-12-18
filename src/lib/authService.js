import { api } from "./api";

// Liefert Token/User zurück; Persistenz erfolgt im AuthContext.
export const authService = {
  async login({ identifier, password }) {
    const res = await api.post("/auth/local", { identifier, password });
    const { jwt, user } = res.data;
    return { jwt, user };
  },

  async register({ username, email, password }) {
    const res = await api.post("/auth/local/register", {
      username,
      email,
      password,
    });
    const { jwt, user } = res.data;
    return { jwt, user };
  },
};
