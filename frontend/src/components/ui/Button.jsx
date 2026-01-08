import React from 'react';
import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900';

const variants = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900',
  ghost:
    'bg-transparent text-slate-900 border border-slate-200 hover:border-slate-400 focus:ring-slate-900',
};

const sizes = {
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};

export default function Button({ as, to, children, variant = 'primary', size = 'md', ...props }) {
  const Component = as || (to ? Link : 'button');
  return (
    <Component className={`${base} ${variants[variant]} ${sizes[size]}`} to={to} {...props}>
      {children}
    </Component>
  );
}
