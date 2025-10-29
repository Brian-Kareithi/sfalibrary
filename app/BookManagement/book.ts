// Add this interface for Loan data
interface Loan {
  id: string;
  bookId: string;
  borrowerId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  renewalCount: number;
  fineAmount: number;
  finePaidAmount: number;
  fineWaivedAmount: number;
  condition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  notes?: string;
  borrower?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  format: 'PHYSICAL' | 'DIGITAL';
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  reservedCopies: number;
  location: string;
  publicationYear: number;
  edition: string;
  language: string;
  pages: number;
  deweyDecimal?: string;
  maxBorrowDays: number;
  maxRenewals: number;
  isReservable: boolean;
  dailyFineAmount: number;
  maxFineAmount: number;
  coverImageUrl?: string;
  description: string;
  isActive: boolean;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    name: string;
    email?: string;
  };
  loans?: Loan[]; // Fixed: Replaced any[] with Loan[]
  _count?: {
    loans: number;
  };
}

export interface BookFilters {
  category?: string;
  format?: string;
  author?: string;
  isbn?: string;
  barcode?: string;
  location?: string;
  publicationYear?: number;
  available?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookResponse {
  success: boolean;
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
    borrowedCopies: number;
  };
  message: string;
}

export interface SingleBookResponse {
  success: boolean;
  data: Book;
  message: string;
}

export interface CreateBookRequest {
  isbn?: string;
  title: string;
  author: string;
  publisher?: string;
  category: string;
  format: 'PHYSICAL' | 'DIGITAL';
  totalCopies: number;
  location?: string;
  publicationYear?: number;
  edition?: string;
  language?: string;
  pages?: number;
  deweyDecimal?: string;
  maxBorrowDays?: number;
  maxRenewals?: number;
  isReservable?: boolean;
  dailyFineAmount?: number;
  maxFineAmount?: number;
  description?: string;
  coverImageUrl?: string;
  barcode?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  publisher?: string;
  category?: string;
  format?: 'PHYSICAL' | 'DIGITAL';
  totalCopies?: number;
  location?: string;
  publicationYear?: number;
  edition?: string;
  language?: string;
  pages?: number;
  deweyDecimal?: string;
  maxBorrowDays?: number;
  maxRenewals?: number;
  isReservable?: boolean;
  dailyFineAmount?: number;
  maxFineAmount?: number;
  description?: string;
  coverImageUrl?: string;
  isActive?: boolean;
}

export interface UpdateCopiesRequest {
  totalCopies: number;
  operation: 'add' | 'subtract' | 'set';
}