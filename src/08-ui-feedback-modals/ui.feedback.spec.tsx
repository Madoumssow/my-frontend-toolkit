import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Modal } from './Modal';
import { ToastProvider, useToast } from './ToastContext';

describe('08-ui-feedback-modals : Modale Accessible & Notifications Toast', () => {
  it('Modal : doit afficher le titre, le contenu et se fermer sur Escape ou clic arrière-plan', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Confirmer la suppression">
        <p>Voulez-vous vraiment supprimer cet élément ?</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirmer la suppression')).toBeInTheDocument();

    // Fermeture via touche Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    // Fermeture via clic sur le backdrop
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('ToastProvider : doit afficher une notification et la retirer automatiquement après le délai', () => {
    vi.useFakeTimers();

    const TriggerButton = () => {
      const { showToast } = useToast();
      return (
        <button
          type="button"
          onClick={() => showToast('Enregistrement réussi !', 'success', 3000)}
        >
          Sauvegarder
        </button>
      );
    };

    render(
      <ToastProvider>
        <TriggerButton />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }));
    expect(screen.getByText('Enregistrement réussi !')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('Enregistrement réussi !')
    ).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
