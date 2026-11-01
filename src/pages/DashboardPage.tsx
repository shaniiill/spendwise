import React from 'react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { SpendingTrendChart } from '../components/dashboard/SpendingTrendChart';
import { BudgetProgressOverview } from '../components/dashboard/BudgetProgressOverview';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { Transaction } from '../types';

interface DashboardPageProps {
  onEditTransaction: (tx: Transaction) => void;
  onOpenAddModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onEditTransaction }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Financial Dashboard</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time tracking of cash flow, monthly allocations, and spending behavior.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <SummaryCards />

      {/* Charts Grid: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Income vs. Expenses */}
        <IncomeExpenseChart />

        {/* Chart B: Category Spending Breakdown */}
        <CategoryDonutChart />
      </div>

      {/* Charts Grid 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart C: Daily Spending Trend */}
        <SpendingTrendChart />

        {/* Chart D: Category Budget Progress */}
        <BudgetProgressOverview />
      </div>

      {/* Recent Activity List */}
      <RecentTransactions onEdit={onEditTransaction} />
    </div>
  );
};
