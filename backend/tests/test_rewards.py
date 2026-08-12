def test_get_balance(client):
    response = client.get("/api/v1/rewards/balance")
    assert response.status_code == 200
    data = response.json()
    assert "coin_balance" in data
    assert data["coin_balance"] >= 0

def test_get_catalogue(client):
    response = client.get("/api/v1/rewards/catalogue")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4

def test_redeem_invalid_reward(client):
    response = client.post(
        "/api/v1/rewards/redeem",
        json={"reward_id": "invalid-reward-9999"}
    )
    assert response.status_code in [404, 400]

def test_redeem_valid_reward(client):
    response = client.post(
        "/api/v1/rewards/redeem",
        json={"reward_id": "reward-3"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "voucher_code" in data
    assert data["coins_spent"] == 100
