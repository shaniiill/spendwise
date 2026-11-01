import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { TransactionType } from '../../types';

interface FilterState {
  search: string;
  type: 'all' | TransactionType;
  category: string;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

interface TransactionFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: string[];
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  categories,
}) => {
  return (
    <div className="bg-[#111827] dark:bg-[#111827] light:bg-white p-4 rounded-2xl border border-slate-800/80 shadow-md space-y-3">
      {/* Search and Main Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by title, description..."
            className="w-full bg-slate-900 pl-10 pr-3.5 py-2 text-sm text-slate-200 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Type Filter */}
        <div className="md:col-span-3">
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value as any })}
            className="w-full bg-slate-900 px-3 py-2 text-sm text-slate-200 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
          >
            <option value="all">All Types (Income & Expense)</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="w-full bg-slate-900 px-3 py-2 text-sm text-slate-200 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort By */}
        <div className="md:col-span-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
            className="w-full bg-slate-900 px-3 py-2 text-sm text-slate-200 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>
    </div>
  );
};
