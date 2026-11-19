# Module 05 : Formulaires Typés React Hook Form + Zod (`FormField.tsx`)

## Dépendances requises
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

## Comment l'adapter en entreprise
1. Copiez `FormField.tsx` dans `src/components/forms/FormField.tsx`.
2. Définissez votre schéma Zod (partageable avec votre backend !) et reliez-le via `zodResolver(schema)`.
3. Passez `register('nomChamp')` et `errors.nomChamp` à `<FormField />`.

## Pièges à éviter
- **Accessibilité (`aria-invalid` et `role="alert"`)** : Toujours lier le message d'erreur au champ via `aria-describedby` pour que les lecteurs d'écran (et les tests `getByLabelText`) fonctionnent nativement.
