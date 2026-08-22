from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime

# --- USER SCHEMAS ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str]
    profile_photo_url: Optional[str]
    language_preference: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- CITY SCHEMAS ---
class CityResponse(BaseModel):
    id: UUID
    name: str
    country: str
    region: Optional[str]
    cost_index: Optional[float]
    popularity_score: int
    description: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True

# --- TRIP SCHEMAS ---
class TripCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    cover_photo_url: Optional[str] = None
    is_public: bool = False
    total_budget: float = 0.00

class TripResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    start_date: date
    end_date: date
    cover_photo_url: Optional[str]
    share_slug: Optional[str]
    is_public: bool
    total_budget: float
    created_at: datetime

    class Config:
        from_attributes = True