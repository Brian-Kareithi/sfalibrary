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

  const getAvailabilityColor = (availableCopies: number, totalCopies: number) => {
    if (availableCopies === 0) return 'text-red-600 bg-red-50';
    if (availableCopies / totalCopies < 0.2) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  const getAvailabilityText = (availableCopies: number) => {
    if (availableCopies === 0) return 'Out of Stock';
    if (availableCopies < 3) return 'Low Stock';
    return 'In Stock';
  };

  const handleCopiesUpdate = () => {
    if (newCopies !== book.totalCopies) {
      onUpdateCopies(book.id, newCopies);
    }
    setShowCopiesModal(false);
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
        {/* Book Cover with Overlay */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
          {book.coverImageUrl ? (
            <Image 
              src={book.coverImageUrl} 
              alt={book.title}
              width={200}
              height={192}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
            />
          ) : (
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm font-medium">No Cover Image</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(book.isActive)} shadow-sm`}>
              {book.isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>

          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getAvailabilityColor(book.availableCopies, book.totalCopies)} shadow-sm`}>
              {getAvailabilityText(book.availableCopies)}
            </span>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-gray-600 text-sm font-medium mb-3">by {book.author}</p>
            
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                {formatCategory(book.category)}
              </span>
              <span className="font-semibold text-gray-700">{book.publicationYear}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className={`text-lg font-bold ${getAvailabilityColor(book.availableCopies, book.totalCopies).split(' ')[0]}`}>
                {book.availableCopies}
              </div>
              <div className="text-xs text-gray-600 font-medium">Available</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">{book.borrowedCopies}</div>
              <div className="text-xs text-gray-600 font-medium">Borrowed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{book.totalCopies}</div>
              <div className="text-xs text-gray-600 font-medium">Total</div>
            </div>
          </div>

          {/* Format Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              book.format === 'PHYSICAL' 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {book.format === 'PHYSICAL' ? '📚 Physical' : '💻 Digital'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center space-x-2 transition-all duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
            >
              <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowCopiesModal(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Update copies"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              <button
                onClick={() => onUpdateStatus(book.id, !book.isActive)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  book.isActive 
                    ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50' 
                    : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                }`}
                title={book.isActive ? 'Deactivate' : 'Activate'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {book.isActive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  )}
                </svg>
              </button>
              
              <button
                onClick={() => onDelete(book.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
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
            <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
              <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                {book.description || 'No description available.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 min-w-20">Publisher:</span>
                  <span>{book.publisher || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 min-w-20">Language:</span>
                  <span>{book.language || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 min-w-20">ISBN:</span>
                  <span className="font-mono">{book.isbn || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 min-w-20">Location:</span>
                  <span>{book.location || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 min-w-20">Pages:</span>
                  <span>{book.pages || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 min-w-20">Added:</span>
                  <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {book.barcode && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs font-semibold text-gray-700">Barcode: </span>
                  <span className="text-xs font-mono text-gray-600">{book.barcode}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Copies Update Modal */}
      {showCopiesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 transform animate-scaleIn">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all duration-200"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">
                    Currently borrowed: <span className="font-semibold">{book.borrowedCopies}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Minimum allowed: <span className="font-semibold">{book.borrowedCopies}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Will be available: <span className="font-semibold text-green-600">{newCopies - book.borrowedCopies}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowCopiesModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopiesUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm w-full sm:w-auto"
                >
                  Update Copies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}