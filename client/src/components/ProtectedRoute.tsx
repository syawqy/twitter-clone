// client/src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthPage } from './AuthPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2em',
        color: '#666'
      }}>
        Memuat...
      </div>
    );
  }

  // If user is not authenticated, show auth page
  if (!user) {
    return <AuthPage />;
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
}