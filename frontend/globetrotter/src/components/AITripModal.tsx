import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Layers, 
  Loader2, 
  CheckCircle2, 
  X,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TravelVibe, AIGenerateTripRequest, Itinerary } from '../types';

interface AITripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripGenerated: (itinerary: Itinerary) => void;
  initialDestination?: string;
}

const VIBE_OPTIONS: { id: TravelVibe; label: string; icon: string }[] = [
  { id: 'Cultural', label: 'Cultural & History', icon: '⛩️' },
  { id: 'Culinary', label: 'Culinary & Wine', icon: '🍝' },
  { id: 'Coastal', label: 'Coastal & Islands', icon: '🏖️' },
  { id: 'Adventure', label: 'Alpine & Adventure', icon: '🏔️' },
  { id: 'Wellness', label: 'Wellness & Spa', icon: '🌿' },
  { id: 'Romantic', label: 'Romantic Vibe', icon: '✨' },
  { id: 'Nature', label: 'Wildlife & Nature', icon: '🌲' },
  { id: 'City Break', label: 'Urban Energy', icon: '🏙️' }
];

const LOADING_STEPS = [
  'Analyzing destination highlights and seasonal weather...',
  'Curating authentic morning and sunset experiences...',
  'Selecting local gastronomic hotspots & secret bakeries...',
  'Optimizing day-by-day transit and walking distances...',
  'Finalizing budget allocations and smart packing checklist...'
];

export const AITripModal: React.FC<AITripModalProps> = ({
  isOpen,
  onClose,
  onTripGenerated,
  initialDestination = ''
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [durationDays, setDurationDays] = useState(5);
  const [budget, setBudget] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [travelParty, setTravelParty] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Couple');
  const [selectedVibes, setSelectedVibes] = useState<TravelVibe[]>(['Cultural', 'Culinary']);
  const [interests, setInterests] = useState('');
  const [season, setSeason] = useState('Autumn (Oct-Nov)');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleVibe = (vibe: TravelVibe) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrorMsg('Please enter a destination name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setLoadingStepIndex(0);

    // Simulate animated generation steps
    const stepInterval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const payload: AIGenerateTripRequest = {
        destination: destination.trim(),
        durationDays,
        budget,
        travelParty,
        vibes: selectedVibes.length > 0 ? selectedVibes : ['Cultural'],
        interests: interests.trim(),
        seasonOrMonth: season
      };

      const res = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      clearInterval(stepInterval);

      if (json.success && json.data) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onTripGenerated(json.data);
        onClose();
      } else {
        setErrorMsg(json.error || 'Failed to generate itinerary.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || 'Network error occurred while generating itinerary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#dfd4c5] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#c85a32] to-[#b34822] p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold">
                AI Vacation Architect
              </h2>
              <p className="text-xs text-white/80">
                Transform your vacation dreams into a structured, day-by-day itinerary
              </p>
            </div>
          </div>

          {!isLoading && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        {isLoading ? (
          <div className="p-10 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c85a32]/10 flex items-center justify-center text-[#c85a32] animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-heading text-xl font-bold text-[#2b2621]">
                Crafting Your Custom Itinerary for {destination}...
              </h3>
              <p className="text-xs text-[#7d7265] animate-pulse">
                {LOADING_STEPS[loadingStepIndex]}
              </p>
            </div>

            {/* Step checklist */}
            <div className="max-w-md mx-auto space-y-2 text-left text-xs text-[#6e6357] pt-4">
              {LOADING_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {idx < loadingStepIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : idx === loadingStepIndex ? (
                    <Loader2 className="w-4 h-4 text-[#c85a32] animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                  )}
                  <span className={idx === loadingStepIndex ? 'font-bold text-[#2b2621]' : ''}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-6 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Destination & Duration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-[#2b2621] mb-1.5 uppercase tracking-wider text-[11px]">
                  Dream Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7f71]" />
                  <input
                    type="text"
                    placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2b2621] mb-1.5 uppercase tracking-wider text-[11px]">
                  Duration ({durationDays} Days)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full accent-[#c85a32]"
                  />
                  <span className="font-bold text-[#c85a32] w-8 text-right">
                    {durationDays}d
                  </span>
                </div>
              </div>
            </div>

            {/* Party & Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#2b2621] mb-1.5 uppercase tracking-wider text-[11px]">
                  Travel Party
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Solo', 'Couple', 'Family', 'Friends'] as const).map((party) => (
                    <button
                      key={party}
                      type="button"
                      onClick={() => setTravelParty(party)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        travelParty === party
                          ? 'bg-[#2b2621] text-white shadow-sm'
                          : 'bg-[#faf7f2] border border-[#dfd4c5] text-[#6e6357] hover:text-[#2b2621]'
                      }`}
                    >
                      {party}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2b2621] mb-1.5 uppercase tracking-wider text-[11px]">
                  Budget Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Budget', 'Moderate', 'Luxury'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        budget === b
                          ? 'bg-[#c85a32] text-white shadow-sm'
                          : 'bg-[#faf7f2] border border-[#dfd4c5] text-[#6e6357] hover:text-[#2b2621]'
                      }`}
                    >
                      {b === 'Budget' ? '💸 Budget' : b === 'Moderate' ? '⚖️ Moderate' : '👑 Luxury'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vibe Selection */}
            <div>
              <label className="block font-bold text-[#2b2621] mb-1.5 uppercase tracking-wider text-[11px]">
                Desired Vibes & Atmosphere (Select multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VIBE_OPTIONS.map((v) => {
                  const isSelected = selectedVibes.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleVibe(v.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        isSelected
                          ? 'bg-amber-50 border-[#c85a32] text-[#c85a32] font-bold'
                          : 'bg-white border-[#dfd4c5] text-[#6e6357] hover:bg-[#faf7f2]'
                      }`}
                    >
                      <span className="text-base">{v.icon}</span>
                      <span className="truncate">{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Interests / Notes */}
            <div>
              <label className="block font-bold text-[#2b2621] mb-1.5 uppercase tracking-wider text-[11px]">
                Special Requests or Must-See Spots (Optional)
              </label>
              <textarea
                placeholder="e.g. Include a sunset catamaran cruise, authentic ramen masterclasses, and photography spots in morning light..."
                rows={2}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#e8ded1] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-[#7d7265] hover:bg-[#faf7f2] font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c85a32] to-[#b34822] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
