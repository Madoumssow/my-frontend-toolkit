import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createAppQueryClient } from './query.client';
import {
  useProducts,
  useCreateProduct,
  ProductItem,
} from './useItemsQuery.example';

describe('06-data-fetching-cache : TanStack Query & Invalidation', () => {
  const createWrapper = () => {
    const queryClient = createAppQueryClient(true);
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('doit charger et mettre en cache la liste des produits', async () => {
    const fetchMock = vi
      .fn<() => Promise<ProductItem[]>>()
      .mockResolvedValue([{ id: '1', name: 'Clavier Mécanique' }]);

    const { result } = renderHook(() => useProducts(fetchMock), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: '1', name: 'Clavier Mécanique' }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('doit invalider et recharger la liste après une mutation réussie', async () => {
    let db: ProductItem[] = [{ id: '1', name: 'Écran 4K' }];

    const fetchMock = vi.fn(async () => [...db]);
    const createMock = vi.fn(async (name: string) => {
      const created = { id: String(db.length + 1), name };
      db.push(created);
      return created;
    });

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => ({
        products: useProducts(fetchMock),
        createProduct: useCreateProduct(createMock),
      }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.products.isSuccess).toBe(true));
    expect(result.current.products.data).toHaveLength(1);

    await act(async () => {
      await result.current.createProduct.mutateAsync('Souris Sans Fil');
    });

    await waitFor(() => expect(result.current.products.data).toHaveLength(2));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
