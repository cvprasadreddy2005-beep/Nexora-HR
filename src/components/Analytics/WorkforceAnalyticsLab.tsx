import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Filter,
  Users,
  Clock,
  CalendarDays,
  IndianRupee,
  PieChart as PieIcon,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../../utils/chartSetup';
import { useApp } from '../../context/AppContext';

export const WorkforceAnalyticsLab: React.FC = () => {
  const { employees, attendance, leaves, payroll, candidates, jobs, theme, addToast } = useApp();

  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('Q4 2026');

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // Department counts
  const filteredEmployees = selectedDept === 'All'
    ? employees
    : employees.filter((e) => e.department === selectedDept);

  // Department headcount breakdown
  const deptDist: Record<string, number> = {};
  employees.forEach((e) => {
    deptDist[e.department] = (deptDist[e.department] || 0) + 1;
  });

  // Leave breakdown
  const leaveCounts: Record<string, number> = {
    'Casual Leave': 0,
    'Sick Leave': 0,
    'Earned Leave': 0,
    'Other': 0
  };
  leaves.forEach((l) => {
    leaveCounts[l.leaveType] = (leaveCounts[l.leaveType] || 0) + l.days;
  });

  // Recruitment funnel counts
  const funnelStages = {
    'Applied': candidates.filter((c) => c.stage === 'Applied').length,
    'Shortlisted': candidates.filter((c) => c.stage === 'Shortlisted').length,
    'Interview': candidates.filter((c) => c.stage === 'Technical Interview' || c.stage === 'HR Interview').length,
    'Selected': candidates.filter((c) => c.stage === 'Selected').length,
    'Rejected': candidates.filter((c) => c.stage === 'Rejected').length
  };

  // Chart 1: Headcount Growth (6 months)
  const growthChartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Staff Count',
        data: [10, 11, 13, 14, 15, employees.length],
        borderColor: '#4f46e5',
        backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5
      }
    ]
  };

  // Chart 2: Leave Utilization by Type
  const leaveChartData = {
    labels: Object.keys(leaveCounts),
    datasets: [
      {
        label: 'Total Days Utilized',
        data: Object.values(leaveCounts),
        backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ec4899'],
        borderRadius: 6
      }
    ]
  };

  // Chart 3: Recruitment Funnel Conversion
  const funnelChartData = {
    labels: Object.keys(funnelStages),
    datasets: [
      {
        label: 'Candidates',
        data: Object.values(funnelStages),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#6366f1', '#10b981', '#94a3b8'],
        borderRadius: 6
      }
    ]
  };

  // CSV Exporter Helper
  const exportToCSV = (datasetName: 'employees' | 'attendance' | 'leaves' | 'payroll') => {
    let csvContent = '';
    let filename = `nexora_${datasetName}_${new Date().toISOString().split('T')[0]}.csv`;

    if (datasetName === 'employees') {
      csvContent = 'ID,Name,Email,Department,Designation,Status,Type,Joining Date,Basic Salary,Net Salary\n';
      filteredEmployees.forEach((e) => {
        const net = e.salary.basic + e.salary.allowances - e.salary.deductions;
        csvContent += `"${e.id}","${e.firstName} ${e.lastName}","${e.email}","${e.department}","${e.designation}","${e.status}","${e.employmentType}","${e.joiningDate}",${e.salary.basic},${net}\n`;
      });
    } else if (datasetName === 'attendance') {
      csvContent = 'ID,Employee ID,Employee Name,Department,Date,Clock In,Clock Out,Work Hours,Status\n';
      attendance.forEach((a) => {
        csvContent += `"${a.id}","${a.employeeId}","${a.employeeName}","${a.department}","${a.date}","${a.checkIn}","${a.checkOut}",${a.workHours},"${a.status}"\n`;
      });
    } else if (datasetName === 'leaves') {
      csvContent = 'Request ID,Employee ID,Employee Name,Department,Leave Type,Start Date,End Date,Days,Status,Reason\n';
      leaves.forEach((l) => {
        csvContent += `"${l.id}","${l.employeeId}","${l.employeeName}","${l.department}","${l.leaveType}","${l.startDate}","${l.endDate}",${l.days},"${l.status}","${l.reason.replace(/"/g, '""')}"\n`;
      });
    } else if (datasetName === 'payroll') {
      csvContent = 'Payroll ID,Employee ID,Employee Name,Department,Designation,Month,Basic Salary,Allowances,Deductions,Net Salary,Payment Status\n';
      payroll.forEach((p) => {
        csvContent += `"${p.id}","${p.employeeId}","${p.employeeName}","${p.department}","${p.designation}","${p.month}",${p.basicSalary},${p.allowances},${p.deductions},${p.netSalary},"${p.paymentStatus}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'CSV Export Generated',
      message: `Downloaded ${filename} successfully.`
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Workforce Analytics Lab</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Q4 Intelligence
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-departmental telemetry, attrition modeling, leave trends, and recruitment analytics
          </p>
        </div>

        <div className="no-print flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Report</span>
          </button>

          <div className="relative group">
            <button
              onClick={() => exportToCSV('employees')}
              className="px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Options Strip */}
      <div className="no-print p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Filters:</span>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-indigo-500"
          >
            <option value="All">All Functional Units</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-indigo-500 font-mono"
          >
            <option value="Q4 2026">Q4 2026 (Oct - Dec)</option>
            <option value="Q3 2026">Q3 2026 (Jul - Sep)</option>
            <option value="Full Year 2026">Full Year 2026</option>
          </select>
        </div>

        {/* Quick CSV Export Selectors */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-400 mr-1 hidden md:inline">Download CSV:</span>
          <button
            onClick={() => exportToCSV('employees')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            Employees
          </button>
          <button
            onClick={() => exportToCSV('attendance')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            Attendance
          </button>
          <button
            onClick={() => exportToCSV('leaves')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            Leaves
          </button>
          <button
            onClick={() => exportToCSV('payroll')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            Payroll
          </button>
        </div>
      </div>

      {/* Printable Area Container */}
      <div className="printable-area space-y-6">
        
        {/* Executive Header for Print Reports */}
        <div className="hidden print-only pb-4 border-b border-slate-300">
          <h1 className="text-xl font-bold uppercase text-slate-900">NEXORA HR — Executive Workforce Intelligence Report</h1>
          <p className="text-xs text-slate-500">Generated on {new Date().toLocaleDateString()} for period: {selectedPeriod}</p>
        </div>

        {/* Analytics KPI Quad */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-medium text-slate-400">Total Headcount</span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {filteredEmployees.length}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+14% Growth</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-medium text-slate-400">Punctuality Score</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              94.2%
            </div>
            <span className="text-[11px] text-slate-400">Across all units</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-medium text-slate-400">Leaves Taken</span>
            <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
              16 days
            </div>
            <span className="text-[11px] text-slate-400">Oct 2026 total</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-medium text-slate-400">Talent Pipeline Ratio</span>
            <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
              5.2:1
            </div>
            <span className="text-[11px] text-slate-400">Applicants to offer</span>
          </div>
        </div>

        {/* 2-Column Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Headcount Trends Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Headcount Growth Trajectory</h2>
                <p className="text-xs text-slate-400">Net additions over 6-month fiscal trajectory</p>
              </div>
            </div>
            <div className="h-60">
              <Line data={growthChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Leave Utilization Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Leave Days by Category</h2>
                <p className="text-xs text-slate-400">Distribution across casual, sick, and earned time-off</p>
              </div>
            </div>
            <div className="h-60">
              <Bar data={leaveChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

        </div>

        {/* Recruitment Funnel Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recruitment Pipeline Conversion Funnel</h2>
              <p className="text-xs text-slate-400">Volume drop-off from initial application to final candidate selection</p>
            </div>
          </div>
          <div className="h-56">
            <Bar data={funnelChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>

    </div>
  );
};
