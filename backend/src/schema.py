from datetime import datetime, date, time
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# Base Models
class LocationBase(BaseModel):
    country: str
    state: str | None = None
    city: str | None = None
    country_code: str
    time_zone: str | None = None


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str]


# Authentication & User Models
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    mobile: str
    email: EmailStr
    location: LocationBase
    password: str
    payment_method: str | None = None
    profile_picture_url: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Response Models
class LocationResponse(LocationBase):
    pass


class UserResponse(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    phone_number: Optional[str]
    location: LocationResponse
    profile_image_url: Optional[str]
    created_at: datetime
    email_verified: bool
    phone_verified: bool

    class Config:
        from_attributes = True


# Account Management
class UpdateAccountInformation(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    mobile: str | None = None
    profile_picture_url: str | None = None
    location: LocationBase | None = None


# Password Management
class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    email: EmailStr
    token: str
    new_password: str


# Verification Models
class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: str


class PhoneVerificationRequest(BaseModel):
    email: EmailStr
    code: str
