import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType, PaymentMethod, ExpenseCategory, IncomeCategory } from '../../types';
import { CURRENCIES } from '../../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
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

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Allowance',
  'Freelancing',
  'Part-time Job',
  'Salary',
  'Scholarship',
  'Business',
  'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'Cash',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Other',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const { addTransaction, updateTransaction, currency } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [description, setDescription] = useState('');

  // Form errors
  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    category?: string;
    date?: string;
  }>({});

  // Sync state when editing or opening
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date);
      setPaymentMethod(transactionToEdit.paymentMethod || 'UPI');
      setDescription(transactionToEdit.description || '');
    } else {
      // Default reset
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setDescription('');
    }
    setErrors({});
  }, [transactionToEdit, isOpen]);

  // Adjust category default when switching type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('Food');
    } else {
      setCategory('Allowance');
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Transaction title is required';
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount);

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
        paymentMethod,
        description: description.trim() || undefined,
      });
    } else {
      addTransaction({
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
        paymentMethod,
        description: description.trim() || undefined,
      });
    }

    onClose();
  };

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const currencySymbol = CURRENCIES[currency]?.symbol || '₹';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
      subtitle={transactionToEdit ? 'Modify recorded financial details' : 'Record a new income or expense'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle: Income vs Expense */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Amount ({currencySymbol}) *
          </label>
          <div className="relative rounded-xl overflow-hidden shadow-inner">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-base pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full bg-slate-900 pl-8 pr-4 py-2.5 text-lg font-bold text-white rounded-xl border ${
                errors.amount ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-emerald-500'
              } focus:outline-none transition-colors`}
              autoFocus
            />
          </div>
          {errors.amount && <p className="text-xs text-rose-400 mt-1">{errors.amount}</p>}
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Title / Note *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'expense' ? 'e.g. Swiggy Lunch, Metro pass, Textbook' : 'e.g. Monthly Allowance, Freelance Project'}
            className={`w-full bg-slate-900 px-3.5 py-2 text-sm text-white rounded-xl border ${
              errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-emerald-500'
            } focus:outline-none transition-colors`}
          />
          {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
        </div>

        {/* Category & Payment Method in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 px-3 py-2 text-sm text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full bg-slate-900 px-3 py-2 text-sm text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Date *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full bg-slate-900 px-3.5 py-2 text-sm text-white rounded-xl border ${
              errors.date ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-emerald-500'
            } focus:outline-none transition-colors`}
          />
          {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
        </div>

        {/* Optional Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Add context, project details, or split information..."
            className="w-full bg-slate-900 px-3.5 py-2 text-sm text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Actions */}
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
            {transactionToEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
