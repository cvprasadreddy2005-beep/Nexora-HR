import React from 'react';
import {
  Users,
  UserCheck,
  CalendarOff,
  Briefcase,
  Clock,
  IndianRupee,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  UserPlus,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../../utils/chartSetup';
import { useApp } from '../../context/AppContext';

interface WorkforceCommandCenterProps {
  onOpenQuickAction: (action: string) => void;
  onSelectEmployee: (empId: string) => void;
}

export const WorkforceCommandCenter: React.FC<WorkforceCommandCenterProps> = ({
  onOpenQuickAction,
  onSelectEmployee
}) => {
  const {
    employees,
    attendance,
    leaves,
    jobs,
    payroll,
    candidates,
    events,
    currentRole,
    currentEmployeeUser,
    setActiveTab,
    theme
  } = useApp();

  // Metrics Calculations
  const totalEmployees = employees.length;
  const todayStr = '2026-10-26';
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentTodayCount = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late' || a.status === 'Half-Day').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;
  const openPositionsCount = jobs.filter((j) => j.status === 'Open').length;
  const pendingApprovalsCount = leaves.filter((l) => l.status === 'Pending').length;
  const totalMonthlyPayroll = payroll.reduce((acc, p) => acc + p.netSalary, 0);

  // Department distribution
  const deptCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
  });

  // Calculate highest attendance department
  const deptAttendance: Record<string, { present: number; total: number }> = {};
  employees.forEach((emp) => {
    if (!deptAttendance[emp.department]) {
      deptAttendance[emp.department] = { present: 0, total: 0 };
    }
    deptAttendance[emp.department].total += 1;
  });
  todayAttendance.forEach((att) => {
    if (deptAttendance[att.department] && att.status !== 'Absent') {
      deptAttendance[att.department].present += 1;
    }
  });

  let topDept = 'Engineering';
  let topRate = 0;
  Object.entries(deptAttendance).forEach(([dept, val]) => {
    const rate = val.total > 0 ? (val.present / val.total) * 100 : 0;
    if (rate > topRate) {
      topRate = rate;
      topDept = dept;
    }
  });

  // Leave overlap check
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

  // Chart configuration constants based on theme
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // Chart 1: Employee Growth Over Time (realistic historical data)
  const growthData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Total Workforce',
        data: [10, 11, 13, 14, 15, totalEmployees],
        borderColor: '#6366f1',
        backgroundColor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: '#6366f1',
        pointRadius: 3.5,
        pointHoverRadius: 6
      }
    ]
  };

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        grid: { color: 'transparent' },
        ticks: { color: textColor, font: { size: 11, family: 'Plus Jakarta Sans' } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11, family: 'Plus Jakarta Sans' }, precision: 0 }
      }
    }
  };

  // Chart 2: Weekly Attendance Trends
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Present',
        data: [15, 14, 16, 15, presentTodayCount],
        backgroundColor: '#4f46e5',
        borderRadius: 6
      },
      {
        label: 'Late / Half-Day',
        data: [1, 2, 0, 1, 2],
        backgroundColor: '#f59e0b',
        borderRadius: 6
      }
    ]
  };

  const attendanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: { color: textColor, font: { size: 11 }, boxWidth: 10, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 }, precision: 0 }
      }
    }
  };

  // Chart 3: Department Distribution
  const doughnutData = {
    labels: Object.keys(deptCounts),
    datasets: [
      {
        data: Object.values(deptCounts),
        backgroundColor: [
          '#4f46e5',
          '#06b6d4',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#ec4899',
          '#64748b'
        ],
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: textColor,
          font: { size: 11, family: 'Plus Jakarta Sans' },
          boxWidth: 10,
          usePointStyle: true
        }
      }
    },
    cutout: '72%'
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* A. Welcome Banner & System Status */}
      <div className="rounded-2xl border border-slate-800 p-6 text-white shadow-xl relative overflow-hidden bg-slate-950">
        {/* Ambient Neutral Architecture Workplace Backdrop */}
        <img
          src="/src/assets/images/neutral_workforce_bg_1793158719271.jpg"
          alt="NEXORA Workplace Architecture"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-indigo-950/85 to-slate-950/90 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-purple-500 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Intelligent Workforce Command</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Welcome back, {currentEmployeeUser.firstName}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              All 7 global functional units are operational. Today's workforce synchronization stands at{' '}
              <span className="text-emerald-400 font-semibold">{Math.round((presentTodayCount / totalEmployees) * 100)}%</span> with{' '}
              <span className="text-amber-300 font-semibold">{pendingApprovalsCount} pending administrative actions</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenQuickAction('record_attendance')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-950 hover:bg-slate-100 shadow-md transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mark My Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/60 hover:bg-indigo-600 text-white border border-indigo-500/40 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Request Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* B. Workforce Overview Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* Stat 1: Total Employees */}
        <div
          onClick={() => setActiveTab('employees')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Workforce</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {totalEmployees}
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across 7 departments</div>
        </div>

        {/* Stat 2: Present Today */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Present Today</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {presentTodayCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {Math.round((presentTodayCount / totalEmployees) * 100)}% active
            </span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">15 verified check-ins</div>
        </div>

        {/* Stat 3: Employees on Leave */}
        <div
          onClick={() => setActiveTab('leave')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">On Leave</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <CalendarOff className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {onLeaveCount}
            </span>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              1 Medical
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled return Oct 29</div>
        </div>

        {/* Stat 4: Open Positions */}
        <div
          onClick={() => setActiveTab('recruitment')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Open Positions</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {openPositionsCount}
            </span>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {candidates.length} in funnel
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Engineering & Design</div>
        </div>

        {/* Stat 5: Pending Approvals */}
        <div
          onClick={() => setActiveTab('leave')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pending Approvals</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {pendingApprovalsCount}
            </span>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Action Req.
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">2 leave requests</div>
        </div>

        {/* Stat 6: Monthly Payroll Summary */}
        <div
          onClick={() => setActiveTab('payroll')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">October Payroll</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ₹{(totalMonthlyPayroll / 100000).toFixed(1)}L
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Disbursed
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">₹{totalMonthlyPayroll.toLocaleString('en-IN')} total</div>
        </div>

      </div>

      {/* C. Workforce Intelligence Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Chart 1: Attendance Trends */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Weekly Performance</h2>
              <p className="text-xs text-slate-400">Daily check-in and punctuality volume</p>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full Log</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-64">
            <Bar data={attendanceData} options={attendanceOptions} />
          </div>
        </div>

        {/* Chart 2: Department Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Department Composition</h2>
              <p className="text-xs text-slate-400">Headcount allocation by team</p>
            </div>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-28">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{totalEmployees}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Staff</span>
            </div>
          </div>
        </div>

      </div>

      {/* D. Bottom Row: Smart Insights, Quick Actions, and Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left: Smart Insights Panel */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Workforce Smart Insights</h2>
              <p className="text-[11px] text-slate-400">Computed from live demonstration datasets</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Insight 1: Department Attendance */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Peak Department Attendance
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  {Math.round(topRate)}% on-time
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <strong className="text-indigo-600 dark:text-indigo-400">{topDept}</strong> recorded the highest punctuality rate today with zero unexcused absences.
              </p>
            </div>

            {/* Insight 2: Leave Overlaps */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Upcoming Leave Schedule
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  {pendingLeaves.length} pending
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Devon Kowalski (Design) has a 2-day leave starting Oct 30. No project delivery conflicts detected.
              </p>
            </div>

            {/* Insight 3: Hiring Pipeline Status */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Talent Funnel Velocity
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                2 candidates in final interview stages; 1 candidate ready for offer release.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Action Studio */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Quick Action Studio</h2>
            <p className="text-xs text-slate-400 mb-4">Execute administrative and operational workflows</p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setActiveTab('employees');
                  onOpenQuickAction('add_employee');
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
              >
                <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Add Employee</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Register new profile</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('attendance');
                  onOpenQuickAction('record_attendance');
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/60 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
              >
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Log Attendance</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Clock in / Clock out</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('leave');
                  onOpenQuickAction('apply_leave');
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 dark:bg-slate-800/60 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
              >
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Apply Leave</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Submit request</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('recruitment');
                  onOpenQuickAction('create_job');
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 dark:bg-slate-800/60 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
              >
                <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Open Requisition</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Post new vacancy</div>
              </button>

              <button
                onClick={() => setActiveTab('leave')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800/60 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
              >
                <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Review Leaves</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{pendingApprovalsCount} awaiting action</div>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Export Report</div>
                <div className="text-[10px] text-slate-400 mt-0.5">CSV & Print format</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Activity Timeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Live Activity Stream</h2>
              <p className="text-xs text-slate-400">Chronological workforce events</p>
            </div>
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-80 pr-1">
            {events.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{evt.title}</p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{evt.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {evt.description}
                  </p>
                  <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                    By {evt.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
