import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Sparkles, 
  Sun, 
  ShieldCheck, 
  Shirt, 
  Laptop, 
  FileText, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { Itinerary, PackingItem } from '../types';

interface PackingListViewProps {
  itinerary: Itinerary;
  onUpdateItinerary: (updated: Itinerary) => void;
}

type PackingCategory = PackingItem['category'];

const CATEGORIES: { id: PackingCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'Essentials', label: 'Essentials', icon: ShieldCheck },
  { id: 'Clothing', label: 'Clothing & Footwear', icon: Shirt },
  { id: 'Tech', label: 'Tech & Electronics', icon: Laptop },
  { id: 'Documents', label: 'Travel Docs & Cards', icon: FileText },
  { id: 'Health', label: 'Health & Pharmacy', icon: HeartHandshake },
  { id: 'Toiletries', label: 'Toiletries & Care', icon: Sparkles }
];

export const PackingListView: React.FC<PackingListViewProps> = ({
  itinerary,
  onUpdateItinerary
}) => {
  const [activeCategory, setActiveCategory] = useState<PackingCategory | 'All'>('All');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingCategory>('Essentials');

  const items = itinerary.packingList || [];
  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const packedPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleTogglePacked = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isPacked: !item.isPacked } : item
    );
    onUpdateItinerary({ ...itinerary, packingList: updated });
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onUpdateItinerary({ ...itinerary, packingList: updated });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `pk-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      isPacked: false,
      isCustom: true
    };

    onUpdateItinerary({
      ...itinerary,
      packingList: [...items, newItem]
    });

    setNewItemName('');
  };

  const filteredItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e8ded1]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Smart Packing Organizer</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#2b2621]">
            Luggage & Checklist
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6357] mt-1">
            Tailored packing list for {itinerary.destination} ({itinerary.totalDays} Days)
          </p>
        </div>

        {/* Progress pill */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#dfd4c5] shadow-sm flex items-center space-x-4 self-start sm:self-auto">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8a7f71]">Packed Status</span>
            <p className="text-sm font-bold text-[#2b2621]">
              {packedCount} of {totalCount} Packed ({packedPercent}%)
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#eee6da] flex items-center justify-center relative">
            <span className="text-xs font-bold text-[#c85a32]">{packedPercent}%</span>
          </div>
        </div>
      </div>

      {/* Quick Add Form */}
      <form
        onSubmit={handleAddItem}
        className="p-5 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          placeholder="Add an item to your packing list (e.g. Hiking boots, Kindle, Passport pouch)..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="w-full sm:flex-1 p-2.5 rounded-xl border border-[#dfd4c5] text-xs focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as PackingCategory)}
          className="w-full sm:w-48 p-2.5 rounded-xl border border-[#dfd4c5] text-xs focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b34822] text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'All'
              ? 'bg-[#2b2621] text-white shadow-sm'
              : 'bg-white text-[#6e6357] border border-[#dfd4c5] hover:text-[#2b2621]'
          }`}
        >
          All Items ({items.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat.id).length;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#2b2621] text-white shadow-sm'
                  : 'bg-white text-[#6e6357] border border-[#dfd4c5] hover:text-[#2b2621]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>
                {cat.label} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Item List */}
      <div className="p-6 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#dfd4c5] rounded-2xl bg-[#faf7f2]">
            <p className="text-xs text-[#8a7f71]">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTogglePacked(item.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  item.isPacked
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-[#faf7f2]/60 border-[#e8ded1] hover:border-[#c85a32]/50 hover:bg-[#faf7f2]'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <button className="text-[#8a7f71]">
                    {item.isPacked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-5 h-5 text-[#baa996]" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-semibold truncate block ${
                        item.isPacked ? 'line-through text-[#8a7f71]' : 'text-[#2b2621]'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#8a7f71] uppercase font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="p-1.5 text-[#8a7f71] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
