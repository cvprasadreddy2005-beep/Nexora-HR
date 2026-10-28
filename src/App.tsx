/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/ToastContainer';
import { ConfirmModal } from './components/ConfirmModal';

// Views
import { WorkforceCommandCenter } from './components/Dashboard/WorkforceCommandCenter';
import { EmployeeExperienceHub } from './components/Employees/EmployeeExperienceHub';
import { AttendanceIntelligence } from './components/Attendance/AttendanceIntelligence';
import { LeaveFlowCenter } from './components/Leave/LeaveFlowCenter';
import { PayrollStudio } from './components/Payroll/PayrollStudio';
import { TalentAcquisition } from './components/Recruitment/TalentAcquisition';
import { WorkforceAnalyticsLab } from './components/Analytics/WorkforceAnalyticsLab';
import { PersonalWorkspace } from './components/Personal/PersonalWorkspace';

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab, resetToDemoData, theme } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  const handleOpenQuickAction = (action: string) => {
    setQuickActionType(action);
    if (action === 'add_employee') {
      setActiveTab('employees');
    } else if (action === 'record_attendance') {
      setActiveTab('attendance');
    } else if (action === 'apply_leave') {
      setActiveTab('leave');
    } else if (action === 'create_job') {
      setActiveTab('recruitment');
    }
  };

  const handleSelectEmployee = (empId: string) => {
    setSelectedEmpId(empId);
    setActiveTab('employees');
  };

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col antialiased transition-colors duration-200 overflow-x-hidden w-full max-w-full`}>
      {/* Global Neutral Ambient Architecture & Workplace Background on Every Page */}
      <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden" aria-hidden="true">
        <img
          src="/src/assets/images/neutral_workforce_bg_1793158719271.jpg"
          alt="Neutral Workplace Architectural Background"
          className="w-full h-full object-cover object-center opacity-25 dark:opacity-35 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/85 via-slate-50/92 to-slate-50/98 dark:from-slate-950/85 dark:via-slate-950/92 dark:to-slate-950/98 transition-colors duration-300" />
      </div>

      <div className="relative z-10 flex-1 flex w-full min-w-0 overflow-x-hidden">
        
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onConfirmReset={() => setResetModalOpen(true)}
        />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          
          {/* Top Navigation Bar */}
          <Header
            onOpenQuickAction={handleOpenQuickAction}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          {/* Main Body Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
            {activeTab === 'dashboard' && (
              <WorkforceCommandCenter
                onOpenQuickAction={handleOpenQuickAction}
                onSelectEmployee={handleSelectEmployee}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeeExperienceHub
                initialOpenAdd={quickActionType === 'add_employee'}
                selectedEmployeeId={selectedEmpId}
                onClearSelectedEmployee={() => {
                  setSelectedEmpId(null);
                  setQuickActionType(null);
                }}
              />
            )}

            {activeTab === 'attendance' && <AttendanceIntelligence />}

            {activeTab === 'leave' && (
              <LeaveFlowCenter initialOpenApply={quickActionType === 'apply_leave'} />
            )}

            {activeTab === 'payroll' && <PayrollStudio />}

            {activeTab === 'recruitment' && (
              <TalentAcquisition initialOpenCreateJob={quickActionType === 'create_job'} />
            )}

            {activeTab === 'analytics' && <WorkforceAnalyticsLab />}

            {activeTab === 'workspace' && <PersonalWorkspace />}
          </main>

          {/* Quiet Minimal Footer */}
          <footer className="no-print border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-medium">
                NEXORA HR — Next-Generation Workforce System
              </span>
              <span className="text-[11px] text-slate-400">
                Demonstration Environment · Browser Local Persistence Active
              </span>
            </div>
          </footer>
        </div>

      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        onSelectEmployee={handleSelectEmployee}
        onOpenQuickAction={handleOpenQuickAction}
      />

      {/* Global Toast Alerts */}
      <ToastContainer />

      {/* Reset Confirmation Dialog */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title="Reset Demonstration Data"
        message="Are you sure you want to restore all employees, attendance logs, leave records, and payroll data to the initial factory demonstration state? Any custom changes made will be cleared."
        confirmLabel="Reset All Data"
        cancelLabel="Keep Current State"
        isDestructive={true}
        onConfirm={() => {
          resetToDemoData();
          setResetModalOpen(false);
        }}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
