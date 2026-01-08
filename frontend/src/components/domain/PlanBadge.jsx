import React from 'react';
import Badge from '../ui/Badge';
import { useI18n } from '../../context/I18nContext';

export default function PlanBadge({ plan }) {
  const { t } = useI18n();
  const variant = plan === 'premium' ? 'info' : 'neutral';
  const label = plan === 'premium' ? t('planBadge.premium') : t('planBadge.basic');
  const camera = plan === 'premium' ? t('planBadge.cam') : t('planBadge.pin');

  return (
    <Badge variant={variant}>
      {label} <span className="text-[10px] uppercase tracking-wide">{camera}</span>
    </Badge>
  );
}
