# Module 08 : Modales Accessibles & Notifications Toast (`Modal.tsx` / `ToastContext.tsx`)

## Dépendances requises
- Aucune dépendance externe (`react` et `react-dom` natifs).

## Comment l'adapter en entreprise
1. Enveloppez votre application avec `<ToastProvider>` dans `App.tsx`.
2. Appelez `const { showToast } = useToast();` dans vos composants ou callbacks `onError` / `onSuccess` de TanStack Query.
3. Remplacez les styles inline par vos classes Tailwind CSS ou CSS Modules selon la charte graphique de l'entreprise.

## Pièges à éviter
- **Portails React (`createPortal`)** : `Modal` est rendue directement dans `document.body` pour éviter d'être coupée par un parent ayant `overflow: hidden` ou un `z-index` inférieur.
