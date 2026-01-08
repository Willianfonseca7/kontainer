import React from 'react';
import Card from '../ui/Card';
import PlanBadge from './PlanBadge';
import Button from '../ui/Button';
import { useI18n } from '../../context/I18nContext';

const sizeMeta = {
  S: { label: '≈ 7,5 m² · 10 ft' },
  M: { label: '≈ 14,8 m² · 20 ft' },
  L: { label: '≈ 29,8 m² · 40 ft' },
};

export default function ContainerCard({ container }) {
  const { t } = useI18n();
  const { size, city, priceMonthly, hasCamera, plan, status, code } = container;
  const meta = sizeMeta[size] || {};
  const isAvailable = status === 'available' || status === 'available';

  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">#{code || container.id}</p>
          <h3 className="text-lg font-semibold text-slate-900">Container {meta.label || size}</h3>
          <p className="text-sm text-slate-500">{city}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PlanBadge plan={plan} />
          {hasCamera ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" /> {t('cards.camera')}
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">{t('cards.pinOnly')}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-slate-900">
          {t('cards.price', { value: priceMonthly })}
        </div>
        <Button size="sm" variant={isAvailable ? 'primary' : 'ghost'} disabled={!isAvailable}>
          {isAvailable ? t('cards.available') : t('cards.unavailable')}
        </Button>
      </div>
    </Card>
  );
}
