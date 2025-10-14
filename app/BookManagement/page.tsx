'use client';
import { useState, useEffect } from 'react';
import { Book, BookFilters } from './book';
import { libraryApi } from '@/lib/api';
import BookGrid from './components/BookGrid';
import BookFiltersComponent from './components/BookFilters';
import BookStats from './components/BookStats';
import AddBookModal from './components/AddBookModal';
import { toast } from 'react-hot-toast';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    limit: 20,
  });
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

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await libraryApi.getBooks(filters);
      
      if (response.success) {
        setBooks(response.data);
        setFilteredBooks(response.data);
        setPagination(response.pagination);
        setSummary(response.summary);
      }
    } catch (error) {
      console.error('Failed to load books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (newBook: any) => {
    try {
      const response = await libraryApi.createBook(newBook);
      if (response.success) {
        toast.success('Book created successfully');
        setIsAddModalOpen(false);
        loadBooks(); // Reload to get the updated list
      }
    } catch (error) {
      console.error('Failed to create book:', error);
      toast.error('Failed to create book');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await libraryApi.deleteBook(bookId);
      if (response.success) {
        toast.success('Book deleted successfully');
        loadBooks(); // Reload to get the updated list
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast.error('Failed to delete book');
    }
  };

  const handleUpdateStatus = async (bookId: string, isActive: boolean) => {
    try {
      const response = await libraryApi.updateBook(bookId, { isActive });
      if (response.success) {
        toast.success(`Book ${isActive ? 'activated' : 'deactivated'} successfully`);
        loadBooks(); // Reload to get the updated list
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
        operation: 'set'
      });
      if (response.success) {
        toast.success('Book copies updated successfully');
        loadBooks(); // Reload to get the updated list
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
                Manage your library's book collection efficiently
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 shadow-sm hover:shadow-md"
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
          <div className="flex justify-between items-center mb-4">
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
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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