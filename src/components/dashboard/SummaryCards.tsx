import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { MetricCard } from '../common/MetricCard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { summary, currency } = useFinance();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Balance */}
      <MetricCard
        title="Total Balance"
        value={formatCurrency(summary.totalBalance, currency)}
        icon={<Wallet className="w-5 h-5" />}
        changePercent={summary.balanceChangePercent}
        changeLabel="vs last month"
        variant="emerald"
      />

      {/* 2. Total Income */}
      <MetricCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome, currency)}
        icon={<ArrowUpRight className="w-5 h-5" />}
        changePercent={summary.incomeChangePercent}
        changeLabel="vs last month"
        variant="blue"
      />

      {/* 3. Total Expenses */}
      <MetricCard
        title="Total Expenses"
        value={formatCurrency(summary.totalExpenses, currency)}
        icon={<ArrowDownRight className="w-5 h-5" />}
        changePercent={summary.expenseChangePercent}
        changeLabel="vs last month"
        variant="rose"
        reverseColorLogic={true} // lower expense is favorable!
      />

      {/* 4. Savings Rate */}
      <MetricCard
        title="Savings Rate"
        value={formatPercentage(summary.savingsRate, false)}
        icon={<PiggyBank className="w-5 h-5" />}
        changePercent={summary.savingsRateChangePercent}
        changeLabel="pts vs last mo"
        variant="amber"
      />
    </div>
  );
};
