import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Navigation, 
  Hotel, 
  Sun, 
  Share2, 
  Download, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Itinerary, DayPlan, Activity, ActivityTimeOfDay } from '../types';

interface ItineraryStudioViewProps {
  itinerary: Itinerary;
  onUpdateItinerary: (updated: Itinerary) => void;
  onOpenAddActivity: (dayNumber: number, defaultTimeOfDay?: ActivityTimeOfDay) => void;
  onOpenEditActivity: (dayNumber: number, activity: Activity) => void;
  onAskConciergeAboutActivity: (activityTitle: string, location: string) => void;
  currency: string;
}

const TIME_OF_DAY_ORDER: ActivityTimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

export const ItineraryStudioView: React.FC<ItineraryStudioViewProps> = ({
  itinerary,
  onUpdateItinerary,
  onOpenAddActivity,
  onOpenEditActivity,
  onAskConciergeAboutActivity,
  currency
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [shareCopied, setShareCopied] = useState(false);

  const activeDay: DayPlan | undefined = itinerary.days.find(
    (d) => d.dayNumber === selectedDayNumber
  ) || itinerary.days[0];

  // Helper to toggle activity completion
  const handleToggleActivity = (dayNumber: number, activityId: string) => {
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.map((act) =>
          act.id === activityId ? { ...act, isCompleted: !act.isCompleted } : act
        )
      };
    });

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  // Helper to delete activity
  const handleDeleteActivity = (dayNumber: number, activityId: string) => {
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.filter((act) => act.id !== activityId)
      };
    });

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  // Helper to add a new day
  const handleAddDay = () => {
    const nextDayNumber = itinerary.days.length + 1;
    const newDay: DayPlan = {
      dayNumber: nextDayNumber,
      title: `Day ${nextDayNumber}: Exploring More of ${itinerary.destination}`,
      theme: 'Adventures & Hidden Spots',
      overview: `A flexible day dedicated to local discoveries, artisanal food, and scenic leisure in ${itinerary.destination}.`,
      activities: []
    };

    const updatedItinerary: Itinerary = {
      ...itinerary,
      totalDays: nextDayNumber,
      days: [...itinerary.days, newDay]
    };

    onUpdateItinerary(updatedItinerary);
    setSelectedDayNumber(nextDayNumber);
  };

  // Helper to remove active day
  const handleDeleteDay = (dayNumber: number) => {
    if (itinerary.days.length <= 1) return;
    const filteredDays = itinerary.days
      .filter((d) => d.dayNumber !== dayNumber)
      .map((d, index) => ({
        ...d,
        dayNumber: index + 1
      }));

    const updatedItinerary: Itinerary = {
      ...itinerary,
      totalDays: filteredDays.length,
      days: filteredDays
    };

    onUpdateItinerary(updatedItinerary);
    setSelectedDayNumber(Math.max(1, dayNumber - 1));
  };

  // Calculate day total cost
  const dayEstimatedCost = activeDay?.activities.reduce(
    (acc, act) => acc + (Number(act.estimatedCost) || 0),
    0
  ) || 0;

  const totalActivitiesCount = itinerary.days.reduce(
    (acc, d) => acc + d.activities.length,
    0
  );

  const completedActivitiesCount = itinerary.days.reduce(
    (acc, d) => acc + d.activities.filter((a) => a.isCompleted).length,
    0
  );

  const completionPercentage = totalActivitiesCount > 0
    ? Math.round((completedActivitiesCount / totalActivitiesCount) * 100)
    : 0;

  const handleShareTrip = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const handleExportText = () => {
    let summary = `=== GLOBETROTTER ITINERARY ===\n`;
    summary += `${itinerary.title}\n`;
    summary += `Destination: ${itinerary.destination}, ${itinerary.country}\n`;
    summary += `Duration: ${itinerary.totalDays} Days | Budget: $${itinerary.totalBudget}\n\n`;

    itinerary.days.forEach((d) => {
      summary += `--- DAY ${d.dayNumber}: ${d.title} ---\n`;
      if (d.overview) summary += `Overview: ${d.overview}\n`;
      d.activities.forEach((a) => {
        summary += `• [${a.timeOfDay}${a.time ? ' ' + a.time : ''}] ${a.title} (${a.location}) - Est. $${a.estimatedCost}\n`;
        if (a.description) summary += `  ${a.description}\n`;
      });
      summary += `\n`;
    });

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${itinerary.destination.toLowerCase()}-itinerary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner with Warm Lighting Overlay */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#dfd4c5] bg-[#2b2621]">
        <img
          src={itinerary.coverImage}
          alt={itinerary.title}
          className="w-full h-64 sm:h-80 object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1714] via-[#1b1714]/40 to-black/30" />

        {/* Content inside Banner */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-[#c85a32] text-white text-xs font-bold uppercase tracking-wider">
                {itinerary.status}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                {itinerary.travelParty} Party
              </span>
              {itinerary.vibes.map((v) => (
                <span
                  key={v}
                  className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs"
                >
                  {v}
                </span>
              ))}
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShareTrip}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={handleExportText}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{itinerary.destination}, {itinerary.country}</span>
            </div>
            <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold leading-tight">
              {itinerary.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 max-w-2xl">
              {itinerary.tagline}
            </p>

            {/* Progress and Stats Row */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 text-xs text-white/90">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>{itinerary.totalDays} Days ({itinerary.startDate} to {itinerary.endDate})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-300" />
                  <span>Total Budget: ${itinerary.totalBudget}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-white/80 font-medium">
                  {completedActivitiesCount}/{totalActivitiesCount} done ({completionPercentage}%)
                </span>
                <div className="w-24 h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#c85a32] rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Selector Carousel Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#7d7265]">
            Daily Itinerary Timeline
          </h2>
          <button
            onClick={handleAddDay}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#eee6da] hover:bg-[#e2d7c7] text-[#2b2621] text-xs font-semibold transition-all border border-[#dfd4c5]"
          >
            <Plus className="w-3.5 h-3.5 text-[#c85a32]" />
            <span>Add Day {itinerary.days.length + 1}</span>
          </button>
        </div>

        {/* Day Tabs horizontal scroll */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          {itinerary.days.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            const completedCount = day.activities.filter((a) => a.isCompleted).length;
            const totalCount = day.activities.length;

            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-[#2b2621] text-white border-[#2b2621] shadow-md'
                    : 'bg-white text-[#2b2621] border-[#dfd4c5] hover:border-[#c85a32]/50 hover:bg-[#faf7f2]'
                }`}
              >
                <div className="flex items-center justify-between space-x-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Day {day.dayNumber}
                  </span>
                  {totalCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#faf7f2] text-[#7d7265]'
                      }`}
                    >
                      {completedCount}/{totalCount}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs font-medium truncate max-w-[130px] ${
                    isSelected ? 'text-white/80' : 'text-[#7d7265]'
                  }`}
                >
                  {day.theme || day.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail Canvas */}
      {activeDay && (
        <div className="space-y-6">
          {/* Day Header Box */}
          <div className="p-6 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8ded1]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#c85a32]/10 text-[#c85a32] text-xs font-bold">
                    Day {activeDay.dayNumber} of {itinerary.totalDays}
                  </span>
                  {activeDay.theme && (
                    <span className="text-xs font-semibold text-[#8a7f71]">
                      • {activeDay.theme}
                    </span>
                  )}
                </div>
                <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#2b2621] mt-1">
                  {activeDay.title}
                </h2>
              </div>

              {/* Day metrics */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-[#e8ded1] text-[#2b2621]">
                  <span className="text-[#8a7f71] block text-[10px] uppercase font-bold">Est. Spend</span>
                  <span className="font-bold text-[#c85a32]">${dayEstimatedCost}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-[#e8ded1] text-[#2b2621]">
                  <span className="text-[#8a7f71] block text-[10px] uppercase font-bold">Activities</span>
                  <span className="font-bold">{activeDay.activities.length} Stops</span>
                </div>
                {itinerary.days.length > 1 && (
                  <button
                    onClick={() => handleDeleteDay(activeDay.dayNumber)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
                    title="Delete this day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {activeDay.overview && (
              <p className="text-xs sm:text-sm text-[#6e6357] leading-relaxed">
                {activeDay.overview}
              </p>
            )}

            {/* Accommodation for this day if present */}
            {activeDay.accommodation && (
              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#e8ded1] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Hotel className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8a7f71]">
                      Night Stay Accommodation
                    </span>
                    <p className="font-bold text-[#2b2621]">
                      {activeDay.accommodation.name}
                    </p>
                    <p className="text-[11px] text-[#7d7265]">
                      {activeDay.accommodation.address}
                    </p>
                  </div>
                </div>

                {activeDay.accommodation.costPerNight && (
                  <span className="font-semibold text-emerald-700">
                    ${activeDay.accommodation.costPerNight}/night
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Time of Day Timeline Sections */}
          <div className="space-y-6">
            {TIME_OF_DAY_ORDER.map((timeBlock) => {
              const activitiesInBlock = activeDay.activities.filter(
                (a) => a.timeOfDay === timeBlock
              );

              return (
                <div key={timeBlock} className="space-y-3">
                  {/* Block Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          timeBlock === 'Morning'
                            ? 'bg-amber-400'
                            : timeBlock === 'Afternoon'
                            ? 'bg-orange-500'
                            : timeBlock === 'Evening'
                            ? 'bg-[#c85a32]'
                            : 'bg-indigo-600'
                        }`}
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b2621]">
                        {timeBlock}
                      </h3>
                      <span className="text-[11px] text-[#8a7f71]">
                        ({activitiesInBlock.length})
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenAddActivity(activeDay.dayNumber, timeBlock)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-[#c85a32] hover:text-[#a8441f] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to {timeBlock}</span>
                    </button>
                  </div>

                  {/* Activities List */}
                  {activitiesInBlock.length === 0 ? (
                    <div className="p-4 rounded-2xl border border-dashed border-[#dfd4c5] bg-[#faf7f2]/50 text-center">
                      <p className="text-xs text-[#8a7f71]">
                        No {timeBlock.toLowerCase()} activities scheduled yet.
                      </p>
                      <button
                        onClick={() => onOpenAddActivity(activeDay.dayNumber, timeBlock)}
                        className="mt-1.5 text-xs font-semibold text-[#c85a32] hover:underline"
                      >
                        + Add first activity
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activitiesInBlock.map((activity) => (
                        <div
                          key={activity.id}
                          className={`p-4 rounded-2xl bg-white border transition-all duration-200 ${
                            activity.isCompleted
                              ? 'border-emerald-200 bg-emerald-50/20'
                              : 'border-[#dfd4c5] hover:border-[#c85a32]/60 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Checkbox and main details */}
                            <div className="flex items-start space-x-3.5 flex-1">
                              <button
                                onClick={() => handleToggleActivity(activeDay.dayNumber, activity.id)}
                                className="mt-0.5 text-[#8a7f71] hover:text-emerald-600 transition-colors"
                              >
                                {activity.isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                ) : (
                                  <Circle className="w-5 h-5 text-[#baa996]" />
                                )}
                              </button>

                              <div className="space-y-1.5 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Category Tag */}
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                      activity.category === 'Dining'
                                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                        : activity.category === 'Activities'
                                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                        : activity.category === 'Transit'
                                        ? 'bg-sky-100 text-sky-900 border border-sky-200'
                                        : activity.category === 'Shopping'
                                        ? 'bg-rose-100 text-rose-900 border border-rose-200'
                                        : 'bg-purple-100 text-purple-900 border border-purple-200'
                                    }`}
                                  >
                                    {activity.category}
                                  </span>

                                  {/* Booking Status Badge */}
                                  {activity.bookingStatus && (
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                        activity.bookingStatus === 'Booked'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : activity.bookingStatus === 'Need to Book'
                                          ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                                          : 'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      {activity.bookingStatus === 'Booked' && '✓ Booked'}
                                      {activity.bookingStatus === 'Need to Book' && '⚡ Need to Book'}
                                      {activity.bookingStatus === 'Optional' && 'Optional'}
                                      {activity.bookingStatus === 'Not Needed' && 'No Ticket Needed'}
                                    </span>
                                  )}

                                  {activity.time && (
                                    <span className="inline-flex items-center space-x-1 text-xs text-[#7d7265] font-medium">
                                      <Clock className="w-3 h-3 text-[#c85a32]" />
                                      <span>{activity.time} ({activity.duration || '1 hr'})</span>
                                    </span>
                                  )}
                                </div>

                                <h4
                                  className={`text-sm sm:text-base font-bold text-[#2b2621] ${
                                    activity.isCompleted ? 'line-through text-[#8a7f71]' : ''
                                  }`}
                                >
                                  {activity.title}
                                </h4>

                                <div className="flex items-center space-x-1.5 text-xs text-[#7d7265]">
                                  <MapPin className="w-3.5 h-3.5 text-[#c85a32]" />
                                  <span>{activity.location}</span>
                                </div>

                                {activity.description && (
                                  <p className="text-xs text-[#6e6357] leading-relaxed pt-1">
                                    {activity.description}
                                  </p>
                                )}

                                {/* Transit Notes Banner */}
                                {activity.transitNotes && (
                                  <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#faf7f2] border border-[#e8ded1] text-[11px] text-[#6e6357]">
                                    <Navigation className="w-3 h-3 text-sky-600" />
                                    <span>{activity.transitNotes}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Cost and Action Menu */}
                            <div className="flex flex-col items-end space-y-2">
                              <span className="text-xs font-bold text-[#2b2621] bg-[#faf7f2] px-2.5 py-1 rounded-lg border border-[#e8ded1]">
                                {activity.estimatedCost > 0 ? `$${activity.estimatedCost}` : 'Free'}
                              </span>

                              <div className="flex items-center space-x-1">
                                {/* Ask AI Concierge about this */}
                                <button
                                  onClick={() =>
                                    onAskConciergeAboutActivity(activity.title, activity.location)
                                  }
                                  className="p-1.5 text-[#8a7f71] hover:text-[#c85a32] hover:bg-[#faf7f2] rounded-lg transition-all"
                                  title="Ask AI Concierge for local tips"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>

                                {/* Edit activity */}
                                <button
                                  onClick={() => onOpenEditActivity(activeDay.dayNumber, activity)}
                                  className="p-1.5 text-[#8a7f71] hover:text-[#2b2621] hover:bg-[#faf7f2] rounded-lg transition-all"
                                  title="Edit Activity"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete activity */}
                                <button
                                  onClick={() => handleDeleteActivity(activeDay.dayNumber, activity.id)}
                                  className="p-1.5 text-[#8a7f71] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
