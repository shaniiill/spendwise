import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Sparkles,
  Settings,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, summary, currency } = useFinance();
  const { currentUser, logout } = useAuth();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets', icon: <PieChart className="w-5 h-5" /> },
    { id: 'insights', label: 'Insights', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  // Get user initials
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AV';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-white border-r border-slate-800/80 p-5 select-none transition-colors justify-between shrink-0">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              SpendWise
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Know Your Money. Own Your Future.</p>
          </div>
        </div>

        {/* Quick balance card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-inner">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Net Balance
          </div>
          <div className="mt-1 text-xl font-bold text-white tracking-tight">
            {formatCurrency(summary.totalBalance, currency)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Savings Rate:</span>
            <span className="font-semibold text-emerald-400">
              {summary.savingsRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile footer with Logout */}
      <div className="pt-4 border-t border-slate-800/70">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser?.name || 'User'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              +91 {currentUser?.phone || '9876543210'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            title="Log out of SpendWise"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
