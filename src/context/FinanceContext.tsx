import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Transaction,
  MonthlyBudget,
  CurrencyCode,
  ActiveTab,
  ToastNotification,
  FinancialSummary,
  BudgetStatus,
  FinancialInsight,
} from '../types';
import {
  SAMPLE_TRANSACTIONS,
  SAMPLE_BUDGETS,
  DEFAULT_CATEGORY_BUDGETS,
  DEFAULT_MONTHLY_LIMIT,
} from '../data/initialData';
import {
  calculateFinancialSummary,
  calculateBudgetStatuses,
  generateInsights,
  getCurrentMonthKey,
} from '../utils/calculations';

interface FinanceContextType {
  // State
  transactions: Transaction[];
  budgets: Record<string, MonthlyBudget>;
  currency: CurrencyCode;
  theme: 'dark' | 'light';
  activeTab: ActiveTab;
  selectedMonth: string;
  toasts: ToastNotification[];

  // Computed
  summary: FinancialSummary;
  budgetStatuses: BudgetStatus[];
  insights: FinancialInsight[];
  currentBudget: MonthlyBudget;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedMonth: (month: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;

  updateCategoryBudget: (month: string, category: string, limit: number) => void;
  updateTotalMonthlyBudget: (month: string, limit: number) => void;
  deleteCategoryBudget: (month: string, category: string) => void;

  resetToSampleData: () => void;
  clearAllData: () => void;
  importData: (imported: { transactions?: Transaction[]; budgets?: Record<string, MonthlyBudget> }) => boolean;

  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendwise_transactions_v1',
  BUDGETS: 'spendwise_budgets_v1',
  CURRENCY: 'spendwise_currency_v1',
  THEME: 'spendwise_theme_v1',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Determine current month key
  const defaultMonth = useMemo(() => {
    // If running in November 2026 or whenever, default to current month
    return getCurrentMonthKey();
  }, []);

  // Initialize transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
    }
    return SAMPLE_TRANSACTIONS;
  });

  // Initialize budgets
  const [budgets, setBudgets] = useState<Record<string, MonthlyBudget>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.error('Failed to load budgets from localStorage', e);
    }
    return SAMPLE_BUDGETS;
  });

  // Initialize currency
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (saved && ['INR', 'USD', 'EUR', 'GBP'].includes(saved)) {
        return saved as CurrencyCode;
      }
    } catch (e) {
      console.error(e);
    }
    return 'INR';
  });

  // Initialize theme
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Apply theme to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Save transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to persist transactions', e);
    }
  }, [transactions]);

  // Save budgets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to persist budgets', e);
    }
  }, [budgets]);

  // Save currency to localStorage
  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
    } catch (e) {
      console.error(e);
    }
    addToast({
      type: 'info',
      title: 'Currency Updated',
      message: `Preferred currency set to ${c}`,
    });
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Helpers
  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Get or initialize active budget for selected month
  const currentBudget: MonthlyBudget = useMemo(() => {
    if (budgets[selectedMonth]) {
      return budgets[selectedMonth];
    }
    return {
      month: selectedMonth,
      totalLimit: DEFAULT_MONTHLY_LIMIT,
      categoryBudgets: { ...DEFAULT_CATEGORY_BUDGETS },
    };
  }, [budgets, selectedMonth]);

  // Computed summary
  const summary = useMemo(() => {
    return calculateFinancialSummary(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  // Computed budget status
  const budgetStatuses = useMemo(() => {
    return calculateBudgetStatuses(transactions, currentBudget);
  }, [transactions, currentBudget]);

  // Computed insights
  const insights = useMemo(() => {
    return generateInsights(transactions, currentBudget, selectedMonth);
  }, [transactions, currentBudget, selectedMonth]);

  // Transaction CRUD
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    addToast({
      type: 'success',
      title: 'Transaction Added',
      message: `${newTx.title} (${newTx.type === 'income' ? '+' : '-'}${newTx.amount}) recorded successfully.`,
    });
  };

  const updateTransaction = (
    id: string,
    txData: Partial<Omit<Transaction, 'id' | 'createdAt'>>
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...txData } : t))
    );
    addToast({
      type: 'success',
      title: 'Transaction Updated',
      message: 'Transaction details updated successfully.',
    });
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast({
      type: 'info',
      title: 'Transaction Deleted',
      message: tx ? `Deleted "${tx.title}"` : 'Transaction deleted.',
    });
  };

  // Budget management
  const updateCategoryBudget = (month: string, category: string, limit: number) => {
    setBudgets((prev) => {
      const existing = prev[month] || {
        month,
        totalLimit: DEFAULT_MONTHLY_LIMIT,
        categoryBudgets: { ...DEFAULT_CATEGORY_BUDGETS },
      };
      return {
        ...prev,
        [month]: {
          ...existing,
          categoryBudgets: {
            ...existing.categoryBudgets,
            [category]: limit,
          },
        },
      };
    });
    addToast({
      type: 'success',
      title: 'Budget Saved',
      message: `${category} budget set to ${limit} for ${month}.`,
    });
  };

  const updateTotalMonthlyBudget = (month: string, limit: number) => {
    setBudgets((prev) => {
      const existing = prev[month] || {
        month,
        totalLimit: limit,
        categoryBudgets: { ...DEFAULT_CATEGORY_BUDGETS },
      };
      return {
        ...prev,
        [month]: {
          ...existing,
          totalLimit: limit,
        },
      };
    });
    addToast({
      type: 'success',
      title: 'Total Budget Updated',
      message: `Monthly budget cap set to ${limit}.`,
    });
  };

  const deleteCategoryBudget = (month: string, category: string) => {
    setBudgets((prev) => {
      const existing = prev[month];
      if (!existing) return prev;
      const updatedCategories = { ...existing.categoryBudgets };
      delete updatedCategories[category];
      return {
        ...prev,
        [month]: {
          ...existing,
          categoryBudgets: updatedCategories,
        },
      };
    });
    addToast({
      type: 'info',
      title: 'Budget Removed',
      message: `Removed budget target for ${category}.`,
    });
  };

  // Reset to Sample Demo Data
  const resetToSampleData = () => {
    setTransactions(SAMPLE_TRANSACTIONS);
    setBudgets(SAMPLE_BUDGETS);
    setSelectedMonth('2026-11');
    addToast({
      type: 'success',
      title: 'Demo Data Loaded',
      message: 'Reset to standard student sample records (Nov, Oct, Sep 2026).',
    });
  };

  // Clear all data
  const clearAllData = () => {
    setTransactions([]);
    setBudgets({});
    addToast({
      type: 'warning',
      title: 'All Data Cleared',
      message: 'All transactions and budget targets have been removed.',
    });
  };

  // Import JSON backup
  const importData = (imported: {
    transactions?: Transaction[];
    budgets?: Record<string, MonthlyBudget>;
  }): boolean => {
    try {
      if (Array.isArray(imported.transactions)) {
        setTransactions(imported.transactions);
      }
      if (imported.budgets && typeof imported.budgets === 'object') {
        setBudgets(imported.budgets);
      }
      addToast({
        type: 'success',
        title: 'Data Imported',
        message: 'Successfully imported financial records.',
      });
      return true;
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Import Failed',
        message: 'The selected file does not contain valid SpendWise data.',
      });
      return false;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        currency,
        theme,
        activeTab,
        selectedMonth,
        toasts,
        summary,
        budgetStatuses,
        insights,
        currentBudget,
        setActiveTab,
        setSelectedMonth,
        setCurrency,
        setTheme,
        toggleTheme,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateCategoryBudget,
        updateTotalMonthlyBudget,
        deleteCategoryBudget,
        resetToSampleData,
        clearAllData,
        importData,
        addToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
