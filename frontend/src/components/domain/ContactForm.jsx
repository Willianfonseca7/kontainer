import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { sendContactMessage } from '../../services/api';
import { useI18n } from '../../context/I18nContext';

const initialState = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });
  const { t } = useI18n();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t('contact.validations.name');
    if (!form.email.trim()) newErrors.email = t('contact.validations.email');
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = t('contact.validations.emailInvalid');
    if (!form.message.trim() || form.message.trim().length < 10)
      newErrors.message = t('contact.validations.message');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ loading: true, success: '', error: '' });
    try {
      await sendContactMessage(form);
      setStatus({ loading: false, success: t('contact.success'), error: '' });
      setForm(initialState);
    } catch (err) {
      setStatus({
        loading: false,
        success: '',
        error: err?.message || t('contact.error'),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label={t('contact.name')}
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label={t('contact.email')}
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />
      <Textarea
        label={t('contact.message')}
        name="message"
        rows={4}
        value={form.message}
        onChange={handleChange}
        error={errors.message}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status.loading}>
          {status.loading ? <Spinner label={t('contact.sending')} /> : t('contact.send')}
        </Button>
        {status.success ? <span className="text-sm text-emerald-700">{status.success}</span> : null}
        {status.error ? <span className="text-sm text-rose-600">{status.error}</span> : null}
      </div>
    </form>
  );
}
