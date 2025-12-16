import { useEffect, useState } from "react";
import { api } from "../lib/api";

const Kontainers = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setError("");
        const res = await api.get("/containers?pagination[pageSize]=100");
        setContainers(res.data.data || []);
      } catch (err) {
        console.log("AXIOS ERROR:", err);

        const status = err?.response?.status;
        const msg =
          err?.response?.data?.error?.message ||
          err?.message ||
          "Erro desconhecido";

        setError(`Erro ao carregar containers (HTTP ${status ?? "?"}): ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, []);

  if (loading) return <p>Carregando containers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Containers</h1>

      {containers.length === 0 ? (
        <p>Nenhum container encontrado.</p>
      ) : (
        <ul>
          {containers.map((c) => (
            <li key={c.id}>
              <strong>{c.code}</strong> — {c.availability_status} — camera:{" "}
              {c.has_camera ? "sim" : "não"}{" "}
              {c.has_camera && c.internal_camera_id
                ? `(id: ${c.internal_camera_id})`
                : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Kontainers;
