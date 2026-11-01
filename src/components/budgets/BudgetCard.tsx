import React from 'react';
import { BudgetStatus } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, getCategoryColor } from '../../utils/formatters';
import { Edit2, Trash2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BudgetCardProps {
  budget: BudgetStatus;
  onEdit: (budget: BudgetStatus) => void;
  onDelete: (category: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const { currency } = useFinance();
  const catColor = getCategoryColor(budget.category);

  const getStatusBadge = () => {
    switch (budget.status) {
      case 'exceeded':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Exceeded by {formatCurrency(Math.abs(budget.remaining), currency)}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Approaching Limit ({budget.percentSpent.toFixed(0)}%)
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> On Track ({budget.percentSpent.toFixed(0)}%)
          </span>
        );
    }
  };

  const getBarColor = () => {
    switch (budget.status) {
      case 'exceeded':
        return 'bg-rose-500 shadow-rose-500/50';
      case 'warning':
        return 'bg-amber-500 shadow-amber-500/50';
      case 'safe':
      default:
        return 'bg-emerald-500 shadow-emerald-500/50';
    }
  };

  return (
    <div className="bg-[#111827] dark:bg-[#111827] light:bg-white p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm"
              style={{ backgroundColor: catColor }}
            />
            <div>
              <h4 className="font-semibold text-white text-base">{budget.category}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cap: {formatCurrency(budget.limit, currency)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Edit budget limit"
              aria-label="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(budget.category)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Remove budget"
              aria-label="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="w-full h-2.5 rounded-full bg-slate-800/90 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
              style={{ width: `${Math.min(100, budget.percentSpent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Spent: <strong className="text-slate-200">{formatCurrency(budget.spent, currency)}</strong></span>
            <span>
              {budget.remaining >= 0 ? 'Remaining: ' : 'Overspent: '}
              <strong className={budget.remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {formatCurrency(Math.abs(budget.remaining), currency)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Status Badge */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        {getStatusBadge()}
        <span className="text-xs text-slate-400 font-medium">
          {budget.percentSpent.toFixed(0)}% used
        </span>
      </div>
    </div>
  );
};
