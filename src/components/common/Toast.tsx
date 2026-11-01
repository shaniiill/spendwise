import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30 bg-slate-900/95 text-slate-100',
          warning: 'border-amber-500/30 bg-slate-900/95 text-slate-100',
          error: 'border-rose-500/30 bg-slate-900/95 text-slate-100',
          info: 'border-blue-500/30 bg-slate-900/95 text-slate-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-slide-up ${
              borders[toast.type]
            }`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-xs tracking-wider uppercase text-slate-400 mb-0.5">{toast.title}</div>}
              <div className="text-slate-200">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
