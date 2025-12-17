import { api } from "./api";

// Speichert Token und User lokal nach erfolgreichem Login/Registrierung.
const persistSession = (jwt, user) => {
  localStorage.setItem("jwt", jwt);
  localStorage.setItem("user", JSON.stringify(user));
};

export const authService = {
  async login({ identifier, password }) {
    const res = await api.post("/auth/local", { identifier, password });
    const { jwt, user } = res.data;
    persistSession(jwt, user);
    return { jwt, user };
  },

  async register({ username, email, password }) {
    const res = await api.post("/auth/local/register", {
      username,
      email,
      password,
    });
    const { jwt, user } = res.data;
    persistSession(jwt, user);
    return { jwt, user };
  },
};
