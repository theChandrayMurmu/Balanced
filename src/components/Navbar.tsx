import React from 'react';
import { 
  Activity, 
  Moon, 
  Sun, 
  RefreshCw, 
  Code2, 
  Radio, 
  Plus, 
  Sparkles,
  SlidersHorizontal,
  LayoutDashboard,
  Eye
} from 'lucide-react';

interface NavbarProps {
  currency: string;
  setCurrency: (c: string) => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  autoSync: boolean;
  setAutoSync: (s: boolean) => void;
  turboSync: boolean;
  setTurboSync: (t: boolean) => void;
  onSimulateFeed: () => void;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  viewMode: 'dashboard' | 'demo';
  setViewMode: (v: 'dashboard' | 'demo') => void;
  lastSyncTime: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  setCurrency,
  isDark,
  setIsDark,
  autoSync,
  setAutoSync,
  turboSync,
  setTurboSync,
  onSimulateFeed,
  onOpenAddModal,
  onOpenGuideModal,
  viewMode,
  setViewMode,
  lastSyncTime,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Activity className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-base sm:text-lg lowercase font-sans">balanced</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                AUTO-SYNC
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">Automated Financial & Cashflow Intelligence</p>
          </div>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center rounded-lg border border-border bg-muted/60 p-1 text-xs">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
              viewMode === 'dashboard'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="size-3.5" />
            <span>Live Auto-Tracker</span>
          </button>
          <button
            onClick={() => setViewMode('demo')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
              viewMode === 'demo'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="size-3.5" />
            <span>Pure Bento Demo</span>
          </button>
        </div>

        {/* Actions & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Auto-Sync Live State */}
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs">
            <span className="relative flex size-2">
              {autoSync && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex size-2 rounded-full ${autoSync ? 'bg-emerald-500' : 'bg-muted-foreground'}`}></span>
            </span>
            <span className="text-muted-foreground font-medium">
              {autoSync ? (turboSync ? 'Turbo Auto-Capture' : 'Live Bank Stream') : 'Auto-Sync Paused'}
            </span>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className="ml-1 text-[11px] font-medium underline text-foreground/80 hover:text-foreground"
            >
              {autoSync ? 'Pause' : 'Resume'}
            </button>
            {autoSync && (
              <button
                onClick={() => setTurboSync(!turboSync)}
                title="Toggle fast simulated transaction frequency (every 4s vs 12s)"
                className={`rounded px-1 text-[10px] font-semibold transition-colors ${
                  turboSync ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'
                }`}
              >
                {turboSync ? '4s Turbo' : '12s Std'}
              </button>
            )}
          </div>

          {/* Quick Bank Feed Trigger */}
          <button
            onClick={onSimulateFeed}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors shadow-xs"
            title="Simulate an incoming transaction from connected banks"
          >
            <Radio className="size-3.5 text-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Simulate</span> Feed
          </button>

          {/* Add Manual Transaction */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Add Entry</span>
          </button>

          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            aria-label="Select Currency"
          >
            <option value="₹">INR (₹)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
          </select>

          {/* Guide Modal */}
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1 rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="View shadcn project structure & integration guide"
          >
            <Code2 className="size-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Toggle Dark / Light Theme"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
