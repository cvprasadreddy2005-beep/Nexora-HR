import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, JobOpening, Candidate, ActivityEvent, NotificationItem } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@nexora.io',
    phone: '+1 (555) 234-8901',
    department: 'Engineering',
    designation: 'Principal Systems Architect',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-03-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face',
    location: 'San Francisco, CA',
    emergencyContact: {
      name: 'Elena Vance',
      phone: '+1 (555) 234-8902',
      relation: 'Spouse'
    },
    education: 'M.S. in Computer Science, Stanford University',
    skills: ['Distributed Systems', 'Go', 'Kubernetes', 'Cloud Architecture'],
    salary: {
      basic: 145000,
      allowances: 22000,
      deductions: 18500
    },
    leaveBalance: {
      casual: 8,
      sick: 10,
      earned: 14
    }
  },
  {
    id: 'EMP-1002',
    firstName: 'Aaliyah',
    lastName: 'Chen',
    email: 'aaliyah.chen@nexora.io',
    phone: '+1 (555) 412-9087',
    department: 'Product',
    designation: 'VP of Product Experience',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2022-09-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
    location: 'Seattle, WA',
    emergencyContact: {
      name: 'Raymond Chen',
      phone: '+1 (555) 412-9088',
      relation: 'Father'
    },
    education: 'MBA, UC Berkeley Haas',
    skills: ['Product Strategy', 'Growth Modeling', 'User Research', 'Roadmapping'],
    salary: {
      basic: 160000,
      allowances: 25000,
      deductions: 21000
    },
    leaveBalance: {
      casual: 6,
      sick: 12,
      earned: 16
    }
  },
  {
    id: 'EMP-1003',
    firstName: 'Devon',
    lastName: 'Kowalski',
    email: 'devon.kowalski@nexora.io',
    phone: '+1 (555) 678-3412',
    department: 'Design',
    designation: 'Staff Product Designer',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-01-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    location: 'New York, NY',
    emergencyContact: {
      name: 'Maya Kowalski',
      phone: '+1 (555) 678-3413',
      relation: 'Sister'
    },
    education: 'B.F.A. Industrial Design, RISD',
    skills: ['Design Systems', 'Micro-interactions', 'Prototyping', 'Figma'],
    salary: {
      basic: 115000,
      allowances: 16000,
      deductions: 13500
    },
    leaveBalance: {
      casual: 9,
      sick: 8,
      earned: 12
    }
  },
  {
    id: 'EMP-1004',
    firstName: 'Iliyaz',
    lastName: 'Takahashi',
    email: 'iliyaz.takahashi@nexora.io',
    phone: '+1 (555) 890-4567',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-06-20',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face',
    location: 'Austin, TX',
    emergencyContact: {
      name: 'Kenji Takahashi',
      phone: '+1 (555) 890-4568',
      relation: 'Brother'
    },
    education: 'B.S. Software Engineering, UT Austin',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Web Performance'],
    salary: {
      basic: 108000,
      allowances: 15000,
      deductions: 12500
    },
    leaveBalance: {
      casual: 11,
      sick: 9,
      earned: 15
    }
  },
  {
    id: 'EMP-1005',
    firstName: 'Zara',
    lastName: 'Al-Mansoor',
    email: 'zara.almansoor@nexora.io',
    phone: '+1 (555) 321-7654',
    department: 'Human Resources',
    designation: 'Head of People & Culture',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2022-04-12',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face',
    location: 'Chicago, IL',
    emergencyContact: {
      name: 'Tariq Al-Mansoor',
      phone: '+1 (555) 321-7655',
      relation: 'Spouse'
    },
    education: 'M.S. Human Resource Management, Northwestern',
    skills: ['Talent Acquisition', 'Compensation & Benefits', 'DEI', 'Organizational Design'],
    salary: {
      basic: 132000,
      allowances: 19000,
      deductions: 16000
    },
    leaveBalance: {
      casual: 7,
      sick: 11,
      earned: 13
    }
  },
  {
    id: 'EMP-1006',
    firstName: 'Julian',
    lastName: 'Mercer',
    email: 'julian.mercer@nexora.io',
    phone: '+1 (555) 654-1234',
    department: 'Sales',
    designation: 'Director of Enterprise Growth',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2022-11-05',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face',
    location: 'Denver, CO',
    emergencyContact: {
      name: 'Hannah Mercer',
      phone: '+1 (555) 654-1235',
      relation: 'Spouse'
    },
    education: 'B.A. Economics, University of Colorado',
    skills: ['Enterprise SaaS', 'Contract Negotiation', 'Account Strategy', 'B2B Pipelines'],
    salary: {
      basic: 125000,
      allowances: 34000,
      deductions: 19000
    },
    leaveBalance: {
      casual: 5,
      sick: 10,
      earned: 10
    }
  },
  {
    id: 'EMP-1007',
    firstName: 'Camila',
    lastName: 'Rios',
    email: 'camila.rios@nexora.io',
    phone: '+1 (555) 789-0123',
    department: 'Marketing',
    designation: 'Global Brand Director',
    status: 'On Leave',
    employmentType: 'Full-Time',
    joiningDate: '2023-04-18',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face',
    location: 'Miami, FL',
    emergencyContact: {
      name: 'Gabriel Rios',
      phone: '+1 (555) 789-0124',
      relation: 'Partner'
    },
    education: 'M.A. Strategic Communications, Columbia University',
    skills: ['Brand Strategy', 'Product Marketing', 'Executive Comms', 'Campaigns'],
    salary: {
      basic: 118000,
      allowances: 18000,
      deductions: 14500
    },
    leaveBalance: {
      casual: 3,
      sick: 7,
      earned: 8
    }
  },
  {
    id: 'EMP-1008',
    firstName: 'Vikram',
    lastName: 'Patel',
    email: 'vikram.patel@nexora.io',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    designation: 'Infrastructure & DevOps Lead',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2022-08-15',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face',
    location: 'San Jose, CA',
    emergencyContact: {
      name: 'Priya Patel',
      phone: '+1 (555) 234-5679',
      relation: 'Spouse'
    },
    education: 'B.Tech Computer Science, IIT Bombay',
    skills: ['Terraform', 'AWS', 'Zero-Trust Security', 'Observability'],
    salary: {
      basic: 138000,
      allowances: 21000,
      deductions: 17500
    },
    leaveBalance: {
      casual: 10,
      sick: 12,
      earned: 18
    }
  },
  {
    id: 'EMP-1009',
    firstName: 'Claire',
    lastName: 'Dubois',
    email: 'claire.dubois@nexora.io',
    phone: '+1 (555) 876-5432',
    department: 'Operations',
    designation: 'Operations Strategy Manager',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-08-01',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&crop=face',
    location: 'Boston, MA',
    emergencyContact: {
      name: 'Luc Dubois',
      phone: '+1 (555) 876-5433',
      relation: 'Father'
    },
    education: 'B.S. Industrial Engineering, MIT',
    skills: ['Process Optimization', 'Logistics Modeling', 'Budgeting', 'Cross-Functional Ops'],
    salary: {
      basic: 102000,
      allowances: 14000,
      deductions: 12000
    },
    leaveBalance: {
      casual: 12,
      sick: 10,
      earned: 14
    }
  },
  {
    id: 'EMP-1010',
    firstName: 'Tariq',
    lastName: 'Okonkwo',
    email: 'tariq.okonkwo@nexora.io',
    phone: '+1 (555) 345-6789',
    department: 'Engineering',
    designation: 'Senior Backend Engineer',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-10-15',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&h=160&fit=crop&crop=face',
    location: 'Atlanta, GA',
    emergencyContact: {
      name: 'Ngozi Okonkwo',
      phone: '+1 (555) 345-6790',
      relation: 'Mother'
    },
    education: 'B.S. Computer Engineering, Georgia Tech',
    skills: ['PostgreSQL', 'Node.js', 'Redis', 'API Architecture'],
    salary: {
      basic: 105000,
      allowances: 14000,
      deductions: 12500
    },
    leaveBalance: {
      casual: 9,
      sick: 9,
      earned: 11
    }
  },
  {
    id: 'EMP-1011',
    firstName: 'Nadia',
    lastName: 'Lindqvist',
    email: 'nadia.lindqvist@nexora.io',
    phone: '+1 (555) 987-6543',
    department: 'Product',
    designation: 'Senior Technical Product Manager',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&h=160&fit=crop&crop=face',
    location: 'Portland, OR',
    emergencyContact: {
      name: 'Erik Lindqvist',
      phone: '+1 (555) 987-6544',
      relation: 'Brother'
    },
    education: 'M.S. Information Systems, University of Washington',
    skills: ['Agile Execution', 'API Specifications', 'Telemetry', 'User Journeys'],
    salary: {
      basic: 112000,
      allowances: 15000,
      deductions: 13000
    },
    leaveBalance: {
      casual: 8,
      sick: 10,
      earned: 9
    }
  },
  {
    id: 'EMP-1012',
    firstName: 'Mateo',
    lastName: 'Silva',
    email: 'mateo.silva@nexora.io',
    phone: '+1 (555) 678-9012',
    department: 'Sales',
    designation: 'Senior Account Executive',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=160&h=160&fit=crop&crop=face',
    location: 'Dallas, TX',
    emergencyContact: {
      name: 'Sofia Silva',
      phone: '+1 (555) 678-9013',
      relation: 'Spouse'
    },
    education: 'B.B.A. Marketing, UT Austin',
    skills: ['Solution Selling', 'Client Retention', 'CRM Mastery', 'Value Engineering'],
    salary: {
      basic: 95000,
      allowances: 28000,
      deductions: 15000
    },
    leaveBalance: {
      casual: 10,
      sick: 8,
      earned: 12
    }
  },
  {
    id: 'EMP-1013',
    firstName: 'Ingrid',
    lastName: 'Berg',
    email: 'ingrid.berg@nexora.io',
    phone: '+1 (555) 456-7890',
    department: 'Design',
    designation: 'Motion & UX Researcher',
    status: 'Probation',
    employmentType: 'Contract',
    joiningDate: '2024-08-01',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop&crop=face',
    location: 'San Francisco, CA',
    emergencyContact: {
      name: 'Lars Berg',
      phone: '+1 (555) 456-7891',
      relation: 'Father'
    },
    education: 'B.A. Interaction Design, Hyper Island',
    skills: ['Framer', 'Usability Audits', '3D Motion', 'Accessible Typography'],
    salary: {
      basic: 82000,
      allowances: 10000,
      deductions: 9500
    },
    leaveBalance: {
      casual: 4,
      sick: 5,
      earned: 3
    }
  },
  {
    id: 'EMP-1014',
    firstName: 'Hassan',
    lastName: 'Farouk',
    email: 'hassan.farouk@nexora.io',
    phone: '+1 (555) 123-9876',
    department: 'Human Resources',
    designation: 'Talent Acquisition Lead',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-05-10',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop&crop=face',
    location: 'Chicago, IL',
    emergencyContact: {
      name: 'Amira Farouk',
      phone: '+1 (555) 123-9877',
      relation: 'Spouse'
    },
    education: 'B.S. Psychology, University of Illinois',
    skills: ['Executive Sourcing', 'ATS Optimization', 'Interview Coaching', 'Candidate Experience'],
    salary: {
      basic: 98000,
      allowances: 13000,
      deductions: 11500
    },
    leaveBalance: {
      casual: 9,
      sick: 11,
      earned: 14
    }
  },
  {
    id: 'EMP-1015',
    firstName: 'Chloe',
    lastName: 'Bennett',
    email: 'chloe.bennett@nexora.io',
    phone: '+1 (555) 789-4321',
    department: 'Operations',
    designation: 'Workforce Workplace Specialist',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2024-02-01',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop&crop=face',
    location: 'Denver, CO',
    emergencyContact: {
      name: 'Paul Bennett',
      phone: '+1 (555) 789-4322',
      relation: 'Father'
    },
    education: 'B.A. Business Administration, CU Boulder',
    skills: ['Facilities', 'Vendor Management', 'Event Logistics', 'Internal Comms'],
    salary: {
      basic: 78000,
      allowances: 9000,
      deductions: 9000
    },
    leaveBalance: {
      casual: 8,
      sick: 9,
      earned: 7
    }
  },
  {
    id: 'EMP-1016',
    firstName: 'Leila',
    lastName: 'Moradi',
    email: 'leila.moradi@nexora.io',
    phone: '+1 (555) 654-7890',
    department: 'Engineering',
    designation: 'QA Automation Engineer',
    status: 'Active',
    employmentType: 'Full-Time',
    joiningDate: '2023-12-01',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&h=160&fit=crop&crop=face',
    location: 'San Jose, CA',
    emergencyContact: {
      name: 'Farhad Moradi',
      phone: '+1 (555) 654-7891',
      relation: 'Brother'
    },
    education: 'B.S. Computer Science, San Jose State',
    skills: ['Playwright', 'Jest', 'CI/CD Pipelines', 'Performance Benchmarking'],
    salary: {
      basic: 92000,
      allowances: 12000,
      deductions: 11000
    },
    leaveBalance: {
      casual: 10,
      sick: 10,
      earned: 11
    }
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'ATT-2001',
    employeeId: 'EMP-1001',
    employeeName: 'Marcus Vance',
    department: 'Engineering',
    date: '2026-10-26',
    checkIn: '08:45:10',
    checkOut: '17:30:20',
    status: 'Present',
    workHours: 8.75
  },
  {
    id: 'ATT-2002',
    employeeId: 'EMP-1002',
    employeeName: 'Aaliyah Chen',
    department: 'Product',
    date: '2026-10-26',
    checkIn: '09:02:40',
    checkOut: '18:15:00',
    status: 'Present',
    workHours: 9.2
  },
  {
    id: 'ATT-2003',
    employeeId: 'EMP-1003',
    employeeName: 'Devon Kowalski',
    department: 'Design',
    date: '2026-10-26',
    checkIn: '09:42:15',
    checkOut: '18:00:10',
    status: 'Late',
    workHours: 8.3
  },
  {
    id: 'ATT-2004',
    employeeId: 'EMP-1004',
    employeeName: 'Iliyaz Takahashi',
    department: 'Engineering',
    date: '2026-10-26',
    checkIn: '08:55:00',
    checkOut: '17:45:30',
    status: 'Present',
    workHours: 8.8
  },
  {
    id: 'ATT-2005',
    employeeId: 'EMP-1005',
    employeeName: 'Zara Al-Mansoor',
    department: 'Human Resources',
    date: '2026-10-26',
    checkIn: '08:30:25',
    checkOut: '17:15:10',
    status: 'Present',
    workHours: 8.75
  },
  {
    id: 'ATT-2006',
    employeeId: 'EMP-1006',
    employeeName: 'Julian Mercer',
    department: 'Sales',
    date: '2026-10-26',
    checkIn: '09:12:00',
    checkOut: '18:00:00',
    status: 'Present',
    workHours: 8.8
  },
  {
    id: 'ATT-2007',
    employeeId: 'EMP-1007',
    employeeName: 'Camila Rios',
    department: 'Marketing',
    date: '2026-10-26',
    checkIn: '-',
    checkOut: '-',
    status: 'Absent',
    workHours: 0,
    notes: 'Approved Medical Leave'
  },
  {
    id: 'ATT-2008',
    employeeId: 'EMP-1008',
    employeeName: 'Vikram Patel',
    department: 'Engineering',
    date: '2026-10-26',
    checkIn: '08:15:00',
    checkOut: '17:05:00',
    status: 'Present',
    workHours: 8.8
  },
  {
    id: 'ATT-2009',
    employeeId: 'EMP-1009',
    employeeName: 'Claire Dubois',
    department: 'Operations',
    date: '2026-10-26',
    checkIn: '09:00:10',
    checkOut: '13:30:00',
    status: 'Half-Day',
    workHours: 4.5,
    notes: 'Approved half-day appointment'
  },
  {
    id: 'ATT-2010',
    employeeId: 'EMP-1010',
    employeeName: 'Tariq Okonkwo',
    department: 'Engineering',
    date: '2026-10-26',
    checkIn: '08:50:00',
    checkOut: '17:35:00',
    status: 'Present',
    workHours: 8.75
  },
  {
    id: 'ATT-2011',
    employeeId: 'EMP-1011',
    employeeName: 'Nadia Lindqvist',
    department: 'Product',
    date: '2026-10-26',
    checkIn: '09:15:30',
    checkOut: '17:50:00',
    status: 'Present',
    workHours: 8.6
  },
  {
    id: 'ATT-2012',
    employeeId: 'EMP-1012',
    employeeName: 'Mateo Silva',
    department: 'Sales',
    date: '2026-10-26',
    checkIn: '09:35:10',
    checkOut: '18:10:00',
    status: 'Late',
    workHours: 8.6
  },
  {
    id: 'ATT-2013',
    employeeId: 'EMP-1013',
    employeeName: 'Ingrid Berg',
    department: 'Design',
    date: '2026-10-26',
    checkIn: '08:58:00',
    checkOut: '17:40:00',
    status: 'Present',
    workHours: 8.7
  },
  {
    id: 'ATT-2014',
    employeeId: 'EMP-1014',
    employeeName: 'Hassan Farouk',
    department: 'Human Resources',
    date: '2026-10-26',
    checkIn: '08:40:00',
    checkOut: '17:20:00',
    status: 'Present',
    workHours: 8.65
  },
  {
    id: 'ATT-2015',
    employeeId: 'EMP-1015',
    employeeName: 'Chloe Bennett',
    department: 'Operations',
    date: '2026-10-26',
    checkIn: '08:50:15',
    checkOut: '17:30:00',
    status: 'Present',
    workHours: 8.65
  },
  {
    id: 'ATT-2016',
    employeeId: 'EMP-1016',
    employeeName: 'Leila Moradi',
    department: 'Engineering',
    date: '2026-10-26',
    checkIn: '08:48:00',
    checkOut: '17:32:00',
    status: 'Present',
    workHours: 8.7
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'LEV-501',
    employeeId: 'EMP-1007',
    employeeName: 'Camila Rios',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '2026-10-26',
    endDate: '2026-10-28',
    days: 3,
    reason: 'Medical recovery following minor dental outpatient surgery.',
    status: 'Approved',
    appliedOn: '2026-10-24',
    actionedBy: 'Zara Al-Mansoor (HR)',
    actionedOn: '2026-10-24'
  },
  {
    id: 'LEV-502',
    employeeId: 'EMP-1003',
    employeeName: 'Devon Kowalski',
    department: 'Design',
    leaveType: 'Casual Leave',
    startDate: '2026-10-30',
    endDate: '2026-11-02',
    days: 2,
    reason: 'Family anniversary gathering out of state.',
    status: 'Pending',
    appliedOn: '2026-10-25'
  },
  {
    id: 'LEV-503',
    employeeId: 'EMP-1010',
    employeeName: 'Tariq Okonkwo',
    department: 'Engineering',
    leaveType: 'Earned Leave',
    startDate: '2026-11-10',
    endDate: '2026-11-17',
    days: 6,
    reason: 'Annual family holiday travel.',
    status: 'Pending',
    appliedOn: '2026-10-26'
  },
  {
    id: 'LEV-504',
    employeeId: 'EMP-1012',
    employeeName: 'Mateo Silva',
    department: 'Sales',
    leaveType: 'Casual Leave',
    startDate: '2026-10-20',
    endDate: '2026-10-21',
    days: 2,
    reason: 'Personal urgent administrative errands.',
    status: 'Approved',
    appliedOn: '2026-10-18',
    actionedBy: 'Zara Al-Mansoor (HR)',
    actionedOn: '2026-10-18'
  },
  {
    id: 'LEV-505',
    employeeId: 'EMP-1008',
    employeeName: 'Vikram Patel',
    department: 'Engineering',
    leaveType: 'Other',
    startDate: '2026-10-12',
    endDate: '2026-10-14',
    days: 3,
    reason: 'Conference attendance - Open Source Infrastructure Summit.',
    status: 'Approved',
    appliedOn: '2026-10-05',
    actionedBy: 'Marcus Vance (Lead)',
    actionedOn: '2026-10-06'
  },
  {
    id: 'LEV-506',
    employeeId: 'EMP-1013',
    employeeName: 'Ingrid Berg',
    department: 'Design',
    leaveType: 'Casual Leave',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    days: 2,
    reason: 'Relocation assistance for apartment move.',
    status: 'Rejected',
    appliedOn: '2026-10-14',
    actionedBy: 'Zara Al-Mansoor (HR)',
    actionedOn: '2026-10-14'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = INITIAL_EMPLOYEES.map((emp, index) => {
  const basic = emp.salary.basic;
  const allowances = emp.salary.allowances;
  const deductions = emp.salary.deductions;
  const net = basic + allowances - deductions;
  const status: 'Paid' | 'Processing' | 'Pending' = index < 12 ? 'Paid' : index < 15 ? 'Processing' : 'Pending';
  return {
    id: `PAY-2026-${1000 + index + 1}`,
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    department: emp.department,
    designation: emp.designation,
    month: 'October 2026',
    basicSalary: basic,
    allowances,
    deductions,
    netSalary: net,
    paymentStatus: status,
    paymentDate: status === 'Paid' ? '2026-10-25' : undefined,
    bankAccount: `•••• •••• ${2100 + index * 33}`
  };
});

export const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'JOB-301',
    title: 'Senior Distributed Systems Architect',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    employmentType: 'Full-Time',
    vacancies: 2,
    status: 'Open',
    postedDate: '2026-10-01',
    applicantsCount: 42
  },
  {
    id: 'JOB-302',
    title: 'Lead Product Designer (Design Systems)',
    department: 'Design',
    location: 'New York, NY / Hybrid',
    employmentType: 'Full-Time',
    vacancies: 1,
    status: 'Open',
    postedDate: '2026-10-08',
    applicantsCount: 29
  },
  {
    id: 'JOB-303',
    title: 'Enterprise Account Executive - West',
    department: 'Sales',
    location: 'Seattle, WA',
    employmentType: 'Full-Time',
    vacancies: 3,
    status: 'Open',
    postedDate: '2026-10-12',
    applicantsCount: 38
  },
  {
    id: 'JOB-304',
    title: 'AI/ML Infrastructure Specialist',
    department: 'Engineering',
    location: 'Austin, TX / Remote',
    employmentType: 'Full-Time',
    vacancies: 2,
    status: 'Open',
    postedDate: '2026-10-15',
    applicantsCount: 54
  },
  {
    id: 'JOB-305',
    title: 'Senior People Partner (HRBP)',
    department: 'Human Resources',
    location: 'Chicago, IL / Hybrid',
    employmentType: 'Full-Time',
    vacancies: 1,
    status: 'Open',
    postedDate: '2026-10-19',
    applicantsCount: 19
  },
  {
    id: 'JOB-306',
    title: 'Global Performance Marketing Manager',
    department: 'Marketing',
    location: 'New York, NY',
    employmentType: 'Full-Time',
    vacancies: 1,
    status: 'Closed',
    postedDate: '2026-09-15',
    applicantsCount: 64
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-801',
    name: 'Maya Lin',
    email: 'maya.lin@candidate.net',
    phone: '+1 (555) 765-4321',
    jobId: 'JOB-301',
    jobTitle: 'Senior Distributed Systems Architect',
    stage: 'Technical Interview',
    appliedDate: '2026-10-14',
    experience: '8 years',
    rating: 5,
    interviewDate: '2026-10-28 14:00',
    interviewer: 'Marcus Vance',
    notes: 'Exceptional deep dive on Raft consensus and Kubernetes operator patterns.'
  },
  {
    id: 'CAN-802',
    name: 'Harrison Wright',
    email: 'hwright.design@candidate.net',
    phone: '+1 (555) 890-1234',
    jobId: 'JOB-302',
    jobTitle: 'Lead Product Designer (Design Systems)',
    stage: 'Shortlisted',
    appliedDate: '2026-10-18',
    experience: '6 years',
    rating: 4,
    notes: 'Outstanding portfolio with enterprise component architecture showcase.'
  },
  {
    id: 'CAN-803',
    name: 'Ananya Sharma',
    email: 'ananya.s@candidate.net',
    phone: '+1 (555) 321-6540',
    jobId: 'JOB-304',
    jobTitle: 'AI/ML Infrastructure Specialist',
    stage: 'HR Interview',
    appliedDate: '2026-10-16',
    experience: '5 years',
    rating: 5,
    interviewDate: '2026-10-27 11:30',
    interviewer: 'Zara Al-Mansoor',
    notes: 'Passed system design with top marks. Cultural alignment interview next.'
  },
  {
    id: 'CAN-804',
    name: 'Lucas Ferreira',
    email: 'lucas.f@candidate.net',
    phone: '+1 (555) 543-8901',
    jobId: 'JOB-303',
    jobTitle: 'Enterprise Account Executive - West',
    stage: 'Selected',
    appliedDate: '2026-10-09',
    experience: '7 years',
    rating: 5,
    notes: 'Offer package sent for formal sign-off. Projected start date Nov 15.'
  },
  {
    id: 'CAN-805',
    name: 'Seraphina Rossi',
    email: 'seraphina.r@candidate.net',
    phone: '+1 (555) 678-2345',
    jobId: 'JOB-301',
    jobTitle: 'Senior Distributed Systems Architect',
    stage: 'Applied',
    appliedDate: '2026-10-24',
    experience: '4 years',
    rating: 4,
    notes: 'Resume screened. Good foundational distributed experience at fintech firm.'
  },
  {
    id: 'CAN-806',
    name: 'David Zhao',
    email: 'david.zhao@candidate.net',
    phone: '+1 (555) 901-2345',
    jobId: 'JOB-305',
    jobTitle: 'Senior People Partner (HRBP)',
    stage: 'Applied',
    appliedDate: '2026-10-25',
    experience: '6 years',
    rating: 3,
    notes: 'Solid background in tech scaleup HR operations.'
  },
  {
    id: 'CAN-807',
    name: 'Ethan Blake',
    email: 'ethan.b@candidate.net',
    phone: '+1 (555) 432-1098',
    jobId: 'JOB-303',
    jobTitle: 'Enterprise Account Executive - West',
    stage: 'Rejected',
    appliedDate: '2026-10-12',
    experience: '2 years',
    rating: 2,
    notes: 'Required enterprise quota track record did not match minimum criteria.'
  }
];

export const INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: 'EVT-01',
    type: 'leave_submitted',
    title: 'Leave Request Submitted',
    description: 'Tariq Okonkwo requested 6 days Earned Leave starting Nov 10.',
    timestamp: '28 minutes ago',
    actor: 'Tariq Okonkwo'
  },
  {
    id: 'EVT-02',
    type: 'candidate_shortlisted',
    title: 'Candidate Progressed',
    description: 'Ananya Sharma advanced to HR Interview for AI/ML Infrastructure.',
    timestamp: '1 hour ago',
    actor: 'Zara Al-Mansoor'
  },
  {
    id: 'EVT-03',
    type: 'attendance_recorded',
    title: 'Attendance Cycle Completed',
    description: '15 of 16 scheduled employees logged attendance for today.',
    timestamp: '2 hours ago',
    actor: 'System Auto-Engine'
  },
  {
    id: 'EVT-04',
    type: 'payroll_processed',
    title: 'October Payroll Batch Disbursed',
    description: '12 salaries settled via direct deposit, totaling ₹13,48,500.',
    timestamp: '4 hours ago',
    actor: 'Finance Dept'
  },
  {
    id: 'EVT-05',
    type: 'employee_joined',
    title: 'New Member Onboarding',
    description: 'Ingrid Berg completed probation milestone in Product Design.',
    timestamp: '1 day ago',
    actor: 'People Team'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Pending Leave Approvals',
    message: '2 leave applications (Devon Kowalski & Tariq Okonkwo) are waiting for your review.',
    time: '35m ago',
    read: false,
    type: 'leave'
  },
  {
    id: 'NOTIF-2',
    title: 'Candidate Interview Today',
    message: 'Interview with Ananya Sharma is scheduled today at 11:30 AM.',
    time: '2h ago',
    read: false,
    type: 'hiring'
  },
  {
    id: 'NOTIF-3',
    title: 'Payroll Settlement Notice',
    message: 'October 2026 payroll batch has 3 pending employee payouts awaiting verification.',
    time: '5h ago',
    read: true,
    type: 'payroll'
  },
  {
    id: 'NOTIF-4',
    title: 'Attendance Insight',
    message: 'Engineering department reached 100% on-time attendance today.',
    time: '7h ago',
    read: true,
    type: 'attendance'
  }
];
