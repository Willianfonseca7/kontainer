import React from 'react';

export default function Select({ label, error, className = '', children, ...props }) {
  const id = props.id || props.name;
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700" htmlFor={id}>
      {label}
      <select
        id={id}
        className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
