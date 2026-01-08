import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { createReservationRequest, getContainers } from '../services/api';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const initialForm = {
  customer_name: '',
  email: '',
  phone: '',
  start_date: '',
  end_date: '',
  notes: '',
};

export default function ContainerDetail() {
  const { id } = useParams();
  const location = useLocation();
  const stateContainer = location.state?.container;
  const [container, setContainer] = useState(stateContainer || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [submitState, setSubmitState] = useState({ loading: false, success: '', error: '' });

  useEffect(() => {
    let mounted = true;
    // Se já veio via state, não refazer fetch desnecessário
    if (stateContainer && (String(stateContainer.id) === String(id) || String(stateContainer.code) === String(id))) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    setError('');
    getContainers()
      .then((list) => {
        const found = (list || []).find(
          (item) => String(item.id) === String(id) || String(item.code) === String(id),
        );
        if (mounted) setContainer(found || null);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'Fehler beim Laden');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id, stateContainer]);

  const isAvailable =
    (container?.availabilityStatus || container?.status || 'available') === 'available';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!form.customer_name.trim()) errors.customer_name = 'Name ist erforderlich.';
    if (!form.email.trim()) errors.email = 'E-Mail ist erforderlich.';
    if (!form.start_date) errors.start_date = 'Startdatum ist erforderlich.';
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      errors.end_date = 'Enddatum muss >= Startdatum sein.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setSubmitState({ loading: false, success: '', error: Object.values(errors).join(' ') });
      return;
    }

    // TODO auth: se não autenticado, redirecionar para /login?redirect=/containers/:id
    // TODO auth: validar se usuário já tem pedido ativo antes de enviar

    setSubmitState({ loading: true, success: '', error: '' });

    const payload = {
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone || undefined,
      start_date: form.start_date,
      end_date: form.end_date || undefined,
      notes: form.notes || undefined,
      city: container?.city,
      size: container?.size,
      wants_camera: container?.hasCamera ?? container?.has_camera ?? false,
      status: 'new',
    };

    try {
      await createReservationRequest(payload);
      setSubmitState({ loading: false, success: 'Reservierung gesendet!', error: '' });
      setForm(initialForm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitState({
        loading: false,
        success: '',
        error: err?.message || 'Senden fehlgeschlagen.',
      });
    }
  };

  if (loading) {
    return (
      <div className="py-10">
        <p className="text-slate-500">Laden...</p>
      </div>
    );
  }

  if (error || !container) {
    return (
      <div className="py-10">
        <p className="text-rose-600">Fehler: {error || 'Container nicht gefunden.'}</p>
      </div>
    );
  }

  const priceValue =
    container.price ?? container.priceMonthly ?? container.price_monthly ?? container.price;
  const priceText =
    typeof priceValue === 'number' && priceValue > 0
      ? `€ ${priceValue} / Monat`
      : 'Preis auf Anfrage';

  return (
    <div className="py-10 space-y-6">
      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Container</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              #{container.code || container.id}
            </h1>
            <p className="text-sm text-slate-600">
              {container.city} • Size {container.size}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {container.hasCamera ? (
              <Badge variant="success">Kamera 24/7</Badge>
            ) : (
              <Badge variant="neutral">PIN</Badge>
            )}
            <Badge
              variant={isAvailable ? 'success' : 'neutral'}
            >{`Status: ${container.availabilityStatus || container.status}`}</Badge>
          </div>
        </div>
        <p className="text-xl font-bold text-slate-900">{priceText}</p>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reservierung</p>
          <h2 className="text-xl font-semibold text-slate-900">Anfrage senden</h2>
          <p className="text-sm text-slate-600">
            Bitte füllen Sie die Pflichtfelder aus. Wir bestätigen per E-Mail.
          </p>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            label="Name*"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />
          <Input
            label="E-Mail*"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            label="Startdatum*"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
          <Input
            label="Enddatum"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Notizen"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={!isAvailable || submitState.loading}>
              {isAvailable ? (submitState.loading ? 'Senden...' : 'Reservierung senden') : 'Nicht verfügbar'}
            </Button>
            {submitState.success ? (
              <span className="text-sm text-emerald-700">{submitState.success}</span>
            ) : null}
            {submitState.error ? (
              <span className="text-sm text-rose-600">{submitState.error}</span>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  );
}
