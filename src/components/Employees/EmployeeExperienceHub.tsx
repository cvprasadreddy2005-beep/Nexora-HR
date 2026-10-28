import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee, EmploymentStatus } from '../../types';
import { EmployeeModal } from './EmployeeModal';
import { EmployeeProfileModal } from './EmployeeProfileModal';
import { ConfirmModal } from '../ConfirmModal';

interface EmployeeExperienceHubProps {
  initialOpenAdd?: boolean;
  selectedEmployeeId?: string | null;
  onClearSelectedEmployee?: () => void;
}

export const EmployeeExperienceHub: React.FC<EmployeeExperienceHubProps> = ({
  initialOpenAdd = false,
  selectedEmployeeId = null,
  onClearSelectedEmployee
}) => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, currentRole } = useApp();

  // View state
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'department' | 'joiningDate' | 'salary'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(initialOpenAdd);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [profileViewEmployee, setProfileViewEmployee] = useState<Employee | null>(() => {
    if (selectedEmployeeId) {
      return employees.find((e) => e.id === selectedEmployeeId) || null;
    }
    return null;
  });

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Employee | null>(null);

  // Sync if selectedEmployeeId prop changes
  React.useEffect(() => {
    if (selectedEmployeeId) {
      const target = employees.find((e) => e.id === selectedEmployeeId);
      if (target) setProfileViewEmployee(target);
    }
  }, [selectedEmployeeId, employees]);

  // Unique departments for filter
  const departments = ['All', 'Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'Human Resources', 'Operations'];

  // Filtered & Sorted Employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const query = searchQuery.toLowerCase();
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        const matchesQuery =
          fullName.includes(query) ||
          emp.id.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query);

        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

        return matchesQuery && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') {
          comp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        } else if (sortBy === 'department') {
          comp = a.department.localeCompare(b.department);
        } else if (sortBy === 'joiningDate') {
          comp = a.joiningDate.localeCompare(b.joiningDate);
        } else if (sortBy === 'salary') {
          comp = a.salary.basic - b.salary.basic;
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [employees, searchQuery, selectedDept, selectedStatus, sortBy, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const handleSort = (field: 'name' | 'department' | 'joiningDate' | 'salary') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSaveEmployee = (empData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, empData);
    } else {
      addEmployee(empData);
    }
    setEditingEmployee(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmTarget) {
      deleteEmployee(deleteConfirmTarget.id);
      setDeleteConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Employee Experience Hub</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
              {filteredEmployees.length} members
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage organizational directory, employment profiles, and compensation records
          </p>
        </div>

        {currentRole !== 'employee' && (
          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsAddEditOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID (e.g. EMP-1001), designation, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 focus:outline-indigo-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 focus:outline-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
              <option value="Terminated">Terminated</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      {filteredEmployees.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No employees match your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or department filters to see the full directory.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table View */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Employee</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('department')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Department</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Status</th>
                  <th
                    onClick={() => handleSort('joiningDate')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Joined</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('salary')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Net Salary</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {paginatedEmployees.map((emp) => {
                  const net = emp.salary.basic + emp.salary.allowances - emp.salary.deductions;
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setProfileViewEmployee(emp)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.firstName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {emp.id} · {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {emp.department}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {emp.designation}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : emp.status === 'On Leave'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {emp.joiningDate}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                        ₹{net.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setProfileViewEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {currentRole !== 'employee' && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingEmployee(emp);
                                  setIsAddEditOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Edit Employee"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmTarget(emp)}
                                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Delete Employee"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} employees
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        
        /* Cards View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedEmployees.map((emp) => {
              const net = emp.salary.basic + emp.salary.allowances - emp.salary.deductions;
              return (
                <div
                  key={emp.id}
                  onClick={() => setProfileViewEmployee(emp)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <img
                        src={emp.avatar}
                        alt={emp.firstName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : emp.status === 'On Leave'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {emp.designation}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {emp.department} · {emp.location}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>Employee ID:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{emp.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Net Monthly:</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          ₹{net.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setProfileViewEmployee(emp)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Profile
                    </button>
                    {currentRole !== 'employee' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingEmployee(emp);
                            setIsAddEditOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-amber-500 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmTarget(emp)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards View Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isAddEditOpen}
        employeeToEdit={editingEmployee}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
      />

      {/* Profile Detail Modal */}
      <EmployeeProfileModal
        isOpen={Boolean(profileViewEmployee)}
        employee={profileViewEmployee}
        onClose={() => {
          setProfileViewEmployee(null);
          onClearSelectedEmployee?.();
        }}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setIsAddEditOpen(true);
        }}
      />

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmTarget)}
        title="Remove Employee Record"
        message={`Are you sure you want to permanently remove ${deleteConfirmTarget?.firstName} ${deleteConfirmTarget?.lastName} (${deleteConfirmTarget?.id}) from the active organization database? This will clear related attendance and payroll ties.`}
        confirmLabel="Delete Record"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmTarget(null)}
      />

    </div>
  );
};
