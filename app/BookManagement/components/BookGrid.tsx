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
      <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm border border-gray-200">
        <svg className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
        <p className="text-gray-500 max-w-sm mx-auto px-4">
          Try adjusting your search criteria or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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