import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getContainers } from '../services/api';
import { useApi } from '../hooks/useApi';

const KontainerContext = createContext(null);

export const defaultFilters = {
  location: 'all',
  size: 'all',
};

export function normalizeText(str) {
  return (str || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function applyFilters(containers, filters) {
  return containers.filter((item) => {
    if (filters.location !== 'all') {
      const city = item.city || item.location;
      if (normalizeText(city) !== normalizeText(filters.location)) return false;
    }
    if (filters.size !== 'all') {
      const size = item.size || item.sizeM2;
      if (normalizeText(size) !== normalizeText(filters.size)) return false;
    }
    return true;
  });
}

export function KontainerProvider({ children }) {
  const [containers, setContainers] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { execute, loading, error, data } = useApi(getContainers);

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (data) setContainers(data);
  }, [data]);

  const filteredContainers = useMemo(
    () => applyFilters(containers, filters),
    [containers, filters],
  );

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const value = {
    containers,
    filteredContainers,
    filters,
    loading,
    error,
    setFilter,
    resetFilters,
    reload: execute,
  };

  return <KontainerContext.Provider value={value}>{children}</KontainerContext.Provider>;
}

export function useKontainer() {
  const ctx = useContext(KontainerContext);
  if (!ctx) throw new Error('useKontainer must be used inside KontainerProvider');
  return ctx;
}
