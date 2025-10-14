import { Loan } from './loan';
import { useState } from 'react';
import { libraryApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface ActiveLoansProps {
  loans: Loan[];
  onReturnSuccess: () => void;
  onRenewSuccess: () => void;
}

export default function ActiveLoans({ loans, onReturnSuccess, onRenewSuccess }: ActiveLoansProps) {
  const [returningLoanId, setReturningLoanId] = useState<string | null>(null);
  const [renewingLoanId, setRenewingLoanId] = useState<string | null>(null);

  const calculateDaysRemaining = (dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDaysOverdue = (dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handleReturn = async (loanId: string) => {
    try {
      setReturningLoanId(loanId);
      const response = await libraryApi.returnBook(loanId, {
        condition: 'GOOD',
        notes: 'Returned via self-service'
      });

      if (response.success) {
        onReturnSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to return book');
    } finally {
      setReturningLoanId(null);
    }
  };

  const handleRenew = async (loanId: string) => {
    try {
      setRenewingLoanId(loanId);
      const response = await libraryApi.renewLoan(loanId);

      if (response.success) {
        onRenewSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to renew loan');
    } finally {
      setRenewingLoanId(null);
    }
  };

  if (loans.length === 0) {
    return (
      <div className="p-6 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Loans</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          You don't have any active book loans at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Active Loans</h2>
      <div className="space-y-4">
        {loans.map((loan) => {
          const daysRemaining = calculateDaysRemaining(loan.dueDate);
          const isOverdue = daysRemaining < 0;
          const daysOverdue = isOverdue ? calculateDaysOverdue(loan.dueDate) : 0;
          const canRenew = loan.renewalCount < (loan.book.maxRenewals || 2);

          return (
            <div key={loan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {loan.book.coverImageUrl ? (
                      <img
                        src={loan.book.coverImageUrl}
                        alt={loan.book.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{loan.book.title}</h3>
                      <p className="text-gray-600">by {loan.book.author}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Borrowed:</span>{' '}
                          {new Date(loan.borrowDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Due:</span>{' '}
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Renewals:</span>{' '}
                          {loan.renewalCount} used
                        </div>
                        <div>
                          <span className="font-medium">Format:</span>{' '}
                          {loan.book.format}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isOverdue 
                      ? 'bg-red-100 text-red-800' 
                      : daysRemaining <= 3 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {isOverdue 
                      ? `Overdue by ${daysOverdue} days` 
                      : `${daysRemaining} days remaining`
                    }
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReturn(loan.id)}
                      disabled={returningLoanId === loan.id}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {returningLoanId === loan.id ? 'Returning...' : 'Return'}
                    </button>
                    
                    {canRenew && !isOverdue && (
                      <button
                        onClick={() => handleRenew(loan.id)}
                        disabled={renewingLoanId === loan.id}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {renewingLoanId === loan.id ? 'Renewing...' : 'Renew'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Digital Access for Digital Books */}
              {loan.book.format === 'DIGITAL' && loan.book.accessUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={loan.book.accessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Access Digital Book
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}