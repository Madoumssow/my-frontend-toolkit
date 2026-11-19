import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterFormExample } from './ValidatedForm.example';

describe('05-forms-zod-validation : Formulaires React Hook Form + Zod', () => {
  it('doit bloquer la soumission et afficher les erreurs Zod si les champs sont invalides', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<RegisterFormExample onSubmitData={onSubmit} />);

    await user.type(screen.getByLabelText('Nom complet'), 'A');
    await user.type(screen.getByLabelText('Adresse e-mail'), 'email-invalide');
    await user.type(screen.getByLabelText('Mot de passe'), '123');
    await user.click(screen.getByRole('button', { name: 'Créer un compte' }));

    expect(
      await screen.findByText('Le nom doit contenir au moins 2 caractères')
    ).toBeInTheDocument();
    expect(screen.getByText('Adresse e-mail invalide')).toBeInTheDocument();
    expect(
      screen.getByText('Le mot de passe doit contenir au moins 8 caractères')
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('doit soumettre les données typées lorsque tous les champs sont valides', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<RegisterFormExample onSubmitData={onSubmit} />);

    await user.type(screen.getByLabelText('Nom complet'), 'Thierno Sow');
    await user.type(screen.getByLabelText('Adresse e-mail'), 'thierno@entreprise.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'SuperSecret123!');
    await user.click(screen.getByRole('button', { name: 'Créer un compte' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          fullName: 'Thierno Sow',
          email: 'thierno@entreprise.com',
          password: 'SuperSecret123!',
        },
        expect.anything()
      );
    });
  });
});
