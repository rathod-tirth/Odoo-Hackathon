import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/globetrotter")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback_secret_key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")

settings = Settings()