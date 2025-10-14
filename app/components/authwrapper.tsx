'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/authcontext';
import LoadingSpinner from './spinner';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/signup'];

// Utility to check if JWT is expired
function isTokenExpired(token?: string | null): boolean {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return true;
    // exp is in seconds
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthenticated = !!user;

    // Check token expiration
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!isPublicRoute && isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      logout?.();
      router.push('/login');
      return;
    }

    if (!isAuthenticated && !isPublicRoute) {
      // User is not authenticated and trying to access a protected route
      router.push('/login');
    } else if (isAuthenticated && pathname === '/login') {
      // User is authenticated but on login page, redirect to dashboard
      router.push('/');
    }
  }, [user, loading, pathname, router, logout]);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show login page or protected content based on authentication status
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthenticated = !!user;

  if (!isAuthenticated && !isPublicRoute) {
    // This will be handled by the useEffect redirect, but we can show loading
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
