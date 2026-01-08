import React from 'react';
import Select from '../ui/Select';
import { useI18n } from '../../context/I18nContext';

const cityOptions = [
  { value: 'all', label: 'filters.all' },
  { value: 'Düsseldorf', label: 'filters.duesseldorf' },
  { value: 'Köln', label: 'filters.koeln' },
];

export default function FiltersBar({ filters, onChange }) {
  const { t } = useI18n();
  return (
    <div className="inline-flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 w-full max-w-sm">
      <Select
        label={t('filters.location')}
        value={filters.location}
        onChange={(e) => onChange('location', e.target.value)}
        name="location"
      >
        {cityOptions.map((city) => (
          <option key={city.value} value={city.value}>
            {t(city.label)}
          </option>
        ))}
      </Select>
    </div>
  );
}
