import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class DestinationModel(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    continent = Column(String(50), nullable=False, index=True)
    tagline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    hero_image = Column(Text, nullable=False)
    gallery = Column(JSON, default=list)  # List of image URLs
    vibes = Column(JSON, default=list)    # List of vibes e.g. ['Cultural', 'Culinary']
    average_daily_cost = Column(Float, default=150.0)
    currency = Column(String(10), default="USD")
    recommended_days = Column(Integer, default=5)
    best_months = Column(JSON, default=list)
    climate = Column(String(100), default="Temperate")
    current_temp = Column(String(50), nullable=True)
    highlights = Column(JSON, default=list)
    local_etiquette = Column(JSON, default=list)
    featured = Column(Boolean, default=False)
    rating = Column(Float, default=4.8)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ItineraryModel(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String(150), nullable=False)
    tagline = Column(String(255), nullable=True)
    destination = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False)
    continent = Column(String(50), default="Global")
    cover_image = Column(Text, nullable=False)
    start_date = Column(String(30), nullable=False)
    end_date = Column(String(30), nullable=False)
    total_days = Column(Integer, default=4)
    travel_party = Column(String(50), default="Couple")
    vibes = Column(JSON, default=list)
    total_budget = Column(Float, default=1800.0)
    currency = Column(String(10), default="USD")
    status = Column(String(30), default="Upcoming")  # Draft, Upcoming, Active, Completed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relational Children
    days = relationship("DayPlanModel", back_populates="itinerary", cascade="all, delete-orphan", order_by="DayPlanModel.day_number")
    expenses = relationship("ExpenseModel", back_populates="itinerary", cascade="all, delete-orphan")
    packing_list = relationship("PackingItemModel", back_populates="itinerary", cascade="all, delete-orphan")


class DayPlanModel(Base):
    __tablename__ = "day_plans"

    id = Column(String, primary_key=True, default=generate_uuid)
    itinerary_id = Column(String, ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False, index=True)
    day_number = Column(Integer, nullable=False)
    date = Column(String(30), nullable=True)
    title = Column(String(150), nullable=False)
    theme = Column(String(100), nullable=True)
    overview = Column(Text, nullable=True)
    accommodation = Column(JSON, nullable=True)  # {name, address, costPerNight, bookingStatus}

    itinerary = relationship("ItineraryModel", back_populates="days")
    activities = relationship("ActivityModel", back_populates="day_plan", cascade="all, delete-orphan")


class ActivityModel(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, default=generate_uuid)
    day_plan_id = Column(String, ForeignKey("day_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    itinerary_id = Column(String, ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(150), nullable=False)
    time_of_day = Column(String(30), default="Morning")  # Morning, Afternoon, Evening, Night
    time = Column(String(20), nullable=True)
    duration = Column(String(30), nullable=True)
    location = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    estimated_cost = Column(Float, default=0.0)
    currency = Column(String(10), default="USD")
    category = Column(String(50), default="Activities")
    image_url = Column(Text, nullable=True)
    booking_status = Column(String(50), default="Not Needed")  # Booked, Need to Book, Optional, Not Needed
    booking_url = Column(Text, nullable=True)
    booking_reference = Column(String(100), nullable=True)
    transit_notes = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    tags = Column(JSON, default=list)

    day_plan = relationship("DayPlanModel", back_populates="activities")


class ExpenseModel(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, default=generate_uuid)
    itinerary_id = Column(String, ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(50), default="Activities")  # Flights, Stays, Dining, Activities, Transit, Shopping, Misc
    amount = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), default="USD")
    date = Column(String(30), nullable=True)
    paid_by = Column(String(100), nullable=True)
    is_paid = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)

    itinerary = relationship("ItineraryModel", back_populates="expenses")


class PackingItemModel(Base):
    __tablename__ = "packing_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    itinerary_id = Column(String, ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), default="Essentials")  # Essentials, Clothing, Tech, Toiletries, Documents, Health
    is_packed = Column(Boolean, default=False)
    quantity = Column(Integer, default=1)
    is_custom = Column(Boolean, default=False)

    itinerary = relationship("ItineraryModel", back_populates="packing_list")
