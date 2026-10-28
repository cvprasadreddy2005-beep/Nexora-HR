import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-slate-200 dark:border-slate-800';
        let iconClass = 'text-indigo-500';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconClass = 'text-emerald-500';
          borderClass = 'border-emerald-500/30';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconClass = 'text-red-500';
          borderClass = 'border-red-500/30';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconClass = 'text-amber-500';
          borderClass = 'border-amber-500/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border ${borderClass} shadow-xl shadow-slate-900/10 dark:shadow-black/40 text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom-3 duration-200`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
