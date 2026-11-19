import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

describe('04-auth-rbac-routing : Protection des routes & RBAC', () => {
  const renderWithRouter = (
    initialRoute: string,
    initialUser: { id: string; email: string; role: 'admin' | 'user' } | null
  ) => {
    return render(
      <AuthProvider initialUser={initialUser}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/login" element={<div>Page de Connexion</div>} />
            <Route path="/unauthorized" element={<div>Accès Refusé 403</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Tableau de Bord Utilisateur</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>Panneau Administration</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('doit rediriger un visiteur non connecté vers /login', () => {
    renderWithRouter('/dashboard', null);
    expect(screen.getByText('Page de Connexion')).toBeInTheDocument();
  });

  it('doit autoriser un utilisateur connecté sur une route protégée générale', () => {
    renderWithRouter('/dashboard', {
      id: '1',
      email: 'user@test.com',
      role: 'user',
    });
    expect(screen.getByText('Tableau de Bord Utilisateur')).toBeInTheDocument();
  });

  it('doit bloquer un utilisateur standard (role: user) sur une route admin', () => {
    renderWithRouter('/admin', {
      id: '1',
      email: 'user@test.com',
      role: 'user',
    });
    expect(screen.getByText('Accès Refusé 403')).toBeInTheDocument();
  });

  it('doit autoriser un administrateur (role: admin) sur la route /admin', () => {
    renderWithRouter('/admin', {
      id: '2',
      email: 'admin@test.com',
      role: 'admin',
    });
    expect(screen.getByText('Panneau Administration')).toBeInTheDocument();
  });
});
