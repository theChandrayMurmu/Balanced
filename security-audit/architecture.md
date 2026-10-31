# balanced Architecture & Trust Boundary Specification

## Overview
**balanced** is a client-side financial analytics and automated cash flow tracking application built on React, Vite, Tailwind CSS, and TypeScript.

## Trust Boundaries & Data Flow

```
[Untrusted Input Surface]
  │ (User manual input via AddTransactionModal)
  ▼
[Input Sanitizer & Validator]
  │ (Type checking, number boundary clamp, auto-categorizer)
  ▼
[Client State & Local Storage Boundary] ─── (NO NETWORK EGRESS)
  │ (window.localStorage: balanced_finance_storage_v1)
  ├──> [KPISummary] (Pure reactive rendering)
  ├──> [AnalyticsBento] (SVG mathematical rendering)
  ├──> [ConnectedAccounts] (Client-side masked view)
  └──> [LiveTransactionFeed] (Sanitized ledger view)
```

## Security & Privacy Assurances
1. **Local-Only Storage:** All transactions, bank account balances, and recurring expenses are stored in `window.localStorage` inside the user's browser sandbox.
2. **Zero Server Exfiltration:** The app does NOT transmit transaction records or balances to any remote web server or backend database.
3. **No Third-Party Telemetry:** No analytics scripts (e.g. Google Analytics, Mixpanel, Sentry) or marketing pixels are installed.
4. **Data Portability & Purge:** Users can export their full data ledger to CSV at any time or completely purge all local records with a single click.
