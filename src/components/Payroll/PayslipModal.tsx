import React from 'react';
import { X, Printer, Download, Building, CheckCircle2, Shield } from 'lucide-react';
import { PayrollRecord } from '../../types';
import { NEXORALogo } from '../NEXORALogo';

interface PayslipModalProps {
  record: PayrollRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

// Convert numbers to words approximately for display
function numberToWords(num: number): string {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  function convert(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    return n.toString();
  }
  return convert(Math.floor(num)) + ' Indian Rupees Only';
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ record, isOpen, onClose }) => {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const hra = Math.round(record.allowances * 0.6);
  const specialAllowance = record.allowances - hra;

  const tax = Math.round(record.deductions * 0.7);
  const providentFund = record.deductions - tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header (Hidden in Print) */}
        <div className="no-print px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Employee Salary Voucher
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {record.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Payslip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-8 space-y-6 printable-area bg-white text-slate-900">
          
          {/* Company Branding & Payslip Title */}
          <div className="flex items-start justify-between border-b pb-5 border-slate-200">
            <div className="space-y-1">
              <NEXORALogo size={28} showText={true} />
              <p className="text-[11px] text-slate-500 pt-1">
                NEXORA Global Workforce Technologies Inc.<br />
                100 Innovation Way, Suite 800, San Francisco, CA 94105
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-lg font-black tracking-tight uppercase text-indigo-950">
                Official Payslip
              </h1>
              <p className="text-xs font-mono text-slate-500">{record.month}</p>
              <p className="text-[10px] text-slate-400">Ref: {record.id}</p>
            </div>
          </div>

          {/* Employee & Payment Credentials */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Employee Name</span>
                <span className="font-bold text-slate-900">{record.employeeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Employee ID</span>
                <span className="font-mono font-medium">{record.employeeId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Designation</span>
                <span>{record.designation}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
                <span className="font-semibold text-slate-900">{record.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bank Account</span>
                <span className="font-mono text-slate-700">{record.bankAccount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Disbursement Status</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {record.paymentStatus} · {record.paymentDate || 'Oct 25, 2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Earnings & Deductions Tables */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            
            {/* Earnings Table */}
            <div>
              <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-600 pb-1 border-b border-slate-200 mb-2">
                Earnings Components
              </h3>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-mono font-medium">₹{record.basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-medium">₹{hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Special Operational Allowance</span>
                  <span className="font-mono font-medium">₹{specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-900">
                  <span>Gross Earnings</span>
                  <span className="font-mono">₹{(record.basicSalary + record.allowances).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions Table */}
            <div>
              <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-600 pb-1 border-b border-slate-200 mb-2">
                Deductions & Withholding
              </h3>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Income Tax (TDS Withholding)</span>
                  <span className="font-mono font-medium text-red-600">-₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Provident Fund (EPF Contribution)</span>
                  <span className="font-mono font-medium text-red-600">-₹{providentFund.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Professional Tax & Other</span>
                  <span className="font-mono font-medium text-slate-400">₹0</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-900">
                  <span>Total Deductions</span>
                  <span className="font-mono text-red-600">-₹{record.deductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Net Pay Box */}
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">
                Net Disbursed Take-Home Pay
              </span>
              <p className="text-xs text-indigo-700 italic mt-0.5">
                {numberToWords(record.netSalary)}
              </p>
            </div>
            <div className="text-2xl font-black font-mono text-indigo-900">
              ₹{record.netSalary.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Authorization & Signatures */}
          <div className="pt-8 flex items-end justify-between text-xs text-slate-400">
            <div className="space-y-1">
              <div className="w-40 border-b border-slate-300 pb-1 font-serif text-slate-700 italic">
                Zara Al-Mansoor
              </div>
              <p className="text-[10px]">Authorized People Partner</p>
            </div>

            <div className="text-right space-y-1">
              <div className="w-40 border-b border-slate-300 pb-1 font-serif text-slate-700 italic text-right">
                NEXORA Payroll Desk
              </div>
              <p className="text-[10px]">Finance & Accounting Controller</p>
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400 pt-3 border-t border-slate-100">
            This computer-generated document represents demonstration HR data within the NEXORA HR framework.
          </div>

        </div>
      </div>
    </div>
  );
};
