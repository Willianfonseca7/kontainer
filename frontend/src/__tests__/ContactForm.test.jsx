import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../components/domain/ContactForm';
import { sendContactMessage } from '../services/api';
import { I18nProvider } from '../context/I18nContext';

vi.mock('../services/api', () => ({
  sendContactMessage: vi.fn(),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    sendContactMessage.mockResolvedValue({ ok: true });
  });

  it('mostra mensagens de validação', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider defaultLang="de">
        <ContactForm />
      </I18nProvider>,
    );
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /nachricht senden/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/bitte namen angeben/i)).toBeInTheDocument();
      expect(screen.getByText(/bitte e-mail angeben/i)).toBeInTheDocument();
      expect(screen.getByText(/mindestens 10/i)).toBeInTheDocument();
    });
  });

  it('envia com dados válidos', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider defaultLang="de">
        <ContactForm />
      </I18nProvider>,
    );
    await user.type(screen.getByLabelText(/name/i), 'Maria');
    await user.type(screen.getByLabelText(/e-mail/i), 'maria@test.com');
    await user.type(screen.getByLabelText(/nachricht/i), 'Gültige Testnachricht');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /nachricht senden/i }));
    });
    await waitFor(() => expect(sendContactMessage).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText(/nachricht erfolgreich gesendet/i)).toBeInTheDocument(),
    );
  });
});
