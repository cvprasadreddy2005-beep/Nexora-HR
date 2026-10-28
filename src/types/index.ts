export type UserRole = 'admin' | 'hr_manager' | 'employee';

export type EmploymentStatus = 'Active' | 'On Leave' | 'Probation' | 'Terminated';
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: EmploymentStatus;
  employmentType: EmploymentType;
  joiningDate: string;
  avatar: string;
  location: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  education: string;
  skills: string[];
  salary: {
    basic: number;
    allowances: number;
    deductions: number;
  };
  leaveBalance: {
    casual: number;
    sick: number;
    earned: number;
  };
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half-Day';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:MM:SS or '-'
  checkOut: string; // HH:MM:SS or '-'
  status: AttendanceStatus;
  workHours: number;
  notes?: string;
}

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Other';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  actionedBy?: string;
  actionedOn?: string;
}

export type PaymentStatus = 'Paid' | 'Processing' | 'Pending';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  bankAccount: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  vacancies: number;
  status: 'Open' | 'Closed';
  postedDate: string;
  applicantsCount: number;
}

export type CandidateStage = 'Applied' | 'Shortlisted' | 'Technical Interview' | 'HR Interview' | 'Selected' | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  stage: CandidateStage;
  appliedDate: string;
  experience: string;
  rating: number; // 1-5
  interviewDate?: string;
  interviewer?: string;
  notes?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'employee_joined' | 'leave_submitted' | 'attendance_recorded' | 'candidate_shortlisted' | 'profile_updated' | 'payroll_processed';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'leave' | 'attendance' | 'hiring' | 'payroll' | 'system';
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
