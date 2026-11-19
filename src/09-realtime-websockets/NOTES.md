# Module 09 : WebSockets Temps Réel & Reconnexion (`useWebSocket.ts`)

## Dépendances requises
- Aucune dépendance externe (API native `WebSocket` du navigateur).

## Comment l'adapter en entreprise
1. Copiez `useWebSocket.ts` dans `src/hooks/useWebSocket.ts`.
2. Passez `url: null` tant que l'utilisateur n'est pas authentifié afin de différer l'ouverture de la connexion :
   ```ts
   const { status, sendJsonMessage } = useWebSocket({
     url: isAuthenticated ? `${env.VITE_WS_URL}?token=${accessToken}` : null,
     onMessage: (event) => { ... },
   });
   ```

## Pièges à éviter
- **Nettoyage au démontage (`useEffect` cleanup)** : Notre hook ferme proprement le socket et annule les timers de reconnexion lorsque le composant quitte l'écran pour éviter les fuites mémoire.
