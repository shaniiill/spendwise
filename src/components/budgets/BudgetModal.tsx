import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { ExpenseCategory } from '../../types';
import { CURRENCIES } from '../../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: string | null;
  initialLimit?: number;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Education',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Bills',
  'Subscriptions',
  'Personal Care',
  'Other',
];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  initialLimit,
}) => {
  const { updateCategoryBudget, selectedMonth, currency } = useFinance();

  const [category, setCategory] = useState<string>('Food');
  const [limit, setLimit] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (categoryToEdit) {
      setCategory(categoryToEdit);
      setLimit(initialLimit ? initialLimit.toString() : '');
    } else {
      setCategory('Food');
      setLimit('');
    }
    setError('');
  }, [categoryToEdit, initialLimit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (!limit || isNaN(parsedLimit) || parsedLimit <= 0) {
      setError('Budget limit must be greater than zero');
      return;
    }

    updateCategoryBudget(selectedMonth, category, parsedLimit);
    onClose();
  };

  const currencySymbol = CURRENCIES[currency]?.symbol || '₹';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoryToEdit ? `Edit ${categoryToEdit} Budget` : 'Set Category Budget'}
      subtitle={`Configure monthly spending limit for ${selectedMonth}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            disabled={!!categoryToEdit}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 px-3.5 py-2 text-sm text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none disabled:opacity-60"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Monthly Limit ({currencySymbol}) *
          </label>
          <div className="relative rounded-xl overflow-hidden shadow-inner">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-base pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="any"
              min="1"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setError('');
              }}
              placeholder="e.g. 5000"
              className={`w-full bg-slate-900 pl-8 pr-4 py-2.5 text-lg font-bold text-white rounded-xl border ${
                error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-emerald-500'
              } focus:outline-none transition-colors`}
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all"
          >
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};
