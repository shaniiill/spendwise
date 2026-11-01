import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { calculateDailySpendingTrend } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp } from 'lucide-react';

export const SpendingTrendChart: React.FC = () => {
  const { transactions, selectedMonth, currency } = useFinance();
  const data = calculateDailySpendingTrend(transactions, selectedMonth);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-2.5 shadow-xl backdrop-blur-md text-xs space-y-1">
          <p className="font-semibold text-slate-300">{payload[0]?.payload?.date}</p>
          <p className="text-emerald-400 font-bold">
            {formatCurrency(payload[0]?.value || 0, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#111827] dark:bg-[#111827] light:bg-white p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Daily Spending Trend</h3>
          <p className="text-xs text-slate-400">Expense trajectory over the month</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
          <TrendingUp className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No trend data</p>
          <p className="text-xs text-slate-500 mt-1">Expenses recorded this month will display here.</p>
        </div>
      ) : (
        <div className="h-64 sm:h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                  return `${val}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendingGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
