import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BentoExploreView } from './components/BentoExploreView';
import { ItineraryStudioView } from './components/ItineraryStudioView';
import { BudgetTrackerView } from './components/BudgetTrackerView';
import { PackingListView } from './components/PackingListView';
import { MyTripsView } from './components/MyTripsView';
import { AITripModal } from './components/AITripModal';
import { AIConciergeDrawer } from './components/AIConciergeDrawer';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { ActivityModal } from './components/ActivityModal';
import { NewTripModal } from './components/NewTripModal';
import { APIModal } from './components/APIModal';
import { SEED_DESTINATIONS, SEED_ITINERARIES } from './data/seedData';
import { Destination, Itinerary, Activity, ActivityTimeOfDay } from './types';
import { 
  getDestinations, 
  getItineraries, 
  createItinerary as apiCreateItinerary, 
  updateItinerary as apiUpdateItinerary, 
  deleteItinerary as apiDeleteItinerary, 
  duplicateItinerary as apiDuplicateItinerary 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'trips' | 'studio' | 'budget' | 'packing'>('explore');
  const [destinations, setDestinations] = useState<Destination[]>(SEED_DESTINATIONS);
  const [itineraries, setItineraries] = useState<Itinerary[]>(SEED_ITINERARIES);
  const [activeItineraryId, setActiveItineraryId] = useState<string | null>(
    SEED_ITINERARIES[0]?.id || null
  );
  const [currency, setCurrency] = useState<string>('USD');

  // Modals and Drawers
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [aiGeneratorInitialDest, setAiGeneratorInitialDest] = useState('');
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [conciergeInitialQuery, setConciergeInitialQuery] = useState('');
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState<Destination | null>(null);

  // Activity Edit/Add Modal State
  const [activityModal, setActivityModal] = useState<{
    isOpen: boolean;
    dayNumber: number;
    activity: Activity | null;
    defaultTimeOfDay: ActivityTimeOfDay;
  }>({
    isOpen: false,
    dayNumber: 1,
    activity: null,
    defaultTimeOfDay: 'Morning'
  });

  // Fetch initial data from backend API
  useEffect(() => {
    getDestinations()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch((err) => console.warn('Destinations fetch fallback:', err));

    getItineraries()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItineraries(data);
          if (!activeItineraryId) {
            setActiveItineraryId(data[0].id);
          }
        }
      })
      .catch((err) => console.warn('Itineraries fetch fallback:', err));
  }, []);

  const activeItinerary = itineraries.find((i) => i.id === activeItineraryId) || itineraries[0] || null;

  // Handlers for Itinerary Management
  const handleSelectItinerary = (id: string) => {
    setActiveItineraryId(id);
    setActiveTab('studio');
  };

  const handleUpdateItinerary = async (updated: Itinerary) => {
    setItineraries((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    try {
      await apiUpdateItinerary(updated.id, updated);
    } catch (e) {
      console.warn('Could not sync update to backend:', e);
    }
  };

  const handleCreateItinerary = async (newTrip: Itinerary) => {
    setItineraries((prev) => [newTrip, ...prev]);
    setActiveItineraryId(newTrip.id);
    setActiveTab('studio');

    try {
      await apiCreateItinerary(newTrip);
    } catch (e) {
      console.warn('Could not sync creation to backend:', e);
    }
  };

  const handleDuplicateItinerary = async (id: string) => {
    try {
      const duplicated = await apiDuplicateItinerary(id);
      if (duplicated && duplicated.id) {
        setItineraries((prev) => [duplicated, ...prev]);
        setActiveItineraryId(duplicated.id);
        setActiveTab('studio');
        return;
      }
    } catch (e) {
      console.warn('Server duplicate failed, using local clone fallback:', e);
    }

    const original = itineraries.find((i) => i.id === id);
    if (!original) return;
    const duplicated: Itinerary = {
      ...JSON.parse(JSON.stringify(original)),
      id: `trip-copy-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString()
    };
    setItineraries((prev) => [duplicated, ...prev]);
    setActiveItineraryId(duplicated.id);
    setActiveTab('studio');
  };

  const handleDeleteItinerary = async (id: string) => {
    setItineraries((prev) => prev.filter((i) => i.id !== id));
    if (activeItineraryId === id) {
      const remaining = itineraries.filter((i) => i.id !== id);
      setActiveItineraryId(remaining[0]?.id || null);
    }

    try {
      await apiDeleteItinerary(id);
    } catch (e) {
      console.warn('Could not delete on backend:', e);
    }
  };

  // Activity modal save handler
  const handleSaveActivity = (activity: Activity) => {
    if (!activeItinerary) return;

    const targetDayNumber = activityModal.dayNumber;
    const updatedDays = activeItinerary.days.map((day) => {
      if (day.dayNumber !== targetDayNumber) return day;

      const existingIndex = day.activities.findIndex((a) => a.id === activity.id);
      let newActivities = [...day.activities];

      if (existingIndex >= 0) {
        newActivities[existingIndex] = activity;
      } else {
        newActivities.push(activity);
      }

      return {
        ...day,
        activities: newActivities
      };
    });

    handleUpdateItinerary({
      ...activeItinerary,
      days: updatedDays
    });
  };

  const handleOpenAIGeneratorWithDest = (destName: string) => {
    setAiGeneratorInitialDest(destName);
    setIsAIGeneratorOpen(true);
  };

  const handleQuickGeneratePrompt = (promptText: string) => {
    setAiGeneratorInitialDest(promptText);
    setIsAIGeneratorOpen(true);
  };

  const handleAskConciergeAboutActivity = (title: string, location: string) => {
    setConciergeInitialQuery(
      `Give me local tips, timing advice, or nearby dining gems around "${title}" in ${location}.`
    );
    setIsConciergeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1d1a] flex flex-col selection:bg-[#c85a32]/20 selection:text-[#c85a32]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeItinerary={activeItinerary}
        onOpenAIGenerator={() => {
          setAiGeneratorInitialDest('');
          setIsAIGeneratorOpen(true);
        }}
        onOpenNewTrip={() => setIsNewTripModalOpen(true)}
        onToggleConcierge={() => setIsConciergeOpen(!isConciergeOpen)}
        onOpenAPIModal={() => setIsAPIModalOpen(true)}
        isConciergeOpen={isConciergeOpen}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <BentoExploreView
            destinations={destinations}
            onSelectDestination={(dest) => setSelectedDestinationForModal(dest)}
            onOpenAIGeneratorWithDest={handleOpenAIGeneratorWithDest}
            onQuickGenerate={handleQuickGeneratePrompt}
            onLoadItinerary={handleSelectItinerary}
            recentItineraries={itineraries}
          />
        )}

        {activeTab === 'trips' && (
          <MyTripsView
            itineraries={itineraries}
            activeItineraryId={activeItineraryId}
            onSelectItinerary={handleSelectItinerary}
            onOpenAIGenerator={() => {
              setAiGeneratorInitialDest('');
              setIsAIGeneratorOpen(true);
            }}
            onOpenNewTrip={() => setIsNewTripModalOpen(true)}
            onDuplicateItinerary={handleDuplicateItinerary}
            onDeleteItinerary={handleDeleteItinerary}
          />
        )}

        {activeTab === 'studio' && activeItinerary && (
          <ItineraryStudioView
            itinerary={activeItinerary}
            onUpdateItinerary={handleUpdateItinerary}
            onOpenAddActivity={(dayNumber, timeOfDay = 'Morning') => {
              setActivityModal({
                isOpen: true,
                dayNumber,
                activity: null,
                defaultTimeOfDay: timeOfDay
              });
            }}
            onOpenEditActivity={(dayNumber, activity) => {
              setActivityModal({
                isOpen: true,
                dayNumber,
                activity,
                defaultTimeOfDay: activity.timeOfDay
              });
            }}
            onAskConciergeAboutActivity={handleAskConciergeAboutActivity}
            currency={currency}
          />
        )}

        {activeTab === 'budget' && activeItinerary && (
          <BudgetTrackerView
            itinerary={activeItinerary}
            onUpdateItinerary={handleUpdateItinerary}
            currency={currency}
          />
        )}

        {activeTab === 'packing' && activeItinerary && (
          <PackingListView
            itinerary={activeItinerary}
            onUpdateItinerary={handleUpdateItinerary}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8ded1] bg-white/70 py-6 mt-12 text-xs text-[#7d7265]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif-heading font-bold text-[#2b2621]">GlobeTrotter</span>
            <span>• Intelligent Vacation & Itinerary Studio</span>
          </div>
          <p className="text-[11px] text-[#8a7f71]">
            Powered by Gemini AI Travel Engine & Bento Grid Architecture
          </p>
        </div>
      </footer>

      {/* Modals & Slide-over Drawers */}
      <AITripModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onTripGenerated={(newTrip) => {
          handleCreateItinerary(newTrip);
        }}
        initialDestination={aiGeneratorInitialDest}
      />

      <NewTripModal
        isOpen={isNewTripModalOpen}
        onClose={() => setIsNewTripModalOpen(false)}
        onCreateTrip={handleCreateItinerary}
      />

      <DestinationDetailModal
        destination={selectedDestinationForModal}
        onClose={() => setSelectedDestinationForModal(null)}
        onPlanTripForDestination={(destName) => {
          setSelectedDestinationForModal(null);
          handleOpenAIGeneratorWithDest(destName);
        }}
      />

      <ActivityModal
        isOpen={activityModal.isOpen}
        onClose={() =>
          setActivityModal((prev) => ({ ...prev, isOpen: false, activity: null }))
        }
        onSave={handleSaveActivity}
        dayNumber={activityModal.dayNumber}
        initialActivity={activityModal.activity}
        defaultTimeOfDay={activityModal.defaultTimeOfDay}
      />

      <AIConciergeDrawer
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        activeItinerary={activeItinerary}
        initialQuery={conciergeInitialQuery}
      />

      <APIModal
        isOpen={isAPIModalOpen}
        onClose={() => setIsAPIModalOpen(false)}
      />
    </div>
  );
}
