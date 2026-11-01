export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Education'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Bills'
  | 'Subscriptions'
  | 'Personal Care'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Part-time Job'
  | 'Freelancing'
  | 'Scholarship'
  | 'Allowance'
  | 'Business'
  | 'Other';

export type Category = ExpenseCategory | IncomeCategory;

export type PaymentMethod =
  | 'UPI'
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  description?: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  limit: number;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalLimit: number;
  categoryBudgets: Record<string, number>;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  previousBalance: number;
  previousIncome: number;
  previousExpenses: number;
  balanceChangePercent: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
  savingsRateChangePercent: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

export interface MonthlyTrendPoint {
  month: string;
  label: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface DailyTrendPoint {
  date: string;
  formattedDate: string;
  amount: number;
}

export interface BudgetStatus {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentSpent: number;
  status: 'safe' | 'warning' | 'exceeded'; // safe: <80%, warning: 80-100%, exceeded: >100%
}

export interface FinancialInsight {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  metric?: string;
  category?: string;
  actionableTip?: string;
}

export interface ToastNotification {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface User {
  id: string;
  name: string;
  phone: string;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'budgets' | 'insights' | 'settings';
