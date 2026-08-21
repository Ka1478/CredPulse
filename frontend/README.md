# CredPulse Frontend - Next.js & React Dashboard

## 1. What the Project Does
The CredPulse Frontend is the web application interface for the CredPulse financial platform. It allows credit card users to explore 10,000+ card transactions with server-side pagination, view 2-way synchronized spending analytics charts, apply combinable filters, and redeem reward coins against partner vouchers with optimistic UI updates and error rollback recovery.

---

## 2. Live Demo Link
- **Deployed Frontend (Vercel)**: [https://cred-pulse-frontend-ten.vercel.app/](https://cred-pulse-frontend-ten.vercel.app/)
- **Deployed Backend API (Render)**: [https://credpulse-backend-te5q.onrender.com](https://credpulse-backend-te5q.onrender.com)
- **GitHub Repository**: [https://github.com/Ka1478/CredPulse.git](https://github.com/Ka1478/CredPulse.git)

---

## 3. Tech Stack
- **Framework**: React 19, Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Design Tokens (`tokens.css`) with glassmorphic cards, custom typography, and zero heavy component UI dependencies.
- **Charts**: Recharts (`ResponsiveContainer`, `PieChart`, `AreaChart`, `Tooltip`, `Legend`)
- **Icons**: Lucide React (`Search`, `Filter`, `RotateCcw`, `Coins`, `CreditCard`, `ArrowUpDown`, `CheckCircle2`)

---

## 4. Main Features
- [x] **Hand-Built Table**: Native HTML `<table>` built without UI component libraries. Includes sticky headers, hover/active states, loading skeletons, and empty states down to 360px screen widths.
- [x] **Hand-Built Accessible Modal**: Full accessibility with focus trapping (`Tab` / `Shift+Tab`), `Escape` key close listener, and focus restoration.
- [x] **Spend Analytics Charts**: Interactive Donut chart displaying spend percentages across 8 categories, and 32-month Area chart displaying spend trends over time.
- [x] **Two-Way Synchronized Cross-Filtering**: Pie slice clicks filter the transaction table and vice-versa.
- [x] **Rewards Vault UI**: Live CredCoin balance counter, voucher catalogue, confirmation modals, optimistic balance deduction, and clean rollback recovery.

---

## 5. Screenshots

![CredPulse Dashboard Overview](public/screenshots/dashboard.png)
*CredPulse Dashboard displaying Spend Analytics, Multi-Criteria Filters, and Transactions Table*

![Category Filtering & Synchronized Analytics](public/screenshots/filtering.png)
*Two-way synchronized Spend by Category Donut Chart and filtered Transactions Table*

---

## 6. Setup Instructions

### Prerequisites
- Node.js v20+ and npm

### Local Development Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 7. Project Structure

```text
frontend/
├── public/
│   ├── screenshots/              # Screenshot assets (dashboard.png, filtering.png)
│   ├── file.svg
│   ├── globe.svg
│   └── vercel.svg
├── src/
│   ├── app/                      # Next.js App Router root layout & page
│   │   ├── api/                  # Next.js Route Handlers for Vercel deployment
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── analytics/            # CategoryChart & MonthlyTrendChart Recharts components
│   │   ├── dashboard/            # TransactionsTable & FilterBar components
│   │   ├── rewards/              # RewardsVault & RewardCard components
│   │   └── ui/                   # Custom hand-built UI primitives (Table, Modal, Button, Card, Badge)
│   ├── data/
│   │   └── transactions-dataset.ts # Native TypeScript dataset fallback
│   ├── hooks/                    # Custom hooks (useTransactions, useAnalytics, useRewards, useFocusTrap)
│   ├── lib/                      # API client fetcher & TypeScript interfaces
│   └── styles/
│       └── tokens.css            # Vanilla CSS design tokens
├── package.json
├── tsconfig.json
└── README.md
```
