import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  CreditCard,
  Search,
  Filter,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import '../../utils/chartSetup';
import { useApp } from '../../context/AppContext';
import { PayrollRecord, PaymentStatus } from '../../types';
import { PayslipModal } from './PayslipModal';

export const PayrollStudio: React.FC = () => {
  const { payroll, updatePayrollStatus, currentRole, theme } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);

  // Totals calculations
  const totalGross = payroll.reduce((acc, p) => acc + p.basicSalary + p.allowances, 0);
  const totalDeductions = payroll.reduce((acc, p) => acc + p.deductions, 0);
  const totalNet = payroll.reduce((acc, p) => acc + p.netSalary, 0);
  const avgNet = payroll.length > 0 ? Math.round(totalNet / payroll.length) : 0;

  // Filtered records
  const filteredRecords = payroll.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || p.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || p.paymentStatus === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Department payroll breakdown for Chart
  const deptPayroll: Record<string, number> = {};
  payroll.forEach((p) => {
    deptPayroll[p.department] = (deptPayroll[p.department] || 0) + p.netSalary;
  });

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartData = {
    labels: Object.keys(deptPayroll),
    datasets: [
      {
        label: 'Net Payroll (₹)',
        data: Object.values(deptPayroll),
        backgroundColor: '#6366f1',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Simulation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Payroll & Compensation Studio</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              October 2026 Batch
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated salary computations, allowance distribution, tax withholdings, and voucher generation
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 max-w-md">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Demonstration payroll calculations only. Does not initiate financial disbursements or guarantee tax compliance.
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-400">Total Net Disbursed</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            ₹{(totalNet / 100000).toFixed(1)}L
          </div>
          <span className="text-[11px] text-slate-400">16 total recipients</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-400">Gross Monthly Payroll</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            ₹{(totalGross / 100000).toFixed(1)}L
          </div>
          <span className="text-[11px] text-slate-400">Basic + Allowances</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-400">Statutory Deductions</span>
          <div className="text-2xl font-bold font-mono text-red-500 mt-1 tabular-nums">
            ₹{(totalDeductions / 100000).toFixed(1)}L
          </div>
          <span className="text-[11px] text-slate-400">Withholdings & EPF</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-400">Average Compensation</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            ₹{avgNet.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">Per employee monthly</span>
        </div>
      </div>

      {/* Department Payroll Breakdown Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Departmental Payroll Allocation</h2>
            <p className="text-xs text-slate-400">Net salary outlay aggregated across functional business departments</p>
          </div>
        </div>
        <div className="h-56">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Salary Records Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Employee Compensation Register</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {filteredRecords.length} records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, ID..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-indigo-500"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
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

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
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
                <th className="py-3 px-4 text-right">Basic Salary</th>
                <th className="py-3 px-4 text-right">Allowances</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Net Take-Home</th>
                <th className="py-3 px-4">Disbursement</th>
                <th className="py-3 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {rec.employeeName}
                    <span className="block text-[10px] font-mono font-normal text-slate-400">
                      {rec.employeeId} · {rec.bankAccount}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {rec.department}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    ₹{rec.basicSalary.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +₹{rec.allowances.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-red-500 tabular-nums">
                    -₹{rec.deductions.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    ₹{rec.netSalary.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    {currentRole !== 'employee' ? (
                      <select
                        value={rec.paymentStatus}
                        onChange={(e) => updatePayrollStatus(rec.id, e.target.value as PaymentStatus)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${
                          rec.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : rec.paymentStatus === 'Processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                        <option value="Pending">Pending</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                        }`}
                      >
                        {rec.paymentStatus}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActivePayslip(rec)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors inline-flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Payslip Modal */}
      <PayslipModal
        isOpen={Boolean(activePayslip)}
        record={activePayslip}
        onClose={() => setActivePayslip(null)}
      />

    </div>
  );
};
