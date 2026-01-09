import React from 'react';
import { useI18n } from '../../context/I18nContext';

// Kommentar: einfacher Sprachumschalter (DE/EN/PT) ohne Persistenz.

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLang('de')}
        className={`px-2 py-1 rounded-full border ${lang === 'de' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:border-slate-400'}`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-full border ${lang === 'en' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:border-slate-400'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('pt')}
        className={`px-2 py-1 rounded-full border ${lang === 'pt' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:border-slate-400'}`}
      >
        PT
      </button>
    </div>
  );
}
