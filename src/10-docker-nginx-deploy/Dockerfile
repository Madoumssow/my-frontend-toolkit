# --- ÉTAPE 1 : Build de l'application React avec Vite ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Les variables VITE_* sont injectées au moment du build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- ÉTAPE 2 : Serveur Web Nginx ultra-léger (~25 Mo) ---
FROM nginx:1.27-alpine AS production

# Suppression de la config par défaut et copie de notre config SPA
RUN rm -f /etc/nginx/conf.d/default.conf
COPY src/10-docker-nginx-deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers statiques générés par Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
