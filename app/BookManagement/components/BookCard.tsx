import { Book } from '../book';
import { useState } from 'react';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
  onDelete: (bookId: string) => void;
  onUpdateStatus: (bookId: string, isActive: boolean) => void;
  onUpdateCopies: (bookId: string, totalCopies: number) => void;
}

export default function BookCard({ book, onDelete, onUpdateStatus, onUpdateCopies }: BookCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showCopiesModal, setShowCopiesModal] = useState(false);
  const [newCopies, setNewCopies] = useState(book.totalCopies);

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? '🟢' : '🔴';
  };

  const getAvailabilityColor = (availableCopies: number) => {
    if (availableCopies === 0) return 'text-red-600';
    if (availableCopies < 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleCopiesUpdate = () => {
    if (newCopies !== book.totalCopies) {
      onUpdateCopies(book.id, newCopies);
    }
    setShowCopiesModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
        {/* Book Cover */}
        <div className="h-48 bg-gray-100 flex items-center justify-center relative">
          {book.coverImageUrl ? (
            <Image 
              src={book.coverImageUrl} 
              alt={book.title}
              width={200}
              height={192}
              className="h-full w-full object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
            />
          ) : (
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm font-medium">No Cover Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(book.isActive)}`}>
              {getStatusIcon(book.isActive)} {book.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight mb-1">{book.title}</h3>
            <p className="text-gray-600 text-sm font-medium">by {book.author}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium max-w-[120px] truncate">
              {book.category.replace('_', ' ')}
            </span>
            <span className="font-medium">{book.publicationYear}</span>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <div className="text-center flex-1">
              <div className={`font-semibold ${getAvailabilityColor(book.availableCopies)}`}>
                {book.availableCopies}/{book.totalCopies}
              </div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
            <div className="text-center flex-1">
              <div className="font-semibold text-gray-900">{book.borrowedCopies}</div>
              <div className="text-xs text-gray-500">Borrowed</div>
            </div>
            <div className="text-center flex-1">
              <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                {book.format}
              </div>
              <div className="text-xs text-gray-500">Format</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-100 gap-3 sm:gap-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center space-x-1 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
              <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-start">
              <button
                onClick={() => setShowCopiesModal(true)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:py-1 rounded-lg transition-colors flex items-center justify-center"
                title="Update copies"
              >
                <span className="hidden sm:inline">📚</span>
                <span className="sm:hidden">Update Copies</span>
              </button>
              
              <button
                onClick={() => onUpdateStatus(book.id, !book.isActive)}
                className={`text-sm px-3 py-2 sm:py-1 rounded-lg transition-colors flex items-center justify-center ${
                  book.isActive 
                    ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' 
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
                title={book.isActive ? 'Deactivate' : 'Activate'}
              >
                <span className="hidden sm:inline">{book.isActive ? '⏸️' : '▶️'}</span>
                <span className="sm:hidden text-xs">{book.isActive ? 'Deactivate' : 'Activate'}</span>
              </button>
              
              <button
                onClick={() => onDelete(book.id)}
                className="text-red-600 hover:text-red-800 p-2 sm:p-1 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                title="Delete book"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3">
                {book.description || 'No description available.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">Publisher:</span> {book.publisher || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Language:</span> {book.language || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">ISBN:</span> {book.isbn || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Location:</span> {book.location || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Pages:</span> {book.pages || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Added:</span> {new Date(book.createdAt).toLocaleDateString()}
                </div>
              </div>
              {book.barcode && (
                <div className="mt-2 text-xs text-gray-500">
                  Barcode: {book.barcode}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Copies Update Modal */}
      {showCopiesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Book Copies</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Copies
                </label>
                <input
                  type="number"
                  min={book.borrowedCopies}
                  value={newCopies}
                  onChange={(e) => setNewCopies(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Currently borrowed: {book.borrowedCopies}
                </p>
                <p className="text-xs text-gray-500">
                  Minimum allowed: {book.borrowedCopies}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowCopiesModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopiesUpdate}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}