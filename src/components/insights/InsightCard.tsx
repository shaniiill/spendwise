import React from 'react';
import { FinancialInsight } from '../../types';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

interface InsightCardProps {
  insight: FinancialInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'info':
      default:
        return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderClasses = () => {
    switch (insight.type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50';
      case 'warning':
        return 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50';
      case 'danger':
        return 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50';
      case 'info':
      default:
        return 'border-blue-500/30 bg-blue-950/10 hover:border-blue-500/50';
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 shadow-md flex flex-col justify-between ${getBorderClasses()}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              {getIcon()}
            </div>
            <h4 className="font-semibold text-white text-base leading-snug">{insight.title}</h4>
          </div>

          {insight.metric && (
            <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-slate-200 border border-slate-700">
              {insight.metric}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed">{insight.description}</p>
      </div>

      {insight.actionableTip && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-start gap-2 text-xs text-slate-400">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-slate-300">
            <strong className="text-amber-400 font-medium">Recommendation:</strong>{' '}
            {insight.actionableTip}
          </span>
        </div>
      )}
    </div>
  );
};
