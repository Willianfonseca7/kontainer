import { render, screen } from '@testing-library/react';
import React from 'react';
import ContainerCard from '../components/domain/ContainerCard';
import { I18nProvider } from '../context/I18nContext';

const baseContainer = {
  id: 1,
  code: 'DUS-01',
  sizeM2: 'S',
  location: 'Düsseldorf',
  priceMonthly: 59,
  hasCamera: true,
  plan: 'premium',
  status: 'available',
};

describe('ContainerCard', () => {
  it('habilita ação quando disponível', () => {
    render(
      <I18nProvider defaultLang="de">
        <ContainerCard container={{ ...baseContainer, status: 'available' }} />
      </I18nProvider>,
    );
    expect(screen.getByRole('button', { name: /buchen/i })).toBeEnabled();
  });

  it('desabilita ação quando reservado', () => {
    render(
      <I18nProvider defaultLang="de">
        <ContainerCard container={{ ...baseContainer, status: 'reserved' }} />
      </I18nProvider>,
    );
    expect(screen.getByRole('button', { name: /momentan nicht verfügbar/i })).toBeDisabled();
  });

  it('desabilita ação quando alugado', () => {
    render(
      <I18nProvider defaultLang="de">
        <ContainerCard container={{ ...baseContainer, status: 'rented' }} />
      </I18nProvider>,
    );
    expect(screen.getByRole('button', { name: /momentan nicht verfügbar/i })).toBeDisabled();
  });
});
