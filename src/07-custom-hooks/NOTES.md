# Module 07 : Hooks Utilitaires (`useDebounce`, `useLocalStorage`, `useClickOutside`)

## Dépendances requises
- Aucune dépendance externe (React natif).

## Comment l'adapter en entreprise
1. Copiez les hooks souhaités dans `src/hooks/`.
2. **`useDebounce`** : À brancher sur les champs de recherche reliés à une API (`const debouncedSearch = useDebounce(searchTerm, 350);`).
3. **`useLocalStorage`** : À utiliser pour sauvegarder les préférences UI (thème sombre, langue, filtres de tableau).
4. **`useClickOutside`** : À utiliser pour fermer automatiquement les menus déroulants, popovers ou modales au clic à l'extérieur.

## Pièges à éviter
- **SSR (Next.js)** : Si vous migrez ces hooks vers Next.js, protégez l'accès à `window.localStorage` avec `typeof window !== 'undefined'`.
