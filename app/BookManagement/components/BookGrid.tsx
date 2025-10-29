import { Book } from '../book';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  onDeleteBook: (bookId: string) => void;
  onUpdateStatus: (bookId: string, isActive: boolean) => void;
  onUpdateCopies: (bookId: string, totalCopies: number) => void;
}

export default function BookGrid({ books, onDeleteBook, onUpdateStatus, onUpdateCopies }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No books found</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          We couldn&apos;t find any books matching your search criteria. Try adjusting your filters or search terms.
        </p>
        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Check your search terms</p>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Adjust your filters</p>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Try different categories</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          onDelete={onDeleteBook}
          onUpdateStatus={onUpdateStatus}
          onUpdateCopies={onUpdateCopies}
        />
      ))}
    </div>
  );
}