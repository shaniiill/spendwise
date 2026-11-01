import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { calculateMonthlyTrends } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export const IncomeExpenseChart: React.FC = () => {
  const { transactions, currency } = useFinance();
  const data = calculateMonthlyTrends(transactions, 6);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5">
          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
          <p className="text-emerald-400 flex justify-between gap-4">
            <span>Income:</span>
            <span className="font-semibold">{formatCurrency(payload[0]?.value || 0, currency)}</span>
          </p>
          <p className="text-rose-400 flex justify-between gap-4">
            <span>Expenses:</span>
            <span className="font-semibold">{formatCurrency(payload[1]?.value || 0, currency)}</span>
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
          <h3 className="text-base font-semibold text-white">Income vs. Expenses</h3>
          <p className="text-xs text-slate-400">Monthly cash flow comparison (Last 6 Months)</p>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748B"
              fontSize={12}
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
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
            />
            <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
