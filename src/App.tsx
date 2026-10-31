/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnalyticsBento } from '@/components/ui/analytics-bento';
import AnalyticsBentoDemo from '@/components/ui/demo';
import { Navbar } from './components/Navbar';
import { KPISummary } from './components/KPISummary';
import { ConnectedAccounts } from './components/ConnectedAccounts';
import { RecurringExpenses } from './components/RecurringExpenses';
import { LiveTransactionFeed } from './components/LiveTransactionFeed';
import { AddTransactionModal } from './components/AddTransactionModal';
import { IntegrationGuideModal } from './components/IntegrationGuideModal';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { 
  INITIAL_BANK_ACCOUNTS, 
  INITIAL_RECURRING_BILLS, 
  INITIAL_TRANSACTIONS, 
  AUTOMATIC_FEED_POOL 
} from './data/initialFinanceData';
import { BankAccount, RecurringBill, Transaction, FinancialCategory } from './types/finance';
import { Sparkles, ShieldCheck, Zap, ServerOff, Lock } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'balanced_finance_storage_v1';

export default function App() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'demo'>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>('₹');
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [turboSync, setTurboSync] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Initialize transactions and bankAccounts from browser localStorage (zero remote server)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.transactions) && parsed.transactions.length > 0) {
          return parsed.transactions;
        }
      }
    } catch (e) {
      // Local fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.bankAccounts) && parsed.bankAccounts.length > 0) {
          return parsed.bankAccounts;
        }
      }
    } catch (e) {
      // Local fallback
    }
    return INITIAL_BANK_ACCOUNTS;
  });

  const [recurringBills] = useState<RecurringBill[]>(INITIAL_RECURRING_BILLS);
  const [autoCaptureCount, setAutoCaptureCount] = useState<number>(0);

  // Auto-persist all financial records in client-side localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        transactions,
        bankAccounts,
        currency,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [transactions, bankAccounts, currency]);

  // Purge local storage
  const handlePurgeLocalData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
    setTransactions(INITIAL_TRANSACTIONS);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
  };

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle incoming transaction and update accounts
  const processIncomingTransaction = useCallback((txData: Omit<Transaction, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      date: dateStr,
    };

    setTransactions(prev => [newTx, ...prev]);
    setAutoCaptureCount(c => c + 1);
    setLastSyncTime('Just now');

    // Update bank balances
    setBankAccounts(prev => prev.map(acc => {
      if (acc.name === newTx.sourceAccount) {
        const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
        return {
          ...acc,
          balance: acc.balance + delta,
          lastSynced: 'Just now'
        };
      }
      return acc;
    }));
  }, []);

  // Simulate an incoming automated transaction
  const handleSimulateFeed = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * AUTOMATIC_FEED_POOL.length);
    const item = AUTOMATIC_FEED_POOL[randomIndex];
    // Slightly randomize amount to make live stream realistic
    const jitter = (Math.random() * 0.3 - 0.15) * item.amount;
    const finalAmount = Math.round((item.amount + jitter) * 100) / 100;
    
    processIncomingTransaction({
      ...item,
      amount: finalAmount,
    });
  }, [processIncomingTransaction]);

  // Automated bank feed interval
  useEffect(() => {
    if (!autoSync) return;
    const intervalMs = turboSync ? 4000 : 12000;
    const timer = setInterval(() => {
      handleSimulateFeed();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [autoSync, turboSync, handleSimulateFeed]);

  // Manual refresh all connected accounts
  const handleRefreshAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setBankAccounts(prev => prev.map(acc => ({ ...acc, lastSynced: 'Just now' })));
      setIsSyncing(false);
      setLastSyncTime('Just now');
    }, 900);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleClearAll = () => {
    setTransactions([]);
  };

  // Financial aggregates
  const { totalBalance, totalIncome, totalExpense, netSavings, runwayMonths } = useMemo(() => {
    const totalBal = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const net = income - expense;
    // Monthly burn rate (assume 30-day window)
    const monthlyBurn = Math.max(expense, 1500);
    const runway = totalBal > 0 ? totalBal / monthlyBurn : 0;

    return {
      totalBalance: totalBal,
      totalIncome: income,
      totalExpense: expense,
      netSavings: net,
      runwayMonths: runway,
    };
  }, [bankAccounts, transactions]);

  // Calculate dynamic props for AnalyticsBento
  const bentoData = useMemo(() => {
    // 30 day revenue curve derived from income transactions
    const baseCurve = [
      7420, 7510, 7460, 7380, 7490, 7640, 7720, 7680, 7590, 7560,
      7630, 7780, 7900, 7960, 7910, 7850, 7880, 8010, 8140, 8230,
      8190, 8120, 8260, 8430, 8560, 8620, 8700, 8890, 9020, 9134
    ];
    // Scale curve with recent transactions
    const scaleFactor = Math.max(0.7, Math.min(2.5, totalIncome / 15000));
    const revenueSeries = baseCurve.map((val, i) => {
      const adjusted = Math.round(val * scaleFactor);
      const day = new Date(2026, 9, 1 + i);
      return {
        value: adjusted,
        label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });

    // Compute dynamic category sums
    const catSums: Record<FinancialCategory, number> = {
      product: 0,
      eng: 0,
      growth: 0,
      brand: 0,
      ops: 0,
    };
    transactions.forEach(t => {
      catSums[t.category] = (catSums[t.category] || 0) + t.amount;
    });

    // Hourly session curves for Cash Velocity / Inflow-Outflow
    const bell = (x: number, m: number, s: number) => Math.exp(-(((x - m) / s) ** 2) / 2);
    const hours = Array.from({ length: 25 }, (_, h) => h);
    const desktop = [0, 1, 2].map((w) =>
      hours.map((h) => Math.round(2400 * (1 - w * 0.16) * (bell(h, 13 - w * 0.6, 3.4) * 0.92 + bell(h, 20, 2.2) * 0.18)))
    );
    const mobile = [0, 1, 2].map((w) =>
      hours.map((h) => Math.round(2600 * (1 - w * 0.18) * (bell(h, 20.5 - w * 0.4, 3) * 0.95 + bell(h, 8, 1.8) * 0.2)))
    );

    const weeklyTotal = Math.round(totalIncome * 0.28);
    const monthlyTotal = Math.round(totalIncome);
    const yearlyTotal = Math.round(totalIncome * 11.2);

    return {
      revenue: {
        label: "Cashflow & Inflow",
        value: Math.round(totalIncome),
        delta: "+19.4%",
        note: <>Net Profit <span className="text-foreground/90 font-mono">+{currency}{Math.round(netSavings).toLocaleString()}</span></>,
        caption: "Last 30 days live stream",
        series: revenueSeries,
      },
      sessions: {
        label: "Transaction Velocity",
        value: 48210 + autoCaptureCount * 12,
        delta: "+14.2%",
        note: "Inflow vs Outflow hourly activity",
        desktop,
        mobile,
        labels: {
          desktop: "Operating Inflow",
          mobile: "Operating Outflow",
          prior: "Prior weeks",
          current: "this week",
        },
      },
      categories: {
        title: "Capital allocation & revenue by category",
        groups: [
          { id: "product", name: "Product & SaaS", color: "#7CFF5B", ink: "dark" as const },
          { id: "eng", name: "Engineering & Cloud", color: "#8B3DFF", ink: "light" as const },
          { id: "growth", name: "Growth & Channels", color: "#FFB800", ink: "dark" as const },
          { id: "brand", name: "Brand & Creative", color: "#FF5A1F", ink: "dark" as const },
          { id: "ops", name: "Operations & Treasury", color: "color-mix(in oklab, var(--color-muted-foreground) 45%, var(--color-muted))" },
        ],
        periods: [
          { label: "Weekly", total: weeklyTotal, delta: "19.6%", compare: `vs ${currency}1,340 last week` },
          { label: "Monthly", total: monthlyTotal, delta: "2.4%", compare: `vs ${currency}8,441 last month` },
          { label: "Yearly", total: yearlyTotal, delta: "24.1%", compare: `vs ${currency}76,330 last year` },
        ],
        items: [
          { name: "SaaS Licenses", group: "product", values: [Math.round(catSums.product * 0.25), Math.round(catSums.product), Math.round(catSums.product * 12)] },
          { name: "Design Seats", group: "product", values: [353, 1460, 17800] },
          { name: "Cloud Compute", group: "eng", values: [Math.round(catSums.eng * 0.28), Math.round(catSums.eng), Math.round(catSums.eng * 12)] },
          { name: "DevOps & CI/CD", group: "eng", values: [551, 2010, 24100] },
          { name: "AI Inference", group: "eng", values: [532, 1720, 19400] },
          { name: "Ad Spend", group: "growth", values: [Math.round(catSums.growth * 0.3), Math.round(catSums.growth), Math.round(catSums.growth * 11)] },
          { name: "SEO & Growth", group: "growth", values: [290, 1310, 16900] },
          { name: "Brand Creative", group: "brand", values: [Math.round(catSums.brand * 0.25), Math.round(catSums.brand), Math.round(catSums.brand * 11)] },
          { name: "Workspace & Fiber", group: "ops", values: [Math.round(catSums.ops * 0.3), Math.round(catSums.ops), Math.round(catSums.ops * 12)] },
          { name: "Legal & Compliance", group: "ops", values: [118, 520, 6100] },
        ],
        table: {
          columns: ["Entity / Region", "Weekly", "Monthly", "Yearly"],
          rows: [
            { label: "US Operating (Chase)", values: [`${currency}20,030`, `${currency}50,331`, `${currency}270,120`] },
            { label: "EU Merchant (Stripe)", values: [`${currency}18,782`, `${currency}40,795`, `${currency}210,650`] },
            { label: "Global Treasury (Mercury)", values: [`${currency}14,221`, `${currency}30,123`, `${currency}200,080`] },
          ],
        },
      },
      seasonality: {
        title: "Seasonality",
        years: [
          {
            label: "2026",
            values: [16120, 20540, 24440, 18460, 28080, 21580, 17160, 25740, 30160, 22880, 32240, 23660],
            stats: [
              { label: "Monthly avg", value: 8097, delta: "19.6%", note: "44,214 orders" },
              { label: "Year total", value: 312134, delta: "2.5%", note: "301,002 orders" },
            ],
            rows: [
              { label: "New York", value: "201,192" },
              { label: "London", value: "192,054" },
              { label: "Tokyo", value: "161,300" },
            ],
          },
          {
            label: "2025",
            values: [13260, 16640, 18720, 22360, 20020, 15860, 14560, 19240, 23920, 26260, 23140, 19760],
            stats: [
              { label: "Monthly avg", value: 6772, delta: "8.1%", note: "38,920 orders" },
              { label: "Year total", value: 304521, delta: "4.4%", note: "287,410 orders" },
            ],
            rows: [
              { label: "New York", value: "188,340" },
              { label: "London", value: "171,215" },
              { label: "Tokyo", value: "150,870" },
            ],
          },
        ],
      },
    };
  }, [totalIncome, netSavings, currency, transactions, autoCaptureCount]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        isDark={isDark}
        setIsDark={setIsDark}
        autoSync={autoSync}
        setAutoSync={setAutoSync}
        turboSync={turboSync}
        setTurboSync={setTurboSync}
        onSimulateFeed={handleSimulateFeed}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-6 sm:px-6 space-y-6">
        {viewMode === 'demo' ? (
          /* Pure Demo View */
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-base font-semibold">Standalone Analytics Bento Demo</h2>
                <p className="text-xs text-muted-foreground">Original isolated test harness from Vasnev</p>
              </div>
              <button
                onClick={() => setViewMode('dashboard')}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                Return to Live Dashboard
              </button>
            </div>
            <AnalyticsBentoDemo />
          </div>
        ) : (
          /* Live Automated Financial Operating System */
          <>
            {/* Top Banner Alert for Auto-Sync */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Continuous Open-Banking Sync Active:
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  Streaming live settlements from Chase, Stripe, Mercury & Brex. Automatic keyword categorization enabled.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateFeed}
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Trigger Inflow/Outflow Event
                </button>
              </div>
            </div>

            {/* KPI Cards Strip */}
            <KPISummary
              currency={currency}
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netSavings={netSavings}
              runwayMonths={runwayMonths}
              autoCaptureCount={autoCaptureCount}
            />

            {/* Core Analytics Bento */}
            <div className="rounded-2xl border border-border bg-card/40 p-1 sm:p-2 backdrop-blur-xs">
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground tracking-tight">Financial Intelligence Grid</h2>
                  <p className="text-xs text-muted-foreground">Live reactive SVG analytics rendered by AnalyticsBento</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  Auto-updated {lastSyncTime}
                </span>
              </div>
              <AnalyticsBento
                className="mt-2"
                currency={currency}
                revenue={bentoData.revenue}
                sessions={bentoData.sessions}
                categories={bentoData.categories}
                seasonality={bentoData.seasonality}
                credit={true}
              />
            </div>

            {/* Secondary Row: Accounts + Subscriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConnectedAccounts
                accounts={bankAccounts}
                currency={currency}
                onRefreshAll={handleRefreshAll}
                isSyncing={isSyncing}
              />
              <RecurringExpenses
                bills={recurringBills}
                currency={currency}
              />
            </div>

            {/* Bottom Row: Live Transactions Ledger */}
            <LiveTransactionFeed
              transactions={transactions}
              currency={currency}
              onDeleteTransaction={handleDeleteTransaction}
              onClearAll={handleClearAll}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>balanced Financial Intelligence · Built with shadcn project structure & Tailwind CSS</span>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4 font-medium"
            >
              <ShieldCheck className="size-3.5" />
              <span>Security Audit: 100% Local Storage</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-foreground underline underline-offset-4"
            >
              Architecture & Integration Docs
            </button>
            <span>·</span>
            <span>All systems operational</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={processIncomingTransaction}
        currency={currency}
      />

      <IntegrationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <SecurityAuditModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onPurgeLocalData={handlePurgeLocalData}
        transactionCount={transactions.length}
      />
    </div>
  );
}
