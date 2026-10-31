import { BankAccount, RecurringBill, Transaction } from '../types/finance';

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'hdfc-current',
    name: 'HDFC Bank Current Account',
    type: 'checking',
    balance: 84250.60,
    accountNumberMask: '•••• 4920',
    lastSynced: 'Just now',
    status: 'connected',
    color: '#1d4ed8'
  },
  {
    id: 'icici-treasury',
    name: 'ICICI Treasury & Liquid Yield (7.2%)',
    type: 'treasury',
    balance: 215430.00,
    accountNumberMask: '•••• 8812',
    lastSynced: '2 mins ago',
    status: 'connected',
    color: '#059669'
  },
  {
    id: 'razorpay-merchant',
    name: 'Razorpay / Stripe SaaS Settlements',
    type: 'payout',
    balance: 14890.45,
    accountNumberMask: 'rzp_live_9k',
    lastSynced: 'Live feed',
    status: 'connected',
    color: '#4f46e5'
  },
  {
    id: 'axis-corp',
    name: 'Corporate RuPay Credit Card',
    type: 'card',
    balance: -4820.15,
    accountNumberMask: '•••• 3091',
    lastSynced: 'Just now',
    status: 'connected',
    color: '#e11d48'
  }
];

export const INITIAL_RECURRING_BILLS: RecurringBill[] = [
  {
    id: 'rec-1',
    service: 'Amazon Web Services (AWS Mumbai)',
    amount: 1420.00,
    category: 'eng',
    frequency: 'Monthly',
    nextBillingDate: 'Nov 02, 2026',
    autoPay: true,
    logoLetter: 'A'
  },
  {
    id: 'rec-2',
    service: 'GitHub Enterprise & Copilot',
    amount: 320.00,
    category: 'eng',
    frequency: 'Monthly',
    nextBillingDate: 'Nov 05, 2026',
    autoPay: true,
    logoLetter: 'G'
  },
  {
    id: 'rec-3',
    service: 'Figma Organization Seats',
    amount: 450.00,
    category: 'product',
    frequency: 'Monthly',
    nextBillingDate: 'Nov 12, 2026',
    autoPay: true,
    logoLetter: 'F'
  },
  {
    id: 'rec-4',
    service: 'Google Workspace Enterprise',
    amount: 280.00,
    category: 'ops',
    frequency: 'Monthly',
    nextBillingDate: 'Nov 14, 2026',
    autoPay: true,
    logoLetter: 'W'
  },
  {
    id: 'rec-5',
    service: 'LinkedIn & Meta Ads Reserve',
    amount: 1850.00,
    category: 'growth',
    frequency: 'Monthly',
    nextBillingDate: 'Nov 18, 2026',
    autoPay: true,
    logoLetter: 'L'
  },
  {
    id: 'rec-6',
    service: 'GST & Compliance Retainer',
    amount: 750.00,
    category: 'ops',
    frequency: 'Monthly',
    nextBillingDate: 'Nov 25, 2026',
    autoPay: true,
    logoLetter: 'C'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    description: 'Enterprise Tier License - Acme Corp',
    amount: 4850.00,
    type: 'income',
    category: 'product',
    categoryName: 'Product',
    sourceAccount: 'Razorpay / Stripe SaaS Settlements',
    date: '2026-10-30 08:45',
    status: 'cleared',
    notes: 'Annual upfront payment'
  },
  {
    id: 'tx-102',
    description: 'Vercel Enterprise Edge Hosting',
    amount: 380.00,
    type: 'expense',
    category: 'eng',
    categoryName: 'Engineering',
    sourceAccount: 'Corporate RuPay Credit Card',
    date: '2026-10-30 07:15',
    status: 'cleared',
    isRecurring: true
  },
  {
    id: 'tx-103',
    description: 'UPI / Card Daily MRR Settlement',
    amount: 2190.40,
    type: 'income',
    category: 'growth',
    categoryName: 'Growth',
    sourceAccount: 'HDFC Bank Current Account',
    date: '2026-10-29 22:30',
    status: 'cleared'
  },
  {
    id: 'tx-104',
    description: 'Google Cloud Platform AI Inference',
    amount: 890.50,
    type: 'expense',
    category: 'eng',
    categoryName: 'Engineering',
    sourceAccount: 'Corporate RuPay Credit Card',
    date: '2026-10-29 18:10',
    status: 'cleared',
    isRecurring: true
  },
  {
    id: 'tx-105',
    description: 'Brand Identity Design Deliverable',
    amount: 1200.00,
    type: 'expense',
    category: 'brand',
    categoryName: 'Brand',
    sourceAccount: 'HDFC Bank Current Account',
    date: '2026-10-29 14:20',
    status: 'cleared'
  },
  {
    id: 'tx-106',
    description: 'SaaS Expansion Upgrade - Lumina AI',
    amount: 1450.00,
    type: 'income',
    category: 'product',
    categoryName: 'Product',
    sourceAccount: 'Razorpay / Stripe SaaS Settlements',
    date: '2026-10-28 16:40',
    status: 'cleared'
  },
  {
    id: 'tx-107',
    description: 'WeWork Office Space & Fiber Net',
    amount: 620.00,
    type: 'expense',
    category: 'ops',
    categoryName: 'Ops',
    sourceAccount: 'HDFC Bank Current Account',
    date: '2026-10-28 11:05',
    status: 'cleared',
    isRecurring: true
  },
  {
    id: 'tx-108',
    description: 'Growth Marketing & Campaign Promotion',
    amount: 450.00,
    type: 'expense',
    category: 'growth',
    categoryName: 'Growth',
    sourceAccount: 'Corporate RuPay Credit Card',
    date: '2026-10-27 15:30',
    status: 'cleared'
  },
  {
    id: 'tx-109',
    description: 'ICICI Treasury Liquid Yield Deposit',
    amount: 915.20,
    type: 'income',
    category: 'ops',
    categoryName: 'Ops',
    sourceAccount: 'ICICI Treasury & Liquid Yield (7.2%)',
    date: '2026-10-27 09:00',
    status: 'cleared',
    notes: 'Monthly 7.2% liquid yield payment'
  },
  {
    id: 'tx-110',
    description: 'OpenAI API Token Usage Billing',
    amount: 612.00,
    type: 'expense',
    category: 'eng',
    categoryName: 'Engineering',
    sourceAccount: 'Corporate RuPay Credit Card',
    date: '2026-10-26 20:15',
    status: 'cleared',
    isRecurring: true
  }
];

export const AUTOMATIC_FEED_POOL: Omit<Transaction, 'id' | 'date'>[] = [
  {
    description: 'Razorpay Micro-SaaS Customer Inflow',
    amount: 149.00,
    type: 'income',
    category: 'product',
    categoryName: 'Product',
    sourceAccount: 'Razorpay / Stripe SaaS Settlements',
    status: 'cleared'
  },
  {
    description: 'Supabase Database Compute Addon',
    amount: 85.00,
    type: 'expense',
    category: 'eng',
    categoryName: 'Engineering',
    sourceAccount: 'Corporate RuPay Credit Card',
    status: 'cleared'
  },
  {
    description: 'Customer Annual Pro Plan - Enterprise',
    amount: 1188.00,
    type: 'income',
    category: 'product',
    categoryName: 'Product',
    sourceAccount: 'Razorpay / Stripe SaaS Settlements',
    status: 'cleared'
  },
  {
    description: 'X / Twitter Premium Developer Tier',
    amount: 100.00,
    type: 'expense',
    category: 'growth',
    categoryName: 'Growth',
    sourceAccount: 'Corporate RuPay Credit Card',
    status: 'cleared'
  },
  {
    description: 'Consulting Retainer - Fintech Strategy',
    amount: 3200.00,
    type: 'income',
    category: 'brand',
    categoryName: 'Brand',
    sourceAccount: 'HDFC Bank Current Account',
    status: 'cleared'
  },
  {
    description: 'Figma Pro Design Team Licenses',
    amount: 90.00,
    type: 'expense',
    category: 'product',
    categoryName: 'Product',
    sourceAccount: 'Corporate RuPay Credit Card',
    status: 'cleared'
  },
  {
    description: 'Slack Business+ Workspace Seats',
    amount: 140.00,
    type: 'expense',
    category: 'ops',
    categoryName: 'Ops',
    sourceAccount: 'HDFC Bank Current Account',
    status: 'cleared'
  },
  {
    description: 'Razorpay Inbound Payout Batch #892',
    amount: 2840.00,
    type: 'income',
    category: 'growth',
    categoryName: 'Growth',
    sourceAccount: 'Razorpay / Stripe SaaS Settlements',
    status: 'cleared'
  }
];

export function autoCategorize(description: string): { category: Transaction['category']; categoryName: string } {
  const d = description.toLowerCase();
  if (d.includes('aws') || d.includes('github') || d.includes('cloud') || d.includes('compute') || d.includes('api') || d.includes('supabase') || d.includes('vercel') || d.includes('database') || d.includes('server')) {
    return { category: 'eng', categoryName: 'Engineering' };
  }
  if (d.includes('figma') || d.includes('design') || d.includes('license') || d.includes('saas') || d.includes('subscription') || d.includes('plan')) {
    return { category: 'product', categoryName: 'Product' };
  }
  if (d.includes('ad') || d.includes('marketing') || d.includes('seo') || d.includes('smm') || d.includes('promo') || d.includes('growth') || d.includes('twitter') || d.includes('meta')) {
    return { category: 'growth', categoryName: 'Growth' };
  }
  if (d.includes('brand') || d.includes('content') || d.includes('copy') || d.includes('consulting') || d.includes('video') || d.includes('creative')) {
    return { category: 'brand', categoryName: 'Brand' };
  }
  return { category: 'ops', categoryName: 'Ops' };
}
