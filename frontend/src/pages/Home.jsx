import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ContainerGrid from '../components/domain/ContainerGrid';
import FiltersBar from '../components/domain/FiltersBar';
import { useKontainer } from '../context/KontainerContext';
import { useI18n } from '../context/I18nContext';

export default function Home() {
  const { filteredContainers, filters, setFilter, resetFilters, loading, containers } =
    useKontainer();
  const { t } = useI18n();
  const highlights = filteredContainers.slice(0, 6);

  const locations = Array.from(new Set(containers.map((c) => c.location))).filter(Boolean);
  const sizes = Array.from(new Set(containers.map((c) => c.sizeM2))).filter(Boolean);

  return (
    <div className="space-y-12 py-10">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('home.badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-900">
            {t('home.title')}
          </h1>
          <p className="text-lg text-slate-600">{t('home.subtitle')}</p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/containers" variant="primary" size="lg">
              {t('home.ctaPrimary')}
            </Button>
            <Button as={Link} to="/contato" variant="ghost" size="lg">
              {t('home.ctaSecondary')}
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 card-shadow space-y-4">
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
            {t('home.plansTitle')}
          </p>
          <div className="grid gap-3">
            {t('home.steps').map((step, idx) => (
              <div key={step} className="flex gap-3 items-start">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                  {idx + 1}
                </span>
                <p className="text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('home.plansTitle')}</p>
            <h2 className="text-2xl font-semibold text-slate-900">{t('home.plansTitle')}</h2>
          </div>
          <Button as={Link} to="/containers" variant="ghost" size="sm">
            {t('nav.cta')}
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-semibold text-slate-900">{t('home.plans.basicTitle')}</h3>
            <p className="text-sm text-slate-600">{t('home.plans.basicDesc')}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {t('home.plans.features').map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-semibold text-slate-900">{t('home.plans.premiumTitle')}</h3>
            <p className="text-sm text-slate-600">{t('home.plans.premiumDesc')}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {t('home.plans.premiumFeatures').map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('home.highlightsBadge')}</p>
            <h2 className="text-2xl font-semibold text-slate-900">{t('home.highlightsTitle')}</h2>
          </div>
          <Button as={Link} to="/containers" size="sm" variant="primary">
            {t('nav.cta')}
          </Button>
        </div>
        <FiltersBar filters={filters} onChange={setFilter} />
        <ContainerGrid containers={highlights} loading={loading} />
      </section>
    </div>
  );
}
