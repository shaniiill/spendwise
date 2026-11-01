import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { Transaction, TransactionType } from '../types';
import { exportTransactionsToCSV } from '../utils/csvExport';
import { formatCurrency } from '../utils/formatters';
import { Download, Plus } from 'lucide-react';

interface TransactionsPageProps {
  onEditTransaction: (tx: Transaction) => void;
  onOpenAddModal: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  onEditTransaction,
  onOpenAddModal,
}) => {
  const { transactions, currency } = useFinance();

  const [filters, setFilters] = useState<{
    search: string;
    type: 'all' | TransactionType;
    category: string;
    sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
  }>({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date-desc',
  });

  // Unique categories in transactions
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t: Transaction) => set.add(t.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx: Transaction) => {
        // Keyword Search
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchTitle = tx.title.toLowerCase().includes(query);
          const matchDesc = tx.description?.toLowerCase().includes(query);
          const matchCategory = tx.category.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCategory) return false;
        }

        // Type filter
        if (filters.type !== 'all' && tx.type !== filters.type) {
          return false;
        }

        // Category filter
        if (filters.category !== 'all' && tx.category !== filters.category) {
          return false;
        }

        return true;
      })
      .sort((a: Transaction, b: Transaction) => {
        if (filters.sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filters.sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filters.sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (filters.sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, filters]);

  // Filtered totals
  const filteredTotals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    filteredTransactions.forEach((t: Transaction) => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });
    return { income, expenses, net: income - expenses };
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    exportTransactionsToCSV(filteredTransactions, `spendwise_export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Transactions</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            View, search, filter, and export all recorded cash movements ({transactions.length} total).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
            title="Download CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Filter summary metrics bar */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#111827] border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block font-medium">Filtered Income</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 block">
            +{formatCurrency(filteredTotals.income, currency)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Filtered Expenses</span>
          <span className="text-sm sm:text-base font-bold text-rose-400 mt-0.5 block">
            -{formatCurrency(filteredTotals.expenses, currency)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Filtered Net</span>
          <span
            className={`text-sm sm:text-base font-bold mt-0.5 block ${
              filteredTotals.net >= 0 ? 'text-white' : 'text-rose-400'
            }`}
          >
            {formatCurrency(filteredTotals.net, currency)}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        categories={uniqueCategories}
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onEdit={onEditTransaction}
      />
    </div>
  );
};
