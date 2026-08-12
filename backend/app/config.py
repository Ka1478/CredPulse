import os

class Settings:
    PROJECT_NAME: str = "CredPulse API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL Connection String defaults
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "credpulse_db")
    POSTGRES_SSLMODE: str = os.getenv("POSTGRES_SSLMODE", "require" if "neon.tech" in os.getenv("POSTGRES_HOST", "") else "")

    @property
    def DATABASE_URL(self) -> str:
        env_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL")
        if env_url:
            # Handle postgresql:// or postgres:// to asyncpg scheme
            if env_url.startswith("postgres://"):
                env_url = env_url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif env_url.startswith("postgresql://") and not env_url.startswith("postgresql+asyncpg://"):
                env_url = env_url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return env_url
        
        ssl_arg = f"?ssl={self.POSTGRES_SSLMODE}" if self.POSTGRES_SSLMODE else ""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}{ssl_arg}"

settings = Settings()
