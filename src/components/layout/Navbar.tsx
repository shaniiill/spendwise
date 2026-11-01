import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Sun,
  Moon,
  Calendar,
  Sparkles,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const {
    theme,
    toggleTheme,
    selectedMonth,
    setSelectedMonth,
    currency,
    summary,
    resetToSampleData,
  } = useFinance();
  const { logout } = useAuth();

  // Generate available months for selector (last 6 months)
  const monthOptions = React.useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      list.push({ val, label });
    }
    return list;
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0F17]/90 dark:bg-[#0B0F17]/90 light:bg-white/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand Logo & Tagline (Mobile visible brand) */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-base text-white tracking-tight">SpendWise</span>
        </div>

        {/* Desktop Tagline Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-400">Net Flow:</span>
          <span className={`font-semibold ${summary.totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(summary.totalBalance, currency)}
          </span>
        </div>
      </div>

      {/* Right Actions: Month switcher, Theme toggle, Add Transaction, Logout */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Month Selector Dropdown */}
        <div className="relative flex items-center">
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium pl-8 pr-3 py-1.5 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer"
            aria-label="Select active month"
          >
            {monthOptions.map((m) => (
              <option key={m.val} value={m.val}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Demo Data Reset Quick Pill (Evaluator friendly) */}
        <button
          onClick={resetToSampleData}
          title="Reset to realistic Indian student demo records"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Data</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add</span>
        </button>

        {/* Mobile Logout Quick Icon */}
        <button
          onClick={logout}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          title="Log out"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
