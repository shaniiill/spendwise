import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { calculateCategoryBreakdown } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

export const CategoryDonutChart: React.FC = () => {
  const { transactions, selectedMonth, currency } = useFinance();
  const breakdown = calculateCategoryBreakdown(transactions, selectedMonth);

  const totalExpense = breakdown.reduce((sum, item) => sum + item.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-semibold text-white">{data.category}</span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4 pt-1 border-t border-slate-800">
            <span>Amount:</span>
            <span className="font-semibold text-emerald-400">
              {formatCurrency(data.amount, currency)}
            </span>
          </div>
          <div className="text-slate-400 flex justify-between gap-4">
            <span>Share:</span>
            <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#111827] dark:bg-[#111827] light:bg-white p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-white">Spending Breakdown</h3>
          <p className="text-xs text-slate-400">Category share of monthly expenses</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
          {formatCurrency(totalExpense, currency)} Total
        </span>
      </div>

      {breakdown.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
          <PieIcon className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No expense records</p>
          <p className="text-xs text-slate-500 mt-1">Add expenses for this month to see the breakdown.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-2">
          {/* Donut Chart */}
          <div className="md:col-span-6 h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={breakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Outflow</span>
              <span className="text-sm font-bold text-white">
                {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </div>

          {/* Legend list */}
          <div className="md:col-span-6 space-y-2 max-h-56 overflow-y-auto pr-1">
            {breakdown.slice(0, 5).map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 font-medium truncate">{item.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-semibold text-slate-200">
                    {formatCurrency(item.amount, currency)}
                  </span>
                  <span className="text-slate-400 ml-1.5 text-[11px]">
                    ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
            {breakdown.length > 5 && (
              <p className="text-[11px] text-slate-500 text-center pt-1">
                + {breakdown.length - 5} more categories
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
