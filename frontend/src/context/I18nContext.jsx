import React, { createContext, useContext, useMemo, useState } from 'react';
import translations from '../i18n/translations';

// Achtung: einfache I18n-Implementierung mit Fallback auf Englisch.

const I18nContext = createContext(null);

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function applyParams(value, params = {}) {
  if (typeof value !== 'string') return value;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v),
    value,
  );
}

export function I18nProvider({ children, defaultLang = 'de' }) {
  const [lang, setLang] = useState(defaultLang);

  const t = useMemo(() => {
    return (key, params = {}) => {
      const current = getNested(translations[lang] || {}, key);
      if (current !== undefined) return applyParams(current, params);
      const fallback = getNested(translations.en, key);
      return applyParams(fallback !== undefined ? fallback : key, params);
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
