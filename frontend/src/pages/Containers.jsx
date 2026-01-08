import React from 'react';
import Button from '../components/ui/Button';
import FiltersBar from '../components/domain/FiltersBar';
import ContainerGrid from '../components/domain/ContainerGrid';
import { normalizeText, useKontainer } from '../context/KontainerContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const sizeMeta = {
  S: { label: '≈ 7,5 m² · 10 ft', priceRange: '€95 – €130 / mês', base: 110, example6: 99, econ6: 66 },
  M: { label: '≈ 14,8 m² · 20 ft', priceRange: '€140 – €190 / mês', base: 170, example6: 153, econ6: 102 },
  L: { label: '≈ 29,8 m² · 40 ft', priceRange: '€220 – €280 / mês', base: 250, example6: 225, econ6: 150 },
};

const sizeIllustrations = ['S', 'M', 'L'].reduce((acc, size) => {
  const svg = `<svg width="320" height="180" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
  </defs>
  <rect width="320" height="180" rx="18" fill="#e5e7eb"/>
  <rect x="18" y="36" width="284" height="108" rx="12" fill="url(#g)"/>
  <rect x="36" y="54" width="64" height="72" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <rect x="112" y="54" width="64" height="72" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <rect x="188" y="54" width="64" height="72" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <rect x="264" y="54" width="16" height="72" fill="rgba(255,255,255,0.15)"/>
  <text x="160" y="105" font-family="Space Grotesk, sans-serif" font-size="34" font-weight="700" fill="#f8fafc" text-anchor="middle">Size ${size}</text>
  <text x="160" y="132" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">PIN-Zugang • Optionale 24/7-Kamera</text>
</svg>`;
  acc[size] = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return acc;
}, {});

function SizeCard({ size, items, loading }) {
  const imgSrc = sizeIllustrations[size];
  const total = items.length;
  const available = items.filter((i) => i.status === 'available').length;
  const premium = items.filter((i) => i.plan === 'premium').length;
  const basic = items.filter((i) => i.plan === 'basic').length;
  const locations = Array.from(new Set(items.map((i) => i.location))).join(' • ');
  const meta = sizeMeta[size];

  return (
    <Card className="overflow-hidden">
      <div className="h-44 w-full bg-slate-200">
        <img
          src={imgSrc}
          alt={`Container ${size}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Containers</p>
            <h3 className="text-xl font-semibold text-slate-900">
              Container {meta?.label || size}
            </h3>
          </div>
          <Badge variant="neutral">{total} unidades</Badge>
        </div>
        <div className="space-y-1 text-sm text-slate-600">
          <p className="text-slate-900 font-semibold">{meta?.priceRange}</p>
          <p>Locais: {locations || '—'}</p>
          <p>Disponíveis: {available > 0 ? available : '—'}</p>
          <p>Planos: Basic {basic} • Premium {premium}</p>
          <p className="text-xs text-slate-500">PIN; Premium com câmera 24/7.</p>
        </div>
        {!total && !loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
            Nenhum container deste tamanho com os filtros atuais.
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default function Containers() {
  const { filteredContainers, filters, setFilter, resetFilters, loading, error, reload, containers } =
    useKontainer();

  const selectedLocation = filters.location;

  const grouped = ['S', 'M', 'L'].map((size) => {
    const items = filteredContainers.filter((c) => {
      const sizeMatch = normalizeText(c.sizeM2) === normalizeText(size);
      const locationMatch =
        selectedLocation === 'all' ||
        normalizeText(c.location) === normalizeText(selectedLocation) ||
        normalizeText(c.location) === normalizeText(
          selectedLocation === 'Köln' ? 'Koln' : selectedLocation,
        );
      return sizeMatch && locationMatch;
    });

    if (process.env.NODE_ENV !== 'production' && items.length === 0 && containers.length > 0) {
      const uniqueCities = Array.from(new Set(containers.map((c) => normalizeText(c.location))));
      // eslint-disable-next-line no-console
      console.debug(
        '[containers] contagem 0 para tamanho',
        size,
        'loc',
        selectedLocation,
        'cidades API:',
        uniqueCities,
      );
    }

    return { size, items };
  });

  const hasNoData = containers.length === 0;

  return (
    <div className="space-y-6 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Inventário</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Containers por tamanho</h1>
          <Button variant="ghost" size="sm" onClick={reload}>
            Recarregar
          </Button>
        </div>
        <p className="text-sm text-slate-600">
          Visualize S, M e L em cartões dedicados, com disponibilidade, planos e locais.
        </p>
      </header>

      <FiltersBar filters={filters} onChange={setFilter} />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          Falha ao carregar containers. {error.message || ''}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {grouped.map(({ size, items }) => (
          <SizeCard key={size} size={size} items={items} loading={loading} />
        ))}
        {hasNoData ? (
          <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-slate-600">
            0 unidades. Sem unidades cadastradas no momento.
          </div>
        ) : null}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 card-shadow space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Descontos por fidelização</p>
        <h2 className="text-2xl font-semibold text-slate-900">Contratos com vantagem</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-slate-900 text-white border-none">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-200">6 meses</p>
            <h3 className="text-xl font-semibold">-8% a -12%</h3>
            <p className="text-sm text-slate-200">
              Exemplo: base €170 → -10% = €153/mês · economia total €102.
            </p>
          </Card>
          <Card className="p-4 bg-slate-50 border-slate-200">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">12 meses</p>
            <h3 className="text-xl font-semibold text-slate-900">-15% a -20%</h3>
            <p className="text-sm text-slate-600">Ideal para empresas e clientes recorrentes.</p>
          </Card>
        </div>
      </section>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Lista completa</p>
        <ContainerGrid containers={filteredContainers} loading={loading} />
      </div>
    </div>
  );
}
