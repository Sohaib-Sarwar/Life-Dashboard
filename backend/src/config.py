from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings(BaseSettings):
    # Database settings
    db_user: str = os.getenv("DB_USER", "root")
    db_password: str = os.getenv("DB_PASSWORD", "root")
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_name: str = os.getenv("DB_NAME", "Discuss_It")
    db_port: str = os.getenv("DB_PORT", "3306")

    # Email settings
    email_host: str = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    email_port: int = int(os.getenv("EMAIL_PORT", "587"))
    email_user: str = os.getenv("EMAIL_USER", "")
    email_password: str = os.getenv("EMAIL_PASSWORD", "")

    # Security settings
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    reset_token_expiry_minutes: int = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "10"))
    verification_code_expiry_minutes: int = int(os.getenv("VERIFICATION_CODE_EXPIRY_MINUTES", "10"))
    bcrypt_rounds: int = int(os.getenv("BCRYPT_ROUNDS", "12"))
    reset_token_length: int = int(os.getenv("RESET_TOKEN_LENGTH", "32"))

    @property
    def database_url(self) -> str:
        return f"mysql+pymysql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}?charset=utf8mb4"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
