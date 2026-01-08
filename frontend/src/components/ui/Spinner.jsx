import React from 'react';

export default function Spinner({ label }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-600">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
