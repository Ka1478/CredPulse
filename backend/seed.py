import os
import sys
import json
import random
import uuid
import psycopg
from datetime import datetime, timedelta, timezone

# Database configuration defaults
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "credpulse_db")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANSACTIONS_JSON_PATH = os.path.join(ROOT_DIR, "transactions.json")
SCHEMA_SQL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "schema.sql")

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"

CATEGORIES = [
    {"id": "cat-1", "name": "Food & Dining", "slug": "food-dining", "icon": "utensils", "color": "#F59E0B"},
    {"id": "cat-2", "name": "Shopping", "slug": "shopping", "icon": "shopping-bag", "color": "#EC4899"},
    {"id": "cat-3", "name": "Travel & Transit", "slug": "travel", "icon": "plane", "color": "#3B82F6"},
    {"id": "cat-4", "name": "Bills & Utilities", "slug": "bills-utilities", "icon": "receipt", "color": "#10B981"},
    {"id": "cat-5", "name": "Entertainment", "slug": "entertainment", "icon": "film", "color": "#8B5CF6"},
    {"id": "cat-6", "name": "Fuel & Transport", "slug": "fuel", "icon": "fuel", "color": "#EF4444"},
    {"id": "cat-7", "name": "Electronics & Tech", "slug": "electronics", "icon": "laptop", "color": "#6366F1"},
    {"id": "cat-8", "name": "Health & Grocery", "slug": "health-grocery", "icon": "heart-pulse", "color": "#14B8A6"}
]

MERCHANTS_BY_CAT = {
    "cat-1": [
        ("Swiggy", 250, 1800, "Online food delivery order"),
        ("Zomato", 200, 1500, "Restaurant delivery"),
        ("Starbucks Coffee", 350, 950, "Coffee & breakfast"),
        ("Dominos Pizza", 400, 1200, "Pizza dining"),
        ("Haldiram's", 300, 2200, "Sweets & snacks"),
        ("Baskin Robbins", 150, 600, "Ice cream treats")
    ],
    "cat-2": [
        ("Amazon India", 500, 12500, "E-commerce purchase"),
        ("Flipkart", 450, 9800, "Electronics & lifestyle items"),
        ("Myntra", 600, 4500, "Apparel & fashion purchase"),
        ("Zara India", 1200, 8500, "Clothing & accessories"),
        ("Decathlon", 800, 5600, "Sports gear & apparel"),
        ("Nykaa", 350, 3200, "Beauty & cosmetics")
    ],
    "cat-3": [
        ("MakeMyTrip", 2500, 28000, "Flight booking"),
        ("Uber India", 120, 850, "Cab ride"),
        ("Ola Cabs", 100, 750, "City transport"),
        ("IRCTC Railways", 320, 2400, "Train ticket booking"),
        ("IndiGo Airlines", 3500, 18500, "Domestic air travel"),
        ("Taj Hotels", 8500, 45000, "Hotel stay booking")
    ],
    "cat-4": [
        ("Airtel Broadband", 799, 1499, "Monthly fiber internet bill"),
        ("Tata Power", 1200, 4800, "Electricity bill payment"),
        ("Jio Fiber", 699, 1299, "Broadband & TV bill"),
        ("Adani Gas", 450, 1800, "Piped natural gas bill"),
        ("HDFC Life Insurance", 5000, 25000, "Annual premium payment")
    ],
    "cat-5": [
        ("Netflix India", 199, 649, "Monthly streaming subscription"),
        ("BookMyShow", 400, 1800, "Movie & event tickets"),
        ("Spotify Premium", 119, 299, "Music streaming subscription"),
        ("PVR Inox Cinemas", 500, 2400, "Multiplex movie outing"),
        ("PlayStation Store", 800, 4999, "Digital gaming purchase")
    ],
    "cat-6": [
        ("Indian Oil Station", 500, 3500, "Fuel fill up"),
        ("HPCL Pump", 400, 3000, "Petrol payment"),
        ("BPCL Petrol Pump", 600, 4000, "Diesel & oil refill"),
        ("Shell Petrol Station", 800, 4500, "Premium V-Power fuel")
    ],
    "cat-7": [
        ("Apple Store Online", 15000, 139900, "iPhone & Accessories"),
        ("Reliance Digital", 2500, 45000, "Home electronics purchase"),
        ("Croma Retail", 1800, 32000, "Consumer electronics"),
        ("Samsung Plaza", 4500, 65000, "Smart TV & Appliances")
    ],
    "cat-8": [
        ("BigBasket", 600, 4200, "Grocery online order"),
        ("Blinkit", 200, 1800, "Instant grocery delivery"),
        ("Apollo Pharmacy", 150, 2500, "Medicine & healthcare"),
        ("Nature's Basket", 800, 3800, "Gourmet groceries"),
        ("Zepto", 180, 1400, "Quick commerce order")
    ]
}

REWARDS_CATALOGUE = [
    {
        "id": "reward-1",
        "title": "₹500 Amazon Pay Gift Card",
        "description": "Redeem 500 CredCoins for a ₹500 Amazon India e-gift voucher valid on all store categories.",
        "category": "Shopping",
        "coin_cost": 500,
        "value_inr": 500.00,
        "partner_name": "Amazon India",
        "stock": 250,
        "is_active": True
    },
    {
        "id": "reward-2",
        "title": "₹250 Swiggy Money Voucher",
        "description": "Get ₹250 added to your Swiggy Money wallet for instant food & Instamart orders.",
        "category": "Food & Dining",
        "coin_cost": 250,
        "value_inr": 250.00,
        "partner_name": "Swiggy",
        "stock": 400,
        "is_active": True
    },
    {
        "id": "reward-3",
        "title": "₹100 Credit Card Bill Cashback",
        "description": "Direct ₹100 statement credit applied to your next credit card bill payment.",
        "category": "Cashback",
        "coin_cost": 100,
        "value_inr": 100.00,
        "partner_name": "CredPulse Direct",
        "stock": 1000,
        "is_active": True
    },
    {
        "id": "reward-4",
        "title": "₹1,000 MakeMyTrip Flight Pass",
        "description": "Enjoy ₹1,000 discount on domestic flight bookings across all major airlines.",
        "category": "Travel",
        "coin_cost": 1000,
        "value_inr": 1000.00,
        "partner_name": "MakeMyTrip",
        "stock": 150,
        "is_active": True
    },
    {
        "id": "reward-5",
        "title": "₹300 BookMyShow Movie Coupon",
        "description": "Flat ₹300 off on booking 2 or more movie tickets at PVR, Inox, or Cinepolis.",
        "category": "Entertainment",
        "coin_cost": 300,
        "value_inr": 300.00,
        "partner_name": "BookMyShow",
        "stock": 300,
        "is_active": True
    },
    {
        "id": "reward-6",
        "title": "₹150 Uber Premier Ride Discount",
        "description": "Get ₹150 off your next Uber Premier or Executive airport trip.",
        "category": "Transit",
        "coin_cost": 150,
        "value_inr": 150.00,
        "partner_name": "Uber India",
        "stock": 500,
        "is_active": True
    }
]

PAYMENT_METHODS = ["HDFC Regalia Gold", "ICICI Sapphiro", "Axis Bank Atlas", "SBI Cashback Card", "Amex Platinum", "UPI AutoPay"]
LOCATIONS = ["Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Online"]

def main():
    print("=== CredPulse Database Seed Script ===")
    print(f"Connecting to PostgreSQL at {DB_HOST}:{DB_PORT} as '{DB_USER}'...")

    # 1. Ensure target DB exists
    try:
        sys_conn = psycopg.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT,
            autocommit=True
        )
        sys_cur = sys_conn.cursor()
        sys_cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}';")
        if not sys_cur.fetchone():
            sys_cur.execute(f"CREATE DATABASE {DB_NAME};")
            print(f"Created database '{DB_NAME}'")
        sys_conn.close()
    except Exception as e:
        print(f"Warning on system DB connection: {e}")

    # 2. Connect to credpulse_db
    conn = psycopg.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT,
        autocommit=True
    )
    cur = conn.cursor()

    # 3. Read and execute schema.sql DDL
    print("Executing schema.sql DDL...")
    with open(SCHEMA_SQL_PATH, "r", encoding="utf-8") as f:
        ddl = f.read()
    cur.execute(ddl)

    # 4. Insert Demo User
    print("Seeding default user...")
    cur.execute(
        "INSERT INTO users (id, name, email, coin_balance, total_spent_inr) VALUES (%s, %s, %s, %s, %s);",
        (DEMO_USER_ID, "Priya Anand", "priya@example.com", 0, 0.00)
    )

    # 5. Insert Categories
    print("Seeding transaction categories...")
    for cat in CATEGORIES:
        cur.execute(
            "INSERT INTO categories (id, name, slug, icon, color) VALUES (%s, %s, %s, %s, %s);",
            (cat["id"], cat["name"], cat["slug"], cat["icon"], cat["color"])
        )

    # 6. Insert Rewards Catalogue
    print("Seeding rewards catalogue...")
    for r in REWARDS_CATALOGUE:
        cur.execute(
            "INSERT INTO rewards_catalogue (id, title, description, category, coin_cost, value_inr, partner_name, stock, is_active) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
            (r["id"], r["title"], r["description"], r["category"], r["coin_cost"], r["value_inr"], r["partner_name"], r["stock"], r["is_active"])
        )

    # 7. Generate 10,000 Transactions
    print("Generating 10,000 realistic credit card transactions...")
    random.seed(42)
    start_date = datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
    end_date = datetime(2026, 8, 10, 23, 59, 59, tzinfo=timezone.utc)
    date_range_seconds = int((end_date - start_date).total_seconds())

    transactions_list = []
    total_coins_earned = 0
    total_spent_inr = 0.00

    statuses = ["SUCCESS"] * 92 + ["PENDING"] * 5 + ["FAILED"] * 3
    card_lasts = ["4821", "9012", "3341", "1098", "5543", "7712"]

    for i in range(1, 10001):
        cat = random.choice(CATEGORIES)
        merchant, min_p, max_p, base_desc = random.choice(MERCHANTS_BY_CAT[cat["id"]])
        
        amount = round(random.uniform(min_p, max_p), 2)
        status = random.choice(statuses)
        
        # 1 coin per ₹100 spent on SUCCESS payments (max 500 coins per txn)
        if status == "SUCCESS":
            coins = min(500, int(amount // 100))
            total_coins_earned += coins
            total_spent_inr += amount
        else:
            coins = 0

        # Random timestamp
        random_secs = random.randint(0, date_range_seconds)
        txn_date = start_date + timedelta(seconds=random_secs)
        
        txn_id = f"txn-{i:05d}"
        txn_ref = f"TXN-{txn_date.strftime('%Y%m%d')}-{i:05d}"
        pay_method = random.choice(PAYMENT_METHODS)
        card_l4 = random.choice(card_lasts)
        loc = random.choice(LOCATIONS)
        desc = f"{base_desc} at {merchant} ({loc})"

        txn_record = (
            txn_id,
            DEMO_USER_ID,
            txn_ref,
            merchant,
            cat["id"],
            amount,
            status,
            txn_date,
            pay_method,
            card_l4,
            coins,
            loc,
            desc
        )
        transactions_list.append(txn_record)

    # Bulk insert into PostgreSQL using executemany / copy
    print("Executing bulk insertion of 10,000 transactions into PostgreSQL...")
    insert_sql = """
    INSERT INTO transactions (
        id, user_id, txn_ref, merchant_name, category_id, amount_inr, status, date,
        payment_method, card_last4, reward_coins_earned, location, description
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    cur.executemany(insert_sql, transactions_list)

    # 8. Update user balance
    print(f"Updating user balance: {total_coins_earned} CredCoins earned, Total Spent INR {total_spent_inr:,.2f}...")
    cur.execute(
        "UPDATE users SET coin_balance = %s, total_spent_inr = %s WHERE id = %s;",
        (total_coins_earned, total_spent_inr, DEMO_USER_ID)
    )

    conn.close()

    # 9. Write out transactions.json file to root directory
    print(f"Exporting raw 10,000 transactions to '{TRANSACTIONS_JSON_PATH}'...")
    json_data = []
    cat_map = {c["id"]: c["name"] for c in CATEGORIES}
    
    for row in transactions_list:
        json_data.append({
            "id": row[0],
            "user_id": row[1],
            "txn_ref": row[2],
            "merchant_name": row[3],
            "category": cat_map.get(row[4], "Other"),
            "category_id": row[4],
            "amount_inr": row[5],
            "status": row[6],
            "date": row[7].isoformat(),
            "payment_method": row[8],
            "card_last4": row[9],
            "reward_coins_earned": row[10],
            "location": row[11],
            "description": row[12]
        })

    with open(TRANSACTIONS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2)

    print("[SUCCESS] Seed completed successfully!")
    print(f"Total Rows Seeded: 10,000")
    print(f"JSON File Exported: {TRANSACTIONS_JSON_PATH} ({os.path.getsize(TRANSACTIONS_JSON_PATH) / 1024 / 1024:.2f} MB)")

if __name__ == "__main__":
    main()
