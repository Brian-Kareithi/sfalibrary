'use client';
import { useState, useEffect } from 'react';
import { libraryApi, DashboardData } from '@/lib/api';
import { Book, Loan } from './Loan/components/loan';
import Link from 'next/link';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dashboard data
      const dashboardResponse = await libraryApi.getDashboard();
      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      } else {
        // If dashboard endpoint fails, create fallback data
        setDashboardData({
          overview: {
            totalBooks: 0,
            totalCopies: 0,
            availableCopies: 0,
            borrowedCopies: 0,
            activeLoans: 0,
            overdueLoans: 0,
            totalFines: 0
          },
          categoryStats: [],
          recentLoans: [],
          popularBooks: []
        });
      }

      // Load recent books
      const booksResponse = await libraryApi.getBooks({ 
        limit: 5, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
      if (booksResponse.success) {
        setRecentBooks(booksResponse.data.data || []);
      }

      // Load user's current loans - with proper error handling
      try {
        const userResponse = await libraryApi.getMe();
        if (userResponse.success && userResponse.data && userResponse.data.id) {
          const userLoansResponse = await libraryApi.getUserLoans(userResponse.data.id, 'ACTIVE');
          if (userLoansResponse.success) {
            setUserLoans(userLoansResponse.data || []);
          }
        } else {
          console.warn('User data not available, skipping user loans load');
          setUserLoans([]);
        }
      } catch (userError) {
        console.warn('Could not load user loans:', userError);
        setUserLoans([]);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data');
      // Set fallback data on error
      setDashboardData({
        overview: {
          totalBooks: 0,
          totalCopies: 0,
          availableCopies: 0,
          borrowedCopies: 0,
          activeLoans: 0,
          overdueLoans: 0,
          totalFines: 0
        },
        categoryStats: [],
        recentLoans: [],
        popularBooks: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanStatusColor = (status: string, dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (status === 'OVERDUE') return 'bg-red-100 text-red-800';
    if (daysUntilDue <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCategoryName = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Library Dashboard</h1>
              <p className="text-gray-600">Welcome to your library management system</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/BookManagement"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Manage Books
              </Link>
              <Link
                href="/Loan"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Loans
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview.totalBooks || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available Copies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview.availableCopies || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Borrowed Copies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview.borrowedCopies || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Loans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview.overdueLoans || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Copies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview.totalCopies || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview.activeLoans || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData?.overview.totalFines || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('myLoans')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'myLoans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Loans
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'popular'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Popular Books
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Books */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Additions</h3>
                    <Link href="/BookManagement" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All Books →
                    </Link>
                  </div>
                  {recentBooks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">No recent books available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentBooks.slice(0, 3).map((book) => (
                        <div key={book.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.availableCopies > 0 ? 'available' : 'borrowed')}`}>
                              {book.availableCopies > 0 ? 'Available' : 'Borrowed'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{book.category}</span>
                            <span>{book.publicationYear}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Loans */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Loans</h3>
                  {dashboardData?.recentLoans && dashboardData.recentLoans.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">No recent loan activity</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dashboardData?.recentLoans?.slice(0, 5).map((loan) => (
                        <div key={loan.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-gray-900">{loan.book?.title}</h4>
                              <p className="text-gray-600 text-sm">Borrowed by {loan.borrower?.name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLoanStatusColor(loan.status, loan.dueDate)}`}>
                              {loan.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>Due: {formatDate(loan.dueDate)}</span>
                            <span>Borrowed: {formatDate(loan.borrowDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Loans Tab */}
            {activeTab === 'myLoans' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Current Loans</h3>
                {userLoans.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No active loans</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by borrowing a book from our collection.</p>
                    <Link
                      href="/books"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Books
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userLoans.map((loan) => {
                      const today = new Date();
                      const dueDate = new Date(loan.dueDate);
                      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      const isOverdue = daysUntilDue < 0;

                      return (
                        <div key={loan.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{loan.book?.title}</h4>
                              <p className="text-gray-600 text-sm">by {loan.book?.author}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLoanStatusColor(loan.status, loan.dueDate)}`}>
                              {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Due: {formatDate(loan.dueDate)}</span>
                            <span>Renewals: {loan.renewalCount}/{loan.book?.maxRenewals || 2}</span>
                          </div>
                          {isOverdue && (
                            <div className="mt-2 text-sm text-red-600 font-medium">
                              Fine: ${loan.fineAmount?.toFixed(2) || '0.00'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Popular Books Tab */}
            {activeTab === 'popular' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Books</h3>
                {dashboardData?.popularBooks && dashboardData.popularBooks.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No popular books data available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData?.popularBooks?.map((book, index) => (
                      <div key={book.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{book.title}</h4>
                              <p className="text-gray-600 text-sm">by {book.author}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.availableCopies > 0 ? 'available' : 'borrowed')}`}>
                            {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Borrowed'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Borrowed {book._count?.loans || 0} times</span>
                          <span>{book.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Books by Category</h3>
                {dashboardData?.categoryStats && dashboardData.categoryStats.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No category data available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData?.categoryStats?.map((category) => (
                      <div key={category.category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900">
                            {formatCategoryName(category.category)}
                          </h4>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {category._count} books
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Total Copies:</span>
                            <span className="font-medium">{category._sum.totalCopies}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Available Copies:</span>
                            <span className="font-medium text-green-600">{category._sum.availableCopies}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Borrowed Copies:</span>
                            <span className="font-medium text-yellow-600">
                              {category._sum.totalCopies - category._sum.availableCopies}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/BookManagement"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Books</h3>
                <p className="text-sm text-gray-600">Add, edit, and manage books</p>
              </div>
            </div>
          </Link>

          <Link
            href="/Loan"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Loans</h3>
                <p className="text-sm text-gray-600">Process borrowings and returns</p>
              </div>
            </div>
          </Link>

          <Link
            href="/search"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search</h3>
                <p className="text-sm text-gray-600">Find books and resources</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}