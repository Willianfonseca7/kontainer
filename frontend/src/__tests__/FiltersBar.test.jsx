import { describe, expect, it } from 'vitest';
import { applyFilters, defaultFilters } from '../context/KontainerContext';

const sample = [
  { id: 1, location: 'Düsseldorf', sizeM2: 'S', plan: 'basic', status: 'available' },
  { id: 2, location: 'Düsseldorf', sizeM2: 'M', plan: 'premium', status: 'reserved' },
  { id: 3, location: 'Köln', sizeM2: 'L', plan: 'premium', status: 'available' },
];

describe('applyFilters', () => {
  it('retorna todos quando filtros estão em "all"', () => {
    const result = applyFilters(sample, defaultFilters);
    expect(result).toHaveLength(3);
  });

  it('filtra apenas por localização', () => {
    const result = applyFilters(sample, {
      ...defaultFilters,
      location: 'Düsseldorf',
    });
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toEqual([1, 2]);
  });
});
