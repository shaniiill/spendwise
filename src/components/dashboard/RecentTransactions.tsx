import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Receipt } from 'lucide-react';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  onEdit: (tx: Transaction) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ onEdit }) => {
  const { transactions, currency, setActiveTab } = useFinance();
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-[#111827] dark:bg-[#111827] light:bg-white p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Latest activity across your accounts</p>
        </div>
        <button
          onClick={() => setActiveTab('transactions')}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          View All ({transactions.length}) <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-sm">No recent transactions</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {recent.map((tx) => {
            const isIncome = tx.type === 'income';
            const catColor = getCategoryColor(tx.category);

            return (
              <div
                key={tx.id}
                onClick={() => onEdit(tx)}
                className="py-3 flex items-center justify-between group hover:bg-slate-800/30 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: catColor }}
                        />
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      {tx.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {tx.paymentMethod}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div
                    className={`text-sm font-semibold ${
                      isIncome ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
