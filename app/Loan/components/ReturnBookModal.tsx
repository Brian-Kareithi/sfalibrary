import { useState } from 'react';
import { Loan } from './loan';
import { libraryApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface ReturnBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loan: Loan | null;
}

type BookCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';

export default function ReturnBookModal({ isOpen, onClose, onSuccess, loan }: ReturnBookModalProps) {
  const [condition, setCondition] = useState<BookCondition>('GOOD');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateDaysOverdue = (dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateFine = (loan: Loan): number => {
    if (loan.status === 'RETURNED') return 0;
    
    const daysOverdue = calculateDaysOverdue(loan.dueDate);
    return daysOverdue * (loan.book.dailyFineAmount || 1);
  };

  const handleReturn = async () => {
    if (!loan) return;

    try {
      setLoading(true);
      const response = await libraryApi.returnBook(loan.id, {
        condition,
        notes: notes || undefined
      });

      if (response.success) {
        toast.success('Book returned successfully!');
        onSuccess();
        resetForm();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to return book';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCondition('GOOD');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !loan) return null;

  const daysOverdue = calculateDaysOverdue(loan.dueDate);
  const estimatedFine = calculateFine(loan);
  const isOverdue = daysOverdue > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Return Book</h2>
              <p className="text-gray-600 mt-1">Process book return and condition assessment</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loan Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Loan Details</h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3 mb-3">
                {loan.book.coverImageUrl ? (
                  <div className="flex-shrink-0">
                    <Image
                      src={loan.book.coverImageUrl}
                      alt={loan.book.title}
                      width={48}
                      height={64}
                      className="w-12 h-16 object-cover rounded-lg shadow-sm"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{loan.book.title}</h4>
                  <p className="text-sm text-gray-600">by {loan.book.author}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Borrower:</span>
                  <div className="text-gray-900">{loan.borrower.name}</div>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Due Date:</span>
                  <div className="text-gray-900">{new Date(loan.dueDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Borrowed:</span>
                  <div className="text-gray-900">{new Date(loan.borrowDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Renewals:</span>
                  <div className="text-gray-900">{loan.renewalCount}</div>
                </div>
              </div>

              {isOverdue && (
                <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                  <div className="text-red-700 text-sm">
                    <div className="font-semibold flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Overdue by {daysOverdue} days
                    </div>
                    <div className="mt-1">Estimated fine: ${estimatedFine.toFixed(2)}</div>
                    <div className="text-xs opacity-75">
                      Daily fine: ${(loan.book.dailyFineAmount || 1).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Condition Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Book Condition Assessment
            </label>
            <div className="space-y-2">
              {[
                { 
                  value: 'EXCELLENT', 
                  label: 'Excellent - Like new condition', 
                  color: 'bg-green-500',
                  description: 'No visible wear or damage'
                },
                { 
                  value: 'GOOD', 
                  label: 'Good - Minor wear', 
                  color: 'bg-blue-500',
                  description: 'Slight wear, no major damage'
                },
                { 
                  value: 'FAIR', 
                  label: 'Fair - Noticeable wear', 
                  color: 'bg-yellow-500',
                  description: 'Visible wear but still functional'
                },
                { 
                  value: 'POOR', 
                  label: 'Poor - Significant damage', 
                  color: 'bg-orange-500',
                  description: 'Major damage affecting usability'
                },
                { 
                  value: 'DAMAGED', 
                  label: 'Damaged - Requires repair', 
                  color: 'bg-red-500',
                  description: 'Needs repair before reuse'
                },
              ].map((option) => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50" style={{
                  borderColor: condition === option.value ? getColor(option.value) : 'transparent',
                  backgroundColor: condition === option.value ? `${getColor(option.value)}15` : 'transparent'
                }}>
                  <input
                    type="radio"
                    value={option.value}
                    checked={condition === option.value}
                    onChange={(e) => setCondition(e.target.value as BookCondition)}
                    className="text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div className="flex items-start space-x-3">
                    <div className={`w-4 h-4 rounded-full ${option.color} mt-1 flex-shrink-0`}></div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white resize-vertical shadow-sm"
              placeholder="Describe any specific damage, wear, or other condition details..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={handleReturn}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirm Return</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get color for condition
function getColor(condition: string): string {
  switch (condition) {
    case 'EXCELLENT': return '#10B981';
    case 'GOOD': return '#3B82F6';
    case 'FAIR': return '#F59E0B';
    case 'POOR': return '#F97316';
    case 'DAMAGED': return '#EF4444';
    default: return '#6B7280';
  }
}