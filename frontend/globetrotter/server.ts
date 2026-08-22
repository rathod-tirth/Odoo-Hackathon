import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { SEED_DESTINATIONS, SEED_ITINERARIES } from './src/data/seedData';
import { Destination, Itinerary, AIGenerateTripRequest } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with seed data
let itinerariesStore: Itinerary[] = [...SEED_ITINERARIES];
let destinationsStore: Destination[] = [...SEED_DESTINATIONS];

// Lazy Gemini AI client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// ----------------------------------------------------
// REST API: Destinations
// ----------------------------------------------------
app.get('/api/destinations', (req, res) => {
  const { vibe, continent, search } = req.query;
  let results = [...destinationsStore];

  if (vibe && typeof vibe === 'string' && vibe !== 'All') {
    results = results.filter((d) => d.vibes.includes(vibe as any));
  }

  if (continent && typeof continent === 'string' && continent !== 'All') {
    results = results.filter((d) => d.continent.toLowerCase() === continent.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: results });
});

app.get('/api/destinations/:id', (req, res) => {
  const destination = destinationsStore.find((d) => d.id === req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, error: 'Destination not found' });
  }
  res.json({ success: true, data: destination });
});

app.post('/api/destinations', (req, res) => {
  const newDest: Destination = {
    ...req.body,
    id: req.body.id || `dest-${Date.now()}`,
    gallery: req.body.gallery || [],
    vibes: req.body.vibes || ['Cultural'],
    highlights: req.body.highlights || [],
    localEtiquette: req.body.localEtiquette || [],
    rating: req.body.rating || 4.8
  };
  destinationsStore.unshift(newDest);
  res.status(201).json({ success: true, data: newDest });
});

app.put('/api/destinations/:id', (req, res) => {
  const index = destinationsStore.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Destination not found' });
  }
  destinationsStore[index] = { ...destinationsStore[index], ...req.body };
  res.json({ success: true, data: destinationsStore[index] });
});

app.delete('/api/destinations/:id', (req, res) => {
  const index = destinationsStore.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Destination not found' });
  }
  const deleted = destinationsStore.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

// ----------------------------------------------------
// REST API: Itineraries
// ----------------------------------------------------
app.get('/api/itineraries', (req, res) => {
  const { status: statusFilter, destination } = req.query;
  let results = [...itinerariesStore];

  if (statusFilter && typeof statusFilter === 'string' && statusFilter !== 'All') {
    results = results.filter((i) => i.status.toLowerCase() === statusFilter.toLowerCase());
  }

  if (destination && typeof destination === 'string') {
    results = results.filter((i) => i.destination.toLowerCase().includes(destination.toLowerCase()));
  }

  res.json({ success: true, data: results });
});

app.get('/api/itineraries/:id', (req, res) => {
  const item = itinerariesStore.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  res.json({ success: true, data: item });
});

app.post('/api/itineraries', (req, res) => {
  const newItinerary: Itinerary = {
    ...req.body,
    id: req.body.id || `trip-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: req.body.status || 'Upcoming',
    expenses: req.body.expenses || [],
    packingList: req.body.packingList || [],
    days: req.body.days || []
  };

  itinerariesStore.unshift(newItinerary);
  res.status(201).json({ success: true, data: newItinerary });
});

app.put('/api/itineraries/:id', (req, res) => {
  const index = itinerariesStore.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }

  const updated: Itinerary = {
    ...itinerariesStore[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  itinerariesStore[index] = updated;
  res.json({ success: true, data: updated });
});

app.delete('/api/itineraries/:id', (req, res) => {
  const index = itinerariesStore.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }

  const deleted = itinerariesStore.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

app.post('/api/itineraries/:id/duplicate', (req, res) => {
  const original = itinerariesStore.find((i) => i.id === req.params.id);
  if (!original) {
    return res.status(404).json({ success: false, error: 'Original itinerary not found' });
  }

  const duplicated: Itinerary = {
    ...JSON.parse(JSON.stringify(original)),
    id: `trip-copy-${Date.now()}`,
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Draft'
  };

  itinerariesStore.unshift(duplicated);
  res.status(201).json({ success: true, data: duplicated });
});

// Granular Activity Endpoints
app.post('/api/itineraries/:id/days/:dayNumber/activities', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  const dayNum = parseInt(req.params.dayNumber, 10);
  let targetDay = itin.days.find((d) => d.dayNumber === dayNum);
  if (!targetDay) {
    targetDay = {
      dayNumber: dayNum,
      title: `Day ${dayNum}`,
      activities: []
    };
    itin.days.push(targetDay);
  }

  const newActivity = {
    ...req.body,
    id: req.body.id || `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    isCompleted: req.body.isCompleted || false
  };
  targetDay.activities.push(newActivity);
  itin.updatedAt = new Date().toISOString();
  res.status(201).json({ success: true, data: newActivity });
});

app.patch('/api/itineraries/:id/activities/:activityId/complete', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  let found = null;
  for (const day of itin.days) {
    const act = day.activities.find((a) => a.id === req.params.activityId);
    if (act) {
      act.isCompleted = !act.isCompleted;
      found = act;
      break;
    }
  }
  if (!found) {
    return res.status(404).json({ success: false, error: 'Activity not found' });
  }
  itin.updatedAt = new Date().toISOString();
  res.json({ success: true, data: found });
});

app.delete('/api/itineraries/:id/activities/:activityId', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  let deleted = false;
  for (const day of itin.days) {
    const idx = day.activities.findIndex((a) => a.id === req.params.activityId);
    if (idx !== -1) {
      day.activities.splice(idx, 1);
      deleted = true;
      break;
    }
  }
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Activity not found' });
  }
  itin.updatedAt = new Date().toISOString();
  res.json({ success: true, message: 'Activity removed' });
});

// Granular Expense Endpoints
app.post('/api/itineraries/:id/expenses', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  const newExp = {
    ...req.body,
    id: req.body.id || `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    amount: Number(req.body.amount) || 0,
    isPaid: Boolean(req.body.isPaid)
  };
  itin.expenses.push(newExp);
  itin.updatedAt = new Date().toISOString();
  res.status(201).json({ success: true, data: newExp });
});

app.patch('/api/itineraries/:id/expenses/:expenseId/toggle-paid', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  const exp = itin.expenses.find((e) => e.id === req.params.expenseId);
  if (!exp) {
    return res.status(404).json({ success: false, error: 'Expense not found' });
  }
  exp.isPaid = !exp.isPaid;
  itin.updatedAt = new Date().toISOString();
  res.json({ success: true, data: exp });
});

app.delete('/api/itineraries/:id/expenses/:expenseId', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  const idx = itin.expenses.findIndex((e) => e.id === req.params.expenseId);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Expense not found' });
  }
  itin.expenses.splice(idx, 1);
  itin.updatedAt = new Date().toISOString();
  res.json({ success: true, message: 'Expense deleted' });
});

// Granular Packing Endpoints
app.post('/api/itineraries/:id/packing', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  const newPk = {
    ...req.body,
    id: req.body.id || `pk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    isPacked: Boolean(req.body.isPacked),
    isCustom: true
  };
  itin.packingList.push(newPk);
  itin.updatedAt = new Date().toISOString();
  res.status(201).json({ success: true, data: newPk });
});

app.patch('/api/itineraries/:id/packing/:itemId/toggle', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  const pk = itin.packingList.find((p) => p.id === req.params.itemId);
  if (!pk) {
    return res.status(404).json({ success: false, error: 'Packing item not found' });
  }
  pk.isPacked = !pk.isPacked;
  itin.updatedAt = new Date().toISOString();
  res.json({ success: true, data: pk });
});

app.delete('/api/itineraries/:id/packing/:itemId', (req, res) => {
  const itin = itinerariesStore.find((i) => i.id === req.params.id);
  if (!itin) {
    return res.status(404).json({ success: false, error: 'Itinerary not found' });
  }
  const idx = itin.packingList.findIndex((p) => p.id === req.params.itemId);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Packing item not found' });
  }
  itin.packingList.splice(idx, 1);
  itin.updatedAt = new Date().toISOString();
  res.json({ success: true, message: 'Item deleted' });
});

// System & Health Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'GlobeTrotter Full-Stack API Engine',
    framework: 'Express + FastAPI Compatible Schemas',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    destinationsCount: destinationsStore.length,
    itinerariesCount: itinerariesStore.length,
    activeTripsCount: itinerariesStore.filter((i) => i.status === 'Active').length
  });
});

// ----------------------------------------------------
// AI Travel Planner & Generator
// ----------------------------------------------------
app.post('/api/ai/generate-itinerary', async (req, res) => {
  try {
    const params: AIGenerateTripRequest = req.body;
    const { destination, durationDays = 4, budget = 'Moderate', travelParty = 'Couple', vibes = ['Cultural'], interests = '', seasonOrMonth = 'Spring' } = params;

    const daysCount = Math.min(Math.max(Number(durationDays) || 3, 1), 14);
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are a world-class luxury and adventure travel curator for GlobeTrotter.
Create a comprehensive, breathtaking ${daysCount}-day travel itinerary for "${destination}".
Context & Preferences:
- Duration: ${daysCount} days
- Budget Level: ${budget}
- Travel Party: ${travelParty}
- Desired Vibes: ${vibes.join(', ')}
- Specific Interests / Notes: ${interests || 'Must-see landmarks, authentic local food, hidden photo spots, relaxing rhythm'}
- Travel Season/Month: ${seasonOrMonth}

Return ONLY valid JSON adhering strictly to this TypeScript structure:
{
  "title": "Inspiring trip title",
  "tagline": "A compelling 1-sentence description",
  "destination": "${destination}",
  "country": "Country name",
  "continent": "Asia | Europe | Americas | Africa | Oceania",
  "coverImage": "High quality Unsplash photo URL relevant to the destination",
  "totalBudget": estimated total numeric budget in USD,
  "currency": "USD",
  "vibes": ["${vibes[0] || 'Cultural'}", "${vibes[1] || 'Culinary'}"],
  "notes": "Key travel tips, transportation advice, local etiquette",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day title",
      "theme": "Day theme",
      "overview": "Summary of today's adventures",
      "accommodation": {
        "name": "Recommended hotel or boutique stay",
        "address": "Neighborhood/Area",
        "costPerNight": number
      },
      "activities": [
        {
          "id": "act-1-1",
          "title": "Activity name",
          "timeOfDay": "Morning | Afternoon | Evening | Night",
          "time": "09:00",
          "duration": "2.5 hrs",
          "location": "Specific location or neighborhood",
          "description": "Engaging description of what to experience, secret tips, and what to eat/see",
          "estimatedCost": number,
          "currency": "USD",
          "category": "Activities | Dining | Transit | Shopping | Stays",
          "bookingStatus": "Need to Book | Booked | Not Needed | Optional",
          "transitNotes": "How to get here easily"
        }
      ]
    }
  ],
  "expenses": [
    {
      "id": "exp-1",
      "title": "Estimated Flights",
      "category": "Flights",
      "amount": number,
      "currency": "USD",
      "isPaid": false
    },
    {
      "id": "exp-2",
      "title": "Accommodations",
      "category": "Stays",
      "amount": number,
      "currency": "USD",
      "isPaid": false
    },
    {
      "id": "exp-3",
      "title": "Activities & Admissions",
      "category": "Activities",
      "amount": number,
      "currency": "USD",
      "isPaid": false
    },
    {
      "id": "exp-4",
      "title": "Food & Dining Experience",
      "category": "Dining",
      "amount": number,
      "currency": "USD",
      "isPaid": false
    }
  ],
  "packingList": [
    { "id": "pk-1", "name": "Passport & Visas", "category": "Documents", "isPacked": false },
    { "id": "pk-2", "name": "Universal Power Adapter", "category": "Tech", "isPacked": false },
    { "id": "pk-3", "name": "Comfortable Walking Shoes", "category": "Clothing", "isPacked": false },
    { "id": "pk-4", "name": "Sunscreen & Sunglasses", "category": "Essentials", "isPacked": false },
    { "id": "pk-5", "name": "Lightweight Rain Shell", "category": "Clothing", "isPacked": false }
  ]
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          // Format into complete Itinerary
          const createdItinerary: Itinerary = {
            id: `trip-ai-${Date.now()}`,
            title: parsed.title || `${destination} Dream Vacation`,
            tagline: parsed.tagline || `An unforgettable ${daysCount}-day getaway in ${destination}.`,
            destination: parsed.destination || destination,
            country: parsed.country || destination,
            continent: parsed.continent || 'Europe',
            coverImage: parsed.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + daysCount * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalDays: daysCount,
            travelParty: travelParty as any,
            vibes: parsed.vibes || (vibes.length > 0 ? vibes : ['Cultural', 'Culinary']),
            totalBudget: Number(parsed.totalBudget) || 1800,
            currency: 'USD',
            status: 'Upcoming',
            days: parsed.days || [],
            expenses: parsed.expenses || [],
            packingList: parsed.packingList || [],
            notes: parsed.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          itinerariesStore.unshift(createdItinerary);
          return res.json({ success: true, data: createdItinerary, generatedBy: 'gemini-2.5-flash' });
        }
      } catch (geminiErr) {
        console.error('Gemini generation error, using fallback builder:', geminiErr);
      }
    }

    // High quality intelligent fallback builder
    const fallbackItinerary = buildSmartFallbackItinerary(destination, daysCount, budget, travelParty, vibes, interests);
    itinerariesStore.unshift(fallbackItinerary);
    return res.json({ success: true, data: fallbackItinerary, generatedBy: 'smart-template-engine' });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate itinerary' });
  }
});

// AI Chat Concierge Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, activeDestination, activeItineraryTitle, conversationHistory = [] } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const historyText = conversationHistory
          .slice(-6)
          .map((m: any) => `${m.role === 'user' ? 'User' : 'GlobeTrotter AI'}: ${m.content}`)
          .join('\n');

        const prompt = `You are "GlobeTrotter Concierge", an expert travel advisor, culinary connoisseur, and local guide.
The user is asking about their vacation/itinerary.
Active Destination context: ${activeDestination || 'General travel'}
Active Itinerary title: ${activeItineraryTitle || 'Dream Vacation'}

Recent conversation:
${historyText}

User Query: "${message}"

Give a warm, highly actionable, concise response with bullet points if helpful. Include specific neighborhood recommendations, timing tips, local food specialties, or etiquette tips. Suggest 2-3 quick follow-up questions or actions.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        const reply = response.text || "I'd love to help you plan that! Let me know if you need specific restaurant picks or route suggestions.";
        return res.json({ success: true, reply, source: 'gemini' });
      } catch (err) {
        console.error('Gemini chat error:', err);
      }
    }

    // Smart fallback concierge reply
    const fallbackReply = generateConciergeFallback(message, activeDestination);
    res.json({ success: true, reply: fallbackReply, source: 'concierge-local' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to process chat' });
  }
});

// Helper for Smart Fallback Itinerary
function buildSmartFallbackItinerary(
  destination: string,
  daysCount: number,
  budget: any,
  travelParty: string,
  vibes: any[],
  interests?: string
): Itinerary {
  const destLower = destination.toLowerCase();
  let country = 'Global';
  let continent = 'Europe';
  let coverImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80';

  if (destLower.includes('tokyo') || destLower.includes('japan') || destLower.includes('kyoto')) {
    country = 'Japan';
    continent = 'Asia';
    coverImage = 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=80';
  } else if (destLower.includes('paris') || destLower.includes('france')) {
    country = 'France';
    continent = 'Europe';
    coverImage = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80';
  } else if (destLower.includes('italy') || destLower.includes('rome') || destLower.includes('amalfi') || destLower.includes('florence')) {
    country = 'Italy';
    continent = 'Europe';
    coverImage = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80';
  } else if (destLower.includes('bali') || destLower.includes('indonesia')) {
    country = 'Indonesia';
    continent = 'Asia';
    coverImage = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80';
  } else if (destLower.includes('switzerland') || destLower.includes('alps')) {
    country = 'Switzerland';
    continent = 'Europe';
    coverImage = 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1400&q=80';
  } else if (destLower.includes('santorini') || destLower.includes('greece')) {
    country = 'Greece';
    continent = 'Europe';
    coverImage = 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80';
  }

  const dailyBudget = budget === 'Luxury' ? 350 : budget === 'Budget' ? 80 : 180;
  const totalBudget = dailyBudget * daysCount + 600;

  const days = [];
  for (let i = 1; i <= daysCount; i++) {
    days.push({
      dayNumber: i,
      title: i === 1 ? `Arrival & First Impressions of ${destination}` : i === daysCount ? `Farewell Discoveries & Departure` : `Immersive Highlights of ${destination} - Part ${i}`,
      theme: i === 1 ? 'Settling in & Golden Hour' : i === 2 ? 'Iconic Landmarks & Local Delicacies' : 'Hidden Gems & Scenic Vistas',
      overview: `Experience the vibrant sights, distinct flavors, and cultural warmth of ${destination} with our curated daytime schedule.`,
      accommodation: {
        name: `${destination} Boutique Suites`,
        address: `City Center, ${destination}`,
        costPerNight: Math.round(dailyBudget * 0.5)
      },
      activities: [
        {
          id: `act-${i}-1`,
          title: i === 1 ? `Check-in & Neighborhood Walk` : `Morning Exploration & Landmark Tour`,
          timeOfDay: 'Morning' as const,
          time: '09:00',
          duration: '2.5 hrs',
          location: `${destination} Central Quarter`,
          description: `Kickstart your day exploring vibrant morning markets, historic plazas, and local artisanal bakeries or tea shops.`,
          estimatedCost: 15,
          currency: 'USD',
          category: 'Activities' as const,
          bookingStatus: 'Not Needed' as const,
          transitNotes: 'Easily accessible via local transit or scenic walk'
        },
        {
          id: `act-${i}-2`,
          title: `Artisanal Lunch & Cultural Museum / Scenic Viewpoint`,
          timeOfDay: 'Afternoon' as const,
          time: '13:00',
          duration: '3 hrs',
          location: `Historic District, ${destination}`,
          description: `Savor signature regional cuisine followed by guided entry into iconic heritage monuments or panoramic observation points.`,
          estimatedCost: 35,
          currency: 'USD',
          category: 'Dining' as const,
          bookingStatus: 'Booked' as const
        },
        {
          id: `act-${i}-3`,
          title: `Sunset Golden Hour & Atmospheric Dinner`,
          timeOfDay: 'Evening' as const,
          time: '18:30',
          duration: '2.5 hrs',
          location: `Riverside / Clifftop Promenade`,
          description: `Watch twilight envelop ${destination} while dining on fresh chef specials and regional wines or beverages.`,
          estimatedCost: 50,
          currency: 'USD',
          category: 'Dining' as const,
          bookingStatus: 'Need to Book' as const
        }
      ]
    });
  }

  return {
    id: `trip-${Date.now()}`,
    title: `${destination}: ${daysCount}-Day ${vibes[0] || 'Dream'} Escape`,
    tagline: `A tailored ${daysCount}-day itinerary featuring top sights, local flavors, and seamless transit in ${destination}.`,
    destination,
    country,
    continent,
    coverImage,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + daysCount * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDays: daysCount,
    travelParty: travelParty as any,
    vibes: vibes.length > 0 ? vibes : ['Cultural', 'Culinary'],
    totalBudget,
    currency: 'USD',
    status: 'Upcoming',
    days,
    expenses: [
      { id: 'exp-1', title: 'Roundtrip Flights / Transit', category: 'Flights', amount: 450, currency: 'USD', isPaid: true },
      { id: 'exp-2', title: `Stays (${daysCount} Nights)`, category: 'Stays', amount: Math.round(dailyBudget * 0.5 * daysCount), currency: 'USD', isPaid: false },
      { id: 'exp-3', title: 'Activities & Guided Tours', category: 'Activities', amount: Math.round(dailyBudget * 0.25 * daysCount), currency: 'USD', isPaid: false },
      { id: 'exp-4', title: 'Dining & Specialty Food', category: 'Dining', amount: Math.round(dailyBudget * 0.25 * daysCount), currency: 'USD', isPaid: false }
    ],
    packingList: [
      { id: 'pk-1', name: 'Passport, ID & Booking Confirmations', category: 'Documents', isPacked: true },
      { id: 'pk-2', name: 'Universal Power Adapter & Cable Kit', category: 'Tech', isPacked: true },
      { id: 'pk-3', name: 'Comfortable Breathable Walking Shoes', category: 'Clothing', isPacked: false },
      { id: 'pk-4', name: 'Weather-appropriate Outerwear', category: 'Clothing', isPacked: false },
      { id: 'pk-5', name: 'Refillable Water Bottle & Sun Protection', category: 'Essentials', isPacked: false }
    ],
    notes: `Customized for ${travelParty} travelers. Remember to check local weather 48 hours prior to departure.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function generateConciergeFallback(query: string, destination?: string): string {
  const q = query.toLowerCase();
  const dest = destination || 'your destination';

  if (q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('dinner')) {
    return `For dining in ${dest}, here are 3 stellar recommendations:\n\n• **Authentic Traditional**: Look for family-run trattorias/bistros situated 2-3 blocks away from main tourist plazas for richer flavors and better value.\n• **Sunset Viewpoints**: Reserve an aperitivo terrace or rooftop dining table around 18:30 to catch the golden hour twilight.\n• **Local Street Special**: Don't miss the central morning food hall for fresh seasonal snacks and regional delicacies.`;
  }

  if (q.includes('transit') || q.includes('train') || q.includes('transport') || q.includes('metro')) {
    return `Getting around ${dest} is easiest when you:\n\n1. Download the official local transit app or load a contactless transit card onto your smartphone wallet.\n2. Book regional high-speed rail tickets at least 2 weeks ahead for reserved seating discounts.\n3. Keep comfortable walking shoes handy as most historic districts are best explored on foot.`;
  }

  if (q.includes('pack') || q.includes('weather') || q.includes('wear')) {
    return `Smart packing tips for ${dest}:\n\n• **Layering**: Bring breathable natural fibers (linen, merino wool, light cotton) with a packable wind/rain shell.\n• **Comfort**: Plan for 12,000–18,000 steps daily—well-broken-in sneakers are essential.\n• **Tech**: Carry a 10,000mAh portable charger to keep navigation and camera apps running all day.`;
  }

  return `Here are key travel tips for your ${dest} trip:\n\n• **Peak Timing**: Visit major monuments right at opening (08:30) or late afternoon (16:30) to bypass midday tour groups.\n• **Reservations**: Major museums and popular restaurants often require bookings 3-7 days in advance.\n• **Local Etiquette**: Carry a small amount of local currency for street vendors and small family shops.`;
}

// ----------------------------------------------------
// Vite Middleware / Static Serving
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlobeTrotter server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
