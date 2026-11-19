# Module 02 : Client HTTP & Intercepteurs JWT (`http.client.ts`)

## Dépendances requises
- `axios`

## Comment l'adapter en entreprise
1. Copiez `http.client.ts` dans `src/api/http.client.ts`.
2. Instanciez votre client unique avec la configuration validée (`env.VITE_API_URL`) :
   ```ts
   export const apiClient = createHttpClient({
     baseURL: env.VITE_API_URL,
     tokenStorage: {
       getAccessToken: () => localStorage.getItem('access_token'),
       setAccessToken: (t) => localStorage.setItem('access_token', t),
       clearTokens: () => localStorage.removeItem('access_token'),
     },
     refreshTokenFn: async () => {
       const { data } = await axios.post(`${env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });
       return data.accessToken;
     },
     onAuthFailure: () => {
       window.location.href = '/login';
     },
   });
   ```

## Pièges à éviter
- **Ne jamais utiliser `apiClient` pour appeler `/auth/refresh`** : Utilisez une instance `axios` brute pour la route de refresh, sinon un 401 sur le refresh déclencherait une boucle infinie.
