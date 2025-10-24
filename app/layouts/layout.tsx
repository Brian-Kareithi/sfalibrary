'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  ClipboardList,
  ArrowUpDown,
  Menu,
  X,
  NotebookText,
} from 'lucide-react';
import UserInfoandLogout from '../components/logout';
import { useAuth } from '@/context/authcontext';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Book Management', href: '/BookManagement', icon: ArrowUpDown },
  { name: 'Loans', href: '/Loan', icon: ClipboardList },
  { name: 'Settings', href: '/settings', icon: NotebookText },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const isLoginPage = pathname === '/login';

  // Check authentication status on component mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      
      // Check if token exists in localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('Auth check - Token exists:', !!token);
      console.log('Auth check - Current path:', pathname);
      
      if (token) {
        setIsAuthenticated(true);
        
        // If on login page but authenticated, redirect to dashboard
        if (isLoginPage) {
          console.log('Redirecting to dashboard from login page');
          router.push('/');
        }
      } else {
        setIsAuthenticated(false);
        
        // If not on login page and not authenticated, redirect to login
        if (!isLoginPage) {
          console.log('Redirecting to login - no token found');
          router.push('/login');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#011C40] via-[#023859] to-[#26658C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-teal-300 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#A7EBF2]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // For login page, don't show the layout
  if (isLoginPage) return <>{children}</>;

  // If not authenticated and not on login page, don't render (will redirect)
  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#011C40] via-[#023859] to-[#26658C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-teal-300 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#A7EBF2]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#011C40] via-[#023859] to-[#26658C] text-white font-sans relative overflow-hidden">
      {/* Animated floating lights for liquid feel */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full animate-pulse-slow" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-300/10 blur-3xl rounded-full animate-pulse-slower" />
      </div>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl border-b border-[#26658C]/40 shadow-lg">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          {/* Collapse Button - Left Side */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center gap-2 text-[#A7EBF2] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Menu Button - Left Side */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[#A7EBF2] hover:text-white transition p-2"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          {/* School Logo - Center/Right */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto md:ml-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-teal-300 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-[#011C40] font-bold text-sm sm:text-lg">S</span>
            </div>
            <span className="text-sm sm:text-lg font-light text-white hidden sm:block">Steadfast Academy Library</span>
          </div>
        </div>
      </div>

      <div className="flex h-screen overflow-hidden relative z-10 pt-16">
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed z-50 top-0 bottom-0 left-0 w-64 border-r border-[#26658C]/40 text-white p-4 space-y-6 transform transition-all duration-500 ease-in-out md:relative md:translate-x-0 md:block',
            'bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            sidebarCollapsed && 'lg:w-20'
          )}
        >
          {/* Mobile Close */}
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="text-xl font-light text-white">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="text-[#A7EBF2] hover:text-white transition p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Brand Title */}
          <h2
            className={cn(
              'hidden md:block text-xl font-light tracking-wide text-[#A7EBF2] transition-opacity duration-300 mb-2',
              sidebarCollapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            Navigation
          </h2>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'relative flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl group transition-all duration-300 ease-in-out overflow-hidden',
                    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/30 before:to-teal-300/30 before:opacity-0 before:blur-xl before:transition-opacity before:duration-300 before:rounded-xl',
                    isActive
                      ? 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_0_20px_rgba(83,215,255,0.3)] before:opacity-100'
                      : 'hover:bg-white/10 hover:backdrop-blur-md hover:shadow-[0_0_20px_rgba(83,215,255,0.1)] hover:before:opacity-100',
                    sidebarCollapsed && 'lg:justify-center lg:px-2'
                  )}
                  title={sidebarCollapsed ? name : undefined}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 sm:h-5 sm:w-5 transition-transform flex-shrink-0 drop-shadow-md',
                      isActive ? 'scale-110 text-white' : 'group-hover:scale-110 text-[#A7EBF2]'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-medium transition-opacity duration-300',
                      sidebarCollapsed ? 'lg:opacity-0 lg:absolute' : 'opacity-100'
                    )}
                  >
                    {name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile + Logout */}
          <div
            className={cn(
              'mt-auto transition-opacity duration-300',
              sidebarCollapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            <UserInfoandLogout />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-500">
          {/* Authentication Status Indicator */}
          <div className="px-4 sm:px-6 py-2 bg-green-500/20 border-b border-green-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-1 sm:gap-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-xs sm:text-sm">
                  Authenticated as: {user?.name || 'User'}
                </span>
              </div>
              <span className="text-green-300 text-xs">
                Role: {user?.role || 'Loading...'}
              </span>
            </div>
          </div>

          {/* Children */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-white/5 backdrop-blur-lg border-l border-white/10 shadow-inner">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}