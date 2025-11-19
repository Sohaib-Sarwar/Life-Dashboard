import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import pytz
from config import get_settings
import logging
import secrets
from sqlalchemy.orm import Session
from models import Tokens, TokenType, DEFAULT_TIMEZONE
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_db
from models import Users
from jose import JWTError, jwt
from database import get_db

logger = logging.getLogger("fastapi")
settings = get_settings()

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> Users:
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401)

    user = db.query(Users).filter(Users.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def generate_verification_code():
    return str(random.randint(1000, 9999))  # 4 digit code


def get_verification_expiry():
    settings = get_settings()
    return datetime.now(DEFAULT_TIMEZONE) + timedelta(
        minutes=settings.verification_code_expiry_minutes
    )


def send_verification_email(to_email: str, verification_code: str):
    # TODO: Implement actual Email sending logic
    # This is a placeholder that just logs the code
    logger.info(f"Email verification code {verification_code} sent to {to_email}")
    return True


def send_phone_verification_sms(phone_number: str, verification_code: str):
    # TODO: Implement actual SMS sending logic
    # This is a placeholder that just logs the code
    logger.info(f"SMS verification code {verification_code} sent to {phone_number}")
    return True


class TokenService:
    @staticmethod
    def create_reset_token(db: Session, email: str) -> str:
        """Create a password reset token"""
        token = secrets.token_hex(settings.reset_token_length)
        expires_at = datetime.now(DEFAULT_TIMEZONE) + timedelta(
            minutes=settings.reset_token_expiry_minutes
        )

        db_token = Tokens(
            token=token,
            email=email,
            token_type=TokenType.password_reset,
            expires_at=expires_at,
        )
        db.add(db_token)
        db.commit()

        return token

    @staticmethod
    def verify_reset_token(db: Session, token: str) -> str | None:
        """Verify a password reset token and return the associated email"""
        db_token = (
            db.query(Tokens)
            .filter(
                Tokens.token == token, Tokens.token_type == TokenType.password_reset
            )
            .first()
        )

        if not db_token or not db_token.is_valid():
            return None

        return db_token.email

    @staticmethod
    def invalidate_reset_token(db: Session, token: str) -> bool:
        """Invalidate a password reset token"""
        db_token = db.query(Tokens).filter(Tokens.token == token).first()
        if db_token:
            db_token.is_used = True
            db.commit()
            return True
        return False

    @staticmethod
    def store_email_verification_code(db: Session, email: str, code: str) -> bool:
        """Store email verification code"""
        expires_at = datetime.now(DEFAULT_TIMEZONE) + timedelta(
            minutes=settings.verification_code_expiry_minutes
        )

        db_token = Tokens(
            token=secrets.token_hex(8),
            email=email,
            token_type=TokenType.email_verification,
            code=code,
            expires_at=expires_at,
        )

        db.add(db_token)
        db.commit()
        return True

    @staticmethod
    def store_phone_verification_code(db: Session, email: str, code: str) -> bool:
        """Store phone verification code"""
        expires_at = datetime.now(DEFAULT_TIMEZONE) + timedelta(
            minutes=settings.verification_code_expiry_minutes
        )

        db_token = Tokens(
            token=secrets.token_hex(8),
            email=email,
            token_type=TokenType.phone_verification,
            code=code,
            expires_at=expires_at,
        )

        db.add(db_token)
        db.commit()
        return True

    @staticmethod
    def verify_email_code(db: Session, email: str, code: str) -> bool:
        """Verify email verification code"""
        db_token = (
            db.query(Tokens)
            .filter(
                Tokens.email == email,
                Tokens.code == code,
                Tokens.token_type == TokenType.email_verification,
                Tokens.is_used == False,
            )
            .order_by(Tokens.created_at.desc())
            .first()
        )

        if not db_token or not db_token.is_valid():
            return False

        db_token.is_used = True
        db.commit()
        return True

    @staticmethod
    def verify_phone_code(db: Session, email: str, code: str) -> bool:
        """Verify phone verification code"""
        db_token = (
            db.query(Tokens)
            .filter(
                Tokens.email == email,
                Tokens.code == code,
                Tokens.token_type == TokenType.phone_verification,
                Tokens.is_used == False,
            )
            .order_by(Tokens.created_at.desc())
            .first()
        )

        if not db_token or not db_token.is_valid():
            return False

        db_token.is_used = True
        db.commit()
        return True
