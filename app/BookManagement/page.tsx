'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Book, BookFilters, CreateBookRequest } from './book';
import { libraryApi } from '@/lib/api';
import BookGrid from './components/BookGrid';
import BookFiltersComponent from './components/BookFilters';
import BookStats from './components/BookStats';
import AddBookModal from './components/AddBookModal';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<BookFilters>({ page: 1, limit: 20 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState({
    totalBooks: 0,
    totalCopies: 0,
    availableCopies: 0,
    borrowedCopies: 0,
  });

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await libraryApi.getBooks(filters);

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to load books');
      }

      // Handle the API response structure correctly
      let booksData: Book[] = [];
      let paginationData = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: 0,
        totalPages: 0,
      };
      let summaryData = {
        totalBooks: 0,
        totalCopies: 0,
        availableCopies: 0,
        borrowedCopies: 0,
      };

      // The API returns data in response.data
      if (response.data && typeof response.data === 'object') {
        const apiData = response.data;
        
        // Extract books array
        if (apiData.data && Array.isArray(apiData.data)) {
          booksData = apiData.data;
        } else if (Array.isArray(apiData)) {
          booksData = apiData;
        }

        // Extract pagination
        if (apiData.pagination) {
          paginationData = { ...paginationData, ...apiData.pagination };
        }

        // Extract summary or calculate it
        if (apiData.summary) {
          summaryData = { ...summaryData, ...apiData.summary };
        } else {
          // Calculate summary from books data
          summaryData.totalBooks = booksData.length;
          summaryData.totalCopies = booksData.reduce((sum, book) => sum + (book.totalCopies || 0), 0);
          summaryData.availableCopies = booksData.reduce((sum, book) => sum + (book.availableCopies || 0), 0);
          summaryData.borrowedCopies = booksData.reduce((sum, book) => sum + (book.borrowedCopies || 0), 0);
        }
      }

      setBooks(booksData);
      setPagination(paginationData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load books:', error);
      toast.error('Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleAddBook = async (newBook: CreateBookRequest) => {
    try {
      const response = await libraryApi.createBook(newBook);
      if (response?.success) {
        toast.success('Book created successfully');
        setIsAddModalOpen(false);
        await loadBooks();
      } else {
        toast.error(response?.message || 'Failed to create book');
      }
    } catch (error) {
      console.error('Failed to create book:', error);
      toast.error('Failed to create book');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this book? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      const response = await libraryApi.deleteBook(bookId);
      if (response?.success) {
        toast.success('Book deleted successfully');
        await loadBooks();
      } else {
        toast.error(response?.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast.error('Failed to delete book');
    }
  };

  const handleUpdateStatus = async (bookId: string, isActive: boolean) => {
    try {
      const response = await libraryApi.updateBook(bookId, { isActive });
      if (response?.success) {
        toast.success(`Book ${isActive ? 'activated' : 'deactivated'} successfully`);
        await loadBooks();
      } else {
        toast.error(response?.message || 'Failed to update book status');
      }
    } catch (error) {
      console.error('Failed to update book status:', error);
      toast.error('Failed to update book status');
    }
  };

  const handleUpdateCopies = async (bookId: string, totalCopies: number) => {
    try {
      const response = await libraryApi.updateBookCopies(bookId, {
        totalCopies,
        operation: 'set',
      });
      if (response?.success) {
        toast.success('Book copies updated successfully');
        await loadBooks();
      } else {
        toast.error(response?.message || 'Failed to update book copies');
      }
    } catch (error) {
      console.error('Failed to update book copies:', error);
      toast.error('Failed to update book copies');
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your library...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your book collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Book Management</h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Manage your library&apos;s book collection efficiently with our intuitive dashboard
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl w-full lg:w-auto justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-semibold text-lg">Add New Book</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <BookStats summary={summary} />

        {/* Filters */}
        <BookFiltersComponent 
          filters={filters} 
          onFiltersChange={setFilters}
        />

        {/* Books Grid */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Library Collection
              </h2>
              <p className="text-gray-600 mt-1">
                {books.length} books • Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
                Total: {pagination.total} books
              </div>
            </div>
          </div>
          
          <BookGrid
            books={books}
            onDeleteBook={handleDeleteBook}
            onUpdateStatus={handleUpdateStatus}
            onUpdateCopies={handleUpdateCopies}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Add Book Modal */}
        <AddBookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddBook={handleAddBook}
        />
      </div>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}