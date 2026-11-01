import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  changePercent?: number;
  changeLabel?: string;
  variant?: 'emerald' | 'blue' | 'rose' | 'amber' | 'neutral';
  reverseColorLogic?: boolean; // For expenses: lower is green, higher is red!
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  changePercent,
  changeLabel = 'vs last month',
  variant = 'emerald',
  reverseColorLogic = false,
}) => {
  // Determine if trend is positive or negative
  const hasChange = changePercent !== undefined && !isNaN(changePercent);
  const isPositive = hasChange && changePercent > 0;
  const isZero = hasChange && Math.abs(changePercent) < 0.1;

  // Good vs Bad logic
  const isFavorable = reverseColorLogic ? !isPositive : isPositive;

  const getTrendBadge = () => {
    if (!hasChange) {
      return (
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Minus className="w-3.5 h-3.5" /> No prev data
        </span>
      );
    }

    if (isZero) {
      return (
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Minus className="w-3.5 h-3.5" /> 0.0% {changeLabel}
        </span>
      );
    }

    const badgeColor = isFavorable
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? '+' : ''}
          {changePercent.toFixed(1)}%
        </span>
        <span className="text-xs text-slate-400">{changeLabel}</span>
      </div>
    );
  };

  const iconBgClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    neutral: 'bg-slate-700/30 text-slate-300 border-slate-700/50',
  }[variant];

  return (
    <div className="relative group bg-[#111827] dark:bg-[#111827] light:bg-white p-5 sm:p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-400 tracking-wide uppercase text-xs">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${iconBgClasses}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {value}
        </div>
        <div className="mt-3 flex items-center">{getTrendBadge()}</div>
      </div>
    </div>
  );
};
