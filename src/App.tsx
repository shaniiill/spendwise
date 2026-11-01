import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { TransactionModal } from './components/transactions/TransactionModal';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Transaction } from './types';

const MainApp: React.FC = () => {
  const { activeTab } = useFinance();

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  const handleOpenAddModal = () => {
    setTxToEdit(null);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setTxToEdit(tx);
    setIsTxModalOpen(true);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onEditTransaction={handleEditTransaction}
            onOpenAddModal={handleOpenAddModal}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            onEditTransaction={handleEditTransaction}
            onOpenAddModal={handleOpenAddModal}
          />
        );
      case 'budgets':
        return <BudgetsPage />;
      case 'insights':
        return <InsightsPage onOpenAddModal={handleOpenAddModal} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onEditTransaction={handleEditTransaction}
            onOpenAddModal={handleOpenAddModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] dark:bg-[#0B0F17] text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Navbar onOpenAddModal={handleOpenAddModal} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileNav />

      {/* Global Add/Edit Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
      />

      {/* Global Floating Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainApp />;
};

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  );
}
