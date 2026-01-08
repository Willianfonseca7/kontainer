import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-500">
        <div>
          <span className="font-semibold text-slate-900">Kontainer</span> — self-storage
          digital.
        </div>
        <div className="flex gap-4">
          <Link to="/containers" className="hover:text-slate-900">
            {t('nav.containers')}
          </Link>
          <Link to="/sobre" className="hover:text-slate-900">
            {t('nav.about')}
          </Link>
          <Link to="/contato" className="hover:text-slate-900">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
