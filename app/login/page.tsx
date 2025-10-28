/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authcontext';

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login page - Auth status:', { isAuthenticated, user });
    
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to dashboard');
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Login attempt with email:', email);
      
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        // Verify token was stored
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        console.log('Token stored after login:', token ? 'Yes' : 'No');
        
        if (!token) {
          console.error('Token not found in localStorage after successful login');
          setError('Authentication failed: Token not stored. Please try again.');
          setLoading(false);
          return;
        }

        console.log('Login successful, redirecting to dashboard...');
        
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          router.push('/');
        }, 200);
      } else {
        console.log('Login failed - invalid credentials');
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      
      // Debug: Check localStorage after error
      const debugToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('Token after error:', debugToken);
      
      // Enhanced error handling
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        setError('Server error: Expected JSON but received HTML. Please check your API endpoint.');
      } else if (error.message?.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check your connection and API URL.');
      } else if (error.message?.includes('CORS')) {
        setError('CORS error: Please check your server configuration.');
      } else if (error.message?.includes('403')) {
        setError('Access forbidden. Please check if your account has the required permissions.');
      } else if (error.message?.includes('401')) {
        setError('Authentication failed. Please check your credentials.');
      } else if (error.response?.status === 404) {
        setError('API endpoint not found. Please check your server configuration.');
      } else if (error.response?.status === 500) {
        setError('Internal server error. Please try again later.');
      } else if (error.message?.includes('Network Error')) {
        setError('Cannot connect to server. Please check your internet connection and ensure the API server is running.');
      } else {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#011C40] via-[#023859] to-[#26658C] text-white relative overflow-hidden">
      {/* Soft Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#54ACBF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#26658C] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#A7EBF2] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-500"></div>

      {/* Page Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="backdrop-blur-2xl bg-[#023859]/80 rounded-[2rem] shadow-2xl border border-[#54ACBF]/20 p-10 transition-all duration-300 hover:border-[#54ACBF]/30">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#A7EBF2] to-[#54ACBF] text-[#011C40] rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-[#A7EBF2] text-sm">Sign in to your School Library Management account</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-400/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#A7EBF2] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-5 py-3 rounded-xl bg-[#011C40]/60 text-white placeholder-[#54ACBF] border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A7EBF2] ${
                    focusedField === 'email' 
                      ? 'border-[#A7EBF2] ring-2 ring-[#A7EBF2]/20' 
                      : 'border-[#26658C] hover:border-[#54ACBF]'
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#A7EBF2] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3 pr-12 rounded-xl bg-[#011C40]/60 text-white placeholder-[#54ACBF] border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A7EBF2] ${
                      focusedField === 'password'
                        ? 'border-[#A7EBF2] ring-2 ring-[#A7EBF2]/20'
                        : 'border-[#26658C] hover:border-[#54ACBF]'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-[#26658C]/30 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-[#54ACBF]" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-[#54ACBF]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center text-sm text-[#A7EBF2] cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2 rounded border-[#26658C] bg-[#011C40]/60 focus:ring-[#A7EBF2]" 
                  />
                  Remember me
                </label>
                <button type="button" className="text-sm text-[#54ACBF] hover:text-[#A7EBF2] transition-colors duration-200 hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#26658C] to-[#54ACBF] text-white rounded-full font-medium hover:from-[#2d74a3] hover:to-[#5fb8d0] transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A7EBF2] focus:ring-offset-2 focus:ring-offset-[#023859] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-[#54ACBF]">
                Secure login powered by Steadfast Academy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}