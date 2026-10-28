import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  JobOpening,
  Candidate,
  CandidateStage,
  ActivityEvent,
  NotificationItem,
  ToastMessage
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

interface AppContextType {
  // Navigation & Preferences
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Data
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  jobs: JobOpening[];
  candidates: Candidate[];
  events: ActivityEvent[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastMessage[];

  // Current session user for Employee mode
  currentEmployeeUser: Employee;

  // Actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  recordAttendance: (employeeId: string, actionType: 'checkIn' | 'checkOut') => void;
  applyLeave: (leave: {
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
  }) => void;
  reviewLeave: (id: string, status: 'Approved' | 'Rejected') => void;
  updatePayrollStatus: (id: string, status: PayrollRecord['paymentStatus']) => void;
  addJob: (job: Omit<JobOpening, 'id' | 'postedDate' | 'applicantsCount'>) => void;
  toggleJobStatus: (id: string) => void;
  addCandidate: (cand: Omit<Candidate, 'id' | 'appliedDate'>) => void;
  updateCandidateStage: (id: string, newStage: CandidateStage) => void;
  scheduleInterview: (candidateId: string, dateStr: string, interviewer: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'nexora_hr_theme',
  ROLE: 'nexora_hr_role',
  TAB: 'nexora_hr_tab',
  EMPLOYEES: 'nexora_hr_employees',
  ATTENDANCE: 'nexora_hr_attendance',
  LEAVES: 'nexora_hr_leaves',
  PAYROLL: 'nexora_hr_payroll',
  JOBS: 'nexora_hr_jobs',
  CANDIDATES: 'nexora_hr_candidates',
  NOTIFICATIONS: 'nexora_hr_notifications',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Local storage write failed', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  });

  // User Role state
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'admin';
  });

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TAB) || 'dashboard';
  });

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Core Data States
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const data = getStorage(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    return data.map((e) => {
      let updated = e;
      if (e.firstName === 'Sora') {
        updated = { ...updated, firstName: 'Iliyaz', email: updated.email.replace('sora.', 'iliyaz.') };
      }
      if (updated.salary && updated.salary.basic < 20000) {
        updated = {
          ...updated,
          salary: {
            basic: updated.salary.basic * 10,
            allowances: updated.salary.allowances * 10,
            deductions: updated.salary.deductions * 10
          }
        };
      }
      return updated;
    });
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const data = getStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    return data.map((a) =>
      a.employeeName.includes('Sora')
        ? { ...a, employeeName: a.employeeName.replace('Sora', 'Iliyaz') }
        : a
    );
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() =>
    getStorage(STORAGE_KEYS.LEAVES, INITIAL_LEAVES)
  );

  const [payroll, setPayroll] = useState<PayrollRecord[]>(() => {
    const data = getStorage(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    return data.map((p) => {
      let updated = p;
      if (p.employeeName.includes('Sora')) {
        updated = { ...updated, employeeName: p.employeeName.replace('Sora', 'Iliyaz') };
      }
      if (updated.basicSalary < 20000) {
        const b = updated.basicSalary * 10;
        const a = updated.allowances * 10;
        const d = updated.deductions * 10;
        updated = {
          ...updated,
          basicSalary: b,
          allowances: a,
          deductions: d,
          netSalary: b + a - d
        };
      }
      return updated;
    });
  });

  const [jobs, setJobs] = useState<JobOpening[]>(() =>
    getStorage(STORAGE_KEYS.JOBS, INITIAL_JOBS)
  );

  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    getStorage(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  const [events, setEvents] = useState<ActivityEvent[]>(INITIAL_EVENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist role
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  // Persist tab
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB, activeTab);
  }, [activeTab]);

  // Persist datasets
  useEffect(() => setStorage(STORAGE_KEYS.EMPLOYEES, employees), [employees]);
  useEffect(() => setStorage(STORAGE_KEYS.ATTENDANCE, attendance), [attendance]);
  useEffect(() => setStorage(STORAGE_KEYS.LEAVES, leaves), [leaves]);
  useEffect(() => setStorage(STORAGE_KEYS.PAYROLL, payroll), [payroll]);
  useEffect(() => setStorage(STORAGE_KEYS.JOBS, jobs), [jobs]);
  useEffect(() => setStorage(STORAGE_KEYS.CANDIDATES, candidates), [candidates]);
  useEffect(() => setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications), [notifications]);

  // Toast System
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut for Command Palette (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine current active user in Employee view
  const currentEmployeeUser = employees[3] || employees[0]; // Iliyaz Takahashi (EMP-1004) or first employee

  // Employee CRUD
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `EMP-${1000 + employees.length + 1}`;
    const newEmp: Employee = { ...empData, id: newId };
    setEmployees((prev) => [newEmp, ...prev]);

    // Also auto-generate initial payroll record
    const basic = newEmp.salary.basic;
    const allowances = newEmp.salary.allowances;
    const deductions = newEmp.salary.deductions;
    const newPay: PayrollRecord = {
      id: `PAY-2026-${1000 + employees.length + 1}`,
      employeeId: newId,
      employeeName: `${newEmp.firstName} ${newEmp.lastName}`,
      department: newEmp.department,
      designation: newEmp.designation,
      month: 'October 2026',
      basicSalary: basic,
      allowances,
      deductions,
      netSalary: basic + allowances - deductions,
      paymentStatus: 'Pending',
      bankAccount: `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`
    };
    setPayroll((prev) => [newPay, ...prev]);

    // Log Activity
    setEvents((prev) => [
      {
        id: `EVT-${Date.now()}`,
        type: 'employee_joined',
        title: 'New Employee Added',
        description: `${newEmp.firstName} ${newEmp.lastName} joined ${newEmp.department} as ${newEmp.designation}.`,
        timestamp: 'Just now',
        actor: 'Admin'
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Employee Added',
      message: `${newEmp.firstName} ${newEmp.lastName} has been registered successfully.`
    });
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, ...updatedFields };
          // If salary components updated, update payroll as well
          if (updatedFields.salary) {
            setPayroll((prevPay) =>
              prevPay.map((pay) => {
                if (pay.employeeId === id) {
                  const basic = updated.salary.basic;
                  const allowances = updated.salary.allowances;
                  const deductions = updated.salary.deductions;
                  return {
                    ...pay,
                    basicSalary: basic,
                    allowances,
                    deductions,
                    netSalary: basic + allowances - deductions
                  };
                }
                return pay;
              })
            );
          }
          return updated;
        }
        return emp;
      })
    );

    setEvents((prev) => [
      {
        id: `EVT-${Date.now()}`,
        type: 'profile_updated',
        title: 'Employee Record Updated',
        description: `Profile credentials updated for ${id}.`,
        timestamp: 'Just now',
        actor: 'HR Manager'
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Employee records updated and synced with payroll database.'
    });
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setAttendance((prev) => prev.filter((a) => a.employeeId !== id));
    setPayroll((prev) => prev.filter((p) => p.employeeId !== id));
    setLeaves((prev) => prev.filter((l) => l.employeeId !== id));

    addToast({
      type: 'info',
      title: 'Employee Removed',
      message: `${emp ? `${emp.firstName} ${emp.lastName}` : id} was removed from the active directory.`
    });
  };

  // Attendance Check-in / Check-out
  const recordAttendance = (employeeId: string, actionType: 'checkIn' | 'checkOut') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toTimeString().split(' ')[0];
    const targetEmp = employees.find((e) => e.id === employeeId);

    setAttendance((prev) => {
      const existingIndex = prev.findIndex((a) => a.employeeId === employeeId && a.date === todayStr);

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        let newWorkHours = existing.workHours;
        let newCheckOut = existing.checkOut;
        let newCheckIn = existing.checkIn;

        if (actionType === 'checkOut') {
          newCheckOut = nowTimeStr;
          if (existing.checkIn !== '-') {
            // Calculate hours approximately
            const [h1, m1] = existing.checkIn.split(':').map(Number);
            const [h2, m2] = nowTimeStr.split(':').map(Number);
            const diffHours = Math.max(0.5, Number(((h2 * 60 + m2 - (h1 * 60 + m1)) / 60).toFixed(2)));
            newWorkHours = diffHours;
          }
        } else {
          newCheckIn = nowTimeStr;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          checkIn: newCheckIn,
          checkOut: newCheckOut,
          status: 'Present',
          workHours: newWorkHours
        };
        return updated;
      } else {
        const isLate = parseInt(nowTimeStr.split(':')[0], 10) >= 9 && parseInt(nowTimeStr.split(':')[1], 10) > 15;
        const newRecord: AttendanceRecord = {
          id: `ATT-${Date.now()}`,
          employeeId,
          employeeName: targetEmp ? `${targetEmp.firstName} ${targetEmp.lastName}` : 'Employee',
          department: targetEmp ? targetEmp.department : 'General',
          date: todayStr,
          checkIn: actionType === 'checkIn' ? nowTimeStr : '-',
          checkOut: actionType === 'checkOut' ? nowTimeStr : '-',
          status: isLate ? 'Late' : 'Present',
          workHours: 0
        };
        return [newRecord, ...prev];
      }
    });

    setEvents((prev) => [
      {
        id: `EVT-${Date.now()}`,
        type: 'attendance_recorded',
        title: actionType === 'checkIn' ? 'Check-In Recorded' : 'Check-Out Recorded',
        description: `${targetEmp ? `${targetEmp.firstName} ${targetEmp.lastName}` : employeeId} marked ${actionType} at ${nowTimeStr}.`,
        timestamp: 'Just now',
        actor: targetEmp ? `${targetEmp.firstName} ${targetEmp.lastName}` : 'User'
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: actionType === 'checkIn' ? 'Checked In' : 'Checked Out',
      message: `Timestamp recorded at ${nowTimeStr} for today.`
    });
  };

  // Leave Management
  const applyLeave = (leaveData: {
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
  }) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `LEV-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setLeaves((prev) => [newLeave, ...prev]);

    // Add notification for HR
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'New Leave Request',
        message: `${leaveData.employeeName} applied for ${leaveData.days} days ${leaveData.leaveType}.`,
        time: 'Just now',
        read: false,
        type: 'leave'
      },
      ...prev
    ]);

    setEvents((prev) => [
      {
        id: `EVT-${Date.now()}`,
        type: 'leave_submitted',
        title: 'Leave Request Filed',
        description: `${leaveData.employeeName} submitted a ${leaveData.days}-day ${leaveData.leaveType} application.`,
        timestamp: 'Just now',
        actor: leaveData.employeeName
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Leave Request Submitted',
      message: 'Your leave application is submitted and forwarded to HR for review.'
    });
  };

  const reviewLeave = (id: string, status: 'Approved' | 'Rejected') => {
    const reviewerName = currentRole === 'admin' ? 'Admin Reviewer' : 'Zara Al-Mansoor (HR)';
    const todayStr = new Date().toISOString().split('T')[0];

    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          // If approved, deduct leave balance from employee
          if (status === 'Approved') {
            setEmployees((prevEmp) =>
              prevEmp.map((emp) => {
                if (emp.id === l.employeeId) {
                  const balance = { ...emp.leaveBalance };
                  if (l.leaveType === 'Casual Leave') balance.casual = Math.max(0, balance.casual - l.days);
                  else if (l.leaveType === 'Sick Leave') balance.sick = Math.max(0, balance.sick - l.days);
                  else if (l.leaveType === 'Earned Leave') balance.earned = Math.max(0, balance.earned - l.days);
                  return { ...emp, leaveBalance: balance };
                }
                return emp;
              })
            );
          }

          return {
            ...l,
            status,
            actionedBy: reviewerName,
            actionedOn: todayStr
          };
        }
        return l;
      })
    );

    addToast({
      type: status === 'Approved' ? 'success' : 'info',
      title: `Leave ${status}`,
      message: `Request ${id} has been marked as ${status.toLowerCase()}.`
    });
  };

  // Payroll Status Update
  const updatePayrollStatus = (id: string, status: PayrollRecord['paymentStatus']) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setPayroll((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            paymentStatus: status,
            paymentDate: status === 'Paid' ? todayStr : undefined
          };
        }
        return p;
      })
    );

    addToast({
      type: 'success',
      title: 'Payroll Updated',
      message: `Disbursement status set to ${status}.`
    });
  };

  // Jobs & Candidates
  const addJob = (jobData: Omit<JobOpening, 'id' | 'postedDate' | 'applicantsCount'>) => {
    const newJob: JobOpening = {
      ...jobData,
      id: `JOB-${300 + jobs.length + 1}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0
    };
    setJobs((prev) => [newJob, ...prev]);

    addToast({
      type: 'success',
      title: 'Position Published',
      message: `Requisition "${newJob.title}" is now open for applicants.`
    });
  };

  const toggleJobStatus = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: j.status === 'Open' ? 'Closed' : 'Open' } : j))
    );
  };

  const addCandidate = (candData: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const newCand: Candidate = {
      ...candData,
      id: `CAN-${800 + candidates.length + 1}`,
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setCandidates((prev) => [newCand, ...prev]);

    // Increment job applicants count
    setJobs((prev) =>
      prev.map((j) => (j.id === candData.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    addToast({
      type: 'success',
      title: 'Candidate Added',
      message: `${newCand.name} enrolled into ${newCand.stage} stage.`
    });
  };

  const updateCandidateStage = (id: string, newStage: CandidateStage) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, stage: newStage };
        }
        return c;
      })
    );

    addToast({
      type: 'info',
      title: 'Pipeline Updated',
      message: `Candidate moved to "${newStage}".`
    });
  };

  const scheduleInterview = (candidateId: string, dateStr: string, interviewer: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            interviewDate: dateStr,
            interviewer,
            stage: c.stage === 'Applied' || c.stage === 'Shortlisted' ? 'Technical Interview' : c.stage
          };
        }
        return c;
      })
    );

    addToast({
      type: 'success',
      title: 'Interview Scheduled',
      message: `Interview confirmed for ${dateStr} with ${interviewer}.`
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({ type: 'info', title: 'Notifications Cleared', message: 'All notifications marked as read.' });
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Reset to Demo Data
  const resetToDemoData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setPayroll(INITIAL_PAYROLL);
    setJobs(INITIAL_JOBS);
    setCandidates(INITIAL_CANDIDATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEvents(INITIAL_EVENTS);
    setCurrentRole('admin');
    setActiveTab('dashboard');

    addToast({
      type: 'success',
      title: 'Demonstration Data Reset',
      message: 'All records restored to original realistic demonstration state.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        theme,
        toggleTheme,
        sidebarCollapsed,
        setSidebarCollapsed,
        commandPaletteOpen,
        setCommandPaletteOpen,
        employees,
        attendance,
        leaves,
        payroll,
        jobs,
        candidates,
        events,
        notifications,
        unreadNotificationCount,
        toasts,
        currentEmployeeUser,
        addToast,
        removeToast,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        recordAttendance,
        applyLeave,
        reviewLeave,
        updatePayrollStatus,
        addJob,
        toggleJobStatus,
        addCandidate,
        updateCandidateStage,
        scheduleInterview,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
