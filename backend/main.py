from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Globe Trotter API", version="1.0.0")

@app.get("/")
def root():
    return {"message": "Globe Trotter API is running"}

# --- USER ENDPOINTS ---
@app.post("/users", response_model=schemas.UserResponse, status_code=status.HTTP_21_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Password hashing should be applied here in production
    new_user = models.User(
        email=user.email,
        password_hash=user.password, 
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --- TRIP ENDPOINTS ---
@app.post("/users/{user_id}/trips", response_model=schemas.TripResponse, status_code=status.HTTP_21_CREATED)
def create_trip(user_id: UUID, trip: schemas.TripCreate, db: Session = Depends(get_db)):
    new_trip = models.Trip(**trip.model_dump(), user_id=user_id)
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip

@app.get("/users/{user_id}/trips", response_model=List[schemas.TripResponse])
def get_user_trips(user_id: UUID, db: Session = Depends(get_db)):
    return db.query(models.Trip).filter(models.Trip.user_id == user_id).all()

# --- CITY ENDPOINTS ---
@app.get("/cities", response_model=List[schemas.CityResponse])
def get_cities(db: Session = Depends(get_db)):
    return db.query(models.City).all()