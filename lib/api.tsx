import { toast } from 'react-hot-toast';

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  role: 'ADMIN' | 'STUDENT' | 'TEACHER' | 'LIBRARIAN' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  registrationNumber: string;
  profileCompleted: boolean;
  lastLoginAt: string;
  createdAt: string;
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
  coverImageUrl: string;
  description: string;
  barcode?: string;
  isActive: boolean;
  createdAt: string;
  creator?: {
    name: string;
    email?: string;
  };
  loans?: Loan[];
  _count?: {
    loans: number;
  };
}

export interface Loan {
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
    name: string;
    email: string;
    role: string;
    studentProfile?: {
      admissionNumber: string;
      parentContacts?: Array<{
        name: string;
        email: string;
        phone: string;
      }>;
    };
  };
  book?: {
    title: string;
    author: string;
    isbn: string;
    format: string;
    dailyFineAmount?: number;
    coverImageUrl?: string;
    fileUrl?: string;
    accessUrl?: string;
  };
  issuedBy?: {
    name: string;
  };
  returnedBy?: {
    name: string;
  };
}

export interface UserBorrowingStatus {
  canBorrow: boolean;
  currentlyBorrowed: number;
  maxAllowed: number;
  remainingAllowed: number;
  hasFines: boolean;
  fineAmount: number;
  borrowingEnabled: boolean;
  message: string;
}

export interface FineDetail {
  id: string;
  fineAmount: number;
  finePaidAmount: number;
  fineWaivedAmount: number;
  returnDate: string;
  book: {
    title: string;
    author: string;
  };
}

export interface UserFines {
  totalFineAmount: number;
  calculatedFineAmount: number;
  fineDetails: FineDetail[];
}

export interface LibraryStats {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  totalMembers?: number;
  activeBorrows?: number;
  overdueBooks?: number;
  totalGenres?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: LibraryStats;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: LibraryStats;
}

export interface AuthResponse {
  message: string;
  success: boolean;
  token: string;
  user: User;
}

export interface BulkImportResult {
  successful: number;
  failed: number;
  errors: string[];
}

export interface CopyUpdateRequest {
  totalCopies: number;
  operation: 'add' | 'subtract' | 'set';
}

export interface BorrowRequest {
  borrowerId: string;
  dueDate?: string;
  notes?: string;
}

export interface ReturnRequest {
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  notes?: string;
}

export interface FineUpdateRequest {
  fineAmount?: number;
  paidAmount?: number;
  waivedAmount?: number;
  notes?: string;
}

// Loan-specific interfaces from the provided code
export interface BorrowingStatus {
  canBorrow: boolean;
  currentlyBorrowed: number;
  maxAllowed: number;
  remainingAllowed: number;
  hasFines: boolean;
  fineAmount: number;
  borrowingEnabled: boolean;
  message: string;
}

export interface LoanFilters {
  page?: number;
  limit?: number;
  status?: string;
  borrowerId?: string;
  bookId?: string;
  overdue?: boolean;
}

export interface BorrowBookRequest {
  borrowerId: string;
  dueDate?: string;
  notes?: string;
}

export interface ReturnBookRequest {
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  notes?: string;
}

export interface RenewLoanRequest {
  newDueDate?: string;
}

export interface LoanResponse {
  success: boolean;
  data: Loan[];
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleLoanResponse {
  success: boolean;
  data: Loan;
  message: string;
}

// New interfaces for students and classes
export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  classId?: string;
  streamId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  profileCompleted: boolean;
  createdAt: string;
}

export interface ClassResponse {
  id: string;
  name: string;
  level: string;
  stream?: string;
  capacity: number;
  currentEnrollment: number;
  isActive: boolean;
  createdAt: string;
}

export interface GetClassesResponse {
  classes: ClassResponse[];
  total: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://steadfast-system-copy-production.up.railway.app/api';

class LibraryApiClient {
  private token: string | null = null;

  constructor() {
    // Safe localStorage access for Next.js
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      if (headers instanceof Headers) {
        headers.set('Authorization', `Bearer ${this.token}`);
      } else if (Array.isArray(headers)) {
        headers.push(['Authorization', `Bearer ${this.token}`]);
      } else {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle HTTP errors first
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access forbidden. Please check your permissions.');
        }
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Authentication required. Please log in again.');
        }
        if (response.status === 404) {
          throw new Error('Resource not found.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // For successful non-JSON responses, return a generic success response
        return {
          success: true,
          message: 'Request completed successfully',
          data: {} as T
        };
      }

      const data = await response.json();

      // Check if the API response indicates an error
      if (data.success === false) {
        throw new Error(data.message || 'API request failed');
      }

      return data;

    } catch (error) {
      console.error('API Request Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      // Only show toast for non-authentication errors
      if (!errorMessage.includes('403') && !errorMessage.includes('401') && !errorMessage.includes('forbidden')) {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${errorText}`);
    }

    const result = await response.json();

    if (result.success && result.token && result.user) {
      const token = result.token.replace(/^Bearer\s+/i, '');
      this.setToken(token);

      return {
        success: result.success,
        token,
        user: result.user,
        message: result.message || '',
      };
    } else {
      throw new Error(result.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // User Management
  async getMe(): Promise<ApiResponse<User>> {
    return this.request('/users/me');
  }

  async updateMe(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // 📚 Book Management

  // Get all books with pagination and filtering
  async getBooks(params?: {
    page?: number;
    limit?: number;
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
    sortOrder?: string;
  }): Promise<ApiResponse<PaginatedResponse<Book>>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request(`/library/books?${queryString}`);
  }

  // Get single book by ID
  async getBookById(bookId: string): Promise<ApiResponse<Book>> {
    return this.request(`/library/books/${bookId}`);
  }

  // Create a new book
  async createBook(bookData: {
    isbn: string;
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
  }): Promise<ApiResponse<Book>> {
    return this.request('/library/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  // Update book details
  async updateBook(bookId: string, updates: Partial<Book>): Promise<ApiResponse<Book>> {
    return this.request(`/library/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Delete book (soft delete)
  async deleteBook(bookId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/library/books/${bookId}`, {
      method: 'DELETE',
    });
  }

  // Update book copies
  async updateBookCopies(bookId: string, request: CopyUpdateRequest): Promise<ApiResponse<Book>> {
    return this.request(`/library/books/${bookId}/copies`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  // Bulk import books
  async bulkImportBooks(books: Array<{
    isbn: string;
    title: string;
    author: string;
    category: string;
    totalCopies: number;
    publisher?: string;
    publicationYear?: number;
    language?: string;
  }>): Promise<ApiResponse<BulkImportResult>> {
    return this.request('/library/books/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ books }),
    });
  }

  // 🔄 Loan Management

  // Borrow a book
  async borrowBook(bookId: string, borrowRequest: BorrowRequest): Promise<ApiResponse<Loan>> {
    return this.request(`/library/books/${bookId}/borrow`, {
      method: 'POST',
      body: JSON.stringify(borrowRequest),
    });
  }

  // Return a book
  async returnBook(loanId: string, returnRequest: ReturnRequest): Promise<ApiResponse<Loan>> {
    return this.request(`/library/loans/${loanId}/return`, {
      method: 'PUT',
      body: JSON.stringify(returnRequest),
    });
  }

  // Renew a loan
  async renewLoan(loanId: string, newDueDate?: string): Promise<ApiResponse<Loan>> {
    const body = newDueDate ? { newDueDate } : {};
    return this.request(`/library/loans/${loanId}/renew`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // Get all loans
  async getLoans(params?: LoanFilters): Promise<ApiResponse<PaginatedResponse<Loan>>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request(`/library/loans?${queryString}`);
  }

  // Get active loans
  async getActiveLoans(params?: LoanFilters): Promise<ApiResponse<PaginatedResponse<Loan>>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request(`/library/loans/active?${queryString}`);
  }

  // Get overdue loans
  async getOverdueLoans(): Promise<ApiResponse<Loan[]>> {
    return this.request('/library/loans/overdue');
  }

  // Update fine for a loan
  async updateFine(loanId: string, fineUpdate: FineUpdateRequest): Promise<ApiResponse<Loan>> {
    return this.request(`/library/loans/${loanId}/fine`, {
      method: 'PUT',
      body: JSON.stringify(fineUpdate),
    });
  }

  // 👤 User Management

  // Get user borrowing status
  async getUserBorrowingStatus(userId: string): Promise<ApiResponse<UserBorrowingStatus>> {
    return this.request(`/library/users/${userId}/borrowing-status`);
  }

  // Get user loans
  async getUserLoans(userId: string, status?: string): Promise<ApiResponse<Loan[]>> {
    const query = status ? `?status=${status}` : '';
    return this.request(`/library/users/${userId}/loans${query}`);
  }

  // Get user loan history
  async getUserLoanHistory(userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Loan>>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request(`/library/users/${userId}/history?${queryString}`);
  }

  // Get user fines
  async getUserFines(userId: string): Promise<ApiResponse<UserFines>> {
    return this.request(`/library/users/${userId}/fines`);
  }

  // 🔍 Search & Discovery

  // Search books
  async searchBooks(query: string, filters?: {
    category?: string;
    format?: string;
    author?: string;
    available?: boolean;
  }): Promise<ApiResponse<Book[]>> {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/library/search?${searchParams.toString()}`);
  }

  // Get popular books
  async getPopularBooks(limit: number = 10): Promise<ApiResponse<Book[]>> {
    return this.request(`/library/popular?limit=${limit}`);
  }

  // Get new arrivals
  async getNewArrivals(limit: number = 10): Promise<ApiResponse<Book[]>> {
    return this.request(`/library/new-arrivals?limit=${limit}`);
  }

  // Get categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request('/library/categories');
  }

  // Get authors
  async getAuthors(): Promise<ApiResponse<string[]>> {
    return this.request('/library/authors');
  }

  // Get library dashboard data
  async getDashboard(): Promise<ApiResponse<{
    stats: LibraryStats;
    recentActivity: any[];
    popularBooks: Book[];
    overdueBooks: Loan[];
  }>> {
    return this.request('/library/dashboard');
  }

  // Get statistics
  async getStatistics(): Promise<ApiResponse<LibraryStats>> {
    return this.request('/library/statistics');
  }

  // Get usage report
  async getUsageReport(params?: {
    startDate?: string;
    endDate?: string;
    reportType?: string;
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request(`/library/usage-report?${queryString}`);
  }

  // ⚙️ Settings

  // Get library settings
  async getSettings(): Promise<ApiResponse<any>> {
    return this.request('/library/settings');
  }

  // Update library settings
  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    return this.request('/library/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // File Upload (for book covers)
  async uploadBookCover(bookId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('cover', file);

    // Create headers without Content-Type for FormData
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/library/books/${bookId}/cover`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Export books
  async exportBooks(format: 'csv' | 'json' = 'json'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.request(`/library/books/export?format=${format}`);
  }

  // Additional loan methods from the provided code
  async getBorrowingStatus(userId: string): Promise<ApiResponse<BorrowingStatus>> {
    return this.request(`/library/users/${userId}/borrowing-status`);
  }

  // Enhanced loan methods with proper typing
  async borrowBookWithRequest(bookId: string, borrowData: BorrowBookRequest): Promise<ApiResponse<Loan>> {
    return this.request(`/library/books/${bookId}/borrow`, {
      method: 'POST',
      body: JSON.stringify(borrowData),
    });
  }

  async returnBookWithRequest(loanId: string, returnData: ReturnBookRequest): Promise<ApiResponse<Loan>> {
    return this.request(`/library/loans/${loanId}/return`, {
      method: 'PUT',
      body: JSON.stringify(returnData),
    });
  }

  async renewLoanWithRequest(loanId: string, renewData?: RenewLoanRequest): Promise<ApiResponse<Loan>> {
    return this.request(`/library/loans/${loanId}/renew`, {
      method: 'PUT',
      body: JSON.stringify(renewData || {}),
    });
  }

  // Get user fines with enhanced response
  async getUserFinesEnhanced(userId: string): Promise<ApiResponse<{ totalFineAmount: number; calculatedFineAmount: number; fineDetails: any[] }>> {
    return this.request(`/library/users/${userId}/fines`);
  }

  // 🎓 Academic Management - New Methods

  // Get students with optional filtering
  async getStudents(params?: { 
    classId?: string; 
    streamId?: string | undefined; 
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ students: StudentResponse[] }>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request(`/students?${queryString}`);
  }

  // Get classes
  async getClasses(): Promise<ApiResponse<GetClassesResponse>> {
    return this.request('/academics/classes');
  }
}

// Create instances
const libraryApi = new LibraryApiClient();
const api = new LibraryApiClient();

// Export the loanApi equivalent functionality
export const loanApi = {
  // Get all loans (for librarians/admins)
  async getLoans(filters: LoanFilters = {}): Promise<LoanResponse> {
    return libraryApi.getLoans(filters) as Promise<LoanResponse>;
  },

  // Get active loans
  async getActiveLoans(filters: LoanFilters = {}): Promise<LoanResponse> {
    return libraryApi.getActiveLoans(filters) as Promise<LoanResponse>;
  },

  // Get overdue loans
  async getOverdueLoans(): Promise<LoanResponse> {
    const response = await libraryApi.getOverdueLoans();
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },

  // Get user's borrowing status
  async getBorrowingStatus(userId: string): Promise<{ success: boolean; data: BorrowingStatus; message: string }> {
    const response = await libraryApi.getUserBorrowingStatus(userId);
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },

  // Get user's loans
  async getUserLoans(userId: string, status?: string): Promise<LoanResponse> {
    const response = await libraryApi.getUserLoans(userId, status);
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },

  // Get user's loan history
  async getUserLoanHistory(userId: string, page: number = 1, limit: number = 20): Promise<LoanResponse> {
    const response = await libraryApi.getUserLoanHistory(userId, { page, limit });
    return {
      success: response.success,
      data: response.data.data || response.data,
      message: response.message,
      pagination: response.data.pagination
    };
  },

  // Borrow a book
  async borrowBook(bookId: string, borrowData: BorrowBookRequest): Promise<SingleLoanResponse> {
    const response = await libraryApi.borrowBookWithRequest(bookId, borrowData);
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },

  // Return a book
  async returnBook(loanId: string, returnData: ReturnBookRequest): Promise<SingleLoanResponse> {
    const response = await libraryApi.returnBookWithRequest(loanId, returnData);
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },

  // Renew a loan
  async renewLoan(loanId: string, renewData?: RenewLoanRequest): Promise<SingleLoanResponse> {
    const response = await libraryApi.renewLoanWithRequest(loanId, renewData);
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },

  // Get user fines
  async getUserFines(userId: string): Promise<{ success: boolean; data: { totalFineAmount: number; calculatedFineAmount: number; fineDetails: any[] }; message: string }> {
    const response = await libraryApi.getUserFinesEnhanced(userId);
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },

  // Update fine
  async updateFine(loanId: string, fineData: { fineAmount?: number; paidAmount?: number; waivedAmount?: number; notes?: string }): Promise<SingleLoanResponse> {
    const response = await libraryApi.updateFine(loanId, fineData);
    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  },
};

export { libraryApi, api };