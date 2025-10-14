import { useState, useEffect, useCallback, useRef } from 'react';
import { libraryApi } from '@/lib/api';
import { loanApi } from '@/lib/api';
import { Student, Class } from './loan';
import { toast } from 'react-hot-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
  coverImageUrl?: string;
  format: 'PHYSICAL' | 'DIGITAL';
  category: string;
}

interface BorrowBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ClassOption {
  value: string;
  label: string;
  streams?: Array<{ id: string; name: string }>;
}

export default function BorrowBookModal({ isOpen, onClose, onSuccess }: BorrowBookModalProps) {
  const [step, setStep] = useState<'search' | 'confirm'>('search');
  const [bookSearch, setBookSearch] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStream, setSelectedStream] = useState<string>('');
  const [classNameFilter, setClassNameFilter] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchingBooks, setSearchingBooks] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [error, setError] = useState('');
  const [borrowingStatus, setBorrowingStatus] = useState<any>(null);

  const studentDetailsRef = useRef<HTMLDivElement>(null);

  // Calculate default due date (14 days from now)
  useEffect(() => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  // Book search effect
  useEffect(() => {
    if (bookSearch.length > 2) {
      const delaySearch = setTimeout(() => {
        searchBooks();
      }, 300);
      return () => clearTimeout(delaySearch);
    } else {
      setBooks([]);
    }
  }, [bookSearch]);

  // Load classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setClassesLoading(true);
        setError("");
        const res = await libraryApi.getClasses();
        if (res.success && Array.isArray(res.data?.dropdown)) {
          setClasses(res.data.dropdown);
        } else if (res.success && Array.isArray(res.data?.getClassesResponse?.classes)) {
          // Map the class response to the expected format
          const classOptions = res.data.getClassesResponse.classes.map((cls: any) => ({
            value: cls.id,
            label: cls.name,
            streams: cls.streams || []
          }));
          setClasses(classOptions);
        } else if (res.success && Array.isArray(res.data?.classes)) {
          const classOptions = res.data.classes.map((cls: any) => ({
            value: cls.id,
            label: cls.name,
            streams: cls.streams || []
          }));
          setClasses(classOptions);
        } else {
          setError("Failed to load classes - invalid data format");
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Error loading classes. Please try again.");
      } finally {
        setClassesLoading(false);
      }
    };
    
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  // Fetch students when class or stream changes
  const fetchStudents = useCallback(async (classId?: string, streamId?: string) => {
    try {
      setLoadingStudents(true);
      setError("");

      const res = await libraryApi.getStudents({
        classId: classId,
        streamId: streamId
      });
      
      const studentList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.students)
        ? res.data.students
        : [];

      const filtered = studentList.filter((s: any) => s.user?.status === "ACTIVE");

      const mappedStudents = filtered.map((s: any) => ({
        ...s,
        user: { ...s.user },
        currentClass: s.currentClass ? { ...s.currentClass } : null,
        currentStream: s.currentStream ? { ...s.currentStream } : null,
        id: s.id || s.user?.id,
        name: s.user?.name || s.name,
        email: s.user?.email || s.email,
        admissionNumber: s.admissionNumber || s.user?.studentProfile?.admissionNumber,
        className: s.currentClass?.name || s.className
      }));

      setStudents(mappedStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Error loading students. Please try again.");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass, selectedStream);
    } else {
      setStudents([]);
    }
  }, [selectedClass, selectedStream, fetchStudents]);

  // Scroll to student details when selected
  useEffect(() => {
    if (selectedStudent && studentDetailsRef.current) {
      studentDetailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedStudent]);

  // Check borrowing status when student is selected
  useEffect(() => {
    if (selectedStudent) {
      checkBorrowingStatus(selectedStudent.id);
    } else {
      setBorrowingStatus(null);
    }
  }, [selectedStudent]);

  const handleClassChange = (classValue: string) => {
    setSelectedClass(classValue);
    setSelectedStream("");
    setClassNameFilter("");
    setSelectedStudent(null);
  };

  const searchBooks = async () => {
    try {
      setSearchingBooks(true);
      const response = await libraryApi.getBooks({
        search: bookSearch,
        available: true,
        limit: 20
      });
      if (response.success) {
        setBooks(response.data.data || response.data);
      }
    } catch (error) {
      console.error('Book search error:', error);
      toast.error('Failed to search books');
    } finally {
      setSearchingBooks(false);
    }
  };

  const checkBorrowingStatus = async (studentId: string) => {
    try {
      const response = await libraryApi.getUserBorrowingStatus(studentId);
      if (response.success) {
        setBorrowingStatus(response.data);
      }
    } catch (error) {
      console.error('Failed to check borrowing status:', error);
    }
  };

  const toggleBookSelection = (book: Book) => {
    setSelectedBooks(prev => {
      const isAlreadySelected = prev.some(b => b.id === book.id);
      if (isAlreadySelected) {
        return prev.filter(b => b.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const removeSelectedBook = (bookId: string) => {
    setSelectedBooks(prev => prev.filter(book => book.id !== bookId));
  };

  const handleBorrow = async () => {
    if (!selectedStudent || selectedBooks.length === 0) return;

    try {
      setLoading(true);
      
      // Borrow each book sequentially
      for (const book of selectedBooks) {
        const response = await loanApi.borrowBook(book.id, {
          borrowerId: selectedStudent.id,
          dueDate: dueDate || undefined,
          notes: notes || undefined
        });

        if (!response.success) {
          throw new Error(`Failed to borrow "${book.title}": ${response.message}`);
        }
      }

      toast.success(`Successfully issued ${selectedBooks.length} book${selectedBooks.length > 1 ? 's' : ''} to ${selectedStudent.name}`);
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to issue books');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('search');
    setBookSearch('');
    setSelectedBooks([]);
    setSelectedStudent(null);
    setSelectedClass('');
    setSelectedStream('');
    setClassNameFilter('');
    setNotes('');
    setBooks([]);
    setStudents([]);
    setBorrowingStatus(null);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStreamsForClass = (classId: string) => {
    const classObj = classes.find(c => c.value === classId);
    return classObj?.streams || [];
  };

  const filteredStudents = students.filter((student) => {
    const matchesClass = !selectedClass || student.currentClassId === selectedClass;
    const matchesStream = !selectedStream || student.currentStreamId === selectedStream;
    const matchesNameFilter =
      !classNameFilter ||
      student.currentClass?.name?.toLowerCase().includes(classNameFilter.toLowerCase());

    return matchesClass && matchesStream && matchesNameFilter;
  });

  const selectedClassData = classes.find((cls) => cls.value === selectedClass);
  const canProceedToConfirm = selectedBooks.length > 0 && selectedStudent && 
    (!borrowingStatus || borrowingStatus.canBorrow) &&
    (selectedBooks.length <= (borrowingStatus?.remainingAllowed || 10));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {step === 'search' ? 'Issue Books to Student' : 'Confirm Book Issuance'}
              </h2>
              <p className="text-gray-600 mt-1">
                {step === 'search' 
                  ? 'Search for books and select a student to issue multiple books'
                  : 'Review and confirm the book issuance details'
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {step === 'search' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Book Search Section */}
              <div className="xl:col-span-2">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Search & Select Books
                  </h3>
                  <p className="text-blue-700 text-sm">You can select multiple books to issue at once</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Search Books by Title, Author, or ISBN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      placeholder="Enter book title, author, or ISBN..."
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {searchingBooks && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600">Searching books...</p>
                  </div>
                )}

                {books.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                    {books.map((book) => {
                      const isSelected = selectedBooks.some(b => b.id === book.id);
                      const canSelect = book.availableCopies > 0;
                      
                      return (
                        <div
                          key={book.id}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                              : canSelect
                              ? 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                              : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                          }`}
                          onClick={() => canSelect && toggleBookSelection(book)}
                        >
                          <div className="flex items-start space-x-3">
                            {book.coverImageUrl ? (
                              <img
                                src={book.coverImageUrl}
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded-lg shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">{book.title}</h4>
                                {isSelected && (
                                  <div className="bg-blue-500 text-white p-1 rounded-full ml-2 flex-shrink-0">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs mt-1">by {book.author}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  book.availableCopies > 0 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {book.availableCopies} available
                                </span>
                              </div>
                              {book.category && (
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">
                                  {book.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!searchingBooks && books.length === 0 && bookSearch.length > 2 && (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-lg font-medium text-gray-600">No books found</p>
                    <p className="text-sm mt-1">Try different search terms or check the spelling</p>
                  </div>
                )}
              </div>

              {/* Student Selection & Summary Section */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Select Student
                  </h3>
                  <p className="text-green-700 text-sm">Choose the student to issue books to</p>
                </div>

                {/* Class & Stream Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => handleClassChange(e.target.value)}
                      disabled={classesLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a class</option>
                      {classes.map((classItem) => (
                        <option key={classItem.value} value={classItem.value}>
                          {classItem.label}
                        </option>
                      ))}
                    </select>
                    {classesLoading && (
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-2"></div>
                        Loading classes...
                      </div>
                    )}
                  </div>

                  {selectedClass && getStreamsForClass(selectedClass).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stream
                      </label>
                      <select
                        value={selectedStream}
                        onChange={(e) => {
                          setSelectedStream(e.target.value);
                          setSelectedStudent(null);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                      >
                        <option value="">All streams</option>
                        {getStreamsForClass(selectedClass).map((stream: any) => (
                          <option key={stream.id} value={stream.id}>
                            {stream.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Class Name Filter */}
                  {selectedClass && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Class Name
                      </label>
                      <input
                        type="text"
                        value={classNameFilter}
                        onChange={(e) => setClassNameFilter(e.target.value)}
                        placeholder="Enter class name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Students List */}
                {loadingStudents && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                    <p className="text-gray-600">Loading students...</p>
                  </div>
                )}

                {filteredStudents.length > 0 && (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          selectedStudent?.id === student.id
                            ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white'
                        }`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm">{student.name}</h4>
                            <p className="text-gray-600 text-xs">Admission: {student.admissionNumber}</p>
                            <p className="text-gray-500 text-xs truncate">{student.email}</p>
                            {student.currentClass?.name && (
                              <p className="text-gray-500 text-xs">Class: {student.currentClass.name}</p>
                            )}
                          </div>
                          {selectedStudent?.id === student.id && (
                            <div className="bg-green-500 text-white p-1 rounded-full ml-2 flex-shrink-0">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedClass && !loadingStudents && filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-gray-600">No students found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {classNameFilter ? 'Try adjusting your filters' : 'No active students in this class'}
                    </p>
                  </div>
                )}

                {/* Selected Student Details & Borrowing Status */}
                {selectedStudent && (
                  <div ref={studentDetailsRef} className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Selected Student
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-semibold text-gray-900">{selectedStudent.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Admission:</span>
                          <span className="font-semibold text-gray-900">{selectedStudent.admissionNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Class:</span>
                          <span className="font-semibold text-gray-900">{selectedStudent.currentClass?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold text-gray-900 truncate">{selectedStudent.email}</span>
                        </div>
                      </div>
                    </div>

                    {borrowingStatus && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                        <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Borrowing Status
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Currently Borrowed:</span>
                            <div className="font-semibold text-gray-900">
                              {borrowingStatus.currentlyBorrowed} / {borrowingStatus.maxAllowed}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Can Borrow:</span>
                            <div className={`font-semibold ${
                              borrowingStatus.canBorrow ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {borrowingStatus.canBorrow ? 'Yes' : 'No'}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Remaining Allowance:</span>
                            <div className="font-semibold text-blue-600">
                              {borrowingStatus.remainingAllowed} books
                            </div>
                          </div>
                          {borrowingStatus.fineAmount > 0 && (
                            <div className="col-span-2">
                              <span className="text-gray-600">Outstanding Fines:</span>
                              <div className="font-semibold text-red-600">
                                ${borrowingStatus.fineAmount.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </div>
                        {!borrowingStatus.canBorrow && (
                          <p className="text-red-600 text-xs mt-2">{borrowingStatus.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Books Summary */}
                {selectedBooks.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-900 mb-3 flex items-center justify-between">
                      <span>Selected Books</span>
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {selectedBooks.length}
                      </span>
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedBooks.map((book) => (
                        <div key={book.id} className="flex items-center justify-between bg-white rounded-lg p-2 text-sm">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{book.title}</p>
                            <p className="text-gray-500 text-xs">by {book.author}</p>
                          </div>
                          <button
                            onClick={() => removeSelectedBook(book.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 ml-2 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    {selectedStudent && borrowingStatus && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <div className={`text-sm font-medium ${
                          selectedBooks.length <= borrowingStatus.remainingAllowed 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {selectedBooks.length} of {borrowingStatus.remainingAllowed} books allowed
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Confirmation Details */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-4 text-lg">Issuance Summary</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Student Details */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                    <h4 className="font-medium text-gray-700 mb-3 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Student Information
                    </h4>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{selectedStudent?.name}</p>
                      <p className="text-gray-600 text-sm">Admission: {selectedStudent?.admissionNumber}</p>
                      <p className="text-gray-500 text-xs">Email: {selectedStudent?.email}</p>
                      {selectedStudent?.currentClass?.name && (
                        <p className="text-gray-500 text-xs">Class: {selectedStudent.currentClass.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Books Summary */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                    <h4 className="font-medium text-gray-700 mb-3 text-sm flex items-center justify-between">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Books to Issue
                      </span>
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        {selectedBooks.length} book{selectedBooks.length > 1 ? 's' : ''}
                      </span>
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedBooks.map((book) => (
                        <div key={book.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          {book.coverImageUrl ? (
                            <img
                              src={book.coverImageUrl}
                              alt={book.title}
                              className="w-8 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-10 bg-gray-200 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                            <p className="text-gray-500 text-xs">by {book.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  The due date determines when the student should return all books. Late returns may incur fines.
                </p>
              </div>

              {/* Notes */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white resize-vertical shadow-sm"
                  placeholder="Any special instructions or notes about this book issuance..."
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
            {step === 'search' ? (
              <>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!canProceedToConfirm}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <span>Continue to Confirm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep('search')}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Search</span>
                </button>
                <div className="flex space-x-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBorrow}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Issuing {selectedBooks.length} Book{selectedBooks.length > 1 ? 's' : ''}...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Issue {selectedBooks.length} Book{selectedBooks.length > 1 ? 's' : ''}</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}