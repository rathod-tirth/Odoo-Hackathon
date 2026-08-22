// Demo data for the Globe Trotter prototype. Nothing here is persisted —
// it exists purely to give the mock UI something realistic to render.

export const currentUser = {
  name: 'Alex Rivera',
  initials: 'AR',
  email: 'alex.rivera@example.com',
}

export const upcomingTrips = [
  {
    id: 'trip-1',
    name: 'Kyoto Autumn Escape',
    location: 'Kyoto, Japan',
    dates: 'Oct 12 – Oct 19',
    icon: 'temple_buddhist',
    budget: '$2,400',
  },
  {
    id: 'trip-2',
    name: 'Amalfi Coast Roadtrip',
    location: 'Amalfi Coast, Italy',
    dates: 'Nov 3 – Nov 10',
    icon: 'directions_car',
    budget: '$3,150',
  },
]

export const previousTrips = [
  {
    id: 'trip-3',
    name: 'Reykjavik Northern Lights',
    location: 'Reykjavik, Iceland',
    dates: 'Feb 2 – Feb 8',
    icon: 'ac_unit',
  },
  {
    id: 'trip-4',
    name: 'Marrakech Souks & Sun',
    location: 'Marrakech, Morocco',
    dates: 'Jan 5 – Jan 11',
    icon: 'storefront',
  },
  {
    id: 'trip-5',
    name: 'Banff Lakeside Hikes',
    location: 'Banff, Canada',
    dates: 'Sep 14 – Sep 20',
    icon: 'landscape',
  },
]

export const topRegionalSelections = [
  { id: 'dest-1', name: 'Santorini', icon: 'villa' },
  { id: 'dest-2', name: 'Bali', icon: 'holiday_village' },
  { id: 'dest-3', name: 'Lisbon', icon: 'location_city' },
  { id: 'dest-4', name: 'Queenstown', icon: 'terrain' },
  { id: 'dest-5', name: 'Kyoto', icon: 'temple_buddhist' },
]

export const budgetHighlights = [
  { label: 'Total planned budget', value: '$8,750', icon: 'savings' },
  { label: 'Spent so far', value: '$3,120', icon: 'payments' },
  { label: 'Trips this year', value: '5', icon: 'flight_takeoff' },
]

export const suggestedPlaces = [
  { id: 'sugg-1', name: 'Fushimi Inari Shrine', icon: 'temple_buddhist' },
  { id: 'sugg-2', name: 'Arashiyama Bamboo Grove', icon: 'park' },
  { id: 'sugg-3', name: 'Gion District Walk', icon: 'directions_walk' },
  { id: 'sugg-4', name: 'Kinkaku-ji Golden Pavilion', icon: 'account_balance' },
  { id: 'sugg-5', name: 'Nishiki Market Food Tour', icon: 'restaurant' },
  { id: 'sugg-6', name: 'Arashiyama River Cruise', icon: 'directions_boat' },
]

export const defaultItinerarySections = [
  {
    id: 'section-1',
    title: 'Section 1',
    description: 'Flight from home city and airport transfer to hotel.',
    startDate: '',
    endDate: '',
    budget: '',
  },
  {
    id: 'section-2',
    title: 'Section 2',
    description: 'Guided walking tour of the historic district and temples.',
    startDate: '',
    endDate: '',
    budget: '',
  },
  {
    id: 'section-3',
    title: 'Section 3',
    description: 'Free day for shopping, food tours, and optional day trips.',
    startDate: '',
    endDate: '',
    budget: '',
  },
]
