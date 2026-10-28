import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  UserCheck,
  User,
  Plus,
  ChevronDown,
  Clock,
  Menu,
  Check,
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenQuickAction?: (action: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickAction,
  onToggleMobileMenu
}) => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    currentEmployeeUser,
    addToast
  } = useApp();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const quickMenuRef = useRef<HTMLDivElement>(null);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setQuickMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Workforce Command Center';
      case 'employees': return 'Employee Experience Hub';
      case 'attendance': return 'Attendance Intelligence';
      case 'leave': return 'Leave Flow Center';
      case 'payroll': return 'Payroll & Compensation';
      case 'recruitment': return 'Talent Acquisition';
      case 'analytics': return 'Workforce Analytics Lab';
      case 'workspace': return 'Personal Workspace';
      default: return 'Overview';
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleMenuOpen(false);
    addToast({
      type: 'info',
      title: 'Role Switched',
      message: `Active demo perspective changed to ${role === 'admin' ? 'System Administrator' : role === 'hr_manager' ? 'HR Manager' : 'Employee'}.`
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors w-full relative overflow-hidden max-w-full">
      {/* Neutral Ambient Workplace Image Layer in Top Menu Bar */}
      <img
        src="/src/assets/images/neutral_workforce_bg_1793158719271.jpg"
        alt=""
        role="presentation"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-30 dark:opacity-40 select-none pointer-events-none"
      />
      <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/90 backdrop-blur-md pointer-events-none" />

      <div className="relative z-10 h-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
        
        {/* Left Zone: Mobile toggle & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none shrink-0"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 min-w-0">
            <span className="hidden sm:inline font-medium shrink-0">NEXORA</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600 shrink-0">/</span>
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs">
              {getTabLabel(activeTab)}
            </span>
          </div>
        </div>

        {/* Center Zone: Live Digital Clock & Search trigger (visible on xl+ so it never crowds menu bar) */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{formatDate(currentTime)}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold whitespace-nowrap">
              {formatTime(currentTime)}
            </span>
          </div>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400 dark:text-slate-400 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-colors w-48 2xl:w-56"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search system...</span>
            <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Zone: Role Switcher, Quick Action, Theme, Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
          
          {/* Quick Search on screens < xl */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="xl:hidden p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Open search"
            title="Search (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Create Dropdown */}
          <div className="relative shrink-0" ref={quickMenuRef}>
            <button
              onClick={() => setQuickMenuOpen(!quickMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors whitespace-nowrap shrink-0"
              title="Quick Actions"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Action</span>
            </button>

            {quickMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Action Studio
                </div>
                <button
                  onClick={() => {
                    setQuickMenuOpen(false);
                    setActiveTab('employees');
                    onOpenQuickAction?.('add_employee');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Add New Employee</span>
                </button>
                <button
                  onClick={() => {
                    setQuickMenuOpen(false);
                    setActiveTab('attendance');
                    onOpenQuickAction?.('record_attendance');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Log Attendance Event</span>
                </button>
                <button
                  onClick={() => {
                    setQuickMenuOpen(false);
                    setActiveTab('leave');
                    onOpenQuickAction?.('apply_leave');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Apply for Leave</span>
                </button>
                <button
                  onClick={() => {
                    setQuickMenuOpen(false);
                    setActiveTab('recruitment');
                    onOpenQuickAction?.('create_job');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Create Job Opening</span>
                </button>
              </div>
            )}
          </div>

          {/* Role Switcher (Demonstration) */}
          <div className="relative shrink-0" ref={roleMenuRef}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors shrink-0"
              title="Demonstration Role Switcher"
            >
              {currentRole === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              ) : currentRole === 'hr_manager' ? (
                <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
              <span className="hidden md:inline capitalize font-medium">
                {currentRole === 'admin' ? 'Admin' : currentRole === 'hr_manager' ? 'HR Mgr' : 'Employee'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">Role Perspective</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Frontend demo simulation (not auth)
                  </p>
                </div>
                
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                    currentRole === 'admin' ? 'bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div>System Administrator</div>
                      <div className="text-[10px] text-slate-400 font-normal">Full write, payroll, approval rights</div>
                    </div>
                  </div>
                  {currentRole === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>

                <button
                  onClick={() => handleRoleSelect('hr_manager')}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                    currentRole === 'hr_manager' ? 'bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div>HR Manager</div>
                      <div className="text-[10px] text-slate-400 font-normal">Leave decisions, hiring, attendance</div>
                    </div>
                  </div>
                  {currentRole === 'hr_manager' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                <button
                  onClick={() => handleRoleSelect('employee')}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                    currentRole === 'employee' ? 'bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
                    <div>
                      <div>Employee Self-Service</div>
                      <div className="text-[10px] text-slate-400 font-normal">My portal, attendance, leave application</div>
                    </div>
                  </div>
                  {currentRole === 'employee' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Toggle dark/light mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative shrink-0" ref={notifMenuRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                          !n.read ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <img
                src={currentEmployeeUser.avatar}
                alt={currentEmployeeUser.firstName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="hidden xl:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
                {currentEmployeeUser.firstName}
              </span>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {currentEmployeeUser.firstName} {currentEmployeeUser.lastName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{currentEmployeeUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    <span>{currentEmployeeUser.department}</span>
                    <span>·</span>
                    <span>{currentEmployeeUser.designation}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setActiveTab('workspace');
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>My Profile & Settings</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setActiveTab('leave');
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span>Leave Balances</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setActiveTab('payroll');
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span>My Payslip Preview</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleRoleSelect('employee');
                      setActiveTab('workspace');
                    }}
                    className="w-full text-left px-4 py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch to Personal Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
