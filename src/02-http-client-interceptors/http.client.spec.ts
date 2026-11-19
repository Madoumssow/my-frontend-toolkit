import { describe, it, expect, vi } from 'vitest';
import { AxiosAdapter, AxiosHeaders } from 'axios';
import { createHttpClient, AuthTokenStorage } from './http.client';

describe('02-http-client-interceptors : Client HTTP & Silent Refresh JWT', () => {
  const createMockStorage = (initialToken: string | null): AuthTokenStorage => {
    let token = initialToken;
    return {
      getAccessToken: () => token,
      setAccessToken: (newToken) => {
        token = newToken;
      },
      clearTokens: () => {
        token = null;
      },
    };
  };

  it('doit injecter automatiquement le header Authorization Bearer', async () => {
    const storage = createMockStorage('mon_token_valide');
    let capturedAuthHeader: string | undefined;

    const mockAdapter: AxiosAdapter = async (config) => {
      capturedAuthHeader = config.headers?.Authorization as string;
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      };
    };

    const client = createHttpClient({
      baseURL: 'http://localhost:3000',
      tokenStorage: storage,
      refreshTokenFn: vi.fn(),
    });
    client.defaults.adapter = mockAdapter;

    const response = await client.get('/profile');
    expect(response.status).toBe(200);
    expect(capturedAuthHeader).toBe('Bearer mon_token_valide');
  });

  it('doit renouveler le token sur une erreur 401 et rejouer la requête initiale', async () => {
    const storage = createMockStorage('token_expire');
    const refreshTokenFn = vi.fn().mockResolvedValue('nouveau_token_frais');

    const mockAdapter: AxiosAdapter = async (config) => {
      const auth = config.headers?.Authorization;
      if (auth === 'Bearer token_expire') {
        throw {
          isAxiosError: true,
          response: { status: 401, data: { message: 'Token expiré' } },
          config,
        };
      }
      return {
        data: { user: 'Thierno', authUsed: auth },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      };
    };

    const client = createHttpClient({
      baseURL: 'http://localhost:3000',
      tokenStorage: storage,
      refreshTokenFn,
    });
    client.defaults.adapter = mockAdapter;

    const response = await client.get('/orders');
    expect(refreshTokenFn).toHaveBeenCalledTimes(1);
    expect(storage.getAccessToken()).toBe('nouveau_token_frais');
    expect(response.data).toEqual({
      user: 'Thierno',
      authUsed: 'Bearer nouveau_token_frais',
    });
  });

  it('doit nettoyer les tokens et appeler onAuthFailure si le refresh échoue', async () => {
    const storage = createMockStorage('token_expire');
    const refreshTokenFn = vi.fn().mockRejectedValue(new Error('Refresh expiré'));
    const onAuthFailure = vi.fn();

    const mockAdapter: AxiosAdapter = async (config) => {
      throw {
        isAxiosError: true,
        response: { status: 401 },
        config,
      };
    };

    const client = createHttpClient({
      baseURL: 'http://localhost:3000',
      tokenStorage: storage,
      refreshTokenFn,
      onAuthFailure,
    });
    client.defaults.adapter = mockAdapter;

    await expect(client.get('/secret')).rejects.toThrow('Refresh expiré');
    expect(storage.getAccessToken()).toBeNull();
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
  });
});
