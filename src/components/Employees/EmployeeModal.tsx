import React, { useState, useEffect } from 'react';
import { X, Upload, User, Mail, Phone, MapPin, Building, Briefcase, IndianRupee } from 'lucide-react';
import { Employee, EmploymentStatus, EmploymentType } from '../../types';

interface EmployeeModalProps {
  isOpen: boolean;
  employeeToEdit?: Employee | null;
  onClose: () => void;
  onSave: (data: Omit<Employee, 'id'>) => void;
}

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Sales',
  'Marketing',
  'Human Resources',
  'Operations'
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  employeeToEdit,
  onClose,
  onSave
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [status, setStatus] = useState<EmploymentStatus>('Active');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-Time');
  const [location, setLocation] = useState('San Francisco, CA');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face');
  const [basicSalary, setBasicSalary] = useState(100000);
  const [allowances, setAllowances] = useState(15000);
  const [deductions, setDeductions] = useState(12000);
  const [education, setEducation] = useState('B.S. in Computer Science');
  const [skillsStr, setSkillsStr] = useState('React, TypeScript, Node.js');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employeeToEdit) {
      setFirstName(employeeToEdit.firstName);
      setLastName(employeeToEdit.lastName);
      setEmail(employeeToEdit.email);
      setPhone(employeeToEdit.phone);
      setDepartment(employeeToEdit.department);
      setDesignation(employeeToEdit.designation);
      setStatus(employeeToEdit.status);
      setEmploymentType(employeeToEdit.employmentType);
      setLocation(employeeToEdit.location);
      setJoiningDate(employeeToEdit.joiningDate);
      setAvatar(employeeToEdit.avatar);
      setBasicSalary(employeeToEdit.salary.basic);
      setAllowances(employeeToEdit.salary.allowances);
      setDeductions(employeeToEdit.salary.deductions);
      setEducation(employeeToEdit.education);
      setSkillsStr(employeeToEdit.skills.join(', '));
      setEmergencyName(employeeToEdit.emergencyContact.name);
      setEmergencyPhone(employeeToEdit.emergencyContact.phone);
      setEmergencyRelation(employeeToEdit.emergencyContact.relation);
    } else {
      // Reset defaults
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('+1 (555) 000-0000');
      setDepartment('Engineering');
      setDesignation('Senior Software Engineer');
      setStatus('Active');
      setEmploymentType('Full-Time');
      setLocation('San Francisco, CA');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face');
      setBasicSalary(110000);
      setAllowances(15000);
      setDeductions(12500);
      setEducation('B.S. in Computer Science');
      setSkillsStr('React, TypeScript, Distributed Systems');
      setEmergencyName('Alex Miller');
      setEmergencyPhone('+1 (555) 000-1111');
      setEmergencyRelation('Spouse');
    }
    setErrors({});
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid work email is required';
    if (!designation.trim()) errs.designation = 'Designation is required';
    if (basicSalary <= 0) errs.basicSalary = 'Salary must be greater than zero';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department,
      designation: designation.trim(),
      status,
      employmentType,
      joiningDate,
      avatar,
      location: location.trim(),
      education: education.trim(),
      skills,
      emergencyContact: {
        name: emergencyName.trim(),
        phone: emergencyPhone.trim(),
        relation: emergencyRelation.trim()
      },
      salary: {
        basic: Number(basicSalary),
        allowances: Number(allowances),
        deductions: Number(deductions)
      },
      leaveBalance: employeeToEdit
        ? employeeToEdit.leaveBalance
        : {
            casual: 10,
            sick: 10,
            earned: 14
          }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {employeeToEdit ? 'Edit Employee Profile' : 'Register New Employee'}
            </h2>
            <p className="text-xs text-slate-400">
              {employeeToEdit ? `Updating records for ${employeeToEdit.id}` : 'Create an employee record across HRMS databases'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Personal Info Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              1. Identity & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    errors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500`}
                  placeholder="e.g. Elena"
                />
                {errors.firstName && <p className="text-[10px] text-red-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    errors.lastName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500`}
                  placeholder="e.g. Rostova"
                />
                {errors.lastName && <p className="text-[10px] text-red-500 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500`}
                  placeholder="elena.rostova@nexora.io"
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Office
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              2. Organizational Role & Employment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Title *
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    errors.designation ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500`}
                  placeholder="e.g. Lead Distributed Architect"
                />
                {errors.designation && <p className="text-[10px] text-red-500 mt-1">{errors.designation}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmploymentStatus)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  placeholder="Go, Kubernetes, Cloud"
                />
              </div>
            </div>
          </div>

          {/* Salary Components */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              3. Monthly Compensation Structure (₹)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Basic Monthly Salary (₹) *
                </label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Allowances (₹)
                </label>
                <input
                  type="number"
                  value={allowances}
                  onChange={(e) => setAllowances(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deductions (₹)
                </label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Calculated Net Salary:</span>
              <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ₹{(Number(basicSalary) + Number(allowances) - Number(deductions)).toLocaleString('en-IN')} / mo
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-colors"
            >
              {employeeToEdit ? 'Save Changes' : 'Register Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
