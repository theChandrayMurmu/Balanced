export type TransactionType = 'income' | 'expense';

export type FinancialCategory = 
  | 'product'
  | 'eng'
  | 'growth'
  | 'brand'
  | 'ops';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: FinancialCategory;
  categoryName: string;
  sourceAccount: string;
  date: string;
  status: 'cleared' | 'pending' | 'processing';
  isRecurring?: boolean;
  notes?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'treasury' | 'card' | 'payout';
  balance: number;
  accountNumberMask: string;
  lastSynced: string;
  status: 'connected' | 'syncing' | 'needs_attention';
  color: string;
}

export interface RecurringBill {
  id: string;
  service: string;
  amount: number;
  category: FinancialCategory;
  frequency: 'Monthly' | 'Annual';
  nextBillingDate: string;
  autoPay: boolean;
  logoLetter: string;
}
