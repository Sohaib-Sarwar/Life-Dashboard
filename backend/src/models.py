from datetime import datetime
import pytz
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Text,
    Date,
    Time,
    Enum,
    DECIMAL,
    Boolean,
    TIMESTAMP,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

# Default timezone
DEFAULT_TIMEZONE = pytz.UTC

# SQLAlchemy Base
Base = declarative_base()


# Timezone-aware datetime function
def utcnow():
    """Return timezone-aware UTC datetime"""
    return datetime.now(DEFAULT_TIMEZONE)


# Enums
class RoleEnum(str, enum.Enum):
    member = "member"
    expert = "expert"


class DurationEnum(str, enum.Enum):
    half_hour = "30 min"
    full_hour = "60 min"


class SessionStatusEnum(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    canceled = "canceled"


class EarningStatusEnum(str, enum.Enum):
    pending = "pending"
    completed = "completed"


class TokenType(str, enum.Enum):
    password_reset = "password_reset"
    email_verification = "email_verification"
    phone_verification = "phone_verification"


# SQLAlchemy Models
class Users(Base):
    __tablename__ = "users"

    email = Column(String(100), primary_key=True)
    role = Column(Enum(RoleEnum), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    phone_number = Column(String(20), unique=True)
    location_id = Column(Integer, ForeignKey("locations.location_id"))
    location = relationship("Locations", back_populates="users")
    phone_verified = Column(Boolean, default=False)
    email_verified = Column(Boolean, default=False)
    password_hash = Column(String(255), nullable=False)
    profile_image_url = Column(String(255))
    credit_card_token = Column(String(255))
    created_at = Column(TIMESTAMP(timezone=True), default=utcnow)
    tokens = relationship("Tokens", back_populates="user")


class Locations(Base):
    __tablename__ = "locations"

    location_id = Column(Integer, primary_key=True, autoincrement=True)
    country = Column(String(50), nullable=False)
    state = Column(String(50))
    city = Column(String(50))
    country_code = Column(String(5))
    time_zone = Column(String(50))
    users = relationship("Users", back_populates="location")


class UserLocations(Base):
    __tablename__ = "user_locations"

    email = Column(String(100), ForeignKey("users.email"), primary_key=True)
    location_id = Column(Integer, ForeignKey("locations.location_id"), primary_key=True)


class ContactUs(Base):
    __tablename__ = "contact_us"

    inquiry_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone_number = Column(String(20))
    subject = Column(String(255))
    message = Column(Text, nullable=False)
    submitted_at = Column(TIMESTAMP(timezone=True), default=utcnow)


class Tokens(Base):
    __tablename__ = "tokens"

    token = Column(String(128), primary_key=True)
    email = Column(String(100), ForeignKey("users.email"), nullable=False)
    token_type = Column(Enum(TokenType, length=50), nullable=False)
    code = Column(String(4), nullable=True)  # For verification codes
    expires_at = Column(TIMESTAMP(timezone=True), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=utcnow)
    is_used = Column(Boolean, default=False)

    user = relationship("Users", back_populates="tokens")

    def is_valid(self) -> bool:
        return not self.is_used and datetime.utcnow() <= self.expires_at
