import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

const SIZE_META = {
  S: {
    label: "Small",
    volume: "ca. 5–7 m³",
    pricing: { min: 80, max: 100 },
    benefits: ["Kompakt", "Schnell verfügbar", "Für kleinere Lagerungen"],
  },
  M: {
    label: "Medium",
    volume: "ca. 30–33 m³ (20 Fuß)",
    pricing: { min: 160, max: 200 },
    benefits: [
      "Vielseitig",
      "Beliebt für Gewerbe",
      "Gutes Preis-Leistungs-Verhältnis",
    ],
  },
  L: {
    label: "Large",
    volume: "ca. 65–67 m³ (40 Fuß)",
    pricing: { min: 250, max: 300 },
    benefits: [
      "Maximales Volumen",
      "Geeignet für Projekte",
      "Individuelle Ausstattung möglich",
    ],
  },
};

const PROMO_HIGHLIGHTS = [
  "24/7 Livestream & Aufzeichnung",
  "Sofortige Alarmierung bei Ereignissen",
  "Vernetzt mit SmartView-Plattform",
];

const normalizeSize = (raw) => {
  const val = (raw || "").toString().trim().toUpperCase();
  if (["S", "SMALL"].includes(val)) return "S";
  if (["M", "MEDIUM"].includes(val)) return "M";
  if (["L", "LARGE"].includes(val)) return "L";
  return "M";
};

const isAvailable = (status) =>
  (status || "").toString().toLowerCase().includes("available");

const formatPriceRange = (pricing, opts = {}) => {
  const currencySymbol = opts.currencySymbol ?? "€";
  const rate = opts.rate ?? 1;
  const min = Math.round(pricing.min * rate);
  const max = Math.round(pricing.max * rate);
  return `${currencySymbol}${min}–${currencySymbol}${max} / Monat`;
};

const KontainerCards = ({ containers, loading, error, onRetry }) => {
  const [cityFilter, setCityFilter] = useState("all");

  const cityOptions = useMemo(() => {
    const set = new Set();
    containers.forEach((item) => {
      const city = (item?.attributes || item || {}).city;
      if (city) set.add(city);
    });
    return ["all", ...Array.from(set)];
  }, [containers]);

  const filtered = useMemo(() => {
    if (cityFilter === "all") return containers;
    return containers.filter(
      (item) => (item?.attributes || item || {}).city === cityFilter
    );
  }, [containers, cityFilter]);

  const grouped = useMemo(() => {
    const acc = {
      S: { total: 0, available: 0, camera: 0 },
      M: { total: 0, available: 0, camera: 0 },
      L: { total: 0, available: 0, camera: 0 },
    };
    filtered.forEach((item) => {
      const attrs = item?.attributes || item || {};
      const size = normalizeSize(attrs.size);
      if (!acc[size]) return;
      acc[size].total += 1;
      if (isAvailable(attrs.availability_status)) acc[size].available += 1;
      if (attrs.has_camera) acc[size].camera += 1;
    });
    return acc;
  }, [filtered]);

  const cameraPromoCount = useMemo(() => {
    const total = filtered.length;
    const withCamera = filtered.filter(
      (c) => (c?.attributes || c || {}).has_camera
    ).length;
    return { total, withCamera };
  }, [filtered]);

  const renderSizeCard = (sizeKey) => {
    const meta = SIZE_META[sizeKey];
    const stats = grouped[sizeKey] || { total: 0, available: 0, camera: 0 };
    return (
      <Grid item xs={12} md={4} key={sizeKey}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
          <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{meta.label}</Typography>
              <Chip label={`${stats.available}/${stats.total || 0} verfügbar`} color="success" variant="soft" />
            </Box>
            <Typography variant="body1" color="text.secondary">
              Volumen: {meta.volume}
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {formatPriceRange(meta.pricing)}
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {meta.benefits.map((b) => (
                <Typography key={b} variant="body2" color="text.secondary">
                  • {b}
                </Typography>
              ))}
            </Stack>
            <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
              <Button variant="contained" fullWidth>
                Reservieren
              </Button>
              <Button variant="outlined" fullWidth>
                Angebot anfragen
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, textAlign: { xs: "left", md: "center" } }}>
        <Typography variant="h4" gutterBottom>
          Wählen Sie Ihren Container
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Flexible Größen, sofort verfügbar, optional mit 24/7 Kamerasicherheit.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="city-filter-label">Stadt</InputLabel>
          <Select
            labelId="city-filter-label"
            label="Stadt"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {cityOptions.map((city) => (
              <MenuItem key={city} value={city}>
                {city === "all" ? "Alle Städte" : city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid item xs={12} md={3} key={idx}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {["S", "M", "L"].map(renderSizeCard)}
            <Grid item xs={12} md={3}>
              <Card
                sx={{
                  height: "100%",
                  background: "linear-gradient(135deg, #0f172a, #1e293b)",
                  color: "#fff",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    height: "100%",
                  }}
                >
                  <Chip
                    label="24/7 Sicherheit"
                    color="secondary"
                    variant="filled"
                    sx={{ alignSelf: "flex-start", color: "#0f172a", fontWeight: 600 }}
                  />
                  <Typography variant="h6">Containers mit Kamera 24/7</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    Live-Überwachung, Alarmierung und volle Transparenz – ideal für wertvolle Waren.
                  </Typography>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    {PROMO_HIGHLIGHTS.map((p) => (
                      <Typography key={p} variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        • {p}
                      </Typography>
                    ))}
                  </Stack>
                  <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
                    <Button variant="contained" color="secondary" fullWidth>
                      Jetzt anfragen
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
                      fullWidth
                    >
                      Demo ansehen
                    </Button>
                  </Box>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                    {cameraPromoCount.withCamera}/{cameraPromoCount.total || 0} Container mit Kamera verfügbar
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Warum Kontainer von uns?
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1">Sofort einsatzbereit</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Schnelle Bereitstellung für Bau, Logistik oder temporäre Lagerflächen.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1">Flexibel & sicher</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Größen S/M/L, optionale 24/7 Kameraüberwachung und individuelle Ausstattung.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1">Persönliche Beratung</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wir finden die beste Lösung für Ihren Bedarf – transparent und schnell.
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button variant="contained" size="large">
                  Jetzt reservieren
                </Button>
                <Button variant="outlined" size="large">
                  Beratung anfragen
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default KontainerCards;
