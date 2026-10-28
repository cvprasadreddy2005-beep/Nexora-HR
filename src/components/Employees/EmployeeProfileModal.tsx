import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Shield,
  Clock,
  IndianRupee,
  HeartHandshake,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { Employee } from '../../types';
import { useApp } from '../../context/AppContext';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit
}) => {
  const { attendance, leaves, currentRole } = useApp();

  if (!isOpen || !employee) return null;

  // Calculate employee stats
  const empAttendance = attendance.filter((a) => a.employeeId === employee.id);
  const presentDays = empAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = empAttendance.length > 0 ? Math.round((presentDays / empAttendance.length) * 100) : 96;

  const empLeaves = leaves.filter((l) => l.employeeId === employee.id);
  const netSalary = employee.salary.basic + employee.salary.allowances - employee.salary.deductions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Profile Head */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative">
              <img
                src={employee.avatar}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute bottom-0 right-0 px-2 py-0.5 text-[10px] font-bold rounded-md ring-2 ring-slate-900 ${
                  employee.status === 'Active'
                    ? 'bg-emerald-500 text-white'
                    : employee.status === 'On Leave'
                    ? 'bg-purple-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {employee.status}
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {employee.firstName} {employee.lastName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-indigo-200">
                  {employee.id}
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium">{employee.designation}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  {employee.department} · {employee.employmentType}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {employee.location}
                </span>
              </div>
            </div>

            {currentRole !== 'employee' && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
                className="px-4 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl shadow-md transition-colors whitespace-nowrap"
              >
                Edit Records
              </button>
            )}
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400">Attendance Rate</span>
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {attendanceRate}%
              </div>
              <span className="text-[10px] text-slate-400">Oct 2026 cycle</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400">Casual Leave Left</span>
              <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                {employee.leaveBalance.casual} days
              </div>
              <span className="text-[10px] text-slate-400">of 12 allocated</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400">Sick Leave Left</span>
              <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                {employee.leaveBalance.sick} days
              </div>
              <span className="text-[10px] text-slate-400">Medical quota</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400">Monthly Net Pay</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                ₹{netSalary.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Direct deposit</span>
            </div>
          </div>

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Contact & Education */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                Contact & Identity
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{employee.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{employee.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Joining Date:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{employee.joiningDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Education:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{employee.education}</span>
                </div>
                <div className="flex items-start justify-between pt-1">
                  <span className="text-slate-400">Emergency Contact:</span>
                  <div className="text-right">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{employee.emergencyContact.name}</p>
                    <p className="text-[11px] text-slate-400">{employee.emergencyContact.phone} ({employee.emergencyContact.relation})</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Core Competencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Salary & Recent Activity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                Compensation Breakdown
              </h3>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Basic Monthly:</span>
                  <span className="font-mono font-medium">₹{employee.salary.basic.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Allowances & Stipend:</span>
                  <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    +₹{employee.salary.allowances.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Statutory Deductions & Tax:</span>
                  <span className="font-mono font-medium text-red-500">
                    -₹{employee.salary.deductions.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold">
                  <span>Net Take-Home Pay:</span>
                  <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400">
                    ₹{netSalary.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Leave Requests Log */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Leave Activity History:</h4>
                {empLeaves.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No leave history recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {empLeaves.map((l) => (
                      <div
                        key={l.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40 text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {l.leaveType} ({l.days} days)
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {l.startDate} to {l.endDate}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            l.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : l.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Demonstration record · Privacy safeguarded</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
