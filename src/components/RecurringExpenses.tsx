import React from 'react';
import { RecurringBill } from '../types/finance';
import { CalendarClock, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface RecurringExpensesProps {
  bills: RecurringBill[];
  currency: string;
}

export const RecurringExpenses: React.FC<RecurringExpensesProps> = ({ bills, currency }) => {
  const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
  const totalMonthlyCommitment = bills.reduce((acc, b) => acc + (b.frequency === 'Annual' ? b.amount / 12 : b.amount), 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Recurring Commitments</h3>
            <span className="rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              Auto-Detected
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Fixed SaaS & infrastructure baseline</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold font-mono text-foreground">
            {currency}{fmt(totalMonthlyCommitment)}/mo
          </div>
          <span className="text-[10px] text-muted-foreground">Fixed Burn</span>
        </div>
      </div>

      <div className="mt-3.5 space-y-2.5">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-2.5 transition-colors hover:bg-muted/60"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                {bill.logoLetter}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-medium text-foreground">{bill.service}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <CalendarClock className="size-3" />
                  <span>Due {bill.nextBillingDate}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-semibold font-mono text-foreground">
                {currency}{fmt(bill.amount)}
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                <Check className="size-2.5" />
                <span>Auto-pay</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
