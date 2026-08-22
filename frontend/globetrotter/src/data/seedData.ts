import { Destination, Itinerary } from '../types';

export const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'kyoto-japan',
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    tagline: 'Ancient temples, bamboo groves & culinary poetry',
    description: 'Immerse yourself in timeless Japanese culture amidst preserved machiya townhouses, mossy Zen rock gardens, morning tea ceremonies, and evening strolls through lantern-lit Gion.',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80'
    ],
    vibes: ['Cultural', 'Culinary', 'Romantic'],
    averageDailyCost: 140,
    currency: 'USD',
    recommendedDays: 6,
    bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
    climate: 'Temperate with vivid 4 seasons',
    currentTemp: '21°C • Mild & Sunny',
    highlights: ['Fushimi Inari 10,000 Torii Gates at sunrise', 'Arashiyama Bamboo Forest & Monkey Park', 'Traditional Gion Kaiseki Multi-course Dinner', 'Philosopher’s Path Sakura Walk'],
    localEtiquette: ['Remove shoes when entering ryokans and temples', 'Do not eat while walking in historic alleys', 'Keep voices low in public transport'],
    featured: true,
    rating: 4.95
  },
  {
    id: 'amalfi-italy',
    name: 'Amalfi Coast',
    country: 'Italy',
    continent: 'Europe',
    tagline: 'Sun-drenched cliffs, pastel villages & lemon groves',
    description: 'A dramatic Mediterranean paradise where pastel houses cling to cliffside bluffs, sparkling turquoise waters invite sunset boat cruises, and hand-pulled burrata meets fresh limoncelli.',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
    ],
    vibes: ['Coastal', 'Romantic', 'Culinary'],
    averageDailyCost: 210,
    currency: 'USD',
    recommendedDays: 5,
    bestMonths: ['May', 'Jun', 'Sep', 'Oct'],
    climate: 'Mediterranean sunny warm',
    currentTemp: '24°C • Coastal Breeze',
    highlights: ['Private wooden boat charter to Capri & Blue Grotto', 'Hike the legendary Path of the Gods (Sentiero degli Dei)', 'Sunset spritz on Positano cliff terraces', 'Ravello cliffside gardens of Villa Cimbrone'],
    localEtiquette: ['Dress respectfully when visiting historic duomos', 'Tipping 5-10% is customary for great service', 'Greet shopkeepers with "Buongiorno"'],
    featured: true,
    rating: 4.92
  },
  {
    id: 'swiss-alps',
    name: 'Lauterbrunnen & Zermatt',
    country: 'Switzerland',
    continent: 'Europe',
    tagline: 'Cascading waterfalls, jagged peaks & alpine fondue',
    description: 'Experience fairytale valleys framed by 72 waterfalls, panoramic cogwheel railways ascending into eternal glaciers, and cozy pine chalets serving authentic Gruyère fondue.',
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    vibes: ['Adventure', 'Nature', 'Romantic'],
    averageDailyCost: 240,
    currency: 'USD',
    recommendedDays: 6,
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Dec', 'Jan'],
    climate: 'Crisp alpine mountain air',
    currentTemp: '16°C • Crystal Clear',
    highlights: ['Jungfraujoch Top of Europe glacier railway', 'Staubbach Waterfall base walk', 'Matterhorn sunrise reflections at Riffelsee', 'First Cliff Walk by Tissot suspension bridge'],
    localEtiquette: ['Punctuality is strictly observed on all Swiss transit', 'Carry a reusable water bottle for pure mountain fountain water', 'Recycle sorted items carefully'],
    featured: true,
    rating: 4.98
  },
  {
    id: 'bali-indonesia',
    name: 'Ubud & Uluwatu',
    country: 'Indonesia',
    continent: 'Asia',
    tagline: 'Emerald jungle terraces, cliffside surf & sacred sanctuaries',
    description: 'From spiritual yoga shalas nestled in Ubud’s misty rice terraces to golden sunset ocean temples overlooking world-class surf breaks in Uluwatu, Bali offers tranquility and adventure in equal measure.',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
    ],
    vibes: ['Wellness', 'Adventure', 'Coastal'],
    averageDailyCost: 80,
    currency: 'USD',
    recommendedDays: 7,
    bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    climate: 'Tropical warm breeze',
    currentTemp: '28°C • Warm & Balmy',
    highlights: ['Sunrise trek up Mount Batur active volcano', 'Tegallalang emerald rice terrace swing', 'Kecak fire dance at Uluwatu clifftop temple', 'Traditional Balinese herbal spa & flower bath'],
    localEtiquette: ['Wear a sarong when visiting temple sanctuaries', 'Never step on Canang Sari daily flower offerings on pavements', 'Use your right hand for giving and receiving'],
    featured: true,
    rating: 4.88
  },
  {
    id: 'santorini-greece',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    tagline: 'Whitewashed domes, cobalt waters & legendary sunsets',
    description: 'Iconic volcanic caldera views, Cycladic architecture painted in radiant white and Aegean blue, cliffside infinity pools, and Assyrtiko wine tasting in sun-baked vineyards.',
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
    ],
    vibes: ['Romantic', 'Coastal', 'Culinary'],
    averageDailyCost: 190,
    currency: 'USD',
    recommendedDays: 4,
    bestMonths: ['May', 'Jun', 'Sep', 'Oct'],
    climate: 'Sunny Mediterranean',
    currentTemp: '25°C • Golden Sunshine',
    highlights: ['Oia clifftop sunset vantage point', 'Catamaran sunset cruise through the volcanic caldera', 'Akrotiri prehistoric Bronze Age archaeological site', 'Red Beach volcanic sand swimming'],
    localEtiquette: ['Do not step on church roofs or private gates for photos', 'Carry cash for smaller tavernas and donkey taxis', 'Water is scarce on the island, conserve mindfully'],
    featured: false,
    rating: 4.89
  },
  {
    id: 'patagonia-chile',
    name: 'Torres del Paine',
    country: 'Chile',
    continent: 'Americas',
    tagline: 'Glacial granite spires, turquoise fjords & wild pampas',
    description: 'One of Earth’s grandest wilderness frontiers. Hike beneath towering granite horns, witness thunderous calving glaciers, and watch wild guanacos roaming across golden Patagonian steppes.',
    heroImage: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80'
    ],
    vibes: ['Adventure', 'Nature'],
    averageDailyCost: 160,
    currency: 'USD',
    recommendedDays: 7,
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    climate: 'Dynamic Patagonian winds & brisk alpine air',
    currentTemp: '12°C • Fresh & Windy',
    highlights: ['Mirador Las Torres sunrise hike', 'Grey Glacier ice trekking with crampons', 'French Valley hanging glacier amphitheater', 'Nordenskjöld turquoise lake navigation'],
    localEtiquette: ['Strict Leave No Trace policy in all national parks', 'Camp only in designated refugio sites', 'Layer technical clothing for sudden weather shifts'],
    featured: false,
    rating: 4.96
  }
];

export const SEED_ITINERARIES: Itinerary[] = [
  {
    id: 'trip-kyoto-zen-2026',
    title: 'Kyoto & Osaka: Zen Temples & Night Markets',
    tagline: 'A harmonious 5-day voyage blending imperial tranquility and lively Kansai culinary culture.',
    destination: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80',
    startDate: '2026-10-12',
    endDate: '2026-10-16',
    totalDays: 5,
    travelParty: 'Couple',
    vibes: ['Cultural', 'Culinary', 'Romantic'],
    totalBudget: 2400,
    currency: 'USD',
    status: 'Active',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-22T02:30:00Z',
    notes: 'JR Kansai Pass active for days 1-5. Pocket Wi-Fi picked up at Kansai Airport. Dinner reservation confirmed at Gion Matayoshi on Day 2.',
    expenses: [
      { id: 'exp-1', title: 'Roundtrip Flights (SFO -> KIX)', category: 'Flights', amount: 980, currency: 'USD', isPaid: true, date: '2026-07-15', notes: 'Economy Plus confirmed' },
      { id: 'exp-2', title: 'Traditional Machiya Ryokan (4 Nights)', category: 'Stays', amount: 820, currency: 'USD', isPaid: true, date: '2026-07-20', notes: 'Includes daily breakfast & private cedar onsen' },
      { id: 'exp-3', title: 'JR Kansai Area 5-Day Rail Pass', category: 'Transit', amount: 110, currency: 'USD', isPaid: true, date: '2026-08-01' },
      { id: 'exp-4', title: 'Kaiseki Dinner at Gion Matayoshi', category: 'Dining', amount: 220, currency: 'USD', isPaid: false, notes: 'Reserved for 19:30 on Day 2' },
      { id: 'exp-5', title: 'Tea Ceremony Experience with Master', category: 'Activities', amount: 65, currency: 'USD', isPaid: true, date: '2026-08-10' },
      { id: 'exp-6', title: 'Street Food & Souvenirs Budget', category: 'Shopping', amount: 150, currency: 'USD', isPaid: false }
    ],
    packingList: [
      { id: 'pk-1', name: 'Passport & Visa Documentation', category: 'Documents', isPacked: true },
      { id: 'pk-2', name: 'JR Rail Pass Voucher & Suica Card', category: 'Documents', isPacked: true },
      { id: 'pk-3', name: 'Comfortable Slip-on Walking Shoes (Temples)', category: 'Clothing', isPacked: true },
      { id: 'pk-4', name: 'Compact Travel Umbrella / Rain Jacket', category: 'Essentials', isPacked: true },
      { id: 'pk-5', name: 'Universal Travel Power Adapter (Type A/B)', category: 'Tech', isPacked: true },
      { id: 'pk-6', name: 'High-capacity Portable Power Bank', category: 'Tech', isPacked: true },
      { id: 'pk-7', name: 'Light Layering Cardigans for Autumn Evenings', category: 'Clothing', isPacked: false },
      { id: 'pk-8', name: 'Personal First-Aid & Blister Bandages', category: 'Health', isPacked: false }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2026-10-12',
        title: 'Arrival & Lanterns in Historic Gion',
        theme: 'Settling into Old Kyoto',
        overview: 'Arrive via Haruka Express from Kansai International Airport, check in to your heritage machiya townhouse, and stroll the stone alleys of Gion as paper lanterns flicker to life.',
        accommodation: {
          name: 'Kyoto Machiya Heritage Ryokan',
          address: 'Higashiyama Ward, Kyoto',
          checkInTime: '15:00',
          costPerNight: 205
        },
        activities: [
          {
            id: 'act-1-1',
            title: 'Express Train from Kansai Airport & Check-in',
            timeOfDay: 'Afternoon',
            time: '14:30',
            duration: '1.5 hrs',
            location: 'Kyoto Station -> Gion Machiya',
            description: 'Board the Haruka Express. Drop luggage at the ryokan, enjoy welcome matcha and warm seasonal wagashi sweets.',
            estimatedCost: 25,
            currency: 'USD',
            category: 'Transit',
            bookingStatus: 'Booked',
            transitNotes: 'Use JR pass at the automated gate'
          },
          {
            id: 'act-1-2',
            title: 'Evening Twilight Walk along Shirakawa Canal',
            timeOfDay: 'Evening',
            time: '17:30',
            duration: '1.5 hrs',
            location: 'Shirakawa Minami-dori, Gion',
            description: 'Walk alongside weeping willows and wooden teahouses. Keep an eye out for Geiko and Maiko gracefully heading to evening appointments.',
            estimatedCost: 0,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Not Needed'
          },
          {
            id: 'act-1-3',
            title: 'Cozy Izakaya Dinner at Pontocho Alley',
            timeOfDay: 'Night',
            time: '19:30',
            duration: '2 hrs',
            location: 'Pontocho Alley, Nakagyo',
            description: 'Dine on duck skewers, fresh sashimi, Kyoto tofu (yudofu), and local dry sake in a traditional riverside dining room.',
            estimatedCost: 45,
            currency: 'USD',
            category: 'Dining',
            bookingStatus: 'Booked'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-10-13',
        title: 'Sunrise Torii Gates & Sacred Higashiyama',
        theme: 'Shrines & Ancient Craft',
        overview: 'Beat the daytime crowds with an early morning hike through Fushimi Inari’s crimson mountain path, followed by Kiyomizu-dera temple and traditional pottery streets.',
        activities: [
          {
            id: 'act-2-1',
            title: 'Fushimi Inari Taisha 10,000 Gates at Sunrise',
            timeOfDay: 'Morning',
            time: '06:30',
            duration: '2.5 hrs',
            location: 'Fushimi Ward, Kyoto',
            description: 'Hike through thousands of vibrant vermillion torii gates threading up sacred Mount Inari with morning mist filtering through cedar canopies.',
            estimatedCost: 0,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Not Needed',
            transitNotes: 'Take Keihan Line directly to Fushimi-Inari Station (10 min)'
          },
          {
            id: 'act-2-2',
            title: 'Kiyomizu-dera Wooden Stage & Ninenzaka Alleys',
            timeOfDay: 'Afternoon',
            time: '11:00',
            duration: '3 hrs',
            location: 'Higashiyama Ward',
            description: 'Marvel at the monumental wooden veranda built without a single nail. Explore Ninenzaka and Sannenzaka stone-paved preserved craft alleys.',
            estimatedCost: 15,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Not Needed'
          },
          {
            id: 'act-2-3',
            title: 'Private Kaiseki Dinner Experience at Gion Matayoshi',
            timeOfDay: 'Evening',
            time: '19:30',
            duration: '2.5 hrs',
            location: 'Gion-machi Minamigawa',
            description: 'A 9-course seasonal banquet celebrating autumn ingredients: matsutake mushrooms, sea bream, grilled wagyu, and delicate sweet chestnuts.',
            estimatedCost: 110,
            currency: 'USD',
            category: 'Dining',
            bookingStatus: 'Booked',
            bookingReference: 'KYOTO-RSV-882'
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-10-14',
        title: 'Arashiyama Bamboo Grove & Riverboat Tranquility',
        theme: 'Zen Nature & Monastic Gardens',
        overview: 'Wander through towering bamboo shoots, feed friendly macaques at Iwatayama, and visit Tenryu-ji’s 14th-century landscape garden.',
        activities: [
          {
            id: 'act-3-1',
            title: 'Arashiyama Bamboo Forest & Tenryu-ji Temple',
            timeOfDay: 'Morning',
            time: '08:00',
            duration: '2 hrs',
            location: 'Ukyo Ward, Kyoto',
            description: 'Listen to the iconic rustling sound of wind in the bamboo stalks, designated as one of Japan’s 100 Soundscapes.',
            estimatedCost: 10,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Not Needed'
          },
          {
            id: 'act-3-2',
            title: 'Traditional Wooden Boat Cruise on Oi River',
            timeOfDay: 'Afternoon',
            time: '13:00',
            duration: '1.5 hrs',
            location: 'Togetsukyo Bridge',
            description: 'Drift serenely along the forested gorge on a hand-poled wooden punt while admiring vibrant red Japanese maples.',
            estimatedCost: 35,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Need to Book'
          },
          {
            id: 'act-3-3',
            title: 'Matcha Tasting & Zen Garden Meditation at Daitoku-ji',
            timeOfDay: 'Evening',
            time: '16:00',
            duration: '2 hrs',
            location: 'Kita Ward, Kyoto',
            description: 'A quiet meditative session overlooking dry landscape rock gardens with single-origin Uji green tea and sweet bean cake.',
            estimatedCost: 20,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Booked'
          }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-10-15',
        title: 'Osaka Day Trip: Castles, Neon & Street Bites',
        theme: 'Urban Energy & Kansai Flavors',
        overview: 'Take the 28-minute rapid train to Osaka. Tour the grand castle grounds, explore vintage Shinsekai, and devour Takoyaki in neon Dotonbori.',
        activities: [
          {
            id: 'act-4-1',
            title: 'Osaka Castle & Moat Gardens',
            timeOfDay: 'Morning',
            time: '09:30',
            duration: '2.5 hrs',
            location: 'Chuo Ward, Osaka',
            description: 'Explore the 16th-century fortress, gold-leaf ornaments, and panoramic views of Osaka skyline from the 8th-floor observation deck.',
            estimatedCost: 12,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Not Needed'
          },
          {
            id: 'act-4-2',
            title: 'Kuromon Ichiba Market Seafood Feast',
            timeOfDay: 'Afternoon',
            time: '12:30',
            duration: '2 hrs',
            location: 'Nippombashi, Osaka',
            description: 'Sample grilled giant king crab legs, uni rice bowls, wagyu skewers, and freshly torch-seared scallops.',
            estimatedCost: 38,
            currency: 'USD',
            category: 'Dining',
            bookingStatus: 'Not Needed'
          },
          {
            id: 'act-4-3',
            title: 'Dotonbori Neon Street Safari & Glico Man Run',
            timeOfDay: 'Night',
            time: '18:00',
            duration: '3 hrs',
            location: 'Dotonbori, Osaka',
            description: 'Bask in giant mechanical crab signs, pulsating LED billboards, piping hot takoyaki octopus balls, and okonomiyaki pancakes.',
            estimatedCost: 30,
            currency: 'USD',
            category: 'Dining',
            bookingStatus: 'Not Needed'
          }
        ]
      },
      {
        dayNumber: 5,
        date: '2026-10-16',
        title: 'Nishiki Market Morning & Departure Farewell',
        theme: 'Gourmet Farewell',
        overview: 'Complete your journey with culinary souvenir shopping at Kyoto’s 400-year-old Kitchen before boarding the airport express.',
        activities: [
          {
            id: 'act-5-1',
            title: 'Nishiki Market Gourmet Walk & Tea Shopping',
            timeOfDay: 'Morning',
            time: '09:00',
            duration: '2.5 hrs',
            location: 'Nishikikoji-dori, Nakagyo',
            description: 'Taste tamagoyaki rolled omelet on a stick, sesame dango, dried yuzu peels, and purchase premium sencha tea tins.',
            estimatedCost: 35,
            currency: 'USD',
            category: 'Shopping',
            bookingStatus: 'Not Needed'
          },
          {
            id: 'act-5-2',
            title: 'Check-out & Kansai Airport Train',
            timeOfDay: 'Afternoon',
            time: '13:00',
            duration: '2 hrs',
            location: 'Kyoto Station to KIX',
            description: 'Pick up luggage from ryokan front desk, board the Haruka express with bento lunch box.',
            estimatedCost: 20,
            currency: 'USD',
            category: 'Transit',
            bookingStatus: 'Booked'
          }
        ]
      }
    ]
  },
  {
    id: 'trip-amalfi-sun-2026',
    title: 'Amalfi Coast: Clifftop Splendor & Capri Blue',
    tagline: '5 days of Mediterranean bliss, private boat cruises, and cliffside dinners.',
    destination: 'Amalfi Coast',
    country: 'Italy',
    continent: 'Europe',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80',
    startDate: '2026-06-18',
    endDate: '2026-06-22',
    totalDays: 5,
    travelParty: 'Couple',
    vibes: ['Coastal', 'Romantic', 'Culinary'],
    totalBudget: 3200,
    currency: 'USD',
    status: 'Upcoming',
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-08-21T18:00:00Z',
    notes: 'Private boat skipper confirmed for Day 3. Car rental pickup at Naples Capodichino Airport.',
    expenses: [
      { id: 'exp-am-1', title: 'Roundtrip Flights to Naples (NAP)', category: 'Flights', amount: 1150, currency: 'USD', isPaid: true },
      { id: 'exp-am-2', title: 'Cliffside Boutique Hotel in Positano', category: 'Stays', amount: 1200, currency: 'USD', isPaid: true },
      { id: 'exp-am-3', title: 'Capri Private Gozzo Boat Charter', category: 'Activities', amount: 450, currency: 'USD', isPaid: true },
      { id: 'exp-am-4', title: 'Dining & Wine Budget', category: 'Dining', amount: 400, currency: 'USD', isPaid: false }
    ],
    packingList: [
      { id: 'pk-am-1', name: 'Linen Shirts & Breezy Resort Wear', category: 'Clothing', isPacked: true },
      { id: 'pk-am-2', name: 'Reef-safe Sunscreen & Polarized Sunglasses', category: 'Essentials', isPacked: true },
      { id: 'pk-am-3', name: 'EU Power Adapters', category: 'Tech', isPacked: false }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2026-06-18',
        title: 'Arrival in Positano & Sunset Aperitivo',
        theme: 'First Glimpse of the Coast',
        overview: 'Arrive along the winding coastal highway, check into your balcony overlooking the sea, and celebrate with an Aperol Spritz.',
        activities: [
          {
            id: 'act-am-1-1',
            title: 'Scenic Coastal Drive & Check-in',
            timeOfDay: 'Afternoon',
            time: '15:00',
            duration: '2 hrs',
            location: 'Positano, Italy',
            description: 'Check in to cliffside suite, unpack while enjoying panoramic Tyrrhenian sea vistas.',
            estimatedCost: 0,
            currency: 'USD',
            category: 'Stays',
            bookingStatus: 'Booked'
          },
          {
            id: 'act-am-1-2',
            title: 'Sunset Drinks at Franco’s Bar',
            timeOfDay: 'Evening',
            time: '18:30',
            duration: '2 hrs',
            location: 'Positano clifftop',
            description: 'Sip champagne cocktails while golden light bathes the cascading pastel architecture.',
            estimatedCost: 45,
            currency: 'USD',
            category: 'Dining',
            bookingStatus: 'Not Needed'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-06-19',
        title: 'Path of the Gods & Historic Amalfi Duomo',
        theme: 'Clifftop Trails & Ancient Maritime Republic',
        overview: 'Trek the legendary Sentiero degli Dei high above the azure sea, then descend to explore Amalfi town.',
        activities: [
          {
            id: 'act-am-2-1',
            title: 'Path of the Gods (Sentiero degli Dei) Hike',
            timeOfDay: 'Morning',
            time: '08:30',
            duration: '3.5 hrs',
            location: 'Bomerano to Nocelle',
            description: 'Spectacular panoramic hike along ancient shepherd paths overlooking the entire Sorrentine peninsula.',
            estimatedCost: 0,
            currency: 'USD',
            category: 'Activities',
            bookingStatus: 'Not Needed'
          },
          {
            id: 'act-am-2-2',
            title: 'Fresh Seafood Lunch at Amalfi Marina',
            timeOfDay: 'Afternoon',
            time: '13:30',
            duration: '2 hrs',
            location: 'Amalfi Port',
            description: 'Handmade scialatielli pasta with fresh clams, calamari, and chilled local Greco di Tufo white wine.',
            estimatedCost: 55,
            currency: 'USD',
            category: 'Dining',
            bookingStatus: 'Booked'
          }
        ]
      }
    ]
  }
];
