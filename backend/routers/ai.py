import os
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ItineraryModel, DayPlanModel, ActivityModel, ExpenseModel, PackingItemModel
from ..schemas import AIGenerateRequest, AIChatRequest, AIChatResponse, ItineraryResponse

router = APIRouter(prefix="/api/ai", tags=["AI Travel Intelligence"])

def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "MY_GEMINI_API_KEY" or api_key.strip() == "":
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print("Gemini client initialization:", e)
        return None


@router.post("/generate-itinerary", response_model=ItineraryResponse, status_code=status.HTTP_201_CREATED)
def generate_itinerary(
    request_data: AIGenerateRequest,
    db: Session = Depends(get_db)
):
    """Generate a high-grade vacation itinerary powered by Gemini 2.5 Flash, saved automatically to database."""
    destination = request_data.destination
    days_count = max(1, min(14, int(request_data.duration_days)))
    budget = request_data.budget
    travel_party = request_data.travel_party
    vibes = request_data.vibes or ["Cultural", "Culinary"]
    interests = request_data.interests or ""
    season = request_data.season_or_month or "Spring"

    client = get_gemini_client()

    parsed_data = None
    if client:
        prompt = f"""You are a world-class luxury and adventure travel curator for GlobeTrotter.
Create a comprehensive, breathtaking {days_count}-day travel itinerary for "{destination}".
Context & Preferences:
- Duration: {days_count} days
- Budget Level: {budget}
- Travel Party: {travel_party}
- Desired Vibes: {', '.join(vibes)}
- Specific Interests / Notes: {interests or 'Must-see landmarks, authentic local food, hidden photo spots, relaxing rhythm'}
- Travel Season/Month: {season}

Return ONLY valid JSON adhering strictly to this JSON structure:
{{
  "title": "Inspiring trip title",
  "tagline": "A compelling 1-sentence description",
  "destination": "{destination}",
  "country": "Country name",
  "continent": "Asia | Europe | Americas | Africa | Oceania",
  "coverImage": "High quality Unsplash photo URL relevant to the destination",
  "totalBudget": 2000,
  "currency": "USD",
  "vibes": {json.dumps(vibes)},
  "notes": "Key travel tips, transportation advice, local etiquette",
  "days": [
    {{
      "dayNumber": 1,
      "title": "Day title",
      "theme": "Day theme",
      "overview": "Summary of today's adventures",
      "accommodation": {{
        "name": "Recommended hotel or boutique stay",
        "address": "Neighborhood/Area",
        "costPerNight": 180
      }},
      "activities": [
        {{
          "title": "Activity name",
          "timeOfDay": "Morning",
          "time": "09:00",
          "duration": "2.5 hrs",
          "location": "Specific location",
          "description": "Engaging description",
          "estimatedCost": 20,
          "currency": "USD",
          "category": "Activities",
          "bookingStatus": "Not Needed",
          "transitNotes": "Transit notes"
        }}
      ]
    }}
  ],
  "expenses": [
    {{
      "title": "Estimated Flights",
      "category": "Flights",
      "amount": 450,
      "currency": "USD",
      "isPaid": false
    }}
  ],
  "packingList": [
    {{ "name": "Passport & Visas", "category": "Documents", "isPacked": false }}
  ]
}}"""
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            if response.text:
                parsed_data = json.loads(response.text)
        except Exception as e:
            print("Gemini generation error, falling back to smart engine:", e)

    # If Gemini wasn't available or failed, construct smart tailored itinerary
    if not parsed_data:
        daily_cost = 350 if budget == "Luxury" else 80 if budget == "Budget" else 180
        total_est = (daily_cost * days_count) + 500
        days_list = []
        for i in range(1, days_count + 1):
            days_list.append({
                "dayNumber": i,
                "title": f"Day {i}: Exploring {destination}" if i > 1 else f"Arrival & First Discoveries in {destination}",
                "theme": "Landmarks & Local Flavors" if i % 2 == 0 else "Culture, Heritage & Sunset Walk",
                "overview": f"A rich daytime schedule discovering the sights, tastes, and hidden corners of {destination}.",
                "accommodation": {
                    "name": f"{destination} Grand Boutique Hotel",
                    "address": f"Historic Center, {destination}",
                    "costPerNight": round(daily_cost * 0.5)
                },
                "activities": [
                    {
                        "title": f"Morning Highlights & Scenic Walk" if i > 1 else f"Check-in & Historic Old Town Stroll",
                        "timeOfDay": "Morning",
                        "time": "09:00",
                        "duration": "2.5 hrs",
                        "location": f"Central District, {destination}",
                        "description": f"Explore iconic cobblestone alleys, local markets, and historic architecture in {destination}.",
                        "estimatedCost": 15.0,
                        "currency": "USD",
                        "category": "Activities",
                        "bookingStatus": "Not Needed",
                        "transitNotes": "Short walk or local tram"
                    },
                    {
                        "title": "Artisanal Lunch & Heritage Site Visit",
                        "timeOfDay": "Afternoon",
                        "time": "13:00",
                        "duration": "3 hrs",
                        "location": f"Cultural Quarter, {destination}",
                        "description": f"Savor signature dishes followed by a guided tour of renowned monuments or galleries.",
                        "estimatedCost": 35.0,
                        "currency": "USD",
                        "category": "Dining",
                        "bookingStatus": "Booked"
                    },
                    {
                        "title": "Sunset Viewpoint & Signature Dinner",
                        "timeOfDay": "Evening",
                        "time": "19:00",
                        "duration": "2 hrs",
                        "location": f"Panoramic Promenade, {destination}",
                        "description": f"Enjoy sunset panoramas over {destination} paired with regional culinary specialties.",
                        "estimatedCost": 55.0,
                        "currency": "USD",
                        "category": "Dining",
                        "bookingStatus": "Need to Book"
                    }
                ]
            })

        parsed_data = {
            "title": f"{destination}: {days_count}-Day {vibes[0] if vibes else 'Dream'} Expedition",
            "tagline": f"An immersive {days_count}-day journey tailored for {travel_party} travelers.",
            "destination": destination,
            "country": destination,
            "continent": "Europe",
            "coverImage": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
            "totalBudget": total_est,
            "currency": "USD",
            "vibes": vibes,
            "notes": f"Tailored for {travel_party} travel in {season}. Book dining reservations in advance.",
            "days": days_list,
            "expenses": [
                {"title": "Flights / Main Transit", "category": "Flights", "amount": 420.0, "currency": "USD", "isPaid": True},
                {"title": f"Accommodations ({days_count} Nights)", "category": "Stays", "amount": round(daily_cost * 0.5 * days_count), "currency": "USD", "isPaid": False},
                {"title": "Tours & Entry Tickets", "category": "Activities", "amount": round(daily_cost * 0.25 * days_count), "currency": "USD", "isPaid": False},
                {"title": "Food & Dining Experience", "category": "Dining", "amount": round(daily_cost * 0.25 * days_count), "currency": "USD", "isPaid": False}
            ],
            "packingList": [
                {"name": "Passport & Travel Documents", "category": "Documents", "isPacked": True},
                {"name": "Universal Power Adapter", "category": "Tech", "isPacked": True},
                {"name": "Comfortable Walking Shoes", "category": "Clothing", "isPacked": False},
                {"name": "Weather Layering Jacket", "category": "Clothing", "isPacked": False},
                {"name": "Refillable Bottle & Sunscreen", "category": "Essentials", "isPacked": False}
            ]
        }

    # Save to database
    new_id = f"trip-ai-{int(os.times().elapsed * 1000)}"
    itinerary_record = ItineraryModel(
        id=new_id,
        title=parsed_data.get("title", f"{destination} Vacation"),
        tagline=parsed_data.get("tagline", f"Exciting trip to {destination}"),
        destination=parsed_data.get("destination", destination),
        country=parsed_data.get("country", destination),
        continent=parsed_data.get("continent", "Europe"),
        cover_image=parsed_data.get("coverImage", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80"),
        start_date=f"2025-06-01",
        end_date=f"2025-06-0{min(9, days_count)}",
        total_days=days_count,
        travel_party=travel_party,
        vibes=parsed_data.get("vibes", vibes),
        total_budget=float(parsed_data.get("totalBudget", 1800)),
        currency="USD",
        status="Upcoming",
        notes=parsed_data.get("notes", "")
    )
    db.add(itinerary_record)
    db.flush()

    # Save Days
    for day in parsed_data.get("days", []):
        day_model = DayPlanModel(
            id=f"day-{new_id}-{day.get('dayNumber', 1)}",
            itinerary_id=new_id,
            day_number=day.get("dayNumber", 1),
            title=day.get("title", f"Day {day.get('dayNumber', 1)}"),
            theme=day.get("theme", ""),
            overview=day.get("overview", ""),
            accommodation=day.get("accommodation")
        )
        db.add(day_model)
        db.flush()

        for act in day.get("activities", []):
            act_model = ActivityModel(
                id=f"act-{new_id}-{day_model.day_number}-{len(day_model.activities) + 1}",
                day_plan_id=day_model.id,
                itinerary_id=new_id,
                title=act.get("title", "Activity"),
                time_of_day=act.get("timeOfDay", "Morning"),
                time=act.get("time", "09:00"),
                duration=act.get("duration", "2 hrs"),
                location=act.get("location", destination),
                description=act.get("description", ""),
                estimated_cost=float(act.get("estimatedCost", 0)),
                currency="USD",
                category=act.get("category", "Activities"),
                booking_status=act.get("bookingStatus", "Not Needed"),
                transit_notes=act.get("transitNotes", "")
            )
            db.add(act_model)

    # Save Expenses
    for exp in parsed_data.get("expenses", []):
        exp_model = ExpenseModel(
            id=f"exp-{new_id}-{len(itinerary_record.expenses) + 1}",
            itinerary_id=new_id,
            title=exp.get("title", "Expense"),
            category=exp.get("category", "Activities"),
            amount=float(exp.get("amount", 0)),
            currency="USD",
            is_paid=exp.get("isPaid", False)
        )
        db.add(exp_model)

    # Save Packing
    for pk in parsed_data.get("packingList", []):
        pk_model = PackingItemModel(
            id=f"pk-{new_id}-{len(itinerary_record.packing_list) + 1}",
            itinerary_id=new_id,
            name=pk.get("name", "Item"),
            category=pk.get("category", "Essentials"),
            is_packed=pk.get("isPacked", False)
        )
        db.add(pk_model)

    db.commit()
    db.refresh(itinerary_record)
    return itinerary_record


@router.post("/chat", response_model=AIChatResponse)
def concierge_chat(request_data: AIChatRequest):
    """Conversational AI Concierge for real-time recommendations and travel tips."""
    client = get_gemini_client()
    user_msg = request_data.message
    dest = request_data.active_destination or "Global travel"
    trip_title = request_data.active_itinerary_title or "Dream Vacation"

    if client:
        history_text = "\n".join([f"{h.role}: {h.content}" for h in request_data.conversation_history[-6:]])
        prompt = f"""You are "GlobeTrotter Concierge", an expert travel advisor, sommelier, and local insider.
Active Trip: {trip_title} in {dest}

Recent Conversation:
{history_text}

User Query: "{user_msg}"

Provide a warm, highly concise, structured response with bullet points, neighborhood names, best times to visit, and local etiquette tips."""
        try:
            res = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            if res.text:
                return AIChatResponse(success=True, reply=res.text, source="gemini-2.5-flash")
        except Exception as e:
            print("Gemini chat error:", e)

    # Fallback reply
    return AIChatResponse(
        success=True,
        reply=f"For {dest}, I recommend checking local morning markets for authentic culinary specialties and reserving popular monuments or viewpoints during sunset (around 18:30) for spectacular golden hour photos.",
        source="concierge-local"
    )
