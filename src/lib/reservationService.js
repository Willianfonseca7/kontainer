import { api } from "./api";

// Minimaler Service für Reservierungen/Angebote.
export const reservationService = {
  async create(payload) {
    const res = await api.post("/reservation-requests", {
      data: payload,
    });
    return res.data;
  },
};
