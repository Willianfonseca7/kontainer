import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Kleiner Convenience-Hook, damit nur noch useAuth importiert wird.
export const useAuth = () => {
  return useContext(AuthContext);
};
