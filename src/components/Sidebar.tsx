import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Briefcase,
  BarChart3,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NEXORALogo } from './NEXORALogo';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onConfirmReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onCloseMobile,
  onConfirmReset
}) => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentRole,
    employees,
    leaves,
    jobs
  } = useApp();

  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;
  const openJobsCount = jobs.filter((j) => j.status === 'Open').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Command Center',
      sublabel: 'Workforce Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      sublabel: 'Experience Hub',
      icon: Users,
      badge: `${employees.length}`
    },
    {
      id: 'attendance',
      label: 'Attendance Live',
      sublabel: 'Check-In & Shifts',
      icon: Clock,
      badge: null
    },
    {
      id: 'leave',
      label: 'Leave Flow',
      sublabel: 'Requests & Balance',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} new` : null,
      badgeColor: 'amber'
    },
    {
      id: 'payroll',
      label: 'Payroll Studio',
      sublabel: 'Salary & Compensation',
      icon: CreditCard,
      badge: null
    },
    {
      id: 'recruitment',
      label: 'Talent Acquisition',
      sublabel: 'Hiring Pipeline',
      icon: Briefcase,
      badge: `${openJobsCount} open`,
      badgeColor: 'indigo'
    },
    {
      id: 'analytics',
      label: 'Analytics Lab',
      sublabel: 'Workforce Insights',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'workspace',
      label: 'My Workspace',
      sublabel: 'Personal Portal',
      icon: UserCheck,
      badge: 'Personal',
      badgeColor: 'purple'
    }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`${
          mobileOpen
            ? 'fixed inset-y-0 left-0 z-50 w-64 flex'
            : 'hidden lg:flex lg:sticky lg:top-0 lg:left-0 z-40'
        } h-screen max-h-screen bg-slate-900 text-slate-200 border-r border-slate-800/80 flex-col transition-[width] duration-200 ease-in-out shrink-0 select-none overflow-hidden ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Neutral Ambient Workplace Image Layer in Sidebar Menu Bar */}
        <img
          src="/src/assets/images/neutral_workforce_bg_1793158719271.jpg"
          alt=""
          role="presentation"
          className="absolute inset-0 w-full h-full object-cover object-left opacity-20 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-slate-900/92 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full min-h-0">
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <NEXORALogo showText={!sidebarCollapsed} size={30} />
          </div>

          <div className="flex items-center">
            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop collapse button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 min-h-0 py-4 px-3 overflow-y-auto space-y-1">
          <div className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {!sidebarCollapsed ? 'Navigation Modules' : '•'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-xs font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded tabular-nums ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor === 'amber'
                            ? 'bg-amber-500/20 text-amber-300'
                            : item.badgeColor === 'purple'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Tooltip in collapsed mode */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-800 text-white text-xs font-medium shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Area: Role Perspective & Reset Demo Button */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 shrink-0">
          {!sidebarCollapsed ? (
            <div className="space-y-2">
              <div className="px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-400 font-medium">Perspective:</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-200 capitalize">
                  {currentRole === 'admin' ? 'Admin' : currentRole === 'hr_manager' ? 'HR Manager' : 'Employee'}
                </span>
              </div>

              <button
                onClick={onConfirmReset}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onConfirmReset}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
