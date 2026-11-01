import {
  Transaction,
  FinancialSummary,
  CategorySpending,
  MonthlyTrendPoint,
  DailyTrendPoint,
  BudgetStatus,
  FinancialInsight,
  MonthlyBudget,
} from '../types';
import { getCategoryColor } from './formatters';

/**
 * Gets the current month key in YYYY-MM format
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Gets the previous month key in YYYY-MM format given any month key
 */
export function getPreviousMonthKey(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1;
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Filters transactions by month string 'YYYY-MM'
 */
export function filterTransactionsByMonth(
  transactions: Transaction[],
  monthKey: string
): Transaction[] {
  return transactions.filter((t) => t.date.startsWith(monthKey));
}

/**
 * Calculates financial summary metrics for a given set of transactions,
 * comparing with the previous month.
 */
export function calculateFinancialSummary(
  transactions: Transaction[],
  targetMonthKey: string = getCurrentMonthKey()
): FinancialSummary {
  const currentMonthTx = filterTransactionsByMonth(transactions, targetMonthKey);
  const previousMonthKey = getPreviousMonthKey(targetMonthKey);
  const previousMonthTx = filterTransactionsByMonth(transactions, previousMonthKey);

  // Current month totals
  let totalIncome = 0;
  let totalExpenses = 0;
  currentMonthTx.forEach((tx) => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Previous month totals
  let prevIncome = 0;
  let prevExpenses = 0;
  previousMonthTx.forEach((tx) => {
    if (tx.type === 'income') {
      prevIncome += tx.amount;
    } else {
      prevExpenses += tx.amount;
    }
  });

  const prevBalance = prevIncome - prevExpenses;
  const prevSavingsRate = prevIncome > 0 ? ((prevIncome - prevExpenses) / prevIncome) * 100 : 0;

  // Calculate percentage changes
  const calcPercentChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate: Math.max(-100, Math.min(100, savingsRate)),
    previousBalance: prevBalance,
    previousIncome: prevIncome,
    previousExpenses: prevExpenses,
    balanceChangePercent: calcPercentChange(totalBalance, prevBalance),
    incomeChangePercent: calcPercentChange(totalIncome, prevIncome),
    expenseChangePercent: calcPercentChange(totalExpenses, prevExpenses),
    savingsRateChangePercent: savingsRate - prevSavingsRate,
  };
}

/**
 * Calculates category-wise spending breakdown for donut chart
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  monthKey?: string
): CategorySpending[] {
  const relevantTx = monthKey
    ? filterTransactionsByMonth(transactions, monthKey)
    : transactions;

  const expenseTx = relevantTx.filter((t) => t.type === 'expense');
  const totalExpense = expenseTx.reduce((sum, t) => sum + t.amount, 0);

  if (totalExpense === 0) return [];

  const categoryMap = new Map<string, { amount: number; count: number }>();

  expenseTx.forEach((tx) => {
    const existing = categoryMap.get(tx.category) || { amount: 0, count: 0 };
    categoryMap.set(tx.category, {
      amount: existing.amount + tx.amount,
      count: existing.count + 1,
    });
  });

  const breakdown: CategorySpending[] = [];
  categoryMap.forEach((val, category) => {
    breakdown.push({
      category,
      amount: val.amount,
      percentage: (val.amount / totalExpense) * 100,
      count: val.count,
      color: getCategoryColor(category),
    });
  });

  return breakdown.sort((a, b) => b.amount - a.amount);
}

/**
 * Calculates monthly trend data for the last N months (Income vs Expenses)
 */
export function calculateMonthlyTrends(
  transactions: Transaction[],
  monthsCount: number = 6
): MonthlyTrendPoint[] {
  const now = new Date();
  const months: string[] = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${yr}-${mo}`);
  }

  return months.map((mKey) => {
    const [yr, mo] = mKey.split('-');
    const dateObj = new Date(parseInt(yr, 10), parseInt(mo, 10) - 1, 1);
    const label = dateObj.toLocaleDateString('en-US', { month: 'short' });

    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      if (tx.date.startsWith(mKey)) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expenses += tx.amount;
        }
      }
    });

    return {
      month: mKey,
      label,
      income,
      expenses,
      savings: income - expenses,
    };
  });
}

/**
 * Calculates daily spending trend over a specific month
 */
export function calculateDailySpendingTrend(
  transactions: Transaction[],
  monthKey: string = getCurrentMonthKey()
): DailyTrendPoint[] {
  const expenseTx = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(monthKey)
  );

  const dailyMap = new Map<string, number>();

  expenseTx.forEach((tx) => {
    const current = dailyMap.get(tx.date) || 0;
    dailyMap.set(tx.date, current + tx.amount);
  });

  // Sort by date
  const sortedDates = Array.from(dailyMap.keys()).sort();

  return sortedDates.map((dateStr) => {
    const parts = dateStr.split('-');
    const day = parts[2];
    const month = new Date(dateStr).toLocaleString('en-US', { month: 'short' });
    return {
      date: dateStr,
      formattedDate: `${day} ${month}`,
      amount: dailyMap.get(dateStr) || 0,
    };
  });
}

/**
 * Computes category budget status given expenses and configured budgets
 */
export function calculateBudgetStatuses(
  transactions: Transaction[],
  budget: MonthlyBudget
): BudgetStatus[] {
  const monthKey = budget.month;
  const monthExpenses = filterTransactionsByMonth(transactions, monthKey).filter(
    (t) => t.type === 'expense'
  );

  // Group spent by category
  const spentMap = new Map<string, number>();
  monthExpenses.forEach((tx) => {
    const current = spentMap.get(tx.category) || 0;
    spentMap.set(tx.category, current + tx.amount);
  });

  const statuses: BudgetStatus[] = [];

  // For categories defined in budget
  Object.entries(budget.categoryBudgets).forEach(([category, limit]) => {
    const spent = spentMap.get(category) || 0;
    const remaining = limit - spent;
    const percentSpent = limit > 0 ? (spent / limit) * 100 : 0;

    let status: 'safe' | 'warning' | 'exceeded' = 'safe';
    if (percentSpent > 100) {
      status = 'exceeded';
    } else if (percentSpent >= 80) {
      status = 'warning';
    }

    statuses.push({
      category,
      limit,
      spent,
      remaining,
      percentSpent,
      status,
    });
  });

  // Sort by highest percent spent first so attention-needed budgets show up top
  return statuses.sort((a, b) => b.percentSpent - a.percentSpent);
}

/**
 * Generates transparent, rule-based financial insights derived directly from user data.
 * No fake data. Returns empty or guidance if no transactions exist.
 */
export function generateInsights(
  transactions: Transaction[],
  monthlyBudget?: MonthlyBudget,
  targetMonthKey: string = getCurrentMonthKey()
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const currentMonthTx = filterTransactionsByMonth(transactions, targetMonthKey);

  if (currentMonthTx.length === 0) {
    return [
      {
        id: 'no-data-curr',
        type: 'info',
        title: 'Start Tracking Your Finances',
        description:
          'No transactions recorded for this month yet. Add your income or recent expenses to see personalized insights, spending trends, and budget alerts.',
        actionableTip: 'Click the "+ Add Transaction" button to record your first entry.',
      },
    ];
  }

  const currentSummary = calculateFinancialSummary(transactions, targetMonthKey);
  const currentBreakdown = calculateCategoryBreakdown(transactions, targetMonthKey);
  const prevMonthKey = getPreviousMonthKey(targetMonthKey);
  const prevSummary = calculateFinancialSummary(transactions, prevMonthKey);
  const prevBreakdown = calculateCategoryBreakdown(transactions, prevMonthKey);

  // 1. Savings Rate Analysis
  if (currentSummary.totalIncome > 0) {
    if (currentSummary.savingsRate >= 40) {
      insights.push({
        id: 'insight-savings-high',
        type: 'success',
        title: 'Excellent Savings Rate',
        description: `You are saving ${currentSummary.savingsRate.toFixed(1)}% of your income this month (₹${currentSummary.totalBalance.toLocaleString('en-IN')} net saved). You are well ahead of the recommended 20% savings rule.`,
        metric: `${currentSummary.savingsRate.toFixed(1)}% Saved`,
        actionableTip: 'Consider putting a portion of your surplus into a high-interest savings account or emergency fund.',
      });
    } else if (currentSummary.savingsRate >= 20) {
      insights.push({
        id: 'insight-savings-healthy',
        type: 'success',
        title: 'Healthy Savings Rate',
        description: `You are saving ${currentSummary.savingsRate.toFixed(1)}% of your income, keeping your finances balanced and disciplined.`,
        metric: `${currentSummary.savingsRate.toFixed(1)}% Saved`,
        actionableTip: 'Keep maintaining this steady habit to build a solid financial cushion.',
      });
    } else if (currentSummary.savingsRate > 0) {
      insights.push({
        id: 'insight-savings-low',
        type: 'warning',
        title: 'Modest Savings Buffer',
        description: `You have saved ${currentSummary.savingsRate.toFixed(1)}% of your income so far. Spending accounts for ${(100 - currentSummary.savingsRate).toFixed(1)}% of your earnings.`,
        metric: `${currentSummary.savingsRate.toFixed(1)}% Saved`,
        actionableTip: 'Review non-essential discretionary expenses to aim for a 20% savings target.',
      });
    } else {
      insights.push({
        id: 'insight-deficit',
        type: 'danger',
        title: 'Deficit Warning: Expenses Exceed Income',
        description: `Your monthly expenses (₹${currentSummary.totalExpenses.toLocaleString('en-IN')}) have surpassed your income (₹${currentSummary.totalIncome.toLocaleString('en-IN')}) by ₹${Math.abs(currentSummary.totalBalance).toLocaleString('en-IN')}.`,
        metric: `-₹${Math.abs(currentSummary.totalBalance).toLocaleString('en-IN')}`,
        actionableTip: 'Halt non-urgent purchases and review upcoming recurring subscriptions to avoid debt.',
      });
    }
  }

  // 2. Highest Spending Category
  if (currentBreakdown.length > 0) {
    const top = currentBreakdown[0];
    insights.push({
      id: 'insight-top-category',
      type: top.percentage > 40 ? 'warning' : 'info',
      title: `Dominant Category: ${top.category}`,
      description: `${top.category} is your highest expense area, accounting for ₹${top.amount.toLocaleString('en-IN')} (${top.percentage.toFixed(1)}% of all spending across ${top.count} transactions).`,
      metric: `${top.percentage.toFixed(1)}% of Outflow`,
      category: top.category,
      actionableTip:
        top.category === 'Food'
          ? 'Cooking simple hostel meals or batch ordering with peers can significantly trim canteen bills.'
          : top.category === 'Shopping'
          ? 'Implement the 48-hour rule before buying non-essential items to curb impulse spending.'
          : `Monitor ${top.category} expenses closely to keep them within your monthly budget.`,
    });
  }

  // 3. Month-over-Month Comparison
  if (prevSummary.totalExpenses > 0) {
    const expenseDiff = currentSummary.totalExpenses - prevSummary.totalExpenses;
    const diffPct = (expenseDiff / prevSummary.totalExpenses) * 100;

    if (diffPct > 15) {
      insights.push({
        id: 'insight-mom-increase',
        type: 'warning',
        title: 'Monthly Spending Increased',
        description: `Your spending is running ${Math.abs(diffPct).toFixed(1)}% higher than the same point last month (an increase of ₹${expenseDiff.toLocaleString('en-IN')}).`,
        metric: `+${diffPct.toFixed(1)}% vs Last Month`,
        actionableTip: 'Identify whether this was caused by one-off semester fees or lifestyle creep.',
      });
    } else if (diffPct < -10) {
      insights.push({
        id: 'insight-mom-decrease',
        type: 'success',
        title: 'Spending Cut by ' + Math.abs(diffPct).toFixed(1) + '%',
        description: `Great job! Your expenses are ${Math.abs(diffPct).toFixed(1)}% lower than last month, saving you ₹${Math.abs(expenseDiff).toLocaleString('en-IN')}.`,
        metric: `${diffPct.toFixed(1)}% vs Last Month`,
        actionableTip: 'Maintain this disciplined trajectory and allocate the savings towards your goals.',
      });
    }
  }

  // 4. Category-specific shifts compared to previous month
  if (prevBreakdown.length > 0 && currentBreakdown.length > 0) {
    for (const currCat of currentBreakdown) {
      const prevCat = prevBreakdown.find((p) => p.category === currCat.category);
      if (prevCat && prevCat.amount > 0) {
        const catDiff = currCat.amount - prevCat.amount;
        const catPct = (catDiff / prevCat.amount) * 100;
        if (catPct >= 30 && catDiff >= 500) {
          insights.push({
            id: `insight-cat-jump-${currCat.category}`,
            type: 'warning',
            title: `${currCat.category} Surge (+${catPct.toFixed(0)}%)`,
            description: `You spent ₹${currCat.amount.toLocaleString('en-IN')} on ${currCat.category} this month compared to ₹${prevCat.amount.toLocaleString('en-IN')} last month (up by ₹${catDiff.toLocaleString('en-IN')}).`,
            metric: `+₹${catDiff.toLocaleString('en-IN')}`,
            category: currCat.category,
            actionableTip: `Check your recent ${currCat.category} transactions to ensure you are not exceeding expectations.`,
          });
          break; // Show at most one specific category surge to avoid clutter
        }
      }
    }
  }

  // 5. Budget Utilization Warnings
  if (monthlyBudget) {
    const budgetStatuses = calculateBudgetStatuses(transactions, monthlyBudget);
    const exceeded = budgetStatuses.filter((b) => b.status === 'exceeded');
    const warning = budgetStatuses.filter((b) => b.status === 'warning');

    if (exceeded.length > 0) {
      const names = exceeded.map((b) => b.category).join(', ');
      insights.push({
        id: 'insight-budget-exceeded',
        type: 'danger',
        title: `Budget Limit Exceeded: ${names}`,
        description: `You have spent more than the allotted budget in: ${names}. Remaining overall budget may be constrained.`,
        metric: `${exceeded.length} Over Budget`,
        actionableTip: 'Adjust your budget limits or pause discretionary spending in these categories.',
      });
    } else if (warning.length > 0) {
      const firstWarn = warning[0];
      insights.push({
        id: `insight-budget-near-${firstWarn.category}`,
        type: 'warning',
        title: `${firstWarn.category} Budget Near Limit`,
        description: `You have utilized ${firstWarn.percentSpent.toFixed(0)}% of your ${firstWarn.category} budget (₹${firstWarn.spent.toLocaleString('en-IN')} of ₹${firstWarn.limit.toLocaleString('en-IN')}). Remaining: ₹${firstWarn.remaining.toLocaleString('en-IN')}.`,
        metric: `${firstWarn.percentSpent.toFixed(0)}% Utilized`,
        category: firstWarn.category,
        actionableTip: `Keep future ${firstWarn.category} expenses below ₹${firstWarn.remaining.toLocaleString('en-IN')} for the rest of the month.`,
      });
    }
  }

  // 6. Average Daily Spending
  const dateObj = new Date();
  const currentDay = Math.max(1, dateObj.getDate());
  const dailyAvg = currentSummary.totalExpenses / currentDay;

  insights.push({
    id: 'insight-daily-burn',
    type: 'info',
    title: 'Daily Spending Velocity',
    description: `Your average spending this month is approximately ₹${Math.round(dailyAvg).toLocaleString('en-IN')} per day across ${currentDay} elapsed days.`,
    metric: `₹${Math.round(dailyAvg).toLocaleString('en-IN')}/day`,
    actionableTip: 'Keeping daily variable spending below ₹300 helps stay within standard student budgets.',
  });

  return insights;
}
