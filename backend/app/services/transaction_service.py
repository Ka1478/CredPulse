from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_, desc, asc
from app.models import Transaction, Category, User
from app.schemas import PaginatedTransactionsResponse, TransactionResponse, AnalyticsSummaryResponse, CategoryAnalyticsItem, MonthlyTrendItem
from typing import Optional, List
from datetime import datetime

async def get_paginated_transactions(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 15,
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    status: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    sort_by: str = "date",
    sort_order: str = "desc"
) -> PaginatedTransactionsResponse:
    # Build query base
    stmt = select(Transaction, Category).join(Category, Transaction.category_id == Category.id)
    filters = []

    if search and search.strip():
        term = f"%{search.strip()}%"
        filters.append(or_(
            Transaction.merchant_name.ilike(term),
            Transaction.txn_ref.ilike(term),
            Transaction.description.ilike(term)
        ))

    if category_id and category_id.strip() and category_id != "ALL":
        filters.append(Transaction.category_id == category_id.strip())

    if status and status.strip() and status != "ALL":
        filters.append(Transaction.status == status.strip().upper())

    if min_amount is not None:
        filters.append(Transaction.amount_inr >= min_amount)

    if max_amount is not None:
        filters.append(Transaction.amount_inr <= max_amount)

    if start_date and start_date.strip():
        try:
            dt = datetime.fromisoformat(start_date.strip().replace("Z", "+00:00"))
            filters.append(Transaction.date >= dt)
        except ValueError:
            pass

    if end_date and end_date.strip():
        try:
            dt = datetime.fromisoformat(end_date.strip().replace("Z", "+00:00"))
            filters.append(Transaction.date <= dt)
        except ValueError:
            pass

    if filters:
        stmt = stmt.where(and_(*filters))

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_count_res = await db.execute(count_stmt)
    total_count = total_count_res.scalar() or 0

    # Total amount sum for filtered set
    sum_stmt = select(func.coalesce(func.sum(Transaction.amount_inr), 0))
    if filters:
        sum_stmt = sum_stmt.where(and_(*filters))
    total_amount_res = await db.execute(sum_stmt)
    total_amount_inr = float(total_amount_res.scalar() or 0.0)

    # Sorting
    sort_column = Transaction.date
    if sort_by == "amount":
        sort_column = Transaction.amount_inr
    elif sort_by == "merchant":
        sort_column = Transaction.merchant_name

    if sort_order.lower() == "asc":
        stmt = stmt.order_by(asc(sort_column))
    else:
        stmt = stmt.order_by(desc(sort_column))

    # Pagination offset
    offset = (page - 1) * page_size
    stmt = stmt.offset(offset).limit(page_size)

    result = await db.execute(stmt)
    rows = result.all()

    items: List[TransactionResponse] = []
    for txn, cat in rows:
        items.append(TransactionResponse(
            id=txn.id,
            user_id=txn.user_id,
            txn_ref=txn.txn_ref,
            merchant_name=txn.merchant_name,
            category_id=txn.category_id,
            category_name=cat.name,
            category_color=cat.color,
            category_icon=cat.icon,
            amount_inr=float(txn.amount_inr),
            status=txn.status,
            date=txn.date,
            payment_method=txn.payment_method,
            card_last4=txn.card_last4,
            reward_coins_earned=txn.reward_coins_earned,
            location=txn.location,
            description=txn.description
        ))

    total_pages = (total_count + page_size - 1) // page_size if page_size > 0 else 1

    return PaginatedTransactionsResponse(
        items=items,
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        total_amount_inr=round(total_amount_inr, 2)
    )


async def get_analytics_summary(
    db: AsyncSession,
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    status: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> AnalyticsSummaryResponse:
    # Build filter criteria matching table filters for 2-way cross filtering
    filters = []

    if search and search.strip():
        term = f"%{search.strip()}%"
        filters.append(or_(
            Transaction.merchant_name.ilike(term),
            Transaction.txn_ref.ilike(term),
            Transaction.description.ilike(term)
        ))

    if category_id and category_id.strip() and category_id != "ALL":
        filters.append(Transaction.category_id == category_id.strip())

    if status and status.strip() and status != "ALL":
        filters.append(Transaction.status == status.strip().upper())

    if min_amount is not None:
        filters.append(Transaction.amount_inr >= min_amount)

    if max_amount is not None:
        filters.append(Transaction.amount_inr <= max_amount)

    if start_date and start_date.strip():
        try:
            dt = datetime.fromisoformat(start_date.strip().replace("Z", "+00:00"))
            filters.append(Transaction.date >= dt)
        except ValueError:
            pass

    if end_date and end_date.strip():
        try:
            dt = datetime.fromisoformat(end_date.strip().replace("Z", "+00:00"))
            filters.append(Transaction.date <= dt)
        except ValueError:
            pass

    where_clause = and_(*filters) if filters else True

    # 1. Category breakdown
    cat_stmt = (
        select(
            Category.id,
            Category.name,
            Category.color,
            Category.icon,
            func.sum(Transaction.amount_inr).label("cat_total"),
            func.count(Transaction.id).label("cat_count")
        )
        .join(Category, Transaction.category_id == Category.id)
        .where(where_clause)
        .group_by(Category.id, Category.name, Category.color, Category.icon)
        .order_by(desc("cat_total"))
    )

    cat_res = await db.execute(cat_stmt)
    cat_rows = cat_res.all()

    overall_spend = sum(float(r.cat_total or 0) for r in cat_rows)
    total_txns = sum(int(r.cat_count or 0) for r in cat_rows)

    category_breakdown: List[CategoryAnalyticsItem] = []
    for r in cat_rows:
        amount = float(r.cat_total or 0)
        pct = (amount / overall_spend * 100.0) if overall_spend > 0 else 0.0
        category_breakdown.append(CategoryAnalyticsItem(
            category_id=r.id,
            category_name=r.name,
            category_color=r.color,
            category_icon=r.icon,
            total_amount_inr=round(amount, 2),
            transaction_count=r.cat_count,
            percentage=round(pct, 1)
        ))

    # 2. Monthly Trend (group by YYYY-MM)
    # Using strftime in postgresql
    month_str_expr = func.to_char(Transaction.date, 'YYYY-MM')
    trend_stmt = (
        select(
            month_str_expr.label("month_key"),
            func.sum(Transaction.amount_inr).label("month_total"),
            func.count(Transaction.id).label("month_count")
        )
        .where(where_clause)
        .group_by(month_str_expr)
        .order_by(month_str_expr)
    )

    trend_res = await db.execute(trend_stmt)
    trend_rows = trend_res.all()

    monthly_trend: List[MonthlyTrendItem] = []
    for r in trend_rows:
        key = r.month_key
        # Parse "YYYY-MM" to readable "Jan 2025"
        try:
            dt = datetime.strptime(key, "%Y-%m")
            formatted_name = dt.strftime("%b %Y")
        except Exception:
            formatted_name = key

        monthly_trend.append(MonthlyTrendItem(
            month_key=key,
            month_name=formatted_name,
            total_amount_inr=round(float(r.month_total or 0), 2),
            transaction_count=r.month_count
        ))

    return AnalyticsSummaryResponse(
        category_breakdown=category_breakdown,
        monthly_trend=monthly_trend,
        total_spend_inr=round(overall_spend, 2),
        total_transactions=total_txns
    )
