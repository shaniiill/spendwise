import React, { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../utils/formatters';
import { CurrencyCode } from '../types';
import { exportTransactionsToCSV, exportDataAsJSON } from '../utils/csvExport';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  Coins,
  Palette,
  Target,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  GraduationCap,
  Sparkles,
  UserCheck,
  LogOut,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    currency,
    setCurrency,
    theme,
    setTheme,
    transactions,
    budgets,
    resetToSampleData,
    clearAllData,
    importData,
    currentBudget,
    updateTotalMonthlyBudget,
    selectedMonth,
  } = useFinance();
  const { currentUser, logout } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals for confirmation
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Monthly budget input in settings
  const [monthlyCap, setMonthlyCap] = useState(currentBudget.totalLimit.toString());

  const handleMonthlyCapChange = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(monthlyCap);
    if (val && val > 0) {
      updateTotalMonthlyBudget(selectedMonth, val);
    }
  };

  const handleExportBackup = () => {
    exportDataAsJSON(
      {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        currency,
        theme,
        transactions,
        budgets,
      },
      `spendwise_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importData(parsed);
      } catch (err) {
        alert('Invalid JSON file. Please provide a valid SpendWise backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Application Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure display currency, themes, data backups, and demo state.
        </p>
      </div>

      <div className="space-y-5">
        {/* 0. Account & Session Information */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">
                  {currentUser?.name || 'Arjun Verma'}
                </h3>
                <p className="text-xs text-slate-400">
                  Phone: <strong className="text-slate-300">+91 {currentUser?.phone || '9876543210'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 1. Currency Preferences */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-semibold text-white text-base">Preferred Currency</h3>
              <p className="text-xs text-slate-400">
                INR (₹) formats amounts with the Indian numbering system (e.g. ₹1,25,000).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => {
              const conf = CURRENCIES[cCode];
              const isSelected = currency === cCode;
              return (
                <button
                  key={cCode}
                  onClick={() => setCurrency(cCode)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg font-bold block">{conf.symbol}</span>
                  <span className="text-xs font-semibold block mt-0.5">{cCode}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{conf.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Theme Preferences */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-semibold text-white text-base">Visual Theme</h3>
              <p className="text-xs text-slate-400">
                Switch between high-contrast fintech dark navy and crisp slate light mode.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700 mx-auto mb-2" />
              <span className="text-xs font-semibold block">Dark Mode</span>
              <span className="text-[10px] text-slate-400">Deep charcoal & navy</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                theme === 'light'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 mx-auto mb-2" />
              <span className="text-xs font-semibold block">Light Mode</span>
              <span className="text-[10px] text-slate-400">Clean slate daylight</span>
            </button>
          </div>
        </div>

        {/* 3. Monthly Budget Preference */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-white text-base">Active Monthly Budget Limit</h3>
              <p className="text-xs text-slate-400">
                Overall monthly expense threshold for {selectedMonth}.
              </p>
            </div>
          </div>

          <form onSubmit={handleMonthlyCapChange} className="flex items-center gap-3 max-w-md">
            <input
              type="number"
              min="1"
              value={monthlyCap}
              onChange={(e) => setMonthlyCap(e.target.value)}
              className="bg-slate-900 px-4 py-2 text-sm text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
            >
              Save Cap
            </button>
          </form>
        </div>

        {/* 4. Data Import / Export */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-semibold text-white text-base">Export & Backup</h3>
              <p className="text-xs text-slate-400">
                Download your financial transactions as CSV or complete application backup as JSON.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportTransactionsToCSV(transactions)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV Spreadsheet</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Export Complete JSON Backup</span>
            </button>

            <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Import JSON Backup</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 5. Demo Data Management */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-white text-base">Demo Data & Reset</h3>
              <p className="text-xs text-slate-400">
                Reset to realistic college engineering student demo records or wipe all data.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Sample Student Data</span>
            </button>

            <button
              onClick={() => setIsClearConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Wipe All Data</span>
            </button>
          </div>
        </div>

        {/* 6. Technical Architecture & College Mini-Project Info */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">Engineering Project Architecture</h3>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong>Architecture Pattern:</strong> Client-Side React SPA with centralized React Context state container and browser <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400">localStorage</code> persistence.
            </p>
            <p>
              <strong>Authentication & Session:</strong> Secured phone & password credentials persisted to local browser storage with automatic session recovery.
            </p>
            <p>
              <strong>Security & Privacy:</strong> Zero cloud trackers or external server dependencies. All sensitive financial records remain strictly within the user&apos;s local sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToSampleData}
        title="Reset to Demo Data"
        message="This will overwrite current records with realistic Indian engineering student sample transactions (college allowance, freelance gigs, canteen food, metro pass, books, etc.). Proceed?"
        confirmLabel="Reset Demo Data"
        variant="warning"
      />

      <ConfirmationModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Financial Records"
        message="Are you sure you want to completely erase all transactions and budgets? This will leave the dashboard in a fresh, clean zero state."
        confirmLabel="Wipe Everything"
        variant="danger"
      />
    </div>
  );
};
