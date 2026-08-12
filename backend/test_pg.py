import psycopg
import sys

passwords = ["postgres", "admin", "root", "123456", "password", ""]

print("Testing PostgreSQL connections...")
for pwd in passwords:
    try:
        conn = psycopg.connect(
            dbname="postgres",
            user="postgres",
            password=pwd,
            host="localhost",
            port=5432,
            autocommit=True
        )
        print(f"SUCCESS! Connected with user 'postgres' and password: '{pwd}'")
        cur = conn.cursor()
        cur.execute("SELECT current_database(), version();")
        res = cur.fetchone()
        print(f"DB Version: {res[1]}")
        
        # Check if credpulse_db exists
        cur.execute("SELECT 1 FROM pg_database WHERE datname='credpulse_db';")
        exists = cur.fetchone()
        if not exists:
            cur.execute("CREATE DATABASE credpulse_db;")
            print("Created database 'credpulse_db'")
        else:
            print("Database 'credpulse_db' already exists.")
        conn.close()
        sys.exit(0)
    except Exception as e:
        print(f"Failed with password '{pwd}': {e}")

print("Could not connect with standard passwords.")
