import React, { useState } from 'react';
import {
  User,
  Clock,
  CalendarDays,
  FileText,
  Bell,
  Settings,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Shield,
  UserCheck,
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PayslipModal } from '../Payroll/PayslipModal';
import { UserRole } from '../../types';

export const PersonalWorkspace: React.FC = () => {
  const {
    currentEmployeeUser,
    currentRole,
    setCurrentRole,
    attendance,
    leaves,
    payroll,
    notifications,
    recordAttendance,
    setActiveTab,
    theme,
    toggleTheme,
    addToast
  } = useApp();

  const [activeSection, setActiveSection] = useState<'profile' | 'attendance' | 'leaves' | 'payslip' | 'notifications' | 'settings'>('profile');
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

  // User's specific attendance records
  const myAttendance = attendance.filter((a) => a.employeeId === currentEmployeeUser.id);
  const todayRecord = myAttendance.find((a) => a.date === '2026-10-26');

  // User's specific leave requests
  const myLeaves = leaves.filter((l) => l.employeeId === currentEmployeeUser.id);

  // User's payslip
  const myPayroll = payroll.find((p) => p.employeeId === currentEmployeeUser.id) || payroll[0];

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    addToast({
      type: 'info',
      title: 'Perspective Changed',
      message: `Active view updated to ${role.toUpperCase()}.`
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Perspective Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Personal Workspace</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Employee Self-Service
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Personal employment profile, self check-in clock, leave balances, and salary vouchers
          </p>
        </div>

        {/* Clear Demonstration Role Notice */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 text-[11px] text-indigo-700 dark:text-indigo-300 max-w-md">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Logged in as <strong>{currentEmployeeUser.firstName} {currentEmployeeUser.lastName}</strong>. Switch role below for demonstration purposes.
          </span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none max-w-full">
        <button
          onClick={() => setActiveSection('profile')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeSection === 'profile'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveSection('attendance')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeSection === 'attendance'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>My Attendance</span>
        </button>

        <button
          onClick={() => setActiveSection('leaves')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeSection === 'leaves'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>My Leaves ({myLeaves.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('payslip')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeSection === 'payslip'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Payslip</span>
        </button>

        <button
          onClick={() => setActiveSection('settings')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeSection === 'settings'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings & Perspectives</span>
        </button>
      </div>

      {/* Section 1: My Profile */}
      {activeSection === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
              <img
                src={currentEmployeeUser.avatar}
                alt={currentEmployeeUser.firstName}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentEmployeeUser.firstName} {currentEmployeeUser.lastName}
                  </h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                    {currentEmployeeUser.id}
                  </span>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  {currentEmployeeUser.designation} · {currentEmployeeUser.department}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {currentEmployeeUser.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {currentEmployeeUser.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs">
              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Employment Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentEmployeeUser.status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Employment Type</span>
                    <span>{currentEmployeeUser.employmentType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Date Joined</span>
                    <span className="font-mono">{currentEmployeeUser.joiningDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Education</span>
                    <span>{currentEmployeeUser.education}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Emergency Contact
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {currentEmployeeUser.emergencyContact.name} ({currentEmployeeUser.emergencyContact.relation})
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono">
                    {currentEmployeeUser.emergencyContact.phone}
                  </p>
                </div>

                <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-400 pt-2">
                  Skills & Tools
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentEmployeeUser.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: My Attendance */}
      {activeSection === 'attendance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance Self-Service</h2>
                <p className="text-xs text-slate-400">Record your shift arrival or departure timestamp</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => recordAttendance(currentEmployeeUser.id, 'checkIn')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Clock In</span>
                </button>
                <button
                  onClick={() => recordAttendance(currentEmployeeUser.id, 'checkOut')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Clock Out</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Today's Recorded Punch: </span>
              {todayRecord ? (
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold ml-1">
                  In: {todayRecord.checkIn} · Out: {todayRecord.checkOut} ({todayRecord.workHours}h logged · {todayRecord.status})
                </span>
              ) : (
                <span className="text-slate-400 italic ml-1">Not stamped yet today.</span>
              )}
            </div>

            {/* Attendance History */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Attendance Log
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">In</th>
                      <th className="py-2.5 px-3">Out</th>
                      <th className="py-2.5 px-3">Hours</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {myAttendance.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2.5 px-3 font-mono">{a.date}</td>
                        <td className="py-2.5 px-3 font-mono">{a.checkIn}</td>
                        <td className="py-2.5 px-3 font-mono">{a.checkOut}</td>
                        <td className="py-2.5 px-3 font-mono">{a.workHours}h</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: My Leaves */}
      {activeSection === 'leaves' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">My Leave Overview</h2>
                <p className="text-xs text-slate-400">Your approved quotas and pending requests</p>
              </div>

              <button
                onClick={() => setActiveTab('leave')}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                Apply for New Leave
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400">Casual Leave Remaining</span>
                <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                  {currentEmployeeUser.leaveBalance.casual} days
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400">Sick Leave Remaining</span>
                <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                  {currentEmployeeUser.leaveBalance.sick} days
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400">Earned Vacation Leave</span>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {currentEmployeeUser.leaveBalance.earned} days
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                My Requests History
              </h3>
              {myLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No leave applications filed yet.</p>
              ) : (
                <div className="space-y-2">
                  {myLeaves.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {l.leaveType} ({l.days} days)
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {l.startDate} to {l.endDate}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
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
      )}

      {/* Section 4: My Payslip */}
      {activeSection === 'payslip' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Monthly Payslip Preview</h2>
                <p className="text-xs text-slate-400">View and print your latest compensation breakdown</p>
              </div>

              <button
                onClick={() => setIsPayslipOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Open Printable Voucher</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Period:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{myPayroll.month}</p>
              </div>
              <div>
                <span className="text-slate-400">Basic Pay:</span>
                <p className="font-mono font-semibold">₹{myPayroll.basicSalary.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-slate-400">Allowances:</span>
                <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">+₹{myPayroll.allowances.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-slate-400">Net Take-Home:</span>
                <p className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  ₹{myPayroll.netSalary.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Settings & Perspectives */}
      {activeSection === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Workspace Perspectives & Preferences</h2>
              <p className="text-xs text-slate-400">Switch demonstration roles and theme preferences</p>
            </div>

            {/* Role switchers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Perspective Switcher (Frontend Simulation)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    currentRole === 'admin'
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/60 border-indigo-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Shield className="w-5 h-5 text-indigo-600 mb-2" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">System Administrator</div>
                  <p className="text-[11px] text-slate-400 mt-1">Full write access, approval rights, and salary editing</p>
                </button>

                <button
                  onClick={() => handleRoleChange('hr_manager')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    currentRole === 'hr_manager'
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/60 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">HR Manager</div>
                  <p className="text-[11px] text-slate-400 mt-1">Talent recruitment, employee directory, leave authorizations</p>
                </button>

                <button
                  onClick={() => handleRoleChange('employee')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    currentRole === 'employee'
                      ? 'bg-amber-50/60 dark:bg-amber-950/60 border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <User className="w-5 h-5 text-amber-600 mb-2" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Employee Self-Service</div>
                  <p className="text-[11px] text-slate-400 mt-1">Personal attendance logging, leave submission, voucher view</p>
                </button>
              </div>
            </div>

            {/* Appearance */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visual Experience
              </h3>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Interface Theme</p>
                  <p className="text-[11px] text-slate-400">Current mode: {theme === 'dark' ? 'Midnight Navy' : 'Crisp Light'}</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-2xs hover:bg-slate-100"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      <PayslipModal
        isOpen={isPayslipOpen}
        record={myPayroll}
        onClose={() => setIsPayslipOpen(false)}
      />

    </div>
  );
};
