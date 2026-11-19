# Module 10 : Déploiement Production Docker & Nginx SPA

## Dépendances requises
- Docker Engine

## Comment l'adapter en entreprise
1. Construire l'image Docker en injectant l'URL de l'API de production :
   ```bash
   docker build -f src/10-docker-nginx-deploy/Dockerfile --build-arg VITE_API_URL=https://entreprise.com -t mon-app-frontend:latest .
   ```
2. Lancer le conteneur :
   ```bash
   docker run -d -p 8080:80 mon-app-frontend:latest
   ```

## Pièges à éviter
- **Variables `VITE_*` au moment du `docker build`** : Contrairement au backend Node.js qui lit `.env` au démarrage (`docker run`), Vite grave les variables `VITE_*` directement dans le JavaScript compilé pendant `npm run build`. Elles doivent donc être passées via `--build-arg`.
