# AI-USAGE - Artificial Intelligence Tool Usage Log

In accordance with the assignment brief, this document details the AI tools used during the development of CredPulse, where they were applied, and two specific examples of generated AI code that were discarded or modified, along with the technical reasoning behind those fixes.

---

## AI Tools Used
- **Antigravity AI Agent (Powered by Gemini 3.6 Flash)**: Used for architecting the project structure, generating realistic Indian credit card merchant seed data, writing boilerplate SQL schema DDL, implementing FastAPI routers, creating React components with custom CSS design tokens, and writing pytest unit tests.

---

## Real Example 1: Discarded Database Connection String Syntax in Config
- **Generated Code**:
  ```python
  from pydantic_settings import BaseSettings if os.getenv("USE_PYDANTIC_SETTINGS") else object
  ```
- **What Was Wrong**:
  - The AI generated invalid inline conditional Python syntax directly inside an `import` statement (`from pydantic_settings import BaseSettings if ... else ...`), causing a `SyntaxError: invalid syntax` upon module import.
- **How It Was Fixed**:
  - Replaced the broken inline import expression with a clean, standard Python class definition reading environment variables via `os.getenv()`, preventing import crashes and ensuring standard Pydantic configuration compatibility.

---

## Real Example 2: Discarded Unicode Rupee Character Print Output on Windows Console
- **Generated Code**:
  ```python
  print(f"Updating user balance: {total_coins_earned} CredCoins earned, Total Spent \u20b9{total_spent_inr:,.2f}...")
  print("✅ Seed completed successfully!")
  ```
- **What Was Wrong**:
  - When running `seed.py` on a Windows operating system environment, the default terminal encoding was `cp1252` (Windows-1252), which cannot encode the Indian Rupee symbol `\u20b9` or checkmark emoji `\u2705`. This triggered a `UnicodeEncodeError: 'charmap' codec can't encode character '\u20b9'` and aborted the database seed script prematurely before writing out `transactions.json`.
- **How It Was Fixed**:
  - Replaced raw non-ASCII symbols in terminal log outputs with standard ASCII strings (`INR` and `[SUCCESS]`), while preserving standard UTF-8 formatting inside `transactions.json` and the frontend UI. This allowed the 1-command database seed script to run cleanly on Windows systems in under 3 seconds.

---

## Real Example 3: Discarded asyncpg Database Engine Pooling in Pytest AsyncClient
- **Generated Code**:
  ```python
  # Initial app/db.py engine definition
  engine = create_async_engine(settings.DATABASE_URL, pool_size=10, max_overflow=20)
  ```
- **What Was Wrong**:
  - During pytest execution with FastAPI's `TestClient` / `AsyncClient`, asyncpg DB connections initialized on the main event loop threw `sqlalchemy.exc.InterfaceError: cannot perform operation: another operation is in progress` because async worker threads in pytest were attempting to reuse pooled connections bound to a closed loop.
- **How It Was Fixed**:
  - Configured `poolclass=NullPool` on `create_async_engine` in `app/db.py` for test isolation, ensuring connections are opened and closed cleanly per request context without event loop conflicts.
