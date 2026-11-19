import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ProductItem {
  id: string;
  name: string;
}

export const PRODUCTS_QUERY_KEY = ['products'] as const;

export function useProducts(fetchProductsFn: () => Promise<ProductItem[]>) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchProductsFn,
  });
}

export function useCreateProduct(
  createProductFn: (name: string) => Promise<ProductItem>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductFn,
    onSuccess: () => {
      // Invalide automatiquement la liste pour déclencher un rafraîchissement propre
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}
