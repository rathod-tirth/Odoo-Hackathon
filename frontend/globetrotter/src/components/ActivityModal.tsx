import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  DollarSign, 
  Tag, 
  Navigation, 
  CheckSquare, 
  FileText 
} from 'lucide-react';
import { Activity, ActivityTimeOfDay, ExpenseCategory } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  dayNumber: number;
  initialActivity?: Activity | null;
  defaultTimeOfDay?: ActivityTimeOfDay;
}

const CATEGORIES: ExpenseCategory[] = ['Activities', 'Dining', 'Transit', 'Shopping', 'Stays', 'Misc'];
const TIME_OF_DAYS: ActivityTimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];
const BOOKING_STATUSES = ['Booked', 'Need to Book', 'Optional', 'Not Needed'] as const;

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dayNumber,
  initialActivity,
  defaultTimeOfDay = 'Morning'
}) => {
  const [title, setTitle] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<ActivityTimeOfDay>(defaultTimeOfDay);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('1.5 hrs');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [category, setCategory] = useState<ExpenseCategory>('Activities');
  const [bookingStatus, setBookingStatus] = useState<typeof BOOKING_STATUSES[number]>('Not Needed');
  const [transitNotes, setTransitNotes] = useState('');

  useEffect(() => {
    if (initialActivity) {
      setTitle(initialActivity.title);
      setTimeOfDay(initialActivity.timeOfDay);
      setTime(initialActivity.time || '');
      setDuration(initialActivity.duration || '1 hr');
      setLocation(initialActivity.location);
      setDescription(initialActivity.description || '');
      setEstimatedCost(initialActivity.estimatedCost ? String(initialActivity.estimatedCost) : '0');
      setCategory(initialActivity.category);
      setBookingStatus((initialActivity.bookingStatus as any) || 'Not Needed');
      setTransitNotes(initialActivity.transitNotes || '');
    } else {
      setTitle('');
      setTimeOfDay(defaultTimeOfDay);
      setTime(defaultTimeOfDay === 'Morning' ? '09:00' : defaultTimeOfDay === 'Afternoon' ? '13:30' : defaultTimeOfDay === 'Evening' ? '18:00' : '20:30');
      setDuration('1.5 hrs');
      setLocation('');
      setDescription('');
      setEstimatedCost('0');
      setCategory('Activities');
      setBookingStatus('Not Needed');
      setTransitNotes('');
    }
  }, [initialActivity, defaultTimeOfDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const activityData: Activity = {
      id: initialActivity ? initialActivity.id : `act-${Date.now()}`,
      title: title.trim(),
      timeOfDay,
      time: time.trim() || undefined,
      duration: duration.trim() || undefined,
      location: location.trim(),
      description: description.trim(),
      estimatedCost: parseFloat(estimatedCost) || 0,
      currency: 'USD',
      category,
      bookingStatus,
      transitNotes: transitNotes.trim() || undefined,
      isCompleted: initialActivity ? initialActivity.isCompleted : false
    };

    onSave(activityData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#dfd4c5] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#2b2621] p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-serif-heading text-lg font-bold">
              {initialActivity ? 'Edit Activity' : 'Add New Activity'}
            </h3>
            <p className="text-xs text-white/70">
              Day {dayNumber} Schedule Plan
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#2b2621] mb-1">
              Activity Name / Experience
            </label>
            <input
              type="text"
              placeholder="e.g. Fushimi Inari Torii Gate Sunrise Walk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Time Block</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as ActivityTimeOfDay)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              >
                {TIME_OF_DAYS.map((tod) => (
                  <option key={tod} value={tod}>
                    {tod}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Specific Time</label>
              <input
                type="text"
                placeholder="09:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Location / Neighborhood</label>
              <input
                type="text"
                placeholder="e.g. Fushimi Ward, Kyoto"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Duration</label>
              <input
                type="text"
                placeholder="e.g. 2.5 hrs"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Est. Cost ($)</label>
              <input
                type="number"
                placeholder="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Booking Status</label>
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              >
                {BOOKING_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2b2621] mb-1">Transit / Navigation Tips</label>
            <input
              type="text"
              placeholder="e.g. Take Keihan line from Gion station, 10 min ride"
              value={transitNotes}
              onChange={(e) => setTransitNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2b2621] mb-1">Details / Notes</label>
            <textarea
              placeholder="What to see, what to wear, photo spot hints, secret foods..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#e8ded1] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-[#7d7265] hover:bg-[#faf7f2] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#c85a32] text-white hover:bg-[#b34822] font-bold shadow-sm"
            >
              {initialActivity ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
