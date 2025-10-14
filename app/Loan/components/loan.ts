export interface Loan {
  id: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  renewalCount: number;
  fineAmount: number;
  finePaidAmount: number;
  fineWaivedAmount: number;
  condition?: string;
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
}