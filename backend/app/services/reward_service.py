import uuid
import secrets
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status
from app.models import User, RewardItem, Redemption
from app.schemas import CoinBalanceResponse, RewardItemResponse, RedemptionResponse

async def get_user_coin_balance(db: AsyncSession, user_id: str) -> CoinBalanceResponse:
    user_stmt = select(User).where(User.id == user_id)
    user_res = await db.execute(user_stmt)
    user = user_res.scalar_one_or_none()

    if not user:
        user_stmt = select(User)
        user_res = await db.execute(user_stmt)
        user = user_res.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")

    earned_stmt = select(func.coalesce(func.sum(Redemption.coins_spent), 0)).where(Redemption.user_id == user.id)
    redeemed_res = await db.execute(earned_stmt)
    redeemed_total = int(redeemed_res.scalar() or 0)

    return CoinBalanceResponse(
        coin_balance=user.coin_balance,
        total_coins_earned=user.coin_balance + redeemed_total,
        total_coins_redeemed=redeemed_total,
        user_name=user.name,
        user_email=user.email
    )

async def get_rewards_catalogue(db: AsyncSession) -> list[RewardItemResponse]:
    stmt = select(RewardItem).where(RewardItem.is_active == True).order_by(RewardItem.coin_cost.asc())
    result = await db.execute(stmt)
    rewards = result.scalars().all()
    return [RewardItemResponse.model_validate(r) for r in rewards]

async def redeem_reward(db: AsyncSession, user_id: str, reward_id: str) -> RedemptionResponse:
    # 1. Fetch User
    user_stmt = select(User).where(User.id == user_id)
    user_res = await db.execute(user_stmt)
    user = user_res.scalar_one_or_none()

    if not user:
        user_stmt = select(User)
        user_res = await db.execute(user_stmt)
        user = user_res.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")

    # 2. Fetch Reward Item
    reward_stmt = select(RewardItem).where(RewardItem.id == reward_id)
    reward_res = await db.execute(reward_stmt)
    reward = reward_res.scalar_one_or_none()

    if not reward:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Reward voucher '{reward_id}' not found in catalogue.")

    if not reward.is_active or reward.stock <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Reward voucher '{reward.title}' is currently out of stock or unavailable.")

    # 3. Check coin balance
    if user.coin_balance < reward.coin_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient reward coins. You need {reward.coin_cost} coins, but your current balance is {user.coin_balance} coins."
        )

    # 4. Perform atomic redemption: deduct coins, decrease stock, log redemption
    user.coin_balance -= reward.coin_cost
    reward.stock -= 1

    partner_prefix = (reward.partner_name[:4] if reward.partner_name else "CRED").upper().replace(" ", "")
    voucher_code = f"CREDPULSE-{partner_prefix}-{secrets.token_hex(4).upper()}"
    
    redemption = Redemption(
        id=str(uuid.uuid4()),
        user_id=user.id,
        reward_id=reward.id,
        coins_spent=reward.coin_cost,
        voucher_code=voucher_code,
        status="COMPLETED",
        redeemed_at=datetime.now(timezone.utc)
    )

    db.add(redemption)
    await db.commit()
    await db.refresh(user)

    return RedemptionResponse(
        success=True,
        message=f"Successfully redeemed {reward.title} for {reward.coin_cost} coins!",
        redemption_id=redemption.id,
        reward_title=reward.title,
        voucher_code=voucher_code,
        coins_spent=reward.coin_cost,
        remaining_balance=user.coin_balance,
        redeemed_at=redemption.redeemed_at
    )
