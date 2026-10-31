import React from 'react';
import { BankAccount } from '../types/finance';
import { Building2, CreditCard, Landmark, CheckCircle2, RefreshCw } from 'lucide-react';

interface ConnectedAccountsProps {
  accounts: BankAccount[];
  currency: string;
  onRefreshAll: () => void;
  isSyncing: boolean;
}

export const ConnectedAccounts: React.FC<ConnectedAccountsProps> = ({
  accounts,
  currency,
  onRefreshAll,
  isSyncing,
}) => {
  const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

  const getIcon = (type: BankAccount['type']) => {
    switch (type) {
      case 'card':
        return <CreditCard className="size-4" />;
      case 'treasury':
        return <Landmark className="size-4" />;
      default:
        return <Building2 className="size-4" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Linked Accounts & Cash Hubs</h3>
          <p className="text-xs text-muted-foreground">Automated open banking API feed</p>
        </div>
        <button
          onClick={onRefreshAll}
          disabled={isSyncing}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Force-sync all connected financial accounts"
        >
          <RefreshCw className={`size-3 ${isSyncing ? 'animate-spin text-emerald-500' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
        </button>
      </div>

      <div className="mt-3.5 space-y-2.5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3 transition-colors hover:bg-muted/60"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: acc.color }}
              >
                {getIcon(acc.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium text-foreground">{acc.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{acc.accountNumberMask}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  <span>{acc.lastSynced}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-sm font-semibold font-mono tabular-nums ${
                  acc.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'
                }`}
              >
                {acc.balance < 0 ? '-' : ''}{currency}{fmt(Math.abs(acc.balance))}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {acc.type === 'card' ? 'Liability' : 'Asset'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
