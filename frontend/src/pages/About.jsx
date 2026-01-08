import React from 'react';
import Card from '../components/ui/Card';
import { useI18n } from '../context/I18nContext';

export default function About() {
  const { t } = useI18n();
  const cards = t('about.cards');
  return (
    <div className="py-10 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('about.badge')}</p>
        <h1 className="text-3xl font-bold text-slate-900">{t('about.title')}</h1>
        <p className="text-sm text-slate-600 max-w-3xl">{t('about.intro')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((item) => (
          <Card key={item.title} className="p-5 space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
