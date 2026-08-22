import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .database import engine, Base, SessionLocal
from .models import DestinationModel, ItineraryModel, DayPlanModel, ActivityModel, ExpenseModel, PackingItemModel
from .routers import destinations, itineraries, ai

# Initial Seed Data for auto-populating DB
INITIAL_DESTINATIONS = [
    {
        "id": "dest-tokyo",
        "name": "Tokyo & Kyoto",
        "country": "Japan",
        "continent": "Asia",
        "tagline": "Neon Metropolises, Ancient Shrines & Culinary Perfection",
        "description": "Experience Japan's mesmerizing fusion of hyper-modern innovation and centuries-old Zen tradition. From early morning Tsukiji market sushi and vibrant Harajuku alleys to Kyoto's serene bamboo groves and Michelin-starred ramen counters.",
        "hero_image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80"
        ],
        "vibes": ["Cultural", "Culinary", "City Break"],
        "average_daily_cost": 175.0,
        "currency": "USD",
        "recommended_days": 8,
        "best_months": ["March", "April", "October", "November"],
        "climate": "Subtropical & Temperate",
        "current_temp": "19°C (66°F)",
        "highlights": ["Fushimi Inari Torii Gates", "Shibuya Crossing", "Tsukiji Outer Market", "Arashiyama Bamboo Forest", "Robot Restaurant Shinjuku"],
        "local_etiquette": ["No tipping in restaurants", "Keep voices low on subway trains", "Remove shoes when entering traditional tatami rooms"],
        "featured": True,
        "rating": 4.95
    },
    {
        "id": "dest-amalfi",
        "name": "Amalfi Coast & Capri",
        "country": "Italy",
        "continent": "Europe",
        "tagline": "Pastel Clifftops, Limoncello Groves & Turquoise Seas",
        "description": "The quintessential Mediterranean dream. Sun-drenched pastel villages cascading down sheer cliffs into the Tyrrhenian Sea, scenic vintage convertible drives along the coastal highway, and fresh handmade seafood pasta paired with crisp regional white wines.",
        "hero_image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
        ],
        "vibes": ["Coastal", "Romantic", "Culinary"],
        "average_daily_cost": 260.0,
        "currency": "EUR",
        "recommended_days": 6,
        "best_months": ["May", "June", "September", "October"],
        "climate": "Mediterranean Sun",
        "current_temp": "24°C (75°F)",
        "highlights": ["Positano Spiaggia Grande", "Capri Blue Grotto Boat Charter", "Path of the Gods Clifftop Hike", "Ravello Villa Cimbrone Gardens"],
        "local_etiquette": ["Dress elegantly for evening dinners", "Validate train and ferry tickets before boarding", "Say 'Buongiorno' when entering shops"],
        "featured": True,
        "rating": 4.92
    },
    {
        "id": "dest-swiss-alps",
        "name": "Swiss Alps & Zermatt",
        "country": "Switzerland",
        "continent": "Europe",
        "tagline": "Iconic Matterhorn Peaks, Glacier Express & Alpine Luxury",
        "description": "Pristine crystalline alpine lakes, soaring snow-capped peaks, panoramic cogwheel railways, and world-class fondue chalets nestled beneath the majestic Matterhorn.",
        "hero_image": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1400&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80"
        ],
        "vibes": ["Adventure", "Nature", "Wellness"],
        "average_daily_cost": 310.0,
        "currency": "CHF",
        "recommended_days": 5,
        "best_months": ["January", "February", "July", "August", "September"],
        "climate": "Alpine / Crisp Mountain",
        "current_temp": "14°C (57°F)",
        "highlights": ["Gornergrat Matterhorn Railway", "Glacier 3000 Suspension Bridge", "Lake Oeschinen Rowboat", "Zermatt Car-Free Village"],
        "local_etiquette": ["Punctuality is strictly observed", "Recycle thoroughly according to chalet guidelines"],
        "featured": True,
        "rating": 4.97
    }
]

def seed_initial_database():
    db = SessionLocal()
    try:
        # Check if destinations already seeded
        count = db.query(DestinationModel).count()
        if count == 0:
            print("Seeding initial destinations into database...")
            for dest_info in INITIAL_DESTINATIONS:
                dest = DestinationModel(**dest_info)
                db.add(dest)
            db.commit()
            print("Successfully seeded initial destinations.")
    except Exception as e:
        print("Database seed notice:", e)
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLAlchemy database tables
    Base.metadata.create_all(bind=engine)
    seed_initial_database()
    yield

app = FastAPI(
    title="GlobeTrotter Travel Itinerary API",
    description="Full-stack FastAPI, Pydantic & SQLAlchemy PostgreSQL Backend for managing vacations, multi-day itineraries, dynamic activities, real-time expenses, and AI concierge.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Middleware for seamless frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(destinations.router)
app.include_router(itineraries.router)
app.include_router(ai.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check status endpoint."""
    return {
        "status": "healthy",
        "service": "GlobeTrotter FastAPI Backend",
        "framework": "FastAPI with SQLAlchemy & PostgreSQL / SQLite",
        "version": "1.0.0"
    }

@app.get("/api/stats", tags=["System"])
def system_stats():
    """Get system summary metrics."""
    db = SessionLocal()
    try:
        dest_count = db.query(DestinationModel).count()
        itin_count = db.query(ItineraryModel).count()
        act_count = db.query(ActivityModel).count()
        return {
            "success": True,
            "destinations_count": dest_count,
            "itineraries_count": itin_count,
            "activities_count": act_count
        }
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
