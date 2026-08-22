import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Numeric, Date, DateTime, 
    ForeignKey, CheckConstraint, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    profile_photo_url = Column(Text, nullable=True)
    language_preference = Column(String(10), default="en")
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    saved_destinations = relationship("UserSavedDestination", back_populates="user", cascade="all, delete-orphan")

class City(Base):
    __tablename__ = "cities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    region = Column(String(100), nullable=True, index=True)
    cost_index = Column(Numeric(5, 2), nullable=True)
    popularity_score = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)

    __table_args__ = (CheckConstraint('cost_index >= 0', name='check_cost_index_positive'),)

    activities = relationship("ActivityCatalog", back_populates="city", cascade="all, delete-orphan")
    stops = relationship("TripStop", back_populates="city")
    saved_by_users = relationship("UserSavedDestination", back_populates="city", cascade="all, delete-orphan")

class ActivityCatalog(Base):
    __tablename__ = "activities_catalog"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)
    estimated_cost = Column(Numeric(10, 2), nullable=False)
    estimated_duration_mins = Column(Integer, nullable=True)
    image_url = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint('estimated_cost >= 0', name='check_cost_positive'),
        CheckConstraint('estimated_duration_mins > 0', name='check_duration_positive')
    )

    city = relationship("City", back_populates="activities")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    cover_photo_url = Column(Text, nullable=True)
    share_slug = Column(String(64), unique=True, nullable=True, index=True)
    is_public = Column(Boolean, default=False)
    total_budget = Column(Numeric(10, 2), default=0.00)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        CheckConstraint('end_date >= start_date', name='check_trip_dates'),
        CheckConstraint('total_budget >= 0', name='check_budget_positive')
    )

    user = relationship("User", back_populates="trips")
    stops = relationship("TripStop", back_populates="trip", cascade="all, delete-orphan")
    expenses = relationship("ExpenseBreakdown", back_populates="trip", cascade="all, delete-orphan")

class TripStop(Base):
    __tablename__ = "trip_stops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id", ondelete="RESTRICT"), nullable=False)
    stop_order = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    __table_args__ = (
        CheckConstraint('end_date >= start_date', name='check_stop_dates'),
        CheckConstraint('stop_order >= 1', name='check_stop_order_positive'),
        UniqueConstraint('trip_id', 'stop_order', name='uq_trip_stop_order')
    )

    trip = relationship("Trip", back_populates="stops")
    city = relationship("City", back_populates="stops")
    activities = relationship("ItineraryActivity", back_populates="trip_stop", cascade="all, delete-orphan")

class ItineraryActivity(Base):
    __tablename__ = "itinerary_activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_stop_id = Column(UUID(as_uuid=True), ForeignKey("trip_stops.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities_catalog.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(150), nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=True)
    cost = Column(Numeric(10, 2), default=0.00)
    display_order = Column(Integer, nullable=False, default=1)
    notes = Column(Text, nullable=True)

    __table_args__ = (CheckConstraint('cost >= 0', name='check_activity_cost_positive'),)

    trip_stop = relationship("TripStop", back_populates="activities")

class ExpenseBreakdown(Base):
    __tablename__ = "expense_breakdowns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    expense_date = Column(Date, nullable=True)
    description = Column(String(255), nullable=True)

    __table_args__ = (
        CheckConstraint('amount >= 0', name='check_expense_amount_positive'),
        CheckConstraint("category IN ('transport', 'stay', 'activities', 'meals', 'other')", name='check_expense_category')
    )

    trip = relationship("Trip", back_populates="expenses")

class UserSavedDestination(Base):
    __tablename__ = "user_saved_destinations"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="saved_destinations")
    city = relationship("City", back_populates="saved_by_users")