import React from 'react';
import ContainerCard from './ContainerCard';
import Skeleton from '../ui/Skeleton';

export default function ContainerGrid({ containers, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-40" />
        ))}
      </div>
    );
  }

  if (!containers.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Nenhum container encontrado com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {containers.map((item) => (
        <ContainerCard key={item.id || item.code} container={item} />
      ))}
    </div>
  );
}
