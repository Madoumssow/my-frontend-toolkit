import { QueryClient } from '@tanstack/react-query';

export function createAppQueryClient(isTest = false): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Données considérées fraîches pendant 1 minute
        gcTime: 5 * 60 * 1000, // Conservées en mémoire 5 minutes après démontage
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          if (isTest) return false;
          const status = error?.response?.status;
          // Inutile de réessayer sur les erreurs client (401, 403, 404)
          if (status && [401, 403, 404].includes(status)) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
