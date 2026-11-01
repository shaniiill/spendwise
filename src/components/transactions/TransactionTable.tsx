import React, { useState } from 'react';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/formatters';
import {
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit }) => {
  const { deleteTransaction, currency } = useFinance();

  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(transactions.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + pageSize);

  const handleDeleteConfirm = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-[#111827] dark:bg-[#111827] light:bg-white rounded-2xl border border-slate-800/80 p-12 text-center shadow-lg">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-slate-200">No transactions found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          No records match your selected filters. Try clearing your filters or record a new transaction.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#111827] dark:bg-[#111827] light:bg-white rounded-2xl border border-slate-800/80 shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Transaction</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {paginatedTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const catColor = getCategoryColor(tx.category);

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Title & Description */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
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
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-xs">{tx.title}</p>
                          {tx.description && (
                            <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                              {tx.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: catColor }}
                        />
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-300 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/40">
                        {tx.paymentMethod || 'Other'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          isIncome ? 'text-emerald-400' : 'text-slate-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit transaction"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTxToDelete(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete transaction"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-slate-800/70">
          {paginatedTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const catColor = getCategoryColor(tx.category);

            return (
              <div key={tx.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
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
                    <div>
                      <h4 className="font-medium text-white text-sm">{tx.title}</h4>
                      <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: catColor }}
                      />
                      {tx.category}
                    </span>
                    {tx.paymentMethod && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {tx.paymentMethod}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      aria-label="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTxToDelete(tx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-900/40 text-xs text-slate-400">
            <span>
              Showing {startIndex + 1}-{Math.min(startIndex + pageSize, transactions.length)} of{' '}
              {transactions.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-200">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={!!txToDelete}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${txToDelete?.title}" (${txToDelete?.type === 'income' ? '+' : '-'}${formatCurrency(
          txToDelete?.amount || 0,
          currency
        )})? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
};
