import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Filter,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import '../../utils/chartSetup';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';

export const AttendanceIntelligence: React.FC = () => {
  const {
    attendance,
    recordAttendance,
    employees,
    currentEmployeeUser,
    currentRole,
    theme
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-26');
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = '2026-10-26';
  const todayRecords = attendance.filter((a) => a.date === todayStr);

  const presentCount = todayRecords.filter((a) => a.status === 'Present').length;
  const lateCount = todayRecords.filter((a) => a.status === 'Late').length;
  const halfDayCount = todayRecords.filter((a) => a.status === 'Half-Day').length;
  const absentCount = todayRecords.filter((a) => a.status === 'Absent').length;

  // Find user's attendance status today
  const myRecordToday = todayRecords.find((a) => a.employeeId === currentEmployeeUser.id);
  const isCheckedIn = myRecordToday && myRecordToday.checkIn !== '-';
  const isCheckedOut = myRecordToday && myRecordToday.checkOut !== '-';

  // Filtered attendance records
  const filteredRecords = attendance.filter((rec) => {
    const matchesStatus = selectedStatusFilter === 'All' || rec.status === selectedStatusFilter;
    const matchesDept = selectedDeptFilter === 'All' || rec.department === selectedDeptFilter;
    const matchesDate = !selectedDate || rec.date === selectedDate;
    return matchesStatus && matchesDept && matchesDate;
  });

  // Chart data
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartData = {
    labels: ['Oct 20', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    datasets: [
      {
        label: 'Present',
        data: [14, 15, 15, 16, 14, 15, presentCount],
        backgroundColor: '#4f46e5',
        borderRadius: 4
      },
      {
        label: 'Late / Partial',
        data: [1, 1, 0, 0, 2, 1, lateCount + halfDayCount],
        backgroundColor: '#f59e0b',
        borderRadius: 4
      },
      {
        label: 'Absent',
        data: [1, 0, 1, 0, 0, 0, absentCount],
        backgroundColor: '#ef4444',
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: { color: textColor, font: { size: 11 }, boxWidth: 10, usePointStyle: true }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 }, precision: 0 } }
    }
  };

  // Calendar dates for October 2026 (simplified interactive demo grid)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Simulation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Attendance Intelligence</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Engine
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time biometric simulation, work hours computation, and shift punctuality tracking
          </p>
        </div>

        {/* Clear Demonstration Note as specified in Prompt */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 text-[11px] text-indigo-700 dark:text-indigo-300 max-w-md">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Simulated browser-side record verification. Actions instantly synchronize with the local demonstration database.
          </span>
        </div>
      </div>

      {/* Clock In / Out Banner Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Live Digital Clock Widget */}
          <div className="flex items-center gap-5">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Current System Timestamp
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                {currentTime.toLocaleTimeString('en-US', { hour12: true })}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Quick Check-In / Check-Out Actions for Active User */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-xs sm:mr-3">
              <p className="font-bold text-slate-900 dark:text-white">
                {currentEmployeeUser.firstName} {currentEmployeeUser.lastName}
              </p>
              <p className="text-[11px] text-slate-400">
                {myRecordToday
                  ? `Today: In ${myRecordToday.checkIn} · Out ${myRecordToday.checkOut}`
                  : 'No attendance stamped yet'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => recordAttendance(currentEmployeeUser.id, 'checkIn')}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Clock In</span>
              </button>
              <button
                onClick={() => recordAttendance(currentEmployeeUser.id, 'checkOut')}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600/80 transition-all flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Clock Out</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Today's Breakdown Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Present</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {presentCount}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            On-time workforce
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Late Arrival</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {lateCount}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            After 9:15 AM
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Half-Day Shift</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {halfDayCount}
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            4.5 hrs average
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Excused / Absent</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {absentCount}
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            1 on approved leave
          </span>
        </div>

      </div>

      {/* 2-Column: Weekly Trend Chart & Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Attendance Trends Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Stability Curve</h2>
              <p className="text-xs text-slate-400">Punctuality and presence across the previous 7 recording days</p>
            </div>
          </div>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Interactive Month Calendar Heatmap */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedMonth}</span>
              <span className="text-[10px] text-slate-400 font-mono">31 days</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day) => {
                const dateStr = `2026-10-${day < 10 ? `0${day}` : day}`;
                const isSelected = selectedDate === dateStr;
                const isToday = day === 26;
                const isWeekend = (day % 7 === 4 || day % 7 === 5); // approximate

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-7 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400/50'
                        : isToday
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                        : isWeekend
                        ? 'text-slate-300 dark:text-slate-700'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Viewing: <strong className="text-slate-700 dark:text-slate-200">{selectedDate}</strong></span>
            <button
              onClick={() => setSelectedDate('2026-10-26')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Reset to Today
            </button>
          </div>
        </div>

      </div>

      {/* Attendance Log Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Attendance Records</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredRecords.length} records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Half-Day">Half-Day</option>
              <option value="Absent">Absent</option>
            </select>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No attendance entries match the selected filters for {selectedDate}.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {rec.employeeName}
                      <span className="block text-[10px] font-mono font-normal text-slate-400">
                        {rec.employeeId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{rec.department}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{rec.date}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                      {rec.checkIn}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                      {rec.checkOut}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      {rec.workHours > 0 ? `${rec.workHours}h` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : rec.status === 'Late'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                            : rec.status === 'Half-Day'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {rec.notes || 'Normal shift completion'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
