import { useMemo, useState } from "react";

// Kapselt Filterung, Gruppierung und Modal-State für Reservierungen/Angebote.
export const useReservation = (containers) => {
  const [cityFilter, setCityFilter] = useState("all");
  const [selectedSize, setSelectedSize] = useState("M");
  const [reserveOpen, setReserveOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  const cityOptions = useMemo(() => {
    const set = new Set();
    containers.forEach((item) => {
      const city = (item?.attributes || item || {}).city;
      if (city) set.add(city);
    });
    return ["all", ...Array.from(set)];
  }, [containers]);

  const normalizeSize = (raw) => {
    const val = (raw || "").toString().trim().toUpperCase();
    if (["S", "SMALL"].includes(val)) return "S";
    if (["M", "MEDIUM"].includes(val)) return "M";
    if (["L", "LARGE"].includes(val)) return "L";
    return "M";
  };

  const isAvailable = (status) =>
    (status || "").toString().toLowerCase().includes("available");

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

  const openReservation = (size) => {
    setSelectedSize(size);
    setReserveOpen(true);
  };

  const openOffer = (size) => {
    setSelectedSize(size);
    setOfferOpen(true);
  };

  return {
    cityFilter,
    setCityFilter,
    cityOptions,
    grouped,
    cameraPromoCount,
    filtered,
    selectedSize,
    reserveOpen,
    setReserveOpen,
    offerOpen,
    setOfferOpen,
    openReservation,
    openOffer,
  };
};
