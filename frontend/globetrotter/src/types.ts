export type TravelVibe = 'Cultural' | 'Coastal' | 'Adventure' | 'Wellness' | 'Culinary' | 'Romantic' | 'Nature' | 'City Break';

export type ActivityTimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type ExpenseCategory = 'Flights' | 'Stays' | 'Dining' | 'Activities' | 'Transit' | 'Shopping' | 'Misc';

export interface Activity {
  id: string;
  title: string;
  timeOfDay: ActivityTimeOfDay;
  time?: string;
  duration?: string;
  location: string;
  description: string;
  estimatedCost: number;
  currency: string;
  category: ExpenseCategory;
  imageUrl?: string;
  bookingStatus?: 'Booked' | 'Need to Book' | 'Optional' | 'Not Needed';
  bookingUrl?: string;
  bookingReference?: string;
  transitNotes?: string;
  isCompleted?: boolean;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  title: string;
  theme?: string;
  overview?: string;
  activities: Activity[];
  accommodation?: {
    name: string;
    address: string;
    checkInTime?: string;
    checkOutTime?: string;
    bookingStatus?: string;
    costPerNight?: number;
  };
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date?: string;
  paidBy?: string;
  isPaid: boolean;
  notes?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Essentials' | 'Clothing' | 'Tech' | 'Toiletries' | 'Documents' | 'Health';
  isPacked: boolean;
  quantity?: number;
  isCustom?: boolean;
}

export interface Itinerary {
  id: string;
  title: string;
  tagline: string;
  destination: string;
  country: string;
  continent: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  travelParty: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Group';
  vibes: TravelVibe[];
  totalBudget: number;
  currency: string;
  status: 'Draft' | 'Upcoming' | 'Active' | 'Completed';
  days: DayPlan[];
  expenses: ExpenseItem[];
  packingList: PackingItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  vibes: TravelVibe[];
  averageDailyCost: number;
  currency: string;
  recommendedDays: number;
  bestMonths: string[];
  climate: string;
  currentTemp?: string;
  highlights: string[];
  localEtiquette: string[];
  featured?: boolean;
  rating: number;
}

export interface AIGenerateTripRequest {
  destination: string;
  durationDays: number;
  budget: 'Budget' | 'Moderate' | 'Luxury' | number;
  travelParty: 'Solo' | 'Couple' | 'Family' | 'Friends';
  vibes: TravelVibe[];
  interests?: string;
  seasonOrMonth?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}
