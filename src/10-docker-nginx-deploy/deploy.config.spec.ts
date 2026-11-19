import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('10-docker-nginx-deploy : Validation Configuration Docker & Nginx SPA', () => {
  const nginxConfPath = path.resolve(__dirname, 'nginx.conf');
  const dockerfilePath = path.resolve(__dirname, 'Dockerfile');

  it('nginx.conf doit contenir le fallback SPA try_files et les headers de sécurité', () => {
    const content = fs.readFileSync(nginxConfPath, 'utf-8');

    expect(content).toContain('try_files $uri $uri/ /index.html;');
    expect(content).toContain('gzip on;');
    expect(content).toContain('X-Frame-Options');
    expect(content).toContain('X-Content-Type-Options');
  });

  it('Dockerfile doit utiliser un build multi-stage et servir le dossier dist via Nginx', () => {
    const content = fs.readFileSync(dockerfilePath, 'utf-8');

    expect(content).toContain('AS builder');
    expect(content).toContain('FROM nginx:');
    expect(content).toContain('npm run build');
    expect(content).toContain('COPY --from=builder /app/dist /usr/share/nginx/html');
  });
});
