import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Crash de rendu critique');
  }
  return <div>Contenu affiché normalement</div>;
};

describe('03-error-boundary : Capture des erreurs UI & Reprise', () => {
  it('doit afficher les enfants normalement lorsqu’aucune erreur ne survient', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Contenu affiché normalement')).toBeInTheDocument();
  });

  it('doit capturer une erreur de rendu, afficher le fallback et notifier onError', () => {
    // Masque le log d'erreur natif de React dans la console pendant le test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Crash de rendu critique')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('doit réinitialiser l’état d’erreur au clic sur "Réessayer"', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const Wrapper = () => {
      const [broken, setBroken] = useState(true);
      return (
        <div>
          <button type="button" onClick={() => setBroken(false)}>
            Corriger le bug
          </button>
          <ErrorBoundary>
            <BuggyComponent shouldThrow={broken} />
          </ErrorBoundary>
        </div>
      );
    };

    render(<Wrapper />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // On corrige la cause du bug puis on clique sur "Réessayer"
    fireEvent.click(screen.getByText('Corriger le bug'));
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }));

    expect(screen.getByText('Contenu affiché normalement')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
