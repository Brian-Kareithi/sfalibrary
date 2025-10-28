import { Loan } from './loan';
import Image from 'next/image';

interface LoansTableProps {
  loans: Loan[];
  loading: boolean;
  onReturnClick: (loan: Loan) => void;
  onRenewClick: (loan: Loan) => void;
  activeTab: string;
}

export default function LoansTable({ loans, loading, onReturnClick, onRenewClick, activeTab }: LoansTableProps) {
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

  const getStatusBadge = (loan: Loan) => {
    if (loan.status === 'RETURNED') {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Returned</span>;
    }

    const daysRemaining = calculateDaysRemaining(loan.dueDate);
    const isOverdue = daysRemaining < 0;

    if (isOverdue) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Overdue</span>;
    } else if (daysRemaining <= 3) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Due Soon</span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Active</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading loans...</p>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="p-6 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loans Found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          {activeTab === 'all' 
            ? 'There are no loans in the system yet.' 
            : activeTab === 'active'
            ? 'There are no active loans at the moment.'
            : 'There are no overdue loans at the moment.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Book & Borrower
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loan Dates
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fines
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loans.map((loan) => {
            const daysRemaining = calculateDaysRemaining(loan.dueDate);
            const isOverdue = daysRemaining < 0;
            const daysOverdue = isOverdue ? calculateDaysOverdue(loan.dueDate) : 0;
            const canRenew = loan.renewalCount < 2; // Assuming max 2 renewals

            return (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {loan.book.coverImageUrl ? (
                      <div className="flex-shrink-0">
                        <Image
                          src={loan.book.coverImageUrl}
                          alt={loan.book.title}
                          width={36}
                          height={48}
                          className="h-12 w-9 object-cover rounded"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-9 bg-gray-100 rounded flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{loan.book.title}</div>
                      <div className="text-sm text-gray-500">by {loan.book.author}</div>
                      <div className="text-sm text-gray-500">
                        Borrowed by: {loan.borrower.name}
                        {loan.borrower.studentProfile && ` (${loan.borrower.studentProfile.admissionNumber})`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Borrowed: {new Date(loan.borrowDate).toLocaleDateString()}</div>
                    <div>Due: {new Date(loan.dueDate).toLocaleDateString()}</div>
                    {loan.returnDate && (
                      <div>Returned: {new Date(loan.returnDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    {getStatusBadge(loan)}
                    {loan.status === 'ACTIVE' && (
                      <div className="text-xs text-gray-500">
                        {isOverdue 
                          ? `${daysOverdue} days overdue` 
                          : `${daysRemaining} days remaining`
                        }
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Renewals: {loan.renewalCount}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.fineAmount > 0 ? (
                    <div>
                      <div className="text-red-600 font-medium">
                        ${loan.fineAmount.toFixed(2)}
                      </div>
                      {loan.finePaidAmount > 0 && (
                        <div className="text-green-600 text-xs">
                          Paid: ${loan.finePaidAmount.toFixed(2)}
                        </div>
                      )}
                      {loan.fineWaivedAmount > 0 && (
                        <div className="text-blue-600 text-xs">
                          Waived: ${loan.fineWaivedAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-green-600">No fines</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {loan.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => onReturnClick(loan)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Return
                        </button>
                        {canRenew && !isOverdue && (
                          <button
                            onClick={() => onRenewClick(loan)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Renew
                          </button>
                        )}
                      </>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded text-sm transition-colors">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}