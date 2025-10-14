import {toast} from 'react-hot-toast'
import { SetStateAction } from 'react';

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
export interface Grade {
    // Define the structure of a Grade object
    [key: string]: any; 
}
export interface Course {
  id: string;                // Unique identifier (UUID)
  courseCode: string;        // e.g., "MATH101"
  name: string;              // e.g., "Basic Mathematics"
  description: string;       // Course description
  credits: number;           // Number of credits
  subjectId: string;         // UUID of the related subject
  classId: string;           // UUID of the class
  teacherId: string;         // UUID of the teacher
  departmentId?: string;     // Optional UUID of the department
  createdAt: string;         // Timestamp of creation
  updatedAt: string;         // Timestamp of last update
}

export type StudentResponse = {
  id: string;
  userId: string;
  admissionNumber: string;
  academicStatus: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    status: string;
    createdAt: string;
  };
};

export interface Notification {
    // Define the structure of a Notification object
    [key: string]: any;
}

export interface Resource {
    // Define the structure of a Resource object
    [key: string]: any;
}

export interface AssignmentSubmission {
    assignmentId: string;
    submissionText: string;
}

export interface Dashboard {
    // Define the structure of a Dashboard object
    [key: string]: any;
}

export interface AuthResponse{
    message:string;
    success:boolean;
    token:string;
    user: User;

}

// Define a generic ApiResponse interface
export interface ApiResponse<T> {
    user(user: any): unknown;
    success: boolean;
    message: string;
    data: T;
}
interface CreateAssignmentPayload {
  subjectId: string;        // The subject for which the assignment is created
  title?: string;           // Optional assignment title
  description?: string;     // Optional assignment description/text
  dueDate?: string;         // Optional due date in ISO format
}
export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  isCore?: boolean | null;
  _count?: {
    classSubjects: number;
    assignments: number;
    exams: number;
    strands: number;
  };
}

export interface StudentProgress {
  startedAt(startedAt: any): import("react").ReactNode;
  id: string;
  studentId: string;
  teacherId: string;
  classId: string;
  streamId?: string;
  progressType: "RECITATION" | "MEMORIZATION" | "UNDERSTANDING" | "REVISION";
  currentSurahId: number;
  currentJuzId: number;
  currentAyahNumber?: number;
  recitationProgress?: number;
  memorizationProgress?: number;
  understandingProgress?: number;
  recitationQuality?: number;
  memorizationQuality?: number;
  understandingQuality?: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVIEW" | "PAUSED";
  lastAssessedAt?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  student?: {
    user: {
      name: string;
    };
  };

  currentSurah?: {
    id: number;
    number: number;
    name: string;
    arabicName: string;
    totalAyahs: number;
    revelationType: "MECCAN" | "MEDINAN";
    juzId: number;
  };

  currentJuz?: {
    id: number;
    number: number;
    name: string;
  };
}
export interface Assessment {
  id: string;
  studentId: string;
  teacherId: string;
  progressId: string;
  surahId?: number;
  juzId?: number;
  fromAyah?: number;
  toAyah?: number;
  assessmentType:
    | "DAILY_CHECK"
    | "WEEKLY_REVIEW"
    | "MONTHLY_ASSESSMENT"
    | "TERM_EVALUATION"
    | "PROGRESS_TEST"
    | "REVISION_CHECK";
  assessmentDate: string;
  recitationScore?: number;
  memorizationScore?: number;
  understandingScore?: number;
  tajweedScore?: number;
  fluencyScore?: number;
  completionPercentage?: number;
  needsImprovement?: boolean;
  readyForNext?: boolean;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  teacherNotes?: string;

  student?: {
    user: {
      name: string;
    };
  };

  surah?: {
    name: string;
    arabicName: string;
  };
}
interface GetClassesResponse {
  raw: SchoolClass[];
  dropdown: ClassDropdown[];
}

// Class
interface SchoolClass {
  id: string;
  name: string;
  classCode: string;
  displayName?: string | null;
  level: number;
  capacity: number;
  academicYearId: string;
  classTeacherId?: string | null;
  createdByRole: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  streams: {
    id: string;
    name: string;
    classId: string;
    capacity: number;
    currentEnrollment: number;
    streamTeacherId?: string | null;
    createdByRole: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    _count: {
      currentStudents: number;
    };
  }[];
  academicYear: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    status: string;
    promotionPeriodStart: string | null;
    promotionPeriodEnd: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  _count: {
    currentStudents: number;
  };
}


// Dropdown format for Class
interface ClassDropdown {
  label: string;
  value: string;
  academicYear: string;
  level: number;
  capacity: string;
  streams: {
    label: string;
    value: string;
    fullLabel: string;
    capacity: string;
    available: number;
  }[];
}


export interface PaginatedSubjectsResponse {
  subjects: Subject[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://steadfast-system-copy-production.up.railway.app/api';

class ApiClient {
     private token : string | null = null;

     constructor(){
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

    cleartoken() {
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
      // If headers is a Headers object, use set; if it's a plain object, assign property
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  }

  // login and logout methods
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
    const token = result.token.replace(/^Bearer\s+/i, ''); // Strip "Bearer " prefix if needed
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
    this.cleartoken();
  }


  //user functions
    async getMe(): Promise<ApiResponse<User[]>> {
    return this.request('/users/me');
  }
  
async updateMe(updates: Partial<User>): Promise<ApiResponse<User>> {
  return this.request('/users/me', {
    method: 'PUT',
    body: JSON.stringify(updates),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// class management functions

// Class Management
async getClasses(): Promise<ApiResponse<{
  getClassesResponse: GetClassesResponse;
  [x: string]: boolean | GetClassesResponse;
}>> {
  return this.request('/academics/classes');
}

async getClassRoster(classId: string): Promise<ApiResponse<any[]>> {
  return this.request(`/classes/${classId}/roster`);
}
async getStudents(p0?: { classId: string; streamId: string | undefined; }): Promise<ApiResponse<{ students: StudentResponse[] }>> {
  return this.request('/students');
}

async getStudentById(studentId: string): Promise<ApiResponse<any>> {
  return this.request(`/students/${studentId}`);
}

// Timetable
async getTimetable(): Promise<ApiResponse<any>> {
  return this.request('/timetable');
}

async getTimetableConflicts(): Promise<ApiResponse<any>> {
  return this.request('/timetable/conflicts');
}

// Statistics
async getStatistics(): Promise<ApiResponse<any>> {
  return this.request('/statistics');
}

async getWorkload(): Promise<ApiResponse<any>> {
  return this.request('/workload');
}

async getPerformance(): Promise<ApiResponse<any>> {
  return this.request('/performance');
}

// Search
async searchStudents(query: string): Promise<ApiResponse<any[]>> {
  return this.request(`/search/students?query=${encodeURIComponent(query)}`);
}

async searchCourses(query: string): Promise<ApiResponse<any[]>> {
  return this.request(`/search/courses?query=${encodeURIComponent(query)}`);
}

// Validation
async validateClassAccess(classId: string): Promise<ApiResponse<any>> {
  return this.request(`/validate/access/class/${classId}`);
}

async validateStudentAccess(studentId: string): Promise<ApiResponse<any>> {
  return this.request(`/validate/access/student/${studentId}`);
}

// Health
async getHealth(): Promise<ApiResponse<any>> {
  return this.request('/health');
}

// Lesson Planning & Content
async getLessonPlans(subjectId: string): Promise<ApiResponse<any[]>> {
  return this.request(`/lessonPlan`);
}


async createLessonPlan(subjectId: string, plan: any): Promise<ApiResponse<any>> {
  return this.request(`/lessonPlan`, {
    method: 'POST',
    body: JSON.stringify(plan),
    headers: { 'Content-Type': 'application/json' },
  });
}

async updateLessonPlan(planId: string, updates: any): Promise<ApiResponse<any>> {
  return this.request(`/lessonPlans/${planId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: { 'Content-Type': 'application/json' },
  });
}

async getCourseContent(courseId: string): Promise<ApiResponse<any[]>> {
  return this.request(`/teachers/courses/${courseId}/content`);
}

async createCourseContent(courseId: string, content: any): Promise<ApiResponse<any>> {
  return this.request(`/teachers/courses/${courseId}/content`, {
    method: 'POST',
    body: JSON.stringify(content),
    headers: { 'Content-Type': 'application/json' },
  });
}

async exportLessonPlans(): Promise<ApiResponse<any>> {
  return this.request('/export/lessonplan');
}

// Assessment & Grading
async getGradebook(gradebookId: string): Promise<ApiResponse<any>> {
  return this.request(`/gradebooks/${gradebookId}`);
}

async postAssignmentResults(assignmentId: string, results: any): Promise<ApiResponse<any>> {
  return this.request(`/assignments/${assignmentId}/results`, {
    method: 'POST',
    body: JSON.stringify(results),
    headers: { 'Content-Type': 'application/json' },
  });
}

async postExamResults(examId: string, results: any): Promise<ApiResponse<any>> {
  return this.request(`/exams/${examId}/results`, {
    method: 'POST',
    body: JSON.stringify(results),
    headers: { 'Content-Type': 'application/json' },
  });
}

async updateResult(resultId: string, updates: any): Promise<ApiResponse<any>> {
  return this.request(`/results/${resultId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: { 'Content-Type': 'application/json' },
  });
}

async postStrandAssessment(classId: string, assessment: any): Promise<ApiResponse<any>> {
  return this.request(`/classes/${classId}/strand-assessments`, {
    method: 'POST',
    body: JSON.stringify(assessment),
    headers: { 'Content-Type': 'application/json' },
  });
}

async postAttitudeAssessment(classId: string, assessment: any): Promise<ApiResponse<any>> {
  return this.request(`/classes/${classId}/attitude-assessments`, {
    method: 'POST',
    body: JSON.stringify(assessment),
    headers: { 'Content-Type': 'application/json' },
  });
}

async postReportCardComment(reportCardId: string, subjectId: string, comment: any): Promise<ApiResponse<any>> {
  return this.request(`/report-cards/${reportCardId}/subjects/${subjectId}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
    headers: { 'Content-Type': 'application/json' },
  });
}

// Attendance Management
async getClassAttendance(classId: string): Promise<ApiResponse<any>> {
  return this.request(`/attendance/classes/${classId}`);
}

async markClassAttendance(classId: string, attendance: any): Promise<ApiResponse<any>> {
  return this.request(`/attendance/classes/${classId}/mark`, {
    method: 'POST',
    body: JSON.stringify(attendance),
    headers: { 'Content-Type': 'application/json' },
  });
}

// Personal Administration
async getPayrolls(): Promise<ApiResponse<any[]>> {
  return this.request('/payrolls');
}

async getEvaluations(): Promise<ApiResponse<any[]>> {
  return this.request('/evaluations');
}

// Export & Reports
async exportGradebook(gradebookId: string): Promise<ApiResponse<any>> {
  return this.request(`/export/gradebook/${gradebookId}`);
}

async exportClassRoster(classId: string): Promise<ApiResponse<any>> {
  return this.request(`/export/class-roster/${classId}`);
}

// Activities & Scheduling
async getRecentActivities(): Promise<ApiResponse<any[]>> {
  return this.request('/activities/recent');
}

async getUpcomingSchedule(): Promise<ApiResponse<any[]>> {
  return this.request('/schedule/upcoming');
}

// Student Interaction
async postStudentComment(studentId: string, comment: any): Promise<ApiResponse<any>> {
  return this.request(`/students/${studentId}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
    headers: { 'Content-Type': 'application/json' },
  });
}

// student functions
async getStudentGrades(studentId: string): Promise<ApiResponse<Grade[]>> {
    return this.request(`/students/${studentId}/grades`);
    
}


async getStudentNotifications(limit: number = 10): Promise<ApiResponse<Notification[]>> {
    return this.request(`/students/me/notifications?limit=${limit}`);
}

async getCourseResources(courseId: string): Promise<ApiResponse<Resource[]>> {
    return this.request(`/students/courses/${courseId}/resources`);
}

async submitAssignment(submission: AssignmentSubmission): Promise<ApiResponse<any>> {
    return this.request('/students/assignments/submit', {
        method: 'POST',
        body: JSON.stringify(submission),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async getDashboard(studentId: string): Promise<ApiResponse<Dashboard>> {
    return this.request(`/teachers/dashboard`);
}

 //subjects
 async getSubjects(params: { page: number; limit: number }): Promise<ApiResponse<PaginatedSubjectsResponse>> {
  return this.request(`/subjects?page=${params.page}&limit=${params.limit}`);
}

async getCourses(params?: {
  page?: number;
  limit?: number;
  search?: string;
  subjectId?: string;
  classId?: string;
  teacherId?: string;
  departmentId?: string;
  academicYearId?: string;
}): Promise<ApiResponse<Course[]>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value.toString());
    });
  }

  return this.request(`/teachers/courses?${query.toString()}`);
}

//ASSIGNMENTS


// Upload Assignment Files
async uploadAssignmentFiles(
  assignmentId: string,
  files: File[]
): Promise<ApiResponse<any>> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files[]", file));

  return this.request(`/assignments/${assignmentId}/files`, {
    method: "POST",
    body: formData,
  });
}
//resources
// Upload Lesson Resources
async uploadLessonResources(
  lessonPlanId: string,
  files: File[]
): Promise<ApiResponse<any>> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files[]", file));

  return this.request(`/lessonplan/${lessonPlanId}/resources`, {
    method: "POST",
    body: formData,
  });
}

async createSubjectAssignment(
  teacherId: string,
  payload: CreateAssignmentPayload
): Promise<ApiResponse<{ assignmentId: string }>> {
  return this.request(`/teachers/${teacherId}/subjects`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

//Quran 
async getStudentProgress(
  studentId: string,
  params?: { progressType?: string; status?: string; includeCompleted?: boolean }
): Promise<ApiResponse<StudentProgress[]>> {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
  }


  const qs = query.toString();
  const url = qs
    ? `/quraan/students/${studentId}/progress?${qs}`
    : `/quraan/students/${studentId}/progress`;

  return this.request(url);
}

async createStudentProgress(body: {
  studentId: string;
  classId: string;
  streamId?: string;
  progressType: "RECITATION" | "MEMORIZATION" | "UNDERSTANDING" | "REVISION";
  currentSurahId: number;
  currentJuzId?: number;
  fromAyah: number;
  toAyah: number;
}): Promise<ApiResponse<StudentProgress>> {
  return this.request(`/quraan/progress`, {
    method: "POST",
    body: JSON.stringify({
      studentId: body.studentId,
      classId: body.classId,
      streamId: body.streamId,
      progressType: body.progressType,
      currentSurahId: body.currentSurahId,
      currentJuzId: body.currentJuzId,
      fromAyah: body.fromAyah,
      toAyah: body.toAyah,
    }),
  });
}

async createAssessment(body: {
  studentId: string;
  classId: string;
  streamId: string;
  progressId: string;
  assessmentType: "DAILY_CHECK" | "WEEKLY_REVIEW" | "MONTHLY_ASSESSMENT" | "TERM_EVALUATION" | "PROGRESS_TEST" | "REVISION_CHECK";
  surahId?: number;
  juzId?: number;
  fromAyah?: number;
  toAyah?: number;
  recitationScore?: number;
  memorizationScore?: number;
  understandingScore?: number;
  tajweedScore?: number;
  fluencyScore?: number;
  completionPercentage?: number;
  needsImprovement?: boolean;
  readyForNext?: boolean;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  teacherNotes?: string;
  assessmentDate?: string;
}): Promise<ApiResponse<Assessment>> {
  return this.request(`/quraan/assessments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
async updateStudentProgress(
  progressId: string,
  body: {
    currentAyahNumber?: number;
    recitationProgress?: number;
    memorizationProgress?: number;
    status?: string;
    recitationQuality?: number;
    memorizationQuality?: number;
  }
): Promise<ApiResponse<StudentProgress>> {
  return this.request(`/quraan/progress/${progressId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
  async getQuranDashboard(): Promise<ApiResponse<any>> {
    return this.request(`/quraan/dashboard/`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });
  } 
  async getTeacherDiaryEntries(teacherId: string): Promise<ApiResponse<any>>{
    return this.request(`/teacher/entries/${teacherId}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });
  }


}
export const api = new ApiClient();