import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { InsightCard } from '../components/insights/InsightCard';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { calculateCategoryBreakdown } from '../utils/calculations';
import { FinancialInsight } from '../types';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  PlusCircle,
} from 'lucide-react';

interface InsightsPageProps {
  onOpenAddModal: () => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onOpenAddModal }) => {
  const { insights, summary, selectedMonth, currency, transactions } = useFinance();

  const breakdown = useMemo(() => {
    return calculateCategoryBreakdown(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const topCategory = breakdown[0];

  // Calculate student financial health score (0 to 100)
  const healthScore = useMemo(() => {
    if (summary.totalIncome === 0 && summary.totalExpenses === 0) return 0;
    let score = 50;

    // Savings rate factor
    if (summary.savingsRate >= 30) score += 30;
    else if (summary.savingsRate >= 15) score += 20;
    else if (summary.savingsRate > 0) score += 10;
    else score -= 20;

    // Expense change factor vs previous month
    if (summary.expenseChangePercent < -5) score += 15;
    else if (summary.expenseChangePercent > 20) score -= 15;

    // Diversification factor (not spending >60% in a single category)
    if (topCategory && topCategory.percentage < 45) score += 10;
    else if (topCategory && topCategory.percentage > 70) score -= 15;

    return Math.max(10, Math.min(100, Math.round(score)));
  }, [summary, topCategory]);

  const getHealthBadge = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Excellent Financial Health',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      };
    }
    if (score >= 60) {
      return {
        label: 'Good Financial Discipline',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      };
    }
    if (score >= 40) {
      return {
        label: 'Moderate Buffer',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      };
    }
    return {
      label: 'Needs Attention',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };
  };

  const badge = getHealthBadge(healthScore);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Smart Financial Insights
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Algorithmic analysis of your cash flow patterns, velocity, and savings rate for {selectedMonth}.
          </p>
        </div>

        {summary.totalIncome > 0 && (
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${badge.color}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              Health Index: {healthScore}/100 — {badge.label}
            </span>
          </div>
        )}
      </div>

      {/* 4 Quick Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Top Spending Area
          </span>
          <span className="text-base font-bold text-white mt-1 block truncate">
            {topCategory ? topCategory.category : 'None yet'}
          </span>
          <span className="text-xs text-slate-400 mt-0.5 block">
            {topCategory ? `${topCategory.percentage.toFixed(0)}% of expenses` : 'No expenses'}
          </span>
        </div>

        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Net Savings
          </span>
          <span className={`text-base font-bold mt-1 block ${summary.totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(summary.totalBalance, currency)}
          </span>
          <span className="text-xs text-slate-400 mt-0.5 block">
            {summary.savingsRate.toFixed(1)}% savings rate
          </span>
        </div>

        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Income Outflow Ratio
          </span>
          <span className="text-base font-bold text-white mt-1 block">
            {summary.totalIncome > 0
              ? `${((summary.totalExpenses / summary.totalIncome) * 100).toFixed(0)}%`
              : '0%'}
          </span>
          <span className="text-xs text-slate-400 mt-0.5 block">Spent of total inflow</span>
        </div>

        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            MoM Expense Shift
          </span>
          <span
            className={`text-base font-bold mt-1 block ${
              summary.expenseChangePercent > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {formatPercentage(summary.expenseChangePercent)}
          </span>
          <span className="text-xs text-slate-400 mt-0.5 block">Compared to last month</span>
        </div>
      </div>

      {/* Dynamic Rule-based Insights Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Observations & Guidance</h3>
        {insights.length === 0 ? (
          <div className="p-12 text-center bg-[#111827] rounded-2xl border border-slate-800 space-y-3">
            <Activity className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-semibold text-slate-200">No data available for {selectedMonth}</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Once you add income or expense transactions for this month, SpendWise will generate real-time actionable insights.
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors mt-2"
            >
              <PlusCircle className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight: FinancialInsight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>

      {/* Student Financial Best Practices Section */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
        <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" /> SpendWise 50-30-20 Rule Guidelines for Students
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
            <span className="font-bold text-emerald-400 block mb-1">50% Needs</span>
            Hostel rent, mess food, semester textbooks, metro travel passes, and essential phone recharges.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
            <span className="font-bold text-blue-400 block mb-1">30% Wants</span>
            Weekend cinema, cafe visits, festival shopping, tech accessories, and OTT subscriptions.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
            <span className="font-bold text-amber-400 block mb-1">20% Savings</span>
            Emergency hostel buffer, certification exams fund, tech upgrade savings, and mutual fund SIPs.
          </div>
        </div>
      </div>
    </div>
  );
};
