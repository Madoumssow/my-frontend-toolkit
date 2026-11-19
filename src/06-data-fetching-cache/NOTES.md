# Module 06 : Cache Serveur & Mutations (`query.client.ts`)

## Dépendances requises
- `@tanstack/react-query`

## Comment l'adapter en entreprise
1. Copiez `query.client.ts` dans `src/api/query.client.ts`.
2. Initialisez `const queryClient = createAppQueryClient();` et enveloppez votre application dans `<QueryClientProvider client={queryClient}>`.
3. Centralisez vos clés de cache (`queryKey`) sous forme de constantes typées pour éviter les fautes de frappe lors de l'invalidation (`invalidateQueries`).

## Pièges à éviter
- **Ne dupliquez pas les données API dans Redux/Zustand** : Laissez TanStack Query gérer le cache serveur (chargement, erreurs, rafraîchissement) et réservez les stores globaux uniquement à l'état purement UI (thème, modales ouvertes).
