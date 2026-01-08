import React from 'react';
import ContactForm from '../components/domain/ContactForm';
import Card from '../components/ui/Card';
import { useI18n } from '../context/I18nContext';

export default function Contact() {
  const { t } = useI18n();
  return (
    <div className="py-10 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('contact.badge')}</p>
        <h1 className="text-3xl font-bold text-slate-900">{t('contact.title')}</h1>
        <p className="text-sm text-slate-600">{t('contact.subtitle')}</p>
      </div>

      <Card className="p-6">
        <ContactForm />
      </Card>
    </div>
  );
}
