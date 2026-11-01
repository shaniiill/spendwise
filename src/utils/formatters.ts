import { CurrencyCode } from '../types';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
  INR: { symbol: '₹', name: 'Indian Rupee (INR)', locale: 'en-IN' },
  USD: { symbol: '$', name: 'US Dollar (USD)', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro (EUR)', locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound (GBP)', locale: 'en-GB' },
};

/**
 * Formats a monetary value according to the chosen currency and its native formatting conventions.
 * In particular, INR uses the Indian numbering system (Lakhs, Crores, e.g. ₹1,25,000).
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: absoluteAmount % 1 === 0 ? 0 : 2,
      minimumFractionDigits: 0,
    }).format(absoluteAmount);

    return isNegative ? `-${formatted}` : formatted;
  } catch {
    // Fallback if Intl fails
    const formattedNum = absoluteAmount.toLocaleString(config.locale);
    return isNegative ? `-${config.symbol}${formattedNum}` : `${config.symbol}${formattedNum}`;
  }
}

/**
 * Formats a raw number without currency symbol with proper locale grouping (e.g. 1,25,000)
 */
export function formatNumber(amount: number, currency: CurrencyCode = 'INR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  return Math.abs(amount).toLocaleString(config.locale, {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
}

/**
 * Formats a date string (YYYY-MM-DD) into readable format, e.g. "15 Oct 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats a percentage with sign (e.g., +14.2% or -5.0%)
 */
export function formatPercentage(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Distinct color palette for categories
 */
export const CATEGORY_COLORS: Record<string, string> = {
  // Expenses
  Food: '#F59E0B',          // Amber
  Transportation: '#3B82F6',// Blue
  Education: '#8B5CF6',     // Violet
  Shopping: '#EC4899',      // Pink
  Entertainment: '#06B6D4', // Cyan
  Healthcare: '#EF4444',    // Red
  Bills: '#F97316',         // Orange
  Subscriptions: '#6366F1', // Indigo
  'Personal Care': '#10B981',// Emerald
  Other: '#64748B',         // Slate

  // Incomes
  Salary: '#10B981',        // Emerald
  'Part-time Job': '#3B82F6',// Blue
  Freelancing: '#8B5CF6',   // Violet
  Scholarship: '#F59E0B',   // Amber
  Allowance: '#06B6D4',     // Cyan
  Business: '#EC4899',      // Pink
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#94A3B8';
}
