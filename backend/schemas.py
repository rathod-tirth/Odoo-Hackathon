from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

# ==========================================
# Common Enums & Types
# ==========================================
TravelVibe = Literal[
    'Cultural', 'Coastal', 'Adventure', 'Wellness',
    'Culinary', 'Romantic', 'Nature', 'City Break'
]

ActivityTimeOfDay = Literal['Morning', 'Afternoon', 'Evening', 'Night']

ExpenseCategory = Literal['Flights', 'Stays', 'Dining', 'Activities', 'Transit', 'Shopping', 'Misc']

BookingStatus = Literal['Booked', 'Need to Book', 'Optional', 'Not Needed']

PackingCategory = Literal['Essentials', 'Clothing', 'Tech', 'Toiletries', 'Documents', 'Health']

ItineraryStatus = Literal['Draft', 'Upcoming', 'Active', 'Completed']

TravelParty = Literal['Solo', 'Couple', 'Family', 'Friends', 'Group']

# ==========================================
# Activity Schemas
# ==========================================
class ActivityBase(BaseModel):
    title: str = Field(..., max_length=150)
    time_of_day: ActivityTimeOfDay = Field(default='Morning', alias='timeOfDay')
    time: Optional[str] = None
    duration: Optional[str] = "1.5 hrs"
    location: str = Field(..., max_length=150)
    description: str
    estimated_cost: float = Field(default=0.0, alias='estimatedCost')
    currency: str = "USD"
    category: ExpenseCategory = "Activities"
    image_url: Optional[str] = Field(default=None, alias='imageUrl')
    booking_status: Optional[BookingStatus] = Field(default="Not Needed", alias='bookingStatus')
    booking_url: Optional[str] = Field(default=None, alias='bookingUrl')
    booking_reference: Optional[str] = Field(default=None, alias='bookingReference')
    transit_notes: Optional[str] = Field(default=None, alias='transitNotes')
    is_completed: bool = Field(default=False, alias='isCompleted')
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    tags: List[str] = Field(default_factory=list)

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    time_of_day: Optional[ActivityTimeOfDay] = Field(default=None, alias='timeOfDay')
    time: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    estimated_cost: Optional[float] = Field(default=None, alias='estimatedCost')
    currency: Optional[str] = None
    category: Optional[ExpenseCategory] = None
    booking_status: Optional[BookingStatus] = Field(default=None, alias='bookingStatus')
    transit_notes: Optional[str] = Field(default=None, alias='transitNotes')
    is_completed: Optional[bool] = Field(default=None, alias='isCompleted')

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ActivityResponse(ActivityBase):
    id: str


# ==========================================
# Accommodation & Day Plan Schemas
# ==========================================
class AccommodationSchema(BaseModel):
    name: str
    address: str
    check_in_time: Optional[str] = Field(default=None, alias='checkInTime')
    check_out_time: Optional[str] = Field(default=None, alias='checkOutTime')
    booking_status: Optional[str] = Field(default=None, alias='bookingStatus')
    cost_per_night: Optional[float] = Field(default=None, alias='costPerNight')

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class DayPlanBase(BaseModel):
    day_number: int = Field(..., alias='dayNumber')
    date: Optional[str] = None
    title: str
    theme: Optional[str] = None
    overview: Optional[str] = None
    accommodation: Optional[AccommodationSchema] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class DayPlanCreate(DayPlanBase):
    activities: List[ActivityCreate] = Field(default_factory=list)


class DayPlanResponse(DayPlanBase):
    id: Optional[str] = None
    activities: List[ActivityResponse] = Field(default_factory=list)


# ==========================================
# Expense Item Schemas
# ==========================================
class ExpenseBase(BaseModel):
    title: str
    category: ExpenseCategory = "Activities"
    amount: float
    currency: str = "USD"
    date: Optional[str] = None
    paid_by: Optional[str] = Field(default=None, alias='paidBy')
    is_paid: bool = Field(default=False, alias='isPaid')
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    id: str


# ==========================================
# Packing Item Schemas
# ==========================================
class PackingItemBase(BaseModel):
    name: str
    category: PackingCategory = "Essentials"
    is_packed: bool = Field(default=False, alias='isPacked')
    quantity: int = 1
    is_custom: bool = Field(default=False, alias='isCustom')

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class PackingItemCreate(PackingItemBase):
    pass


class PackingItemResponse(PackingItemBase):
    id: str


# ==========================================
# Itinerary Schemas
# ==========================================
class ItineraryBase(BaseModel):
    title: str
    tagline: Optional[str] = None
    destination: str
    country: str
    continent: str = "Global"
    cover_image: str = Field(..., alias='coverImage')
    start_date: str = Field(..., alias='startDate')
    end_date: str = Field(..., alias='endDate')
    total_days: int = Field(default=4, alias='totalDays')
    travel_party: TravelParty = Field(default='Couple', alias='travelParty')
    vibes: List[TravelVibe] = Field(default_factory=list)
    total_budget: float = Field(default=1800.0, alias='totalBudget')
    currency: str = "USD"
    status: ItineraryStatus = "Upcoming"
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ItineraryCreate(ItineraryBase):
    days: List[DayPlanCreate] = Field(default_factory=list)
    expenses: List[ExpenseCreate] = Field(default_factory=list)
    packing_list: List[PackingItemCreate] = Field(default_factory=list, alias='packingList')


class ItineraryUpdate(BaseModel):
    title: Optional[str] = None
    tagline: Optional[str] = None
    destination: Optional[str] = None
    country: Optional[str] = None
    continent: Optional[str] = None
    cover_image: Optional[str] = Field(default=None, alias='coverImage')
    start_date: Optional[str] = Field(default=None, alias='startDate')
    end_date: Optional[str] = Field(default=None, alias='endDate')
    total_days: Optional[int] = Field(default=None, alias='totalDays')
    travel_party: Optional[TravelParty] = Field(default=None, alias='travelParty')
    vibes: Optional[List[TravelVibe]] = None
    total_budget: Optional[float] = Field(default=None, alias='totalBudget')
    currency: Optional[str] = None
    status: Optional[ItineraryStatus] = None
    notes: Optional[str] = None
    days: Optional[List[DayPlanCreate]] = None
    expenses: Optional[List[ExpenseCreate]] = None
    packing_list: Optional[List[PackingItemCreate]] = Field(default=None, alias='packingList')

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ItineraryResponse(ItineraryBase):
    id: str
    days: List[DayPlanResponse] = Field(default_factory=list)
    expenses: List[ExpenseResponse] = Field(default_factory=list)
    packing_list: List[PackingItemResponse] = Field(default_factory=list, alias='packingList')
    created_at: Optional[datetime] = Field(default=None, alias='createdAt')
    updated_at: Optional[datetime] = Field(default=None, alias='updatedAt')


# ==========================================
# Destination Schemas
# ==========================================
class DestinationBase(BaseModel):
    name: str
    country: str
    continent: str
    tagline: str
    description: str
    hero_image: str = Field(..., alias='heroImage')
    gallery: List[str] = Field(default_factory=list)
    vibes: List[TravelVibe] = Field(default_factory=list)
    average_daily_cost: float = Field(default=150.0, alias='averageDailyCost')
    currency: str = "USD"
    recommended_days: int = Field(default=5, alias='recommendedDays')
    best_months: List[str] = Field(default_factory=list, alias='bestMonths')
    climate: str = "Temperate"
    current_temp: Optional[str] = Field(default=None, alias='currentTemp')
    highlights: List[str] = Field(default_factory=list)
    local_etiquette: List[str] = Field(default_factory=list, alias='localEtiquette')
    featured: bool = False
    rating: float = 4.8

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class DestinationCreate(DestinationBase):
    pass


class DestinationResponse(DestinationBase):
    id: str


# ==========================================
# AI Generation & Chat Schemas
# ==========================================
class AIGenerateRequest(BaseModel):
    destination: str
    duration_days: int = Field(default=4, alias='durationDays')
    budget: Any = "Moderate"
    travel_party: TravelParty = Field(default="Couple", alias='travelParty')
    vibes: List[TravelVibe] = Field(default_factory=list)
    interests: Optional[str] = None
    season_or_month: Optional[str] = Field(default="Spring", alias='seasonOrMonth')

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class AIChatHistoryItem(BaseModel):
    role: Literal['user', 'assistant']
    content: str


class AIChatRequest(BaseModel):
    message: str
    active_destination: Optional[str] = Field(default=None, alias='activeDestination')
    active_itinerary_title: Optional[str] = Field(default=None, alias='activeItineraryTitle')
    conversation_history: List[AIChatHistoryItem] = Field(default_factory=list, alias='conversationHistory')

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class AIChatResponse(BaseModel):
    success: bool = True
    reply: str
    source: str = "gemini"


class GenericResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None
