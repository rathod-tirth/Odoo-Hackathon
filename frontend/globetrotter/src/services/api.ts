import { Destination, Itinerary, Activity, ExpenseItem, PackingItem, AIGenerateTripRequest, AIChatMessage } from '../types';
import { SEED_DESTINATIONS, SEED_ITINERARIES } from '../data/seedData';

const BASE_URL = '/api';

/**
 * Helper to handle JSON fetch with fallback to seed data if network fails
 */
async function fetchJson<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || errBody.detail || `HTTP Error ${res.status}`);
    }

    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    console.warn(`API request to ${url} failed or returned error:`, error);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

// ==========================================
// Destinations API
// ==========================================
export async function getDestinations(params?: { vibe?: string; continent?: string; search?: string }): Promise<Destination[]> {
  const query = new URLSearchParams();
  if (params?.vibe && params.vibe !== 'All') query.set('vibe', params.vibe);
  if (params?.continent && params.continent !== 'All') query.set('continent', params.continent);
  if (params?.search) query.set('search', params.search);

  const url = `${BASE_URL}/destinations${query.toString() ? `?${query.toString()}` : ''}`;
  return fetchJson<Destination[]>(url, undefined, SEED_DESTINATIONS);
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const fallback = SEED_DESTINATIONS.find((d) => d.id === id) || null;
  return fetchJson<Destination>(`${BASE_URL}/destinations/${id}`, undefined, fallback as any);
}

// ==========================================
// Itineraries API
// ==========================================
export async function getItineraries(status?: string): Promise<Itinerary[]> {
  const query = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
  return fetchJson<Itinerary[]>(`${BASE_URL}/itineraries${query}`, undefined, SEED_ITINERARIES);
}

export async function getItineraryById(id: string): Promise<Itinerary | null> {
  const fallback = SEED_ITINERARIES.find((i) => i.id === id) || null;
  return fetchJson<Itinerary>(`${BASE_URL}/itineraries/${id}`, undefined, fallback as any);
}

export async function createItinerary(itinerary: Partial<Itinerary>): Promise<Itinerary> {
  return fetchJson<Itinerary>(`${BASE_URL}/itineraries`, {
    method: 'POST',
    body: JSON.stringify(itinerary),
  });
}

export async function updateItinerary(id: string, updates: Partial<Itinerary>): Promise<Itinerary> {
  return fetchJson<Itinerary>(`${BASE_URL}/itineraries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteItinerary(id: string): Promise<void> {
  await fetchJson(`${BASE_URL}/itineraries/${id}`, {
    method: 'DELETE',
  });
}

export async function duplicateItinerary(id: string): Promise<Itinerary> {
  return fetchJson<Itinerary>(`${BASE_URL}/itineraries/${id}/duplicate`, {
    method: 'POST',
  });
}

// ==========================================
// Granular Activities API
// ==========================================
export async function addActivityToDay(itineraryId: string, dayNumber: number, activity: Partial<Activity>): Promise<Activity> {
  return fetchJson<Activity>(`${BASE_URL}/itineraries/${itineraryId}/days/${dayNumber}/activities`, {
    method: 'POST',
    body: JSON.stringify(activity),
  });
}

export async function toggleActivityCompletion(itineraryId: string, activityId: string): Promise<Activity> {
  return fetchJson<Activity>(`${BASE_URL}/itineraries/${itineraryId}/activities/${activityId}/complete`, {
    method: 'PATCH',
  });
}

export async function deleteActivity(itineraryId: string, activityId: string): Promise<void> {
  await fetchJson(`${BASE_URL}/itineraries/${itineraryId}/activities/${activityId}`, {
    method: 'DELETE',
  });
}

// ==========================================
// Granular Expenses API
// ==========================================
export async function addExpense(itineraryId: string, expense: Partial<ExpenseItem>): Promise<ExpenseItem> {
  return fetchJson<ExpenseItem>(`${BASE_URL}/itineraries/${itineraryId}/expenses`, {
    method: 'POST',
    body: JSON.stringify(expense),
  });
}

export async function toggleExpensePaid(itineraryId: string, expenseId: string): Promise<ExpenseItem> {
  return fetchJson<ExpenseItem>(`${BASE_URL}/itineraries/${itineraryId}/expenses/${expenseId}/toggle-paid`, {
    method: 'PATCH',
  });
}

export async function deleteExpense(itineraryId: string, expenseId: string): Promise<void> {
  await fetchJson(`${BASE_URL}/itineraries/${itineraryId}/expenses/${expenseId}`, {
    method: 'DELETE',
  });
}

// ==========================================
// Granular Packing List API
// ==========================================
export async function addPackingItem(itineraryId: string, item: Partial<PackingItem>): Promise<PackingItem> {
  return fetchJson<PackingItem>(`${BASE_URL}/itineraries/${itineraryId}/packing`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function togglePackingItem(itineraryId: string, itemId: string): Promise<PackingItem> {
  return fetchJson<PackingItem>(`${BASE_URL}/itineraries/${itineraryId}/packing/${itemId}/toggle`, {
    method: 'PATCH',
  });
}

export async function deletePackingItem(itineraryId: string, itemId: string): Promise<void> {
  await fetchJson(`${BASE_URL}/itineraries/${itineraryId}/packing/${itemId}`, {
    method: 'DELETE',
  });
}

// ==========================================
// AI Generation & Concierge Chat API
// ==========================================
export async function generateAIItinerary(requestParams: AIGenerateTripRequest): Promise<{ itinerary: Itinerary; generatedBy?: string }> {
  const res = await fetch(`${BASE_URL}/ai/generate-itinerary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestParams),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || 'Failed to generate itinerary');
  }

  const json = await res.json();
  return {
    itinerary: json.data,
    generatedBy: json.generatedBy || 'gemini-2.5-flash',
  };
}

export async function sendAIChatMessage(payload: {
  message: string;
  activeDestination?: string;
  activeItineraryTitle?: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
}): Promise<{ reply: string; source: string }> {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to send AI chat message');
  }

  return res.json();
}

export async function getApiHealth(): Promise<{ status: string; service: string }> {
  return fetchJson<{ status: string; service: string }>(`${BASE_URL}/health`);
}
