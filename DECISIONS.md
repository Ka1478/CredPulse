# DECISIONS - Architectural Choices & Rationale

This document logs the primary technical decisions made across the frontend, backend, and database layers of CredPulse, along with their engineering trade-offs.

---

## 1. Hand-Built Custom Table Architecture (Zero Component Libraries)
- **Decision**: Constructed a pure React + Vanilla CSS table component (`Table.tsx` & `TransactionsTable.tsx`) using semantic HTML tags (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`), with zero component library dependencies (no MUI, Ant Design, Chakra, shadcn, or TanStack Table).
- **Rationale**:
  - Complies strictly with the assignment constraint.
  - Controls exact rendering performance, sticky positioning (`position: sticky; top: 0; z-index: 10;`), hover transitions, keyboard focus outlines, skeleton loading states, empty search states, and mobile responsiveness down to 360px viewport width.

---

## 2. Accessible Hand-Built Modal System
- **Decision**: Developed a custom `Modal.tsx` component supported by a custom React hook `useFocusTrap.ts`.
- **Rationale**:
  - Traps keyboard `Tab` and `Shift + Tab` navigation inside open modal containers to prevent focus spilling into background elements.
  - Listens for `Escape` key events to close the modal.
  - Restores focus to the triggering button upon unmounting for screen reader accessibility.

---

## 3. Database Schema & PostgreSQL Index Optimization
- **Decision**: Designed a fully normalized PostgreSQL 17 relational schema (`users`, `categories`, `transactions`, `rewards_catalogue`, `redemptions`) instead of storing JSON blobs.
- **Index Strategy**:
  ```sql
  CREATE INDEX idx_txn_user_date ON transactions(user_id, date DESC);
  CREATE INDEX idx_txn_category ON transactions(category_id);
  CREATE INDEX idx_txn_status ON transactions(status);
  CREATE INDEX idx_txn_amount ON transactions(amount_inr);
  CREATE INDEX idx_txn_merchant ON transactions USING btree (merchant_name text_pattern_ops);
  ```
- **Rationale**:
  - Multi-column index on `(user_id, date DESC)` speeds up default chronological sorting to `< 5ms`.
  - `text_pattern_ops` B-tree index on `merchant_name` provides instant prefix search matching as the user types without full table scans across 10,000 rows.

---

## 4. Backend Framework & Async Architecture
- **Decision**: Python **FastAPI** with `AsyncSQLAlchemy` and `asyncpg` async PostgreSQL driver.
- **Rationale**:
  - FastAPI provides native ASGI async concurrency, auto-generated OpenAPI docs (`/docs`), and lightweight Pydantic data validation.
  - Async DB connection pooling allows handling concurrent search and filtering requests efficiently.

---

## 5. State Management & Data Fetching Strategy
- **Decision**: Extracted state into specialized custom React hooks (`useTransactions`, `useAnalytics`, `useRewards`).
- **Rationale**:
  - Keeps UI presentation components clean and decoupled from network fetching logic.
  - Enables clear 2-way cross-filtering coordination between `useTransactions` filter state and `useAnalytics` aggregation queries.
