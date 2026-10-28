import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  User,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest, LeaveType } from '../../types';
import { ConfirmModal } from '../ConfirmModal';

interface LeaveFlowCenterProps {
  initialOpenApply?: boolean;
}

export const LeaveFlowCenter: React.FC<LeaveFlowCenterProps> = ({ initialOpenApply = false }) => {
  const {
    leaves,
    employees,
    applyLeave,
    reviewLeave,
    currentRole,
    currentEmployeeUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(initialOpenApply);

  // Review confirmation modal
  const [reviewTarget, setReviewTarget] = useState<{ id: string; status: 'Approved' | 'Rejected' } | null>(null);

  // Apply Form State
  const [applicantEmpId, setApplicantEmpId] = useState(currentEmployeeUser.id);
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [startDate, setStartDate] = useState('2026-11-02');
  const [endDate, setEndDate] = useState('2026-11-04');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  // Calculate duration in days
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = d2.getTime() - d1.getTime();
    if (diffTime < 0) return -1;
    return Math.round(diffTime / (1000 * 3600 * 24)) + 1;
  };

  const calculatedDays = calculateDays(startDate, endDate);

  // Filtered leaves
  const filteredLeaves = leaves.filter((l) => {
    const matchesTab = activeTab === 'All' || l.status === activeTab;
    const matchesSearch =
      l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (calculatedDays <= 0) {
      setFormError('End date cannot be prior to start date.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please specify the reason for your leave request.');
      return;
    }

    const emp = employees.find((e) => e.id === applicantEmpId) || currentEmployeeUser;

    applyLeave({
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      leaveType,
      startDate,
      endDate,
      days: calculatedDays,
      reason: reason.trim()
    });

    setIsApplyModalOpen(false);
    setReason('');
  };

  const handleExecuteReview = () => {
    if (reviewTarget) {
      reviewLeave(reviewTarget.id, reviewTarget.status);
      setReviewTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Apply Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Leave Flow Center</span>
            {pendingCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {pendingCount} review required
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Streamlined time-off applications, calendar conflict checks, and managerial approval workflows
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Overview Cards for Active Profile */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Leave Balances Allocation
            </span>
            <span className="text-[11px] text-slate-400">
              ({currentEmployeeUser.firstName} {currentEmployeeUser.lastName} · {currentEmployeeUser.department})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Fiscal Year 2026</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-400">Casual Leave (CL)</span>
            <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
              {currentEmployeeUser.leaveBalance.casual} <span className="text-xs font-normal">days</span>
            </div>
            <span className="text-[10px] text-slate-400">Remaining quota</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-400">Sick Leave (SL)</span>
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              {currentEmployeeUser.leaveBalance.sick} <span className="text-xs font-normal">days</span>
            </div>
            <span className="text-[10px] text-slate-400">Medical emergency</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-400">Earned Leave (EL)</span>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {currentEmployeeUser.leaveBalance.earned} <span className="text-xs font-normal">days</span>
            </div>
            <span className="text-[10px] text-slate-400">Paid vacation balance</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-400">Total Available</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {currentEmployeeUser.leaveBalance.casual +
                currentEmployeeUser.leaveBalance.sick +
                currentEmployeeUser.leaveBalance.earned}{' '}
              <span className="text-xs font-normal">days</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Active balance</span>
          </div>
        </div>
      </div>

      {/* Requests Management Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        
        {/* Tab & Search Strip */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none max-w-full shrink-0">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => {
              const count =
                tab === 'All'
                  ? leaves.length
                  : tab === 'Pending'
                  ? pendingCount
                  : tab === 'Approved'
                  ? approvedCount
                  : rejectedCount;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-600 text-slate-600 dark:text-slate-300">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leaves by person, reason..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-indigo-500"
            />
          </div>

        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Dates & Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No leave requests found matching "{activeTab}".
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{leave.id}</td>
                    
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {leave.employeeName}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {leave.department}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {leave.leaveType}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                        {leave.startDate} → {leave.endDate}
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {leave.days} {leave.days === 1 ? 'day' : 'days'}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400" title={leave.reason}>
                      {leave.reason}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : leave.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {leave.status === 'Pending' && currentRole !== 'employee' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setReviewTarget({ id: leave.id, status: 'Approved' })}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setReviewTarget({ id: leave.id, status: 'Rejected' })}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 transition-colors flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {leave.actionedBy ? `${leave.status} by ${leave.actionedBy}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Apply for Leave</h2>
                <p className="text-xs text-slate-400">Submit time-off requisition for authorization</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              
              {/* Employee selection (for Admin/HR testing) */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Applicant Profile
                </label>
                <select
                  value={applicantEmpId}
                  onChange={(e) => setApplicantEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.department} - {emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Category *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                  <option value="Other">Other / Special Bereavement / Training</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                  />
                </div>
              </div>

              {/* Duration calculation banner */}
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-between text-xs">
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  Calculated Duration:
                </span>
                <span className="font-bold font-mono text-indigo-700 dark:text-indigo-300">
                  {calculatedDays > 0 ? `${calculatedDays} Days` : 'Invalid Range'}
                </span>
              </div>

              {/* Reason */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Time-Off *
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detail the circumstances, coverage handover, or reason..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-500 font-medium">{formError}</p>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Submit Application
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Review */}
      <ConfirmModal
        isOpen={Boolean(reviewTarget)}
        title={reviewTarget?.status === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
        message={
          reviewTarget?.status === 'Approved'
            ? 'Are you sure you want to approve this leave request? This will deduct the corresponding days from the employee leave balance.'
            : 'Are you sure you want to reject this request? The employee will be notified.'
        }
        confirmLabel={reviewTarget?.status === 'Approved' ? 'Confirm Approval' : 'Confirm Rejection'}
        isDestructive={reviewTarget?.status === 'Rejected'}
        onConfirm={handleExecuteReview}
        onCancel={() => setReviewTarget(null)}
      />

    </div>
  );
};
