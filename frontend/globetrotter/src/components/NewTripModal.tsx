import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Image as ImageIcon,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Itinerary, TravelVibe } from '../types';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrip: (newItinerary: Itinerary) => void;
}

export const NewTripModal: React.FC<NewTripModalProps> = ({
  isOpen,
  onClose,
  onCreateTrip
}) => {
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [durationDays, setDurationDays] = useState(4);
  const [totalBudget, setTotalBudget] = useState('1800');
  const [travelParty, setTravelParty] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Couple');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !title.trim()) return;

    const days = [];
    for (let i = 1; i <= durationDays; i++) {
      days.push({
        dayNumber: i,
        title: `Day ${i}: Exploring ${destination}`,
        theme: i === 1 ? 'Arrival & First Sights' : 'Local Adventures',
        overview: `Enjoy your day in ${destination}. Add your morning, afternoon, and evening stops below.`,
        activities: []
      });
    }

    const newTrip: Itinerary = {
      id: `trip-custom-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim() || `A personalized ${durationDays}-day vacation in ${destination}`,
      destination: destination.trim(),
      country: country.trim() || destination.trim(),
      continent: 'Global',
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalDays: durationDays,
      travelParty,
      vibes: ['Cultural', 'Culinary'],
      totalBudget: parseFloat(totalBudget) || 1800,
      currency: 'USD',
      status: 'Upcoming',
      days,
      expenses: [
        {
          id: `exp-${Date.now()}-1`,
          title: 'Estimated Stay & Accommodations',
          category: 'Stays',
          amount: Math.round((parseFloat(totalBudget) || 1800) * 0.45),
          currency: 'USD',
          isPaid: false
        }
      ],
      packingList: [
        { id: `pk-${Date.now()}-1`, name: 'Passport & Travel Insurance', category: 'Documents', isPacked: false },
        { id: `pk-${Date.now()}-2`, name: 'Comfortable Footwear', category: 'Clothing', isPacked: false },
        { id: `pk-${Date.now()}-3`, name: 'Universal Charger & Cables', category: 'Tech', isPacked: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#dfd4c5] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#2b2621] p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-serif-heading text-lg font-bold">
              Create Blank Vacation Itinerary
            </h3>
            <p className="text-xs text-white/70">
              Build your custom trip from scratch
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
            <label className="block font-bold text-[#2b2621] mb-1">Trip Name</label>
            <input
              type="text"
              placeholder="e.g. Autumn in Kyoto or Romantic Paris Getaway"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Destination City</label>
              <input
                type="text"
                placeholder="e.g. Kyoto"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Country</label>
              <input
                type="text"
                placeholder="e.g. Japan"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Budget ($ USD)</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2b2621] mb-1">Party</label>
              <select
                value={travelParty}
                onChange={(e) => setTravelParty(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
              >
                <option value="Solo">Solo</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2b2621] mb-1">Tagline / Motto</label>
            <input
              type="text"
              placeholder="e.g. 5 days of zen temples, bamboo walks and ramen"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2b2621] mb-1">Cover Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
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
              className="px-5 py-2.5 rounded-xl bg-[#c85a32] text-white hover:bg-[#b34822] font-bold shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Itinerary</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
