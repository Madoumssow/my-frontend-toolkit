import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  loginPath?: string;
  unauthorizedPath?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  loginPath = '/login',
  unauthorizedPath = '/unauthorized',
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return <>{children}</>;
};
