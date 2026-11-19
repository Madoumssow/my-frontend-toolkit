# Module 01 : Validation de la Configuration Frontend (`env.config.ts`)

## Dépendances requises
- `zod`

## Comment l'adapter en entreprise
1. Copiez `env.config.ts` dans `src/config/env.config.ts`.
2. Importez `env` dans `main.tsx` dès la première ligne pour garantir le comportement *Fail-Fast* avant le rendu React :
   ```ts
   import { env } from './config/env.config';
   ```
3. Utilisez ensuite `env.VITE_API_URL` partout dans l'application avec l'autocomplétion TypeScript complète.

## Pièges à éviter
- **Préfixe `VITE_` obligatoire** : Par sécurité, Vite n'expose au navigateur que les variables commençant par `VITE_`. Ne placez jamais de clé secrète privée (ex: clé secrète Stripe ou JWT) dans un `.env` frontend.
