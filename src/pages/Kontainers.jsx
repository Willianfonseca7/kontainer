import { useEffect, useState } from "react";
import { api } from "../lib/api";
import KontainerCards from "../components/KontainerCards";

const Kontainers = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContainers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/containers", {
        params: {
          "pagination[pageSize]": 100,
          "pagination[page]": 1,
        },
      });
      setContainers(res.data?.data || []);
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Unbekannter Fehler";
      setError(`Fehler beim Laden (HTTP ${status ?? "?"}): ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <KontainerCards
      containers={containers}
      loading={loading}
      error={error}
      onRetry={fetchContainers}
    />
  );
};

export default Kontainers;
