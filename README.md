# GlobeTrotter Backend (FastAPI + Pydantic + SQLAlchemy + PostgreSQL)

A high-performance travel itinerary planning backend built with **FastAPI**, **Pydantic v2**, **SQLAlchemy 2.0**, and **PostgreSQL**.

---

## 🚀 Key Features

- **Pydantic Validation**: Strict type-checking, serialization, and input validation schemas.
- **SQLAlchemy Relational ORM**: Relational models with cascade deletes for Destinations, Itineraries, Day Plans, Activities, Expenses, and Packing Items.
- **PostgreSQL / SQLite Connection**: Automatic environment-based DB connection with connection pooling and sqlite fallback for offline/development use.
- **Gemini 2.5 AI Integration**: AI itinerary generator and conversational concierge.
- **Interactive Swagger Docs**: Available at `/api/docs` and Redoc at `/api/redoc`.

---

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Data Validation**: Pydantic v2
- **ORM**: SQLAlchemy 2.0
- **Database Driver**: Psycopg2 / Asyncpg (PostgreSQL)
- **AI Engine**: Google GenAI SDK (`gemini-2.5-flash`)
- **Server**: Uvicorn (ASGI)

---

## 📦 Setup & Run

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables
Create or update `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/globetrotter_db
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Interactive API Documentation
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`
- OpenAPI JSON: `http://localhost:8000/api/openapi.json`

---

## 📡 API Endpoints Catalog

### Destinations (`/api/destinations`)
- `GET /api/destinations`: List destinations (filters: `vibe`, `continent`, `search`, `featuredOnly`).
- `GET /api/destinations/{id}`: Get destination details.
- `POST /api/destinations`: Create a new destination.
- `PUT /api/destinations/{id}`: Update an existing destination.
- `DELETE /api/destinations/{id}`: Delete a destination.

### Itineraries (`/api/itineraries`)
- `GET /api/itineraries`: List user itineraries (filters: `status`, `destination`).
- `GET /api/itineraries/{id}`: Get full itinerary with days, activities, expenses, and packing list.
- `POST /api/itineraries`: Create new itinerary with nested days, activities, expenses, and packing items.
- `PUT /api/itineraries/{id}`: Update itinerary metadata or nested components.
- `DELETE /api/itineraries/{id}`: Delete itinerary.
- `POST /api/itineraries/{id}/duplicate`: Duplicate itinerary into a draft copy.

### Activities & Days
- `POST /api/itineraries/{id}/days/{day_number}/activities`: Add activity to a day.
- `PATCH /api/itineraries/{id}/activities/{activity_id}/complete`: Toggle activity completion.
- `DELETE /api/itineraries/{id}/activities/{activity_id}`: Remove activity.

### Expenses & Packing
- `POST /api/itineraries/{id}/expenses`: Add expense.
- `PATCH /api/itineraries/{id}/expenses/{expense_id}/toggle-paid`: Toggle expense paid status.
- `DELETE /api/itineraries/{id}/expenses/{expense_id}`: Delete expense.
- `POST /api/itineraries/{id}/packing`: Add packing item.
- `PATCH /api/itineraries/{id}/packing/{item_id}/toggle`: Toggle packed status.
- `DELETE /api/itineraries/{id}/packing/{item_id}`: Delete packing item.

### AI Engine (`/api/ai`)
- `POST /api/ai/generate-itinerary`: Generate a tailored multi-day itinerary with Gemini 2.5 Flash.
- `POST /api/ai/chat`: Real-time AI Travel Concierge conversational guidance.
