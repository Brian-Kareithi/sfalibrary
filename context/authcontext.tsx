/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User } from '../lib/api';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  canManageInventory: () => boolean;
  canManageLibrary: () => boolean;
  canApprove: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
   
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        api.setToken(token);
        console.log('Restored user session:', parsedUser.email);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    }
   
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      const response = await api.login({ email, password });
      console.log('API login response:', response);
     
      if (response.success && response.token && response.user) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Set token in API client
        api.setToken(response.token);
        
        // Update state
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('Login successful, token stored:', response.token ? 'Yes' : 'No');
        toast.success('Login successful!');
        return true;
      } else {
        const errorMessage = response.message || 'Login failed';
        console.error('Login failed:', errorMessage);
        toast.error(errorMessage);
        return false;
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      
      // Enhanced error handling for different types of errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        errorMessage = 'Server error: Invalid response format. Please contact support.';
        console.error('JSON Parse Error - Server likely returned HTML instead of JSON');
      } else if (error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('CORS')) {
        errorMessage = 'Connection error. Please try again.';
      } else if (error.message?.includes('403')) {
        errorMessage = 'Access forbidden. Please check your credentials.';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Invalid email or password.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Login service not found. Please contact support.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    api.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    console.log('User logged out, session cleared');
  };

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const canManageInventory = (): boolean => {
    return hasRole(['ADMIN']);
  };

  const canManageLibrary = (): boolean => {
    return hasRole(['ADMIN', 'LIBRARIAN']);
  };

  const canApprove = (): boolean => {
    return hasRole(['ADMIN']);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    canManageInventory,
    canManageLibrary,
    canApprove,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}