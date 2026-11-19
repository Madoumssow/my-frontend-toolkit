# Module 03 : Error Boundary UI (`ErrorBoundary.tsx`)

## Dépendances requises
- Aucune dépendance externe (React natif).

## Comment l'adapter en entreprise
1. Copiez `ErrorBoundary.tsx` dans `src/components/common/ErrorBoundary.tsx`.
2. Enveloppez votre application dans `main.tsx` et branchez un outil de monitoring (ex: Sentry) via `onError` :
   ```tsx
   <ErrorBoundary onError={(error, info) => Sentry.captureException(error, { extra: info })}>
     <App />
   </ErrorBoundary>
   ```
3. Enveloppez également les widgets critiques (ex: graphiques, panier, paiement) individuellement pour qu'un bug isolé ne bloque pas toute la page.

## Pièges à éviter
- **Ce qu'un `ErrorBoundary` ne capture PAS** : Les erreurs dans les gestionnaires d'événements (`onClick`), les appels `async/await` ou `setTimeout`. Pour ces cas, utilisez `try/catch` + notifications Toast (Module 08).
