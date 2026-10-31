import React, { useState, useEffect } from 'react';
import { Transaction, FinancialCategory } from '../types/finance';
import { autoCategorize } from '../data/initialFinanceData';
import { X, Sparkles, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  currency: string;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  currency,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<FinancialCategory>('ops');
  const [categoryName, setCategoryName] = useState('Ops');
  const [sourceAccount, setSourceAccount] = useState('Chase Operating Account');
  const [isRecurring, setIsRecurring] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);

  // Auto categorize when description changes
  useEffect(() => {
    if (description.trim().length > 2) {
      const detected = autoCategorize(description);
      setCategory(detected.category);
      setCategoryName(detected.categoryName);
      setAutoDetected(true);
    } else {
      setAutoDetected(false);
    }
  }, [description]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAdd({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      categoryName,
      sourceAccount,
      status: 'cleared',
      isRecurring,
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // safe fallback
    }

    setDescription('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PlusCircle className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Record Financial Entry</h2>
            <p className="text-xs text-muted-foreground">Automatic categorization active</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`rounded-lg py-1.5 text-xs font-medium transition-all ${
                type === 'expense'
                  ? 'bg-card text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              - Outflow (Expense)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`rounded-lg py-1.5 text-xs font-medium transition-all ${
                type === 'income'
                  ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              + Inflow (Income)
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Description / Merchant
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Cloud Cluster, Client Retainer, Figma"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            {autoDetected && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                <Sparkles className="size-3" />
                <span>Auto-classified as <strong>{categoryName}</strong></span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-7 pr-3 py-2 text-xs font-mono text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Category override */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as FinancialCategory;
                  setCategory(val);
                  const names: Record<FinancialCategory, string> = {
                    product: 'Product',
                    eng: 'Engineering',
                    growth: 'Growth',
                    brand: 'Brand',
                    ops: 'Ops'
                  };
                  setCategoryName(names[val]);
                }}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="product">Product</option>
                <option value="eng">Engineering</option>
                <option value="growth">Growth</option>
                <option value="brand">Brand</option>
                <option value="ops">Ops</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Account
              </label>
              <select
                value={sourceAccount}
                onChange={(e) => setSourceAccount(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Chase Operating Account">Chase Operating</option>
                <option value="Mercury Treasury (5.1% APY)">Mercury Treasury</option>
                <option value="Stripe SaaS Payouts">Stripe Payouts</option>
                <option value="Brex Corporate Card">Brex Card</option>
              </select>
            </div>
          </div>

          {/* Recurring checkbox */}
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-border text-primary focus:ring-ring"
            />
            <span>Mark as monthly recurring commitment</span>
          </label>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Post Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
