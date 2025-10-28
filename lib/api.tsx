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
  updatedAt: string;
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
  books?: T[];
  items?: T[];
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

export interface IssueBookRequest {
  bookId: string;
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

export interface LoanFilters {
  page?: number;
  limit?: number;
  status?: string;
  borrowerId?: string;
  bookId?: string;
  overdue?: boolean;
}

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
  streams?: Array<{ id: string; name: string }>;
}

export interface ClassOption {
  value: string;
  label: string;
  streams?: Array<{ id: string; name: string }>;
}

export interface GetClassesResponse {
  classes: ClassResponse[];
  total: number;
  data?: {
    classes?: ClassResponse[];
    dropdown?: ClassOption[];
  };
  dropdown?: ClassOption[];
  getClassesResponse?: {
    classes?: ClassResponse[];
  };
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
  book?: {
    title: string;
    isbn: string;
  };
}

export interface DashboardData {
  stats: LibraryStats;
  recentActivity: RecentActivity[];
  popularBooks: Book[];
  overdueBooks: Loan[];
}

export interface UsageReport {
  period: string;
  totalBorrows: number;
  totalReturns: number;
  totalFines: number;
  mostBorrowedBooks: Book[];
  activeUsers: User[];
}

export interface LibrarySettings {
  maxBooksPerUser: number;
  maxBorrowDays: number;
  maxRenewals: number;
  dailyFineAmount: number;
  maxFineAmount: number;
  reservationDuration: number;
  allowDigitalBorrows: boolean;
  allowPhysicalBorrows: boolean;
  autoCalculateFines: boolean;
  notifyOnOverdue: boolean;
}

export interface CreateBookRequest {
  isbn?: string;
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
  barcode?: string;
}

export interface BookFilters {
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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://steadfast-system-copy-production.up.railway.app/api';

class LibraryApiClient {
  private token: string | null = null;

  constructor() {
    this.initializeToken();
  }

  private initializeToken() {
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
      localStorage.removeItem('user');
    }
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('token');
      if (currentToken && currentToken !== this.token) {
        this.token = currentToken;
      }
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    
    const baseHeaders = this.getAuthHeaders();
    const headers = {
      ...baseHeaders,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}:`, errorText);
        
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Authentication required. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('Access forbidden. Please check your permissions.');
        }
        if (response.status === 404) {
          throw new Error('Resource not found.');
        }
        if (response.status === 400) {
          throw new Error(`Bad request: ${errorText || 'Invalid request format'}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        return {
          success: true,
          message: 'Request completed successfully',
          data: textResponse as unknown as T
        };
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || 'API request failed');
      }

      return data;

    } catch (error) {
      console.error('API Request Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      if (!errorMessage.includes('Authentication required') && !errorMessage.includes('401')) {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
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
          message: result.message || 'Login successful',
        };
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // User Management
  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  async updateMe(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Book Management
  async getBooks(params?: BookFilters): Promise<ApiResponse<PaginatedResponse<Book>>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request<PaginatedResponse<Book>>(`/library/books?${queryString}`);
  }

  async getBookById(bookId: string): Promise<ApiResponse<Book>> {
    return this.request<Book>(`/library/books/${bookId}`);
  }

  async createBook(bookData: CreateBookRequest): Promise<ApiResponse<Book>> {
    return this.request<Book>('/library/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(bookId: string, updates: Partial<Book>): Promise<ApiResponse<Book>> {
    return this.request<Book>(`/library/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBook(bookId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/library/books/${bookId}`, {
      method: 'DELETE',
    });
  }

  async updateBookCopies(bookId: string, request: CopyUpdateRequest): Promise<ApiResponse<Book>> {
    return this.request<Book>(`/library/books/${bookId}/copies`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

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
    return this.request<BulkImportResult>('/library/books/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ books }),
    });
  }

  // Loan Management
  async issueBook(bookId: string, borrowRequest: BorrowRequest): Promise<ApiResponse<Loan>> {
    const payload = {
      bookId,
      ...borrowRequest
    };

    return this.request<Loan>('/library/loans/issue', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async borrowBook(bookId: string, borrowRequest: BorrowRequest): Promise<ApiResponse<Loan>> {
    return this.request<Loan>(`/library/books/${bookId}/borrow`, {
      method: 'POST',
      body: JSON.stringify(borrowRequest),
    });
  }

  async returnBook(loanId: string, returnRequest: ReturnRequest): Promise<ApiResponse<Loan>> {
    return this.request<Loan>(`/library/loans/${loanId}/return`, {
      method: 'PUT',
      body: JSON.stringify(returnRequest),
    });
  }

  async renewLoan(loanId: string, newDueDate?: string): Promise<ApiResponse<Loan>> {
    const body = newDueDate ? { newDueDate } : {};
    return this.request<Loan>(`/library/loans/${loanId}/renew`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

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
    return this.request<PaginatedResponse<Loan>>(`/library/loans?${queryString}`);
  }

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
    return this.request<PaginatedResponse<Loan>>(`/library/loans/active?${queryString}`);
  }

  async getOverdueLoans(): Promise<ApiResponse<Loan[]>> {
    return this.request<Loan[]>('/library/loans/overdue');
  }

  async updateFine(loanId: string, fineUpdate: FineUpdateRequest): Promise<ApiResponse<Loan>> {
    return this.request<Loan>(`/library/loans/${loanId}/fine`, {
      method: 'PUT',
      body: JSON.stringify(fineUpdate),
    });
  }

  // User Management
  async getUserBorrowingStatus(userId: string): Promise<ApiResponse<UserBorrowingStatus>> {
    return this.request<UserBorrowingStatus>(`/library/users/${userId}/borrowing-status`);
  }

  async getUserLoans(userId: string, status?: string): Promise<ApiResponse<Loan[]>> {
    const query = status ? `?status=${status}` : '';
    return this.request<Loan[]>(`/library/users/${userId}/loans${query}`);
  }

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
    return this.request<PaginatedResponse<Loan>>(`/library/users/${userId}/history?${queryString}`);
  }

  async getUserFines(userId: string): Promise<ApiResponse<UserFines>> {
    return this.request<UserFines>(`/library/users/${userId}/fines`);
  }

  // Search & Discovery
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

    return this.request<Book[]>(`/library/search?${searchParams.toString()}`);
  }

  async getPopularBooks(limit: number = 10): Promise<ApiResponse<Book[]>> {
    return this.request<Book[]>(`/library/popular?limit=${limit}`);
  }

  async getNewArrivals(limit: number = 10): Promise<ApiResponse<Book[]>> {
    return this.request<Book[]>(`/library/new-arrivals?limit=${limit}`);
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/library/categories');
  }

  async getAuthors(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/library/authors');
  }

  // Dashboard
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.request<DashboardData>('/library/dashboard');
  }

  async getStatistics(): Promise<ApiResponse<LibraryStats>> {
    return this.request<LibraryStats>('/library/statistics');
  }

  async getUsageReport(params?: {
    startDate?: string;
    endDate?: string;
    reportType?: string;
  }): Promise<ApiResponse<UsageReport>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }

    const queryString = query.toString();
    return this.request<UsageReport>(`/library/usage-report?${queryString}`);
  }

  // Settings
  async getSettings(): Promise<ApiResponse<LibrarySettings>> {
    return this.request<LibrarySettings>('/library/settings');
  }

  async updateSettings(settings: LibrarySettings): Promise<ApiResponse<LibrarySettings>> {
    return this.request<LibrarySettings>('/library/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // File Upload
  async uploadBookCover(bookId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('cover', file);

    const headers: HeadersInit = { ...this.getAuthHeaders() };
    delete (headers as Record<string, string>)['Content-Type'];

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
    return this.request<{ downloadUrl: string }>(`/library/books/export?format=${format}`);
  }

  // Academic Management
  async getStudents(params?: { 
    classId?: string; 
    streamId?: string; 
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
    return this.request<{ students: StudentResponse[] }>(`/students?${queryString}`);
  }

  async getClasses(): Promise<ApiResponse<GetClassesResponse>> {
    return this.request<GetClassesResponse>('/academics/classes');
  }
}

// Create and export single instance
export const libraryApi = new LibraryApiClient();