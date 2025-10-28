import { Loan } from './loan';
import Image from 'next/image';

interface LoanHistoryProps {
  loans: Loan[];
}

export default function LoanHistory({ loans }: LoanHistoryProps) {
  if (loans.length === 0) {
    return (
      <div className="p-6 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loan History</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Your loan history will appear here once you start borrowing books.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Loan History</h2>
      <div className="space-y-4">
        {loans.map((loan) => (
          <div key={loan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              {loan.book.coverImageUrl ? (
                <div className="flex-shrink-0">
                  <Image
                    src={loan.book.coverImageUrl}
                    alt={loan.book.title}
                    width={64}
                    height={80}
                    className="w-16 h-20 object-cover rounded-lg"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
                  />
                </div>
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
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Borrowed:</span>{' '}
                    {new Date(loan.borrowDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Due:</span>{' '}
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Returned:</span>{' '}
                    {loan.returnDate 
                      ? new Date(loan.returnDate).toLocaleDateString()
                      : 'Not returned'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      loan.status === 'RETURNED' 
                        ? 'bg-green-100 text-green-800'
                        : loan.status === 'OVERDUE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
                
                {loan.fineAmount > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-red-600">
                      Fine: ${loan.fineAmount.toFixed(2)}
                      {loan.finePaidAmount > 0 && ` (Paid: $${loan.finePaidAmount.toFixed(2)})`}
                      {loan.fineWaivedAmount > 0 && ` (Waived: $${loan.fineWaivedAmount.toFixed(2)})`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}