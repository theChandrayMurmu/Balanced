import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Hourglass,
  Zap
} from 'lucide-react';

interface KPISummaryProps {
  currency: string;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  runwayMonths: number;
  autoCaptureCount: number;
}

export const KPISummary: React.FC<KPISummaryProps> = ({
  currency,
  totalBalance,
  totalIncome,
  totalExpense,
  netSavings,
  runwayMonths,
  autoCaptureCount,
}) => {
  const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* 1. Total Treasury & Operating Liquidity */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Liquid Treasury & Cash</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-semibold tracking-tight sm:text-3xl font-mono">
            {currency}{fmt(totalBalance)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="size-3.5 mr-0.5" /> 4 Accounts Linked
            </span>
            <span>· Live sync</span>
          </div>
        </div>
      </div>

      {/* 2. Automated Income Captured */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Captured Inflow / Income</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-semibold tracking-tight sm:text-3xl font-mono text-emerald-600 dark:text-emerald-400">
            +{currency}{fmt(totalIncome)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="size-3.5 mr-0.5" /> +18.4%
            </span>
            <span>vs previous 30d</span>
          </div>
        </div>
      </div>

      {/* 3. Automatic Outflow / Expenses */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Tracked Burn & Outflow</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-semibold tracking-tight sm:text-3xl font-mono text-rose-600 dark:text-rose-400">
            -{currency}{fmt(totalExpense)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              -3.2% controlled
            </span>
            <span>overhead burn</span>
          </div>
        </div>
      </div>

      {/* 4. Net Cash Velocity & Runway */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Net Flow & Runway</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Hourglass className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-semibold tracking-tight sm:text-3xl font-mono">
            {netSavings >= 0 ? '+' : '-'}{currency}{fmt(Math.abs(netSavings))}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium">
              <Zap className="size-3.5 mr-0.5" /> {runwayMonths.toFixed(1)} mo
            </span>
            <span>runway at current pace</span>
          </div>
        </div>
      </div>
    </div>
  );
};
