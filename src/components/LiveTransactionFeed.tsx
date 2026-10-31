import React, { useState } from 'react';
import { Transaction } from '../types/finance';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter, 
  Radio, 
  Trash2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface LiveTransactionFeedProps {
  transactions: Transaction[];
  currency: string;
  onDeleteTransaction: (id: string) => void;
  onClearAll: () => void;
}

export const LiveTransactionFeed: React.FC<LiveTransactionFeedProps> = ({
  transactions,
  currency,
  onDeleteTransaction,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const filtered = transactions.filter((t) => {
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sourceAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const exportCSV = () => {
    const headers = ['ID,Description,Amount,Type,Category,Account,Date,Status'];
    const rows = filtered.map(t => 
      `"${t.id}","${t.description.replace(/"/g, '""')}",${t.amount},"${t.type}","${t.categoryName}","${t.sourceAccount}","${t.date}","${t.status}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balanced-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'product': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'eng': return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
      case 'growth': return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'brand': return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30';
      default: return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Live Automated Transaction Stream</h3>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {transactions.length} Tracked
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Every debit and credit classified in real-time</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
            title="Export filtered records to CSV"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="mt-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchants, descriptions, accounts..."
            className="w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Type Filter */}
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              onClick={() => setTypeFilter('all')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                typeFilter === 'all' ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                typeFilter === 'income' ? 'bg-background text-emerald-600 dark:text-emerald-400 shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              + Inflow
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                typeFilter === 'expense' ? 'bg-background text-rose-600 dark:text-rose-400 shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              - Outflow
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="product">Product</option>
            <option value="eng">Engineering</option>
            <option value="growth">Growth</option>
            <option value="brand">Brand</option>
            <option value="ops">Ops</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border/80">
        <div className="max-h-[380px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No transactions match your current query or filter.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((tx) => (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between p-3 transition-colors hover:bg-muted/40"
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowDownRight className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-medium text-foreground">
                          {tx.description}
                        </span>
                        {tx.isRecurring && (
                          <span className="shrink-0 rounded px-1.5 py-0.2 bg-purple-500/10 text-[9px] font-semibold text-purple-600 dark:text-purple-400">
                            Recurring
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="truncate">{tx.sourceAccount}</span>
                        <span>·</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Category badge, Amount, Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`hidden sm:inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium ${getCategoryColor(
                        tx.category
                      )}`}
                    >
                      {tx.categoryName}
                    </span>

                    <div className="text-right">
                      <div
                        className={`text-xs sm:text-sm font-semibold font-mono tabular-nums ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}{currency}{fmt(tx.amount)}
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">
                        {tx.status}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-500 transition-opacity"
                      title="Remove transaction"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
