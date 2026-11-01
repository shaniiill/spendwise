import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { BudgetStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Plus, Edit3, Target } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const {
    budgetStatuses,
    currentBudget,
    selectedMonth,
    currency,
    updateTotalMonthlyBudget,
    deleteCategoryBudget,
    summary,
  } = useFinance();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
  const [initialLimit, setInitialLimit] = useState<number | undefined>(undefined);

  // Total budget modal state
  const [isTotalBudgetModalOpen, setIsTotalBudgetModalOpen] = useState(false);
  const [totalLimitInput, setTotalLimitInput] = useState(currentBudget.totalLimit.toString());

  // Delete category confirmation
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleEditBudget = (status: BudgetStatus) => {
    setCategoryToEdit(status.category);
    setInitialLimit(status.limit);
    setIsModalOpen(true);
  };

  const handleAddNewBudget = () => {
    setCategoryToEdit(null);
    setInitialLimit(undefined);
    setIsModalOpen(true);
  };

  const handleSaveTotalBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(totalLimitInput);
    if (val && val > 0) {
      updateTotalMonthlyBudget(selectedMonth, val);
      setIsTotalBudgetModalOpen(false);
    }
  };

  const totalSpent = summary.totalExpenses;
  const overallRemaining = currentBudget.totalLimit - totalSpent;
  const overallPercent = currentBudget.totalLimit > 0 ? (totalSpent / currentBudget.totalLimit) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Budget Management</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Set expenditure limits, track month-to-date burns, and prevent overspending for {selectedMonth}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewBudget}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Set Category Budget</span>
          </button>
        </div>
      </div>

      {/* Overall Total Monthly Budget Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1F2937] border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Target className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Overall Monthly Spending Cap ({selectedMonth})
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold text-white">
                {formatCurrency(currentBudget.totalLimit, currency)}
              </span>
              <button
                onClick={() => {
                  setTotalLimitInput(currentBudget.totalLimit.toString());
                  setIsTotalBudgetModalOpen(true);
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Limit
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Total expenses recorded this month: <strong className="text-slate-200">{formatCurrency(totalSpent, currency)}</strong>
            </p>
          </div>

          {/* Right Summary Metrics */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Remaining Cap</span>
              <span
                className={`text-lg font-bold ${
                  overallRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(Math.abs(overallRemaining), currency)}{' '}
                <span className="text-xs font-normal">
                  {overallRemaining >= 0 ? 'left' : 'over'}
                </span>
              </span>
            </div>
            <div className="w-px h-10 bg-slate-700/60" />
            <div>
              <span className="text-xs text-slate-400 block">Utilization</span>
              <span
                className={`text-lg font-bold ${
                  overallPercent > 100
                    ? 'text-rose-400'
                    : overallPercent >= 80
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {overallPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="mt-5 w-full h-3 rounded-full bg-slate-800/90 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallPercent > 100
                ? 'bg-rose-500'
                : overallPercent >= 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, overallPercent)}%` }}
          />
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Category Allocations</h3>
          <span className="text-xs text-slate-400">
            {budgetStatuses.length} Categories Monitored
          </span>
        </div>

        {budgetStatuses.length === 0 ? (
          <div className="p-12 text-center bg-[#111827] rounded-2xl border border-slate-800">
            <Target className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No category budgets defined yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Click &quot;Set Category Budget&quot; above to allocate monthly spending caps for your expenses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStatuses.map((budget: BudgetStatus) => (
              <BudgetCard
                key={budget.category}
                budget={budget}
                onEdit={handleEditBudget}
                onDelete={(cat) => setCategoryToDelete(cat)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Category Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={categoryToEdit}
        initialLimit={initialLimit}
      />

      {/* Total Budget Edit Modal */}
      {isTotalBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-white">Set Total Monthly Budget</h3>
            <p className="text-xs text-slate-400">
              Set the absolute ceiling for all expenses in {selectedMonth}.
            </p>
            <form onSubmit={handleSaveTotalBudget} className="space-y-4">
              <input
                type="number"
                min="1"
                step="any"
                value={totalLimitInput}
                onChange={(e) => setTotalLimitInput(e.target.value)}
                className="w-full bg-slate-900 px-4 py-2.5 text-lg font-bold text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTotalBudgetModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      <ConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) {
            deleteCategoryBudget(selectedMonth, categoryToDelete);
            setCategoryToDelete(null);
          }
        }}
        title="Remove Budget Target"
        message={`Are you sure you want to remove the budget cap for "${categoryToDelete}"? Expense tracking will continue without an alert threshold.`}
        confirmLabel="Remove"
        variant="warning"
      />
    </div>
  );
};
