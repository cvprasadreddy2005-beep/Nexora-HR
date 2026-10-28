import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Briefcase,
  BarChart3,
  UserCheck,
  User,
  Plus,
  Moon,
  Sun,
  Shield,
  X,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CommandPaletteProps {
  onSelectEmployee?: (empId: string) => void;
  onOpenQuickAction?: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onSelectEmployee,
  onOpenQuickAction
}) => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTab,
    employees,
    toggleTheme,
    theme,
    setCurrentRole
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Build searchable items
  interface PaletteItem {
    id: string;
    title: string;
    category: 'Navigation' | 'Employee' | 'Action' | 'Setting';
    icon: React.ComponentType<{ className?: string }>;
    run: () => void;
  }

  const items: PaletteItem[] = [
    // Navigation
    {
      id: 'nav-dash',
      title: 'Go to Workforce Command Center',
      category: 'Navigation',
      icon: LayoutDashboard,
      run: () => setActiveTab('dashboard')
    },
    {
      id: 'nav-emp',
      title: 'Go to Employee Experience Hub',
      category: 'Navigation',
      icon: Users,
      run: () => setActiveTab('employees')
    },
    {
      id: 'nav-att',
      title: 'Go to Attendance Intelligence',
      category: 'Navigation',
      icon: Clock,
      run: () => setActiveTab('attendance')
    },
    {
      id: 'nav-leave',
      title: 'Go to Leave Flow Center',
      category: 'Navigation',
      icon: CalendarDays,
      run: () => setActiveTab('leave')
    },
    {
      id: 'nav-pay',
      title: 'Go to Payroll & Compensation Studio',
      category: 'Navigation',
      icon: CreditCard,
      run: () => setActiveTab('payroll')
    },
    {
      id: 'nav-rec',
      title: 'Go to Talent Acquisition Workspace',
      category: 'Navigation',
      icon: Briefcase,
      run: () => setActiveTab('recruitment')
    },
    {
      id: 'nav-ana',
      title: 'Go to Workforce Analytics Lab',
      category: 'Navigation',
      icon: BarChart3,
      run: () => setActiveTab('analytics')
    },
    {
      id: 'nav-ws',
      title: 'Go to Personal Workspace',
      category: 'Navigation',
      icon: UserCheck,
      run: () => setActiveTab('workspace')
    },
    // Quick Actions
    {
      id: 'act-add-emp',
      title: 'Quick Action: Add New Employee',
      category: 'Action',
      icon: Plus,
      run: () => {
        setActiveTab('employees');
        onOpenQuickAction?.('add_employee');
      }
    },
    {
      id: 'act-att',
      title: 'Quick Action: Record Attendance',
      category: 'Action',
      icon: Clock,
      run: () => {
        setActiveTab('attendance');
        onOpenQuickAction?.('record_attendance');
      }
    },
    {
      id: 'act-leave',
      title: 'Quick Action: Apply for Leave',
      category: 'Action',
      icon: CalendarDays,
      run: () => {
        setActiveTab('leave');
        onOpenQuickAction?.('apply_leave');
      }
    },
    {
      id: 'act-theme',
      title: `Toggle Theme: Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'Setting',
      icon: theme === 'dark' ? Sun : Moon,
      run: () => toggleTheme()
    },
    {
      id: 'act-role-admin',
      title: 'Switch Perspective: System Administrator',
      category: 'Setting',
      icon: Shield,
      run: () => setCurrentRole('admin')
    },
    {
      id: 'act-role-hr',
      title: 'Switch Perspective: HR Manager',
      category: 'Setting',
      icon: UserCheck,
      run: () => setCurrentRole('hr_manager')
    },
    {
      id: 'act-role-emp',
      title: 'Switch Perspective: Employee View',
      category: 'Setting',
      icon: User,
      run: () => {
        setCurrentRole('employee');
        setActiveTab('workspace');
      }
    },
    // Employees
    ...employees.map((emp) => ({
      id: `emp-${emp.id}`,
      title: `${emp.firstName} ${emp.lastName} · ${emp.designation} (${emp.department})`,
      category: 'Employee' as const,
      icon: User,
      run: () => {
        setActiveTab('employees');
        onSelectEmployee?.(emp.id);
      }
    }))
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].run();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, navigate, or search employees..."
            className="w-full py-4 pl-3 pr-8 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or employees found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.run();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-medium truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Esc</kbd> Close
            </span>
          </div>
          <span>NEXORA Quick Command</span>
        </div>
      </div>
    </div>
  );
};
