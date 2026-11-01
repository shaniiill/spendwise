import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Sparkles,
  Settings,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'History', icon: <Receipt className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets', icon: <PieChart className="w-5 h-5" /> },
    { id: 'insights', label: 'Insights', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 dark:bg-[#0B0F17]/95 light:bg-white/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-500/10' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
