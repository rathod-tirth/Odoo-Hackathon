from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import DestinationModel
from ..schemas import DestinationCreate, DestinationResponse, DestinationBase

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])

@router.get("", response_model=List[DestinationResponse])
def get_destinations(
    vibe: Optional[str] = Query(None, description="Filter by travel vibe"),
    continent: Optional[str] = Query(None, description="Filter by continent"),
    search: Optional[str] = Query(None, description="Search by name, country, or tagline"),
    featured_only: Optional[bool] = Query(False, alias="featuredOnly"),
    db: Session = Depends(get_db)
):
    """Retrieve all destinations with optional vibe, continent, and search filters."""
    query = db.query(DestinationModel)

    if featured_only:
        query = query.filter(DestinationModel.featured == True)

    if continent and continent != "All":
        query = query.filter(DestinationModel.continent.ilike(continent))

    results = query.all()

    # Filter vibes (stored as JSON list)
    if vibe and vibe != "All":
        results = [d for d in results if d.vibes and vibe in d.vibes]

    # Search filter
    if search and search.strip():
        q = search.strip().lower()
        results = [
            d for d in results
            if q in d.name.lower() or q in d.country.lower() or q in d.tagline.lower() or q in d.description.lower()
        ]

    return results


@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination_by_id(destination_id: str, db: Session = Depends(get_db)):
    """Retrieve a single destination by its ID."""
    destination = db.query(DestinationModel).filter(DestinationModel.id == destination_id).first()
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with ID '{destination_id}' not found"
        )
    return destination


@router.post("", response_model=DestinationResponse, status_code=status.HTTP_201_CREATED)
def create_destination(dest_data: DestinationCreate, db: Session = Depends(get_db)):
    """Create a new travel destination."""
    new_dest = DestinationModel(
        name=dest_data.name,
        country=dest_data.country,
        continent=dest_data.continent,
        tagline=dest_data.tagline,
        description=dest_data.description,
        hero_image=dest_data.hero_image,
        gallery=dest_data.gallery,
        vibes=dest_data.vibes,
        average_daily_cost=dest_data.average_daily_cost,
        currency=dest_data.currency,
        recommended_days=dest_data.recommended_days,
        best_months=dest_data.best_months,
        climate=dest_data.climate,
        current_temp=dest_data.current_temp,
        highlights=dest_data.highlights,
        local_etiquette=dest_data.local_etiquette,
        featured=dest_data.featured,
        rating=dest_data.rating
    )
    db.add(new_dest)
    db.commit()
    db.refresh(new_dest)
    return new_dest


@router.put("/{destination_id}", response_model=DestinationResponse)
def update_destination(destination_id: str, dest_data: DestinationCreate, db: Session = Depends(get_db)):
    """Update an existing travel destination."""
    dest = db.query(DestinationModel).filter(DestinationModel.id == destination_id).first()
    if not dest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with ID '{destination_id}' not found"
        )

    for field, value in dest_data.model_dump().items():
        setattr(dest, field, value)

    db.commit()
    db.refresh(dest)
    return dest


@router.delete("/{destination_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_destination(destination_id: str, db: Session = Depends(get_db)):
    """Delete a travel destination."""
    dest = db.query(DestinationModel).filter(DestinationModel.id == destination_id).first()
    if not dest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with ID '{destination_id}' not found"
        )
    db.delete(dest)
    db.commit()
    return None
