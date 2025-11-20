from fastapi import FastAPI, Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from models import *
from schema import *
from hashlib import md5
from jose import jwt, JWTError
from datetime import datetime, timedelta
import pytz
from typing import Optional
from sqlalchemy import create_engine
from database import get_db
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from config import get_settings, Settings
from utils import *
from database import get_db, engine
from models import Base

# Get settings
settings = get_settings()

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()

# Use settings for security
SECRET_KEY = settings.secret_key
ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
RESET_PASSWORD_EXPIRE_MINUTES = settings.reset_token_expiry_minutes
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return md5(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return md5(plain_password.encode()).hexdigest() == hashed_password


def __get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def __verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[int] = None):
    to_encode = data.copy()
    expire = datetime.now(DEFAULT_TIMEZONE) + timedelta(
        minutes=expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


# Add settings dependency
async def get_settings_dependency():
    return get_settings()


# Router instances
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
member_router = APIRouter(prefix="/member", tags=["Member Dashboard"])
password_router = APIRouter(prefix="/password", tags=["Password Management"])
common_router = APIRouter(tags=["Common"])


def create_user_response(user: Users, location: Locations) -> UserResponse:
    """Helper function to create UserResponse"""
    return UserResponse(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        phone_number=user.phone_number,
        location=LocationResponse(
            country=location.country,
            state=location.state,
            city=location.city,
            country_code=location.country_code,
            time_zone=location.time_zone,
        ),
        profile_image_url=user.profile_image_url,
        created_at=user.created_at,
        email_verified=user.email_verified,
        phone_verified=user.phone_verified,
    )


# --------------------- Authentication Routes ---------------------#
@auth_router.post("/member/register", response_model=UserResponse)
def register_member(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create or get location
    location = (
        db.query(Locations)
        .filter(
            Locations.country == user.location.country,
            Locations.state == user.location.state,
            Locations.city == user.location.city,
            Locations.country_code == user.location.country_code,
            Locations.time_zone == user.location.time_zone,
        )
        .first()
    )

    if not location:
        location = Locations(
            country=user.location.country,
            state=user.location.state,
            city=user.location.city,
            country_code=user.location.country_code,
            time_zone=user.location.time_zone,
        )
        db.add(location)
        db.commit()
        db.refresh(location)

    hashed_password = get_password_hash(user.password)
    new_user = Users(
        email=user.email,
        role="member",
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.mobile,
        location_id=location.location_id,
        profile_image_url=user.profile_picture_url or "default.jpg",
        password_hash=hashed_password,
        created_at=datetime.now(DEFAULT_TIMEZONE),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate and send verification codes
    email_code = generate_verification_code()
    phone_code = generate_verification_code()

    # Store verification codes
    TokenService.store_email_verification_code(db, user.email, email_code)
    TokenService.store_phone_verification_code(db, user.email, phone_code)

    # Send verification codes
    send_verification_email(user.email, email_code)
    send_phone_verification_sms(user.mobile, phone_code)

    return new_user


@auth_router.post("/member/login")
def member_login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = (
        db.query(Users)
        .filter(Users.email == user.email, Users.role == "member")
        .first()
    )
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token({"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# --------------------- Member Dashboard Routes ---------------------#
@member_router.get("/profile", response_model=UserResponse)
def get_member_profile(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials"
            )
    except jwt.JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    user = db.query(Users).filter(Users.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    location = (
        db.query(Locations).filter(Locations.location_id == user.location_id).first()
    )
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")

    return create_user_response(user, location)


@member_router.patch("/profile", response_model=UserResponse)
def update_member_profile(
    update_data: UpdateAccountInformation,
    bearer_token: str,
    db: Session = Depends(get_db),
):
    """Update user account information"""
    try:
        payload = jwt.decode(bearer_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update basic user information
    if update_data.first_name is not None:
        user.first_name = update_data.first_name
    if update_data.last_name is not None:
        user.last_name = update_data.last_name
    if update_data.mobile is not None:
        user.phone_number = update_data.mobile
    if update_data.profile_picture_url is not None:
        user.profile_image_url = update_data.profile_picture_url

    # Update location if provided
    if update_data.location is not None:
        # Check if location exists
        location = (
            db.query(Locations)
            .filter(
                Locations.country == update_data.location.country,
                Locations.state == update_data.location.state,
                Locations.city == update_data.location.city,
                Locations.country_code == update_data.location.country_code,
                Locations.time_zone == update_data.location.time_zone,
            )
            .first()
        )

        if not location:
            # Create new location
            location = Locations(
                country=update_data.location.country,
                state=update_data.location.state,
                city=update_data.location.city,
                country_code=update_data.location.country_code,
                time_zone=update_data.location.time_zone,
            )
            db.add(location)
            db.commit()
            db.refresh(location)

        user.location_id = location.location_id

    db.commit()
    db.refresh(user)

    # Return updated user data with location
    location = (
        db.query(Locations).filter(Locations.location_id == user.location_id).first()
    )
    return create_user_response(user, location)


# --------------------- Password Management Routes ---------------------#
@password_router.post("/reset-request")
def reset_password_request(
    request: PasswordResetRequest, db: Session = Depends(get_db)
):
    user = (
        db.query(Users)
        .filter(Users.email == request.email, Users.role == "member")
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = TokenService.create_reset_token(db, user.email)
    # Send token via email (placeholder for actual email logic)
    return {"message": "Password reset token sent", "reset_token": token}


@password_router.post("/reset-confirm")
def reset_password_confirm(
    request: PasswordResetConfirm, db: Session = Depends(get_db)
):
    email = TokenService.verify_reset_token(db, request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(Users).filter(Users.email == email, Users.role == "member").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = get_password_hash(request.new_password)
    db.commit()

    # Invalidate the used token
    TokenService.invalidate_reset_token(db, request.token)

    return {"message": "Password has been reset successfully"}


@password_router.post("/change")
def change_password(
    request: PasswordChange, bearer_token: str, db: Session = Depends(get_db)
):
    """Change password for the User/Expert, token: Bearer token"""
    try:
        payload = jwt.decode(bearer_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(request.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if user.password_hash == get_password_hash(request.new_password):
        raise HTTPException(
            status_code=400,
            detail="New password cannot be the same as the old password",
        )

    user.password_hash = get_password_hash(request.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


# --------------------- Common Routes ---------------------#
@common_router.post("/verify/email")
def verify_email(request: EmailVerificationRequest, db: Session = Depends(get_db)):
    if not TokenService.verify_email_code(db, request.email, request.code):
        raise HTTPException(
            status_code=400, detail="Invalid or expired verification code"
        )

    user = db.query(Users).filter(Users.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email_verified = True
    db.commit()
    return {"message": "Email verified successfully"}


@common_router.post("/verify/phone")
def verify_phone(request: PhoneVerificationRequest, db: Session = Depends(get_db)):
    if not TokenService.verify_phone_code(db, request.email, request.code):
        raise HTTPException(
            status_code=400, detail="Invalid or expired verification code"
        )

    user = db.query(Users).filter(Users.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.phone_verified = True
    db.commit()
    return {"message": "Phone number verified successfully"}


@common_router.get("/me", response_model=UserResponse)
def get_current_user(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials"
            )
    except jwt.JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    user = db.query(Users).filter(Users.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    location = (
        db.query(Locations).filter(Locations.location_id == user.location_id).first()
    )
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")

    return create_user_response(user, location)


# Include all routers
app.include_router(auth_router)
app.include_router(member_router)
app.include_router(password_router)
app.include_router(common_router)
