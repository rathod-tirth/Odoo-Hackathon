import React from 'react';
import { 
  Layers, 
  Plus, 
  Calendar, 
  DollarSign, 
  Copy, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Itinerary } from '../types';

interface MyTripsViewProps {
  itineraries: Itinerary[];
  activeItineraryId: string | null;
  onSelectItinerary: (id: string) => void;
  onOpenAIGenerator: () => void;
  onOpenNewTrip: () => void;
  onDuplicateItinerary: (id: string) => void;
  onDeleteItinerary: (id: string) => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  itineraries,
  activeItineraryId,
  onSelectItinerary,
  onOpenAIGenerator,
  onOpenNewTrip,
  onDuplicateItinerary,
  onDeleteItinerary
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e8ded1]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32] text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Itinerary Portfolio</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#2b2621]">
            My Planned Vacations
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6357] mt-1">
            {itineraries.length} custom itineraries created with GlobeTrotter
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenAIGenerator}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b34822] text-white font-bold text-xs shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Trip Generator</span>
          </button>

          <button
            onClick={onOpenNewTrip}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#faf7f2] text-[#2b2621] font-semibold text-xs border border-[#dfd4c5] shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Blank Trip</span>
          </button>
        </div>
      </div>

      {/* Triplist Cards */}
      {itineraries.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[#dfd4c5] rounded-3xl bg-white space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c85a32]/10 text-[#c85a32] flex items-center justify-center">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-heading text-xl font-bold text-[#2b2621]">
              No Vacations Planned Yet
            </h3>
            <p className="text-xs text-[#7d7265] max-w-sm mx-auto">
              Start by building your dream itinerary with AI or explore our curated Bento destinations.
            </p>
          </div>
          <button
            onClick={onOpenAIGenerator}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#c85a32] text-white text-xs font-bold shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate First Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((trip) => {
            const isActive = trip.id === activeItineraryId;
            const totalActs = trip.days.reduce((acc, d) => acc + d.activities.length, 0);

            return (
              <div
                key={trip.id}
                className={`group rounded-3xl bg-white border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isActive ? 'ring-2 ring-[#c85a32] border-transparent' : 'border-[#dfd4c5]'
                }`}
              >
                {/* Image Cover */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Status and Active Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        trip.status === 'Active'
                          ? 'bg-emerald-500 text-white'
                          : trip.status === 'Upcoming'
                          ? 'bg-[#c85a32] text-white'
                          : 'bg-black/40 text-white'
                      }`}
                    >
                      {trip.status}
                    </span>

                    {isActive && (
                      <span className="px-2.5 py-1 rounded-full bg-white text-[#2b2621] text-[10px] font-bold shadow-sm">
                        ⭐ Current Active Studio
                      </span>
                    )}
                  </div>

                  {/* Destination on Cover */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center space-x-1 text-amber-200 text-xs font-bold">
                      <MapPin className="w-3 h-3" />
                      <span>{trip.destination}, {trip.country}</span>
                    </div>
                    <h3 className="font-serif-heading text-lg font-bold truncate">
                      {trip.title}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#6e6357] line-clamp-2">
                    {trip.tagline || `${trip.totalDays} days in ${trip.destination}`}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#7d7265] py-2 border-y border-[#e8ded1]">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c85a32]" />
                      <span>{trip.totalDays} Days ({totalActs} stops)</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-semibold text-[#2b2621]">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>${trip.totalBudget} Budget</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onDuplicateItinerary(trip.id)}
                        className="p-2 text-[#8a7f71] hover:text-[#2b2621] hover:bg-[#faf7f2] rounded-xl transition-all"
                        title="Duplicate Trip"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItinerary(trip.id)}
                        className="p-2 text-[#8a7f71] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectItinerary(trip.id)}
                      className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#2b2621] text-white shadow-sm'
                          : 'bg-[#faf7f2] hover:bg-[#c85a32] hover:text-white text-[#2b2621] border border-[#dfd4c5]'
                      }`}
                    >
                      <span>{isActive ? 'Open Studio' : 'Select Trip'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
