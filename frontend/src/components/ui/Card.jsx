import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl card-shadow ${className}`}
    >
      {children}
    </div>
  );
}
