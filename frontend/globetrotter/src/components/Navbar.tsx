import React from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  Sparkles, 
  Plus, 
  Globe2, 
  Layers,
  Server
} from 'lucide-react';
import { Itinerary } from '../types';

interface NavbarProps {
  activeTab: 'explore' | 'trips' | 'studio' | 'budget' | 'packing';
  setActiveTab: (tab: 'explore' | 'trips' | 'studio' | 'budget' | 'packing') => void;
  activeItinerary: Itinerary | null;
  onOpenAIGenerator: () => void;
  onOpenNewTrip: () => void;
  onToggleConcierge: () => void;
  onOpenAPIModal: () => void;
  isConciergeOpen: boolean;
  currency: string;
  setCurrency: (c: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeItinerary,
  onOpenAIGenerator,
  onOpenNewTrip,
  onToggleConcierge,
  onOpenAPIModal,
  isConciergeOpen,
  currency,
  setCurrency
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur-md border-b border-[#e8ded1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c85a32] to-[#e68c52] flex items-center justify-center shadow-md shadow-[#c85a32]/20 text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif-heading text-xl font-bold tracking-tight text-[#2b2621]">GlobeTrotter</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#c85a32]/10 text-[#c85a32]">Studio</span>
              </div>
              <p className="text-xs text-[#7d7265] hidden sm:block">Intelligent Vacation & Itinerary Planner</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#eee6da] p-1 rounded-xl border border-[#dfd4c5]">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-[#2b2621] shadow-sm'
                  : 'text-[#6e6357] hover:text-[#2b2621]'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>Explore Bento</span>
            </button>

            <button
              onClick={() => setActiveTab('trips')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'trips'
                  ? 'bg-white text-[#2b2621] shadow-sm'
                  : 'text-[#6e6357] hover:text-[#2b2621]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Trips</span>
            </button>

            {activeItinerary && (
              <>
                <button
                  onClick={() => setActiveTab('studio')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'studio'
                      ? 'bg-white text-[#2b2621] shadow-sm'
                      : 'text-[#6e6357] hover:text-[#2b2621]'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#c85a32]" />
                  <span className="truncate max-w-[110px]">{activeItinerary.destination} Day-by-Day</span>
                </button>

                <button
                  onClick={() => setActiveTab('budget')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'budget'
                      ? 'bg-white text-[#2b2621] shadow-sm'
                      : 'text-[#6e6357] hover:text-[#2b2621]'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Budget</span>
                </button>

                <button
                  onClick={() => setActiveTab('packing')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'packing'
                      ? 'bg-white text-[#2b2621] shadow-sm'
                      : 'text-[#6e6357] hover:text-[#2b2621]'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  <span>Packing</span>
                </button>
              </>
            )}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#eee6da] border border-[#dfd4c5] text-[#2b2621] text-xs font-semibold rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="JPY">¥ JPY</option>
            </select>

            {/* AI Travel Concierge Toggle */}
            <button
              onClick={onToggleConcierge}
              className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isConciergeOpen
                  ? 'bg-[#2b2621] text-white shadow-md'
                  : 'bg-amber-100/70 border border-amber-200/80 text-amber-900 hover:bg-amber-100'
              }`}
              title="GlobeTrotter AI Concierge"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="hidden sm:inline">AI Concierge</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* FastAPI & PostgreSQL Specs Inspector */}
            <button
              onClick={onOpenAPIModal}
              className="flex items-center space-x-1.5 bg-[#eee6da] hover:bg-[#e4dacb] border border-[#dfd4c5] text-[#2b2621] px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              title="FastAPI & PostgreSQL Backend API Architecture"
            >
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Backend API</span>
            </button>

            {/* AI Generator CTA */}
            <button
              onClick={onOpenAIGenerator}
              className="flex items-center space-x-1.5 bg-[#c85a32] hover:bg-[#b54f2a] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Trip Builder</span>
            </button>

            {/* Quick manual trip */}
            <button
              onClick={onOpenNewTrip}
              className="p-2 rounded-xl bg-[#eee6da] hover:bg-[#e4dacb] text-[#2b2621] border border-[#dfd4c5] transition-all"
              title="Custom Blank Itinerary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation sub-bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#e8ded1] text-xs">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-2 py-1 font-semibold ${activeTab === 'explore' ? 'text-[#c85a32]' : 'text-[#7d7265]'}`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-2 py-1 font-semibold ${activeTab === 'trips' ? 'text-[#c85a32]' : 'text-[#7d7265]'}`}
          >
            My Trips
          </button>
          {activeItinerary && (
            <>
              <button
                onClick={() => setActiveTab('studio')}
                className={`px-2 py-1 font-semibold ${activeTab === 'studio' ? 'text-[#c85a32]' : 'text-[#7d7265]'}`}
              >
                Itinerary
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-2 py-1 font-semibold ${activeTab === 'budget' ? 'text-[#c85a32]' : 'text-[#7d7265]'}`}
              >
                Budget
              </button>
              <button
                onClick={() => setActiveTab('packing')}
                className={`px-2 py-1 font-semibold ${activeTab === 'packing' ? 'text-[#c85a32]' : 'text-[#7d7265]'}`}
              >
                Packing
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
