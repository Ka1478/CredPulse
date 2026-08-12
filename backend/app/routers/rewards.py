from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas import CoinBalanceResponse, RewardItemResponse, RedeemRequest, RedemptionResponse
from app.services.reward_service import get_user_coin_balance, get_rewards_catalogue, redeem_reward
from typing import List

router = APIRouter(prefix="/rewards", tags=["Rewards"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"

@router.get("/balance", response_model=CoinBalanceResponse)
async def get_balance(db: AsyncSession = Depends(get_db)):
    return await get_user_coin_balance(db=db, user_id=DEMO_USER_ID)

@router.get("/catalogue", response_model=List[RewardItemResponse])
async def get_catalogue(db: AsyncSession = Depends(get_db)):
    return await get_rewards_catalogue(db=db)

@router.post("/redeem", response_model=RedemptionResponse)
async def redeem_voucher(
    request: RedeemRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    return await redeem_reward(db=db, user_id=DEMO_USER_ID, reward_id=request.reward_id)
