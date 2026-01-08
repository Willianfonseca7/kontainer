import React from 'react';

const variantClasses = {
  neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200',
  info: 'bg-sky-50 text-sky-700 border border-sky-200',
};

export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
