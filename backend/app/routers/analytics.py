from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas import AnalyticsSummaryResponse
from app.services.transaction_service import get_analytics_summary
from typing import Optional

router = APIRouter(prefix="/analytics", tags=["Spend Analytics"])

@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics(
    search: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_amount: Optional[float] = Query(None),
    max_amount: Optional[float] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    return await get_analytics_summary(
        db=db,
        search=search,
        category_id=category_id,
        status=status,
        min_amount=min_amount,
        max_amount=max_amount,
        start_date=start_date,
        end_date=end_date
    )
