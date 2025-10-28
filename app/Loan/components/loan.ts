// Core Loan and related types
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
  borrower: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    studentProfile?: {
      admissionNumber: string;
      parentContacts?: Array<{
        name: string;
        email: string;
        phone: string;
      }>;
    };
  };
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    format: 'PHYSICAL' | 'DIGITAL';
    coverImageUrl?: string;
    dailyFineAmount: number;
    maxRenewals?: number;
    accessUrl?: string;
  };
  issuedBy?: {
    name: string;
    email: string;
  };
  returnedBy?: {
    name: string;
    email: string;
  };
}

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
  status?: string;
  page?: number;
  limit?: number;
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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  count?: number;
  message: string;
}

export interface SingleLoanResponse {
  success: boolean;
  data: Loan;
  message: string;
}

// Academic types for student filtering
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
  studentProfile?: {
    admissionNumber: string;
    class?: {
      name: string;
      level: string;
    };
  };
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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClassDropdown {
  value: string;
  label: string;
  level?: string;
  stream?: string;
}

export interface StudentsResponse {
  success: boolean;
  data: {
    students: StudentResponse[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  classId?: string;
  streamId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  profileCompleted: boolean;
  createdAt: string;
  currentClassId?: string;
  currentStreamId?: string;
  currentClass?: {
    id: string;
    name: string;
    level: string;
    stream?: string;
  };
  studentProfile?: {
    admissionNumber: string;
    class?: {
      id: string;
      name: string;
      level: string;
    };
  };
}

export interface Class {
  id: string;
  name: string;
  level: string;
  stream?: string;
  capacity: number;
  currentEnrollment: number;
  isActive: boolean;
  createdAt: string;
}

export interface StudentsFilters {
  classId?: string;
  streamId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ClassesResponse {
  success: boolean;
  data: GetClassesResponse;
  message: string;
}

export interface SingleStudentResponse {
  success: boolean;
  data: Student;
  message: string;
}

export interface SingleClassResponse {
  success: boolean;
  data: Class;
  message: string;
}

// Extended interfaces for UI components
export interface StudentWithClassInfo extends Student {
  currentClass?: {
    id: string;
    name: string;
    level: string;
    stream?: string;
  };
  className?: string;
  streamName?: string;
}

export interface ClassWithDropdown extends Class {
  dropdown?: ClassDropdown;
}

// Response types for dropdown data
export interface ClassesDropdownResponse {
  success: boolean;
  data: {
    classes: ClassDropdown[];
    total: number;
  };
  message: string;
}

// Extended GetClassesResponse with dropdown support
export interface ExtendedGetClassesResponse extends GetClassesResponse {
  dropdown?: ClassDropdown[];
}

// Extended Student with current class info
export interface ExtendedStudent extends Student {
  currentClassId?: string;
  currentStreamId?: string;
  currentClass?: {
    id: string;
    name: string;
    level: string;
    stream?: string;
  };
}

// Additional utility types for better type safety
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Additional loan-related types specific to components
export interface LoanTableProps {
  loans: Loan[];
  loading: boolean;
  onReturnClick: (loan: Loan) => void;
  onRenewClick: (loan: Loan) => void;
  activeTab: 'all' | 'active' | 'overdue';
}

export interface LoanStatsProps {
  loans: Loan[];
  activeTab: 'all' | 'active' | 'overdue';
}

export interface BorrowBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ReturnBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loan: Loan | null;
}

// Extended interfaces for additional functionality
export interface LoanWithDetails extends Loan {
  isOverdue?: boolean;
  daysOverdue?: number;
}

export interface LoanSummary {
  total: number;
  active: number;
  overdue: number;
  returned: number;
}

// Book related types
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

// User related types
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

export interface AuthResponse {
  message: string;
  success: boolean;
  token: string;
  user: User;
}

// Library management types
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

export interface FineUpdateRequest {
  fineAmount?: number;
  paidAmount?: number;
  waivedAmount?: number;
  notes?: string;
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