import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { AlertCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const BudgetProgressOverview: React.FC = () => {
  const { budgetStatuses, currency, setActiveTab } = useFinance();

  const getStatusBadge = (status: 'safe' | 'warning' | 'exceeded', percent: number) => {
    switch (status) {
      case 'exceeded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Exceeded ({percent.toFixed(0)}%)
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Near Limit ({percent.toFixed(0)}%)
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> On Track ({percent.toFixed(0)}%)
          </span>
        );
    }
  };

  const getBarColor = (status: 'safe' | 'warning' | 'exceeded') => {
    switch (status) {
      case 'exceeded':
        return 'bg-rose-500';
      case 'warning':
        return 'bg-amber-500';
      case 'safe':
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="bg-[#111827] dark:bg-[#111827] light:bg-white p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Category Budget Progress</h3>
          <p className="text-xs text-slate-400">Spending limits for current month</p>
        </div>
        <button
          onClick={() => setActiveTab('budgets')}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          Manage <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4">
        {budgetStatuses.slice(0, 4).map((b) => (
          <div key={b.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200">{b.category}</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(b.status, b.percentSpent)}
                <span className="text-slate-400 font-medium">
                  {formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)}
                </span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(b.status)}`}
                style={{ width: `${Math.min(100, b.percentSpent)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
