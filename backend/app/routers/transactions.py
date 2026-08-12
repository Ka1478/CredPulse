from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from app.models import Transaction, Category
from app.schemas import PaginatedTransactionsResponse, TransactionResponse, CategoryResponse
from app.services.transaction_service import get_paginated_transactions
from typing import Optional, List

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=PaginatedTransactionsResponse)
async def list_transactions(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(15, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search merchant name, description, reference"),
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    status: Optional[str] = Query(None, description="Filter by status (SUCCESS, PENDING, FAILED)"),
    min_amount: Optional[float] = Query(None, ge=0, description="Minimum amount INR"),
    max_amount: Optional[float] = Query(None, ge=0, description="Maximum amount INR"),
    start_date: Optional[str] = Query(None, description="Start date ISO string"),
    end_date: Optional[str] = Query(None, description="End date ISO string"),
    sort_by: str = Query("date", description="Sort field: date, amount, merchant"),
    sort_order: str = Query("desc", description="Sort order: asc, desc"),
    db: AsyncSession = Depends(get_db)
):
    return await get_paginated_transactions(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        category_id=category_id,
        status=status,
        min_amount=min_amount,
        max_amount=max_amount,
        start_date=start_date,
        end_date=end_date,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    stmt = select(Category).order_by(Category.name.asc())
    res = await db.execute(stmt)
    categories = res.scalars().all()
    return categories

@router.get("/{txn_id}", response_model=TransactionResponse)
async def get_transaction(txn_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Transaction, Category).join(Category, Transaction.category_id == Category.id).where(Transaction.id == txn_id)
    res = await db.execute(stmt)
    row = res.first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    txn, cat = row
    return TransactionResponse(
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
    )
