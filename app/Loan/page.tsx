'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authcontext';
import { libraryApi } from '@/lib/api';
import { Loan, LoanFilters, LoanTableProps, LoanStatsProps } from './components/loan';
import LoanStats from './components/LoanStats';
import LoansTable from './components/LoansTable';
import BorrowBookModal from './components/BorrowBookModal';
import ReturnBookModal from './components/ReturnBookModal';
import { toast } from 'react-hot-toast';

type ActiveTab = 'all' | 'active' | 'overdue';

interface LoansApiResponse {
  data: Loan[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function LoansPage() {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LoanFilters>({
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const extractLoansFromResponse = (responseData: unknown): Loan[] => {
    // Handle array response directly
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    // Handle object response with data property
    if (responseData && typeof responseData === 'object') {
      const dataObj = responseData as Record<string, unknown>;
      
      // Check for data property that contains array
      if ('data' in dataObj && Array.isArray(dataObj.data)) {
        return dataObj.data as Loan[];
      }
      
      // Check for loans property that contains array
      if ('loans' in dataObj && Array.isArray(dataObj.loans)) {
        return dataObj.loans as Loan[];
      }
      
      // Check for items property that contains array
      if ('items' in dataObj && Array.isArray(dataObj.items)) {
        return dataObj.items as Loan[];
      }
    }
    
    console.warn('Unexpected loans response format:', responseData);
    return [];
  };

  const loadLoans = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      switch (activeTab) {
        case 'active':
          response = await libraryApi.getActiveLoans(filters);
          break;
        case 'overdue':
          response = await libraryApi.getOverdueLoans();
          break;
        default:
          response = await libraryApi.getLoans(filters);
          break;
      }

      if (response.success) {
        const loansData = extractLoansFromResponse(response.data);
        setLoans(loansData);
        
        if (response.pagination) {
          setPagination(response.pagination);
        } else if (response.data && typeof response.data === 'object') {
          const data = response.data as LoansApiResponse;
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load loans:', error);
      toast.error('Failed to load loans');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const handleBorrowSuccess = (): void => {
    setIsBorrowModalOpen(false);
    loadLoans();
    toast.success('Book issued successfully!');
  };

  const handleReturnSuccess = (): void => {
    setIsReturnModalOpen(false);
    setSelectedLoan(null);
    loadLoans();
    toast.success('Book returned successfully!');
  };

  const handleRenewClick = async (loan: Loan): Promise<void> => {
    try {
      const response = await libraryApi.renewLoan(loan.id);
      if (response.success) {
        loadLoans();
        toast.success('Loan renewed successfully!');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to renew loan';
      toast.error(errorMessage);
    }
  };

  const handleReturnClick = (loan: Loan): void => {
    setSelectedLoan(loan);
    setIsReturnModalOpen(true);
  };

  const handlePageChange = (newPage: number): void => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Check if user has required role
  const canAccess = hasRole && hasRole(['ADMIN', 'LIBRARIAN', 'STAFF']);

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don&apos;t have permission to access loan management.</p>
          </div>
        </div>
      </div>
    );
  }

  const loanStatsProps: LoanStatsProps = {
    loans,
    activeTab
  };

  const loanTableProps: LoanTableProps = {
    loans,
    loading,
    onReturnClick: handleReturnClick,
    onRenewClick: handleRenewClick,
    activeTab
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loan Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage book borrowings, returns, and renewals
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsBorrowModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-semibold">Issue Book</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loan Statistics */}
        <LoanStats {...loanStatsProps} />

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 inline-flex">
            <nav className="flex space-x-1">
              {[
                { key: 'all', label: 'All Loans' },
                { key: 'active', label: 'Active Loans' },
                { key: 'overdue', label: 'Overdue Loans' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as ActiveTab)}
                  className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <LoansTable {...loanTableProps} />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Next
            </button>
          </div>
        )}

        {/* Modals */}
        <BorrowBookModal
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
          onSuccess={handleBorrowSuccess}
        />

        <ReturnBookModal
          isOpen={isReturnModalOpen}
          onClose={() => {
            setIsReturnModalOpen(false);
            setSelectedLoan(null);
          }}
          onSuccess={handleReturnSuccess}
          loan={selectedLoan}
        />
      </div>
    </div>
  );
}