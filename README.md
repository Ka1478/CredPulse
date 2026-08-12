# CredPulse - Credit Card Transactions, Spend Analytics & Coin Rewards Dashboard

CredPulse is a full-stack financial dashboard web application for managing credit card bill payments, analyzing spending habits across 10,000+ transactions with server-side pagination and two-way cross-filtering, and redeeming reward coins against a catalogue of partner vouchers with clean failure recovery.

---

## Live Links

- **GitHub Repository**: [https://github.com/Ka1478/CredPulse.git](https://github.com/Ka1478/CredPulse.git)
- **Deployed Frontend (Vercel)**: [https://cred-pulse-frontend-ten.vercel.app/](https://cred-pulse-frontend-ten.vercel.app/)
- **Deployed Backend API (Render)**: [https://credpulse-backend-te5q.onrender.com](https://credpulse-backend-te5q.onrender.com) (API Docs: [https://credpulse-backend-te5q.onrender.com/docs](https://credpulse-backend-te5q.onrender.com/docs))

---

## Technical Stack

- **Frontend**: React (TypeScript), Next.js (App Router), Vanilla CSS Design System (`tokens.css`), Recharts (Spend Analytics), Lucide Icons.
  - **Hand-Built Custom Table**: Built from scratch using native HTML `<table>` elements without UI libraries (No MUI, Ant, Chakra, shadcn, or TanStack Table). Features sticky headers, hover/focus interaction states, loading skeletons, empty/error handling, and responsive layout down to 360px viewport width.
  - **Hand-Built Accessible Modal**: Features keyboard focus trapping (`Tab` / `Shift+Tab`), `Escape` key close listener, backdrop blur, and focus restoration.
- **Backend**: Python (FastAPI), AsyncSQLAlchemy, Pydantic v2, Pytest test suite.
- **Database**: PostgreSQL 17 with normalized DDL schema, foreign key relations, and B-tree / text pattern indexes for sub-15ms server-side queries on 10,000 transactions.

---

## Features Implemented

### Core Features (100% Completed)
- [x] **Transactions Dashboard on 10k Rows**: Server-side paginated data table handling full dataset of 10,000 transactions smoothly.
- [x] **Multi-Criteria Combinable Filters**: Filter by category, payment status (SUCCESS, PENDING, FAILED), amount range (min/max), and date range.
- [x] **As-You-Type Search**: Instant search matching merchant names, transaction reference codes, and descriptions.
- [x] **Sorting**: Multi-column sorting by transaction date (asc/desc) and transaction amount (asc/desc).
- [x] **Row Detail Drawer / Modal**: Click any transaction row to open full detail view (merchant, ref code, category, payment method, card last 4, location, reward coins earned, description).
- [x] **Spend Analytics**: Category breakdown (interactive Donut chart) and monthly spend trend over time (Area chart).
- [x] **Two-Way Cross-Filtering**: Clicking a slice on the spend category chart filters the transaction table to that category. Updating table filters dynamically updates analytics charts.
- [x] **Rewards Vault**: Live coin balance prominently displayed in header and rewards section.
- [x] **Rewards Catalogue**: Catalogue of 6 curated reward vouchers (Amazon ₹500, Swiggy ₹250, Bill Cashback ₹100, MakeMyTrip ₹1,000, BookMyShow ₹300, Uber Pass ₹150).
- [x] **Redeem Flow & Failure Recovery**: Select voucher -> View confirmation modal -> Redeem. Includes **optimistic balance deduction** with **clean rollback recovery** if API fails, and backend validation (rejecting unaffordable or invalid redemptions with proper HTTP 400 / 404 status codes).
- [x] **PostgreSQL Database & 1-Command Seed**: Normalized DDL schema (`schema.sql`) and 1-command Python seed script (`seed.py`) populating 10,000 realistic transactions into PostgreSQL 17 and exporting `transactions.json`.

---

## Local Setup Guide (Under 5 Minutes)

### Prerequisites
- Node.js v20+ and npm
- Python 3.10+
- PostgreSQL 16 or 17 (Running on `localhost:5432` with default superuser `postgres`)

### 1. Database Setup & Seeding (1 Command)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\pip install -r requirements.txt
.\venv\Scripts\python seed.py
```
> This creates the database `credpulse_db`, executes `schema.sql`, populates 10,000 realistic transactions, calculates reward balances, and exports `transactions.json` to the root directory.

### 2. Start Backend API
```bash
cd backend
.\venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```
Backend API will run at `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).

### 3. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Running Automated Tests

Run backend unit tests for coin balance and redemption validation:
```bash
cd backend
.\venv\Scripts\pytest tests/ -v
```

---

## Directory Overview

```
credpulse/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application entrypoint
│   │   ├── config.py                   # App configuration & DB URI
│   │   ├── db.py                       # SQLAlchemy database session manager
│   │   ├── models.py                   # ORM models (User, Category, Transaction, RewardItem, Redemption)
│   │   ├── schemas.py                  # Pydantic v2 schemas
│   │   ├── seed.py                     # 1-command database seed script
│   │   ├── routers/                    # API Routers (transactions, analytics, rewards)
│   │   └── services/                   # Business logic (query builder & atomic redemption)
│   ├── tests/
│   │   └── test_rewards.py             # Pytest test suite for rewards API
│   ├── requirements.txt
│   └── schema.sql                      # PostgreSQL DDL
├── frontend/
│   ├── src/
│   │   ├── app/                        # Next.js App Router pages & globals.css
│   │   ├── styles/tokens.css           # Internal Design Tokens (colors, spacing, type, glassmorphism)
│   │   ├── components/
│   │   │   ├── ui/                     # Hand-built custom UI components (Table, Modal, Button, Card, Badge)
│   │   │   ├── dashboard/              # Transactions dashboard components
│   │   │   ├── analytics/              # Recharts analytics components
│   │   │   └── rewards/                # Rewards vault & voucher components
│   │   ├── hooks/                      # Custom hooks (useTransactions, useAnalytics, useRewards, useFocusTrap)
│   │   └── lib/                        # API fetcher & TypeScript interfaces
├── transactions.json                   # Exported 10,000 transactions dataset
├── ASSUMPTIONS.md                      # Product assumptions document
├── DECISIONS.md                        # Technical decision log
└── AI-USAGE.md                         # AI usage disclosure & examples
```
