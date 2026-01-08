import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import LanguageSwitcher from '../domain/LanguageSwitcher';
import { useI18n } from '../../context/I18nContext';

export default function Navbar() {
  const { t } = useI18n();
  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/containers', label: t('nav.containers') },
    { to: '/sobre', label: t('nav.about') },
    { to: '/contato', label: t('nav.contact') },
  ];

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-20 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          Kontainer
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button as={Link} to="/containers" variant="primary" size="sm">
            {t('nav.cta')}
          </Button>
        </div>
      </div>
    </header>
  );
}
