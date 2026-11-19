import { describe, it, expect } from 'vitest';
import { validateEnv } from './env.config';

describe('01-env-config : Validation des variables d’environnement Frontend', () => {
  it('doit valider et transformer correctement des variables valides', () => {
    const result = validateEnv({
      VITE_APP_ENV: 'production',
      VITE_API_URL: 'https://entreprise.com',
      VITE_APP_NAME: 'ClientPortal',
      VITE_ENABLE_DEBUG: 'true',
    });

    expect(result).toEqual({
      VITE_APP_ENV: 'production',
      VITE_API_URL: 'https://entreprise.com',
      VITE_APP_NAME: 'ClientPortal',
      VITE_ENABLE_DEBUG: true,
    });
  });

  it('doit appliquer les valeurs par défaut si les variables optionnelles sont absentes', () => {
    const result = validateEnv({
      VITE_API_URL: 'http://localhost:4000',
    });

    expect(result.VITE_APP_ENV).toBe('development');
    expect(result.VITE_APP_NAME).toBe('MyApp');
    expect(result.VITE_ENABLE_DEBUG).toBe(false);
  });

  it('doit lever une erreur explicite si VITE_API_URL est manquante ou invalide', () => {
    expect(() =>
      validateEnv({
        VITE_API_URL: 'pas-une-url-valide',
      })
    ).toThrow(/VITE_API_URL/);
  });
});
