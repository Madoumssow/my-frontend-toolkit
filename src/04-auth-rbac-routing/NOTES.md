# Module 04 : Authentification & Routage RBAC (`AuthContext.tsx` / `ProtectedRoute.tsx`)

## Dépendances requises
- `react-router-dom`

## Comment l'adapter en entreprise
1. Copiez `AuthContext.tsx` et `ProtectedRoute.tsx` dans `src/auth/`.
2. Enveloppez votre application avec `<AuthProvider>` dans `App.tsx`.
3. Protégez vos routes dans votre routeur :
   ```tsx
   <Route
     path="/settings"
     element={
       <ProtectedRoute allowedRoles={['admin', 'manager']}>
         <SettingsPage />
       </ProtectedRoute>
     }
   />
   ```

## Pièges à éviter
- **Sécurité côté serveur obligatoire** : `ProtectedRoute` améliore l'expérience utilisateur (UX), mais ne remplace jamais la vérification du JWT et du rôle côté backend (voir Module 05 de `my-backend-toolkit`).
