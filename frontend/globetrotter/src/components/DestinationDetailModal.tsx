import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Sun, 
  Compass, 
  ArrowRight
} from 'lucide-react';
import { Destination } from '../types';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  onPlanTripForDestination: (destinationName: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  onPlanTripForDestination
}) => {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#dfd4c5] overflow-hidden my-8">
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-80">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1714] via-[#1b1714]/30 to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c85a32] text-white text-[11px] font-bold uppercase tracking-wider">
                {destination.country}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px]">
                {destination.continent}
              </span>
              <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-amber-300 text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>{destination.rating.toFixed(2)}</span>
              </div>
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold">
              {destination.name}
            </h2>
            <p className="text-white/90 text-xs sm:text-sm max-w-xl">
              {destination.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-[#6e6357]">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#faf7f2] border border-[#e8ded1] text-[#2b2621]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8a7f71] block">
                Suggested Stay
              </span>
              <span className="font-bold text-sm">{destination.recommendedDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8a7f71] block">
                Daily Budget
              </span>
              <span className="font-bold text-sm text-emerald-700">
                ~${destination.averageDailyCost} / day
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8a7f71] block">
                Best Months
              </span>
              <span className="font-bold text-sm">{destination.bestMonths.join(', ')}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8a7f71] block">
                Current Climate
              </span>
              <span className="font-bold text-sm text-amber-700">{destination.currentTemp || destination.climate}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif-heading text-base font-bold text-[#2b2621] mb-2">
              About {destination.name}
            </h3>
            <p className="leading-relaxed text-xs sm:text-sm">
              {destination.description}
            </p>
          </div>

          {/* Highlights & Photo Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2b2621] mb-3 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-[#c85a32]" />
                <span>Must-Do Highlights</span>
              </h4>
              <div className="space-y-2">
                {destination.highlights.map((h, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2b2621] mb-3 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Local Customs & Etiquette</span>
              </h4>
              <div className="space-y-2">
                {destination.localEtiquette.map((tip, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#e8ded1] text-[11px]">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-[#e8ded1] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-[#7d7265] hover:bg-[#faf7f2] font-semibold"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onPlanTripForDestination(destination.name);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c85a32] to-[#b34822] text-white font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate {destination.name} Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
