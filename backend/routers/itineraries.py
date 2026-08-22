import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (
    ItineraryModel,
    DayPlanModel,
    ActivityModel,
    ExpenseModel,
    PackingItemModel
)
from ..schemas import (
    ItineraryCreate,
    ItineraryUpdate,
    ItineraryResponse,
    DayPlanCreate,
    DayPlanResponse,
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    ExpenseCreate,
    ExpenseResponse,
    PackingItemCreate,
    PackingItemResponse,
    GenericResponse
)

router = APIRouter(prefix="/api/itineraries", tags=["Itineraries"])


# ==========================================
# Itinerary Root CRUD
# ==========================================
@router.get("", response_model=List[ItineraryResponse])
def list_itineraries(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (Draft, Upcoming, Active, Completed)"),
    destination: Optional[str] = Query(None, description="Filter by destination"),
    db: Session = Depends(get_db)
):
    """List all itineraries with optional status and destination filters."""
    query = db.query(ItineraryModel)

    if status_filter:
        query = query.filter(ItineraryModel.status.ilike(status_filter))

    if destination:
        query = query.filter(ItineraryModel.destination.ilike(f"%{destination}%"))

    return query.order_by(ItineraryModel.created_at.desc()).all()


@router.get("/{itinerary_id}", response_model=ItineraryResponse)
def get_itinerary(itinerary_id: str, db: Session = Depends(get_db)):
    """Retrieve full details of a specific itinerary including days, activities, expenses, and packing list."""
    itinerary = db.query(ItineraryModel).filter(ItineraryModel.id == itinerary_id).first()
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary with ID '{itinerary_id}' not found"
        )
    return itinerary


@router.post("", response_model=ItineraryResponse, status_code=status.HTTP_201_CREATED)
def create_itinerary(itinerary_data: ItineraryCreate, db: Session = Depends(get_db)):
    """Create a new complete vacation itinerary with days, activities, expenses, and packing items."""
    new_itinerary = ItineraryModel(
        id=f"trip-{int(datetime.utcnow().timestamp()*1000)}",
        title=itinerary_data.title,
        tagline=itinerary_data.tagline,
        destination=itinerary_data.destination,
        country=itinerary_data.country,
        continent=itinerary_data.continent,
        cover_image=itinerary_data.cover_image,
        start_date=itinerary_data.start_date,
        end_date=itinerary_data.end_date,
        total_days=itinerary_data.total_days,
        travel_party=itinerary_data.travel_party,
        vibes=itinerary_data.vibes,
        total_budget=itinerary_data.total_budget,
        currency=itinerary_data.currency,
        status=itinerary_data.status,
        notes=itinerary_data.notes
    )
    db.add(new_itinerary)
    db.flush()

    # Add Days & Activities
    for day in itinerary_data.days:
        day_model = DayPlanModel(
            id=f"day-{new_itinerary.id}-{day.day_number}",
            itinerary_id=new_itinerary.id,
            day_number=day.day_number,
            date=day.date,
            title=day.title,
            theme=day.theme,
            overview=day.overview,
            accommodation=day.accommodation.model_dump(by_alias=True) if day.accommodation else None
        )
        db.add(day_model)
        db.flush()

        for act in day.activities:
            act_model = ActivityModel(
                id=f"act-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
                day_plan_id=day_model.id,
                itinerary_id=new_itinerary.id,
                title=act.title,
                time_of_day=act.time_of_day,
                time=act.time,
                duration=act.duration,
                location=act.location,
                description=act.description,
                estimated_cost=act.estimated_cost,
                currency=act.currency,
                category=act.category,
                image_url=act.image_url,
                booking_status=act.booking_status,
                booking_url=act.booking_url,
                booking_reference=act.booking_reference,
                transit_notes=act.transit_notes,
                is_completed=act.is_completed,
                latitude=act.latitude,
                longitude=act.longitude,
                tags=act.tags
            )
            db.add(act_model)

    # Add Expenses
    for exp in itinerary_data.expenses:
        exp_model = ExpenseModel(
            id=f"exp-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
            itinerary_id=new_itinerary.id,
            title=exp.title,
            category=exp.category,
            amount=exp.amount,
            currency=exp.currency,
            date=exp.date,
            paid_by=exp.paid_by,
            is_paid=exp.is_paid,
            notes=exp.notes
        )
        db.add(exp_model)

    # Add Packing Items
    for pk in itinerary_data.packing_list:
        pk_model = PackingItemModel(
            id=f"pk-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
            itinerary_id=new_itinerary.id,
            name=pk.name,
            category=pk.category,
            is_packed=pk.is_packed,
            quantity=pk.quantity,
            is_custom=pk.is_custom
        )
        db.add(pk_model)

    db.commit()
    db.refresh(new_itinerary)
    return new_itinerary


@router.put("/{itinerary_id}", response_model=ItineraryResponse)
def update_itinerary(itinerary_id: str, update_data: ItineraryUpdate, db: Session = Depends(get_db)):
    """Update metadata or full structure of an itinerary."""
    itinerary = db.query(ItineraryModel).filter(ItineraryModel.id == itinerary_id).first()
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary with ID '{itinerary_id}' not found"
        )

    # Update top-level fields
    data_dict = update_data.model_dump(exclude_unset=True, by_alias=False)
    for field in ['title', 'tagline', 'destination', 'country', 'continent', 'cover_image',
                  'start_date', 'end_date', 'total_days', 'travel_party', 'vibes',
                  'total_budget', 'currency', 'status', 'notes']:
        if field in data_dict and data_dict[field] is not None:
            setattr(itinerary, field, data_dict[field])

    # If days are provided in update payload, sync days & activities
    if update_data.days is not None:
        # Delete old days
        db.query(DayPlanModel).filter(DayPlanModel.itinerary_id == itinerary_id).delete()
        db.flush()

        for day in update_data.days:
            day_model = DayPlanModel(
                id=f"day-{itinerary.id}-{day.day_number}",
                itinerary_id=itinerary.id,
                day_number=day.day_number,
                date=day.date,
                title=day.title,
                theme=day.theme,
                overview=day.overview,
                accommodation=day.accommodation.model_dump(by_alias=True) if day.accommodation else None
            )
            db.add(day_model)
            db.flush()

            for act in day.activities:
                act_model = ActivityModel(
                    id=f"act-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
                    day_plan_id=day_model.id,
                    itinerary_id=itinerary.id,
                    title=act.title,
                    time_of_day=act.time_of_day,
                    time=act.time,
                    duration=act.duration,
                    location=act.location,
                    description=act.description,
                    estimated_cost=act.estimated_cost,
                    currency=act.currency,
                    category=act.category,
                    image_url=act.image_url,
                    booking_status=act.booking_status,
                    booking_url=act.booking_url,
                    booking_reference=act.booking_reference,
                    transit_notes=act.transit_notes,
                    is_completed=act.is_completed,
                    latitude=act.latitude,
                    longitude=act.longitude,
                    tags=act.tags
                )
                db.add(act_model)

    # If expenses provided in update payload
    if update_data.expenses is not None:
        db.query(ExpenseModel).filter(ExpenseModel.itinerary_id == itinerary_id).delete()
        db.flush()
        for exp in update_data.expenses:
            exp_model = ExpenseModel(
                id=f"exp-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
                itinerary_id=itinerary.id,
                title=exp.title,
                category=exp.category,
                amount=exp.amount,
                currency=exp.currency,
                date=exp.date,
                paid_by=exp.paid_by,
                is_paid=exp.is_paid,
                notes=exp.notes
            )
            db.add(exp_model)

    # If packing list provided in update payload
    if update_data.packing_list is not None:
        db.query(PackingItemModel).filter(PackingItemModel.itinerary_id == itinerary_id).delete()
        db.flush()
        for pk in update_data.packing_list:
            pk_model = PackingItemModel(
                id=f"pk-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
                itinerary_id=itinerary.id,
                name=pk.name,
                category=pk.category,
                is_packed=pk.is_packed,
                quantity=pk.quantity,
                is_custom=pk.is_custom
            )
            db.add(pk_model)

    itinerary.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(itinerary)
    return itinerary


@router.delete("/{itinerary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_itinerary(itinerary_id: str, db: Session = Depends(get_db)):
    """Delete an entire itinerary and its associated day plans, activities, expenses, and packing items."""
    itinerary = db.query(ItineraryModel).filter(ItineraryModel.id == itinerary_id).first()
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary with ID '{itinerary_id}' not found"
        )
    db.delete(itinerary)
    db.commit()
    return None


@router.post("/{itinerary_id}/duplicate", response_model=ItineraryResponse, status_code=status.HTTP_201_CREATED)
def duplicate_itinerary(itinerary_id: str, db: Session = Depends(get_db)):
    """Clone an existing itinerary as a new Draft itinerary."""
    original = db.query(ItineraryModel).filter(ItineraryModel.id == itinerary_id).first()
    if not original:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Original itinerary '{itinerary_id}' not found"
        )

    new_id = f"trip-copy-{int(datetime.utcnow().timestamp()*1000)}"
    cloned = ItineraryModel(
        id=new_id,
        title=f"{original.title} (Copy)",
        tagline=original.tagline,
        destination=original.destination,
        country=original.country,
        continent=original.continent,
        cover_image=original.cover_image,
        start_date=original.start_date,
        end_date=original.end_date,
        total_days=original.total_days,
        travel_party=original.travel_party,
        vibes=original.vibes,
        total_budget=original.total_budget,
        currency=original.currency,
        status="Draft",
        notes=original.notes
    )
    db.add(cloned)
    db.flush()

    # Clone Days & Activities
    for day in original.days:
        cloned_day = DayPlanModel(
            id=f"day-{new_id}-{day.day_number}",
            itinerary_id=new_id,
            day_number=day.day_number,
            date=day.date,
            title=day.title,
            theme=day.theme,
            overview=day.overview,
            accommodation=day.accommodation
        )
        db.add(cloned_day)
        db.flush()

        for act in day.activities:
            cloned_act = ActivityModel(
                id=f"act-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
                day_plan_id=cloned_day.id,
                itinerary_id=new_id,
                title=act.title,
                time_of_day=act.time_of_day,
                time=act.time,
                duration=act.duration,
                location=act.location,
                description=act.description,
                estimated_cost=act.estimated_cost,
                currency=act.currency,
                category=act.category,
                image_url=act.image_url,
                booking_status=act.booking_status,
                booking_url=act.booking_url,
                booking_reference=act.booking_reference,
                transit_notes=act.transit_notes,
                is_completed=False,
                latitude=act.latitude,
                longitude=act.longitude,
                tags=act.tags
            )
            db.add(cloned_act)

    # Clone Expenses
    for exp in original.expenses:
        cloned_exp = ExpenseModel(
            id=f"exp-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
            itinerary_id=new_id,
            title=exp.title,
            category=exp.category,
            amount=exp.amount,
            currency=exp.currency,
            date=exp.date,
            paid_by=exp.paid_by,
            is_paid=False,
            notes=exp.notes
        )
        db.add(cloned_exp)

    # Clone Packing items
    for pk in original.packing_list:
        cloned_pk = PackingItemModel(
            id=f"pk-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
            itinerary_id=new_id,
            name=pk.name,
            category=pk.category,
            is_packed=False,
            quantity=pk.quantity,
            is_custom=pk.is_custom
        )
        db.add(cloned_pk)

    db.commit()
    db.refresh(cloned)
    return cloned


# ==========================================
# Granular Activity Endpoints
# ==========================================
@router.post("/{itinerary_id}/days/{day_number}/activities", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def add_activity_to_day(
    itinerary_id: str,
    day_number: int,
    activity_data: ActivityCreate,
    db: Session = Depends(get_db)
):
    """Add a single activity to a designated day in an itinerary."""
    day = db.query(DayPlanModel).filter(
        DayPlanModel.itinerary_id == itinerary_id,
        DayPlanModel.day_number == day_number
    ).first()

    if not day:
        # Create day if not existing yet
        day = DayPlanModel(
            id=f"day-{itinerary_id}-{day_number}",
            itinerary_id=itinerary_id,
            day_number=day_number,
            title=f"Day {day_number}",
            overview=f"Activities for Day {day_number}"
        )
        db.add(day)
        db.flush()

    new_act = ActivityModel(
        id=f"act-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
        day_plan_id=day.id,
        itinerary_id=itinerary_id,
        title=activity_data.title,
        time_of_day=activity_data.time_of_day,
        time=activity_data.time,
        duration=activity_data.duration,
        location=activity_data.location,
        description=activity_data.description,
        estimated_cost=activity_data.estimated_cost,
        currency=activity_data.currency,
        category=activity_data.category,
        image_url=activity_data.image_url,
        booking_status=activity_data.booking_status,
        booking_url=activity_data.booking_url,
        booking_reference=activity_data.booking_reference,
        transit_notes=activity_data.transit_notes,
        is_completed=activity_data.is_completed,
        latitude=activity_data.latitude,
        longitude=activity_data.longitude,
        tags=activity_data.tags
    )
    db.add(new_act)
    db.commit()
    db.refresh(new_act)
    return new_act


@router.patch("/{itinerary_id}/activities/{activity_id}/complete", response_model=ActivityResponse)
def toggle_activity_completed(
    itinerary_id: str,
    activity_id: str,
    db: Session = Depends(get_db)
):
    """Toggle the completion status of an activity."""
    act = db.query(ActivityModel).filter(
        ActivityModel.id == activity_id,
        ActivityModel.itinerary_id == itinerary_id
    ).first()

    if not act:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    act.is_completed = not act.is_completed
    db.commit()
    db.refresh(act)
    return act


@router.delete("/{itinerary_id}/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    itinerary_id: str,
    activity_id: str,
    db: Session = Depends(get_db)
):
    """Remove an activity from an itinerary."""
    act = db.query(ActivityModel).filter(
        ActivityModel.id == activity_id,
        ActivityModel.itinerary_id == itinerary_id
    ).first()

    if not act:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    db.delete(act)
    db.commit()
    return None


# ==========================================
# Granular Expense Endpoints
# ==========================================
@router.post("/{itinerary_id}/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def add_expense(
    itinerary_id: str,
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db)
):
    """Add a new logged expense to an itinerary."""
    new_exp = ExpenseModel(
        id=f"exp-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
        itinerary_id=itinerary_id,
        title=expense_data.title,
        category=expense_data.category,
        amount=expense_data.amount,
        currency=expense_data.currency,
        date=expense_data.date,
        paid_by=expense_data.paid_by,
        is_paid=expense_data.is_paid,
        notes=expense_data.notes
    )
    db.add(new_exp)
    db.commit()
    db.refresh(new_exp)
    return new_exp


@router.patch("/{itinerary_id}/expenses/{expense_id}/toggle-paid", response_model=ExpenseResponse)
def toggle_expense_paid(
    itinerary_id: str,
    expense_id: str,
    db: Session = Depends(get_db)
):
    """Toggle whether an expense is marked as paid or pending."""
    exp = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id,
        ExpenseModel.itinerary_id == itinerary_id
    ).first()

    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    exp.is_paid = not exp.is_paid
    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/{itinerary_id}/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    itinerary_id: str,
    expense_id: str,
    db: Session = Depends(get_db)
):
    """Delete a logged expense from an itinerary."""
    exp = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id,
        ExpenseModel.itinerary_id == itinerary_id
    ).first()

    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    db.delete(exp)
    db.commit()
    return None


# ==========================================
# Granular Packing Endpoints
# ==========================================
@router.post("/{itinerary_id}/packing", response_model=PackingItemResponse, status_code=status.HTTP_201_CREATED)
def add_packing_item(
    itinerary_id: str,
    item_data: PackingItemCreate,
    db: Session = Depends(get_db)
):
    """Add a new item to the packing list."""
    new_pk = PackingItemModel(
        id=f"pk-{int(datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:4]}",
        itinerary_id=itinerary_id,
        name=item_data.name,
        category=item_data.category,
        is_packed=item_data.is_packed,
        quantity=item_data.quantity,
        is_custom=True
    )
    db.add(new_pk)
    db.commit()
    db.refresh(new_pk)
    return new_pk


@router.patch("/{itinerary_id}/packing/{item_id}/toggle", response_model=PackingItemResponse)
def toggle_packing_item(
    itinerary_id: str,
    item_id: str,
    db: Session = Depends(get_db)
):
    """Toggle packed state of an item."""
    item = db.query(PackingItemModel).filter(
        PackingItemModel.id == item_id,
        PackingItemModel.itinerary_id == itinerary_id
    ).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Packing item not found")

    item.is_packed = not item.is_packed
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{itinerary_id}/packing/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_packing_item(
    itinerary_id: str,
    item_id: str,
    db: Session = Depends(get_db)
):
    """Delete an item from the packing list."""
    item = db.query(PackingItemModel).filter(
        PackingItemModel.id == item_id,
        PackingItemModel.itinerary_id == itinerary_id
    ).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Packing item not found")

    db.delete(item)
    db.commit()
    return None
