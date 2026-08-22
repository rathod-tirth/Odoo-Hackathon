import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Sun, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  Compass, 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Heart,
  ChevronRight,
  Send
} from 'lucide-react';
import { Destination, TravelVibe, Itinerary } from '../types';

interface BentoExploreViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onOpenAIGeneratorWithDest: (destName: string) => void;
  onQuickGenerate: (prompt: string) => void;
  onLoadItinerary: (itineraryId: string) => void;
  recentItineraries: Itinerary[];
}

const VIBE_FILTERS: (TravelVibe | 'All')[] = [
  'All',
  'Cultural',
  'Coastal',
  'Adventure',
  'Wellness',
  'Culinary',
  'Romantic',
  'Nature'
];

export const BentoExploreView: React.FC<BentoExploreViewProps> = ({
  destinations,
  onSelectDestination,
  onOpenAIGeneratorWithDest,
  onQuickGenerate,
  onLoadItinerary,
  recentItineraries
}) => {
  const [selectedVibe, setSelectedVibe] = useState<TravelVibe | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['kyoto-japan', 'amalfi-italy']);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesVibe = selectedVibe === 'All' || dest.vibes.includes(selectedVibe);
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVibe && matchesSearch;
  });

  const featuredDest = destinations.find((d) => d.featured) || destinations[0];

  const handleQuickPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onQuickGenerate(quickPrompt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#e8ded1]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32] text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Travel Canvas</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2b2621] tracking-tight">
            Design Your Next Escape
          </h1>
          <p className="text-sm sm:text-base text-[#6e6357] mt-1 max-w-2xl">
            Seamlessly build, budget, and customize day-by-day vacation itineraries powered by AI intelligence.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7f71]" />
          <input
            type="text"
            placeholder="Search Kyoto, Amalfi, Bali..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dfd4c5] rounded-xl text-xs sm:text-sm text-[#2b2621] placeholder-[#9a8f82] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30 focus:border-[#c85a32] transition-all"
          />
        </div>
      </div>

      {/* Primary Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bento Cell 1: Featured Destination Spotlight (Large Span 7 cols) */}
        {featuredDest && (
          <div 
            onClick={() => onSelectDestination(featuredDest)}
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#dfd4c5] bg-[#2b2621] cursor-pointer min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-8"
          >
            {/* Background Image with warm overlay */}
            <img
              src={featuredDest.heroImage}
              alt={featuredDest.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1714] via-[#1b1714]/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Featured Destination of the Season</span>
              </div>

              <button
                onClick={(e) => toggleFavorite(featuredDest.id, e)}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#c85a32] transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(featuredDest.id) ? 'fill-[#c85a32] text-[#c85a32]' : ''
                  }`}
                />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {featuredDest.vibes.map((v) => (
                  <span
                    key={v}
                    className="px-2.5 py-0.5 rounded-full bg-[#c85a32]/90 text-white text-[11px] font-bold uppercase tracking-wider"
                  >
                    {v}
                  </span>
                ))}
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium">
                  {featuredDest.climate}
                </span>
              </div>

              <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
                {featuredDest.name}, {featuredDest.country}
              </h2>

              <p className="text-white/85 text-xs sm:text-sm line-clamp-2 max-w-xl">
                {featuredDest.tagline}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-4 text-xs text-white/90">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{featuredDest.recommendedDays} Days Suggested</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
                    <span>~${featuredDest.averageDailyCost} / day</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAIGeneratorWithDest(featuredDest.name);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-[#2b2621] hover:bg-[#faf7f2] font-semibold text-xs transition-all shadow-md group-hover:translate-x-0.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c85a32]" />
                  <span>Build with AI</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c85a32]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bento Cell 2: Quick AI Prompt & Travel Inspiration (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* AI Instant Trip Crafter Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#c85a32] to-[#b34822] text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Instant AI Architect</span>
              </div>
              <h3 className="font-serif-heading text-xl sm:text-2xl font-bold">
                Where is your wanderlust taking you?
              </h3>
              <p className="text-white/80 text-xs mt-1">
                Tell GlobeTrotter your dream destination, budget, or mood.
              </p>
            </div>

            <form onSubmit={handleQuickPromptSubmit} className="mt-5 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 5 days in Swiss Alps for hiking & fondue on $1800..."
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl bg-white text-[#2b2621] text-xs sm:text-sm placeholder-[#8a7f71] focus:outline-none shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#2b2621] hover:bg-[#3d362e] text-white rounded-lg flex items-center justify-center transition-all"
                  title="Generate Itinerary"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setQuickPrompt('Romantic 5 days in Amalfi Coast with private boat charter')}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all text-left truncate max-w-full"
                >
                  ✨ Amalfi Sunset & Boat
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPrompt('7-day cultural immersion in Kyoto & Osaka street food')}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all text-left truncate max-w-full"
                >
                  ⛩️ Kyoto Temples & Food
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPrompt('6 days in Bali: Ubud rice terraces & Uluwatu cliff surf')}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all text-left truncate max-w-full"
                >
                  🌴 Bali Wellness Retreat
                </button>
              </div>
            </form>
          </div>

          {/* Quick Active Itineraries Widget */}
          {recentItineraries.length > 0 && (
            <div className="rounded-3xl p-5 bg-white border border-[#dfd4c5] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#c85a32]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2b2621]">Your Active Trips</h4>
                </div>
                <span className="text-[11px] font-semibold text-[#8a7f71]">{recentItineraries.length} Planned</span>
              </div>

              <div className="space-y-2">
                {recentItineraries.slice(0, 2).map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => onLoadItinerary(trip.id)}
                    className="group p-3 rounded-2xl bg-[#faf7f2] hover:bg-[#f3ede4] border border-[#e8ded1] cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={trip.coverImage}
                        alt={trip.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#2b2621] group-hover:text-[#c85a32] transition-colors line-clamp-1">
                          {trip.title}
                        </p>
                        <p className="text-[11px] text-[#7d7265]">
                          {trip.totalDays} Days • {trip.destination} • ${trip.totalBudget}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8a7f71] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vibe Categories & Filter Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#c85a32]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2b2621]">
              Explore by Travel Vibe
            </h3>
          </div>
          <span className="text-xs text-[#7d7265]">
            Showing {filteredDestinations.length} curated destinations
          </span>
        </div>

        {/* Vibe Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {VIBE_FILTERS.map((vibe) => {
            const isSelected = selectedVibe === vibe;
            return (
              <button
                key={vibe}
                onClick={() => setSelectedVibe(vibe)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#2b2621] text-white shadow-sm'
                    : 'bg-white text-[#6e6357] border border-[#dfd4c5] hover:border-[#c85a32] hover:text-[#2b2621]'
                }`}
              >
                {vibe === 'All' ? '🌐 All Destinations' : vibe === 'Cultural' ? '⛩️ Cultural & Heritage' : vibe === 'Coastal' ? '🏖️ Coastal & Islands' : vibe === 'Adventure' ? '🏔️ Alpine & Hiking' : vibe === 'Wellness' ? '🌿 Wellness & Nature' : vibe === 'Culinary' ? '🍝 Culinary & Wine' : vibe === 'Romantic' ? '✨ Romantic Getaways' : '🌲 Nature & Parks'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Destination Bento Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => onSelectDestination(dest)}
            className="group rounded-3xl bg-white border border-[#dfd4c5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Card Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={dest.heroImage}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1714]/80 via-transparent to-black/20" />

              {/* Floating Top Pills */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>{dest.rating.toFixed(2)}</span>
                </div>

                <button
                  onClick={(e) => toggleFavorite(dest.id, e)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#c85a32] transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favorites.includes(dest.id) ? 'fill-[#c85a32] text-[#c85a32]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Bottom Image Tag */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs uppercase tracking-wider font-bold text-amber-200">
                  {dest.country}
                </p>
                <h3 className="font-serif-heading text-xl font-bold leading-tight">
                  {dest.name}
                </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#6e6357] line-clamp-2 leading-relaxed">
                {dest.description}
              </p>

              {/* Highlights tags */}
              <div className="flex flex-wrap gap-1.5">
                {dest.vibes.map((v) => (
                  <span
                    key={v}
                    className="px-2 py-0.5 rounded-md bg-[#faf7f2] border border-[#e8ded1] text-[#7d7265] text-[10px] font-semibold"
                  >
                    {v}
                  </span>
                ))}
              </div>

              {/* Meta stats bar */}
              <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between text-xs text-[#6e6357]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c85a32]" />
                  <span>{dest.recommendedDays} Days</span>
                </div>
                <div className="flex items-center space-x-1 font-semibold text-[#2b2621]">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>${dest.averageDailyCost} / day</span>
                </div>
                <span className="text-[#c85a32] font-semibold text-xs flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
