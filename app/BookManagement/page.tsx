'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Book, BookFilters, CreateBookRequest } from './book';
import { libraryApi } from '@/lib/api';
import BookGrid from './components/BookGrid';
import BookFiltersComponent from './components/BookFilters';
import BookStats from './components/BookStats';
import AddBookModal from './components/AddBookModal';

// Define a more flexible interface for API responses
interface ApiBookResponse {
  data?: Book[];
  books?: Book[];
  items?: Book[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
    borrowedCopies: number;
  };
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
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

      // Handle response safely
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to load books');
      }

      const responseData = response.data;
      
      // Handle different possible response structures with proper type checking
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

      if (Array.isArray(responseData)) {
        // If response.data is directly an array
        booksData = responseData;
        paginationData.total = booksData.length;
        paginationData.totalPages = Math.ceil(booksData.length / paginationData.limit);
        summaryData.totalBooks = booksData.length;
      } else if (responseData && typeof responseData === 'object') {
        // If response.data is an object with nested structure - use proper type checking
        const data = responseData as ApiBookResponse;
        
        // Safely extract books data using proper type checking
        if (data.data && Array.isArray(data.data)) {
          booksData = data.data;
        } else if (data.books && Array.isArray(data.books)) {
          booksData = data.books;
        } else if (data.items && Array.isArray(data.items)) {
          booksData = data.items;
        } else {
          booksData = [];
        }
        
        // Handle pagination from response
        if (data.pagination) {
          paginationData = { ...paginationData, ...data.pagination };
        } else {
          paginationData.total = booksData.length;
          paginationData.totalPages = Math.ceil(booksData.length / paginationData.limit);
        }

        // Handle summary from response
        if (data.summary) {
          summaryData = { ...summaryData, ...data.summary };
        } else {
          summaryData.totalBooks = booksData.length;
        }
      }

      // Calculate summary if not provided
      if (summaryData.totalBooks === 0) {
        summaryData.totalBooks = booksData.length;
        summaryData.totalCopies = booksData.reduce((sum, book) => sum + (book.totalCopies || 0), 0);
        summaryData.availableCopies = booksData.reduce((sum, book) => sum + (book.availableCopies || 0), 0);
        summaryData.borrowedCopies = booksData.reduce((sum, book) => sum + (book.borrowedCopies || 0), 0);
      }

      setBooks(booksData);
      setFilteredBooks(booksData);
      setPagination(paginationData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load books:', error);
      toast.error('Failed to load books');
      setBooks([]);
      setFilteredBooks([]);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage your library&apos;s book collection efficiently
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center space-x-2 sm:space-x-3 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add New Book</span>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Books ({filteredBooks.length})
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredBooks.length} of {pagination.total} books
            </p>
          </div>
          <BookGrid
            books={filteredBooks}
            onDeleteBook={handleDeleteBook}
            onUpdateStatus={handleUpdateStatus}
            onUpdateCopies={handleUpdateCopies}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700 px-4 py-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
              Next
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
    </div>
  );
}