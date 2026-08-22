import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Filter, 
  CreditCard, 
  Wallet,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { Itinerary, ExpenseItem, ExpenseCategory } from '../types';

interface BudgetTrackerViewProps {
  itinerary: Itinerary;
  onUpdateItinerary: (updated: Itinerary) => void;
  currency: string;
}

const CATEGORIES: ExpenseCategory[] = [
  'Flights',
  'Stays',
  'Dining',
  'Activities',
  'Transit',
  'Shopping',
  'Misc'
];

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; fill: string; border: string }> = {
  Flights: { bg: 'bg-blue-50', text: 'text-blue-900', fill: 'bg-blue-600', border: 'border-blue-200' },
  Stays: { bg: 'bg-purple-50', text: 'text-purple-900', fill: 'bg-purple-600', border: 'border-purple-200' },
  Dining: { bg: 'bg-amber-50', text: 'text-amber-900', fill: 'bg-amber-600', border: 'border-amber-200' },
  Activities: { bg: 'bg-emerald-50', text: 'text-emerald-900', fill: 'bg-emerald-600', border: 'border-emerald-200' },
  Transit: { bg: 'bg-cyan-50', text: 'text-cyan-900', fill: 'bg-cyan-600', border: 'border-cyan-200' },
  Shopping: { bg: 'bg-rose-50', text: 'text-rose-900', fill: 'bg-rose-600', border: 'border-rose-200' },
  Misc: { bg: 'bg-gray-50', text: 'text-gray-900', fill: 'bg-gray-600', border: 'border-gray-200' }
};

export const BudgetTrackerView: React.FC<BudgetTrackerViewProps> = ({
  itinerary,
  onUpdateItinerary,
  currency
}) => {
  const [selectedFilter, setSelectedFilter] = useState<ExpenseCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('Dining');
  const [newAmount, setNewAmount] = useState('');
  const [newIsPaid, setNewIsPaid] = useState(false);
  const [newNotes, setNewNotes] = useState('');

  // Computations
  const totalBudget = Number(itinerary.totalBudget) || 2000;
  const totalAllocated = itinerary.expenses.reduce(
    (acc, item) => acc + (Number(item.amount) || 0),
    0
  );
  const totalPaid = itinerary.expenses
    .filter((e) => e.isPaid)
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const remainingBudget = totalBudget - totalAllocated;
  const dailyAverage = itinerary.totalDays > 0 ? Math.round(totalAllocated / itinerary.totalDays) : 0;

  // Category totals
  const categoryTotals = CATEGORIES.map((cat) => {
    const sum = itinerary.expenses
      .filter((e) => e.category === cat)
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const percentOfTotal = totalAllocated > 0 ? (sum / totalAllocated) * 100 : 0;
    return {
      category: cat,
      amount: sum,
      percent: percentOfTotal
    };
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      amount: parseFloat(newAmount) || 0,
      currency: 'USD',
      isPaid: newIsPaid,
      notes: newNotes.trim() || undefined,
      date: new Date().toISOString().split('T')[0]
    };

    onUpdateItinerary({
      ...itinerary,
      expenses: [...itinerary.expenses, newItem]
    });

    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setNewIsPaid(false);
    setShowAddModal(false);
  };

  const handleTogglePaid = (id: string) => {
    const updated = itinerary.expenses.map((e) =>
      e.id === id ? { ...e, isPaid: !e.isPaid } : e
    );
    onUpdateItinerary({ ...itinerary, expenses: updated });
  };

  const handleDeleteExpense = (id: string) => {
    const updated = itinerary.expenses.filter((e) => e.id !== id);
    onUpdateItinerary({ ...itinerary, expenses: updated });
  };

  const filteredExpenses = itinerary.expenses.filter(
    (e) => selectedFilter === 'All' || e.category === selectedFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e8ded1]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Trip Financials & Expenses</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#2b2621]">
            Budget Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6357] mt-1">
            Tracking expenses for {itinerary.title} ({itinerary.totalDays} Days)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b34822] text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8a7f71]">
            <span className="text-xs uppercase font-bold tracking-wider">Total Planned Budget</span>
            <Wallet className="w-4 h-4 text-[#c85a32]" />
          </div>
          <p className="text-2xl font-bold text-[#2b2621]">${totalBudget.toLocaleString()}</p>
          <p className="text-[11px] text-[#7d7265]">Initial trip target ceiling</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8a7f71]">
            <span className="text-xs uppercase font-bold tracking-wider">Allocated Expenses</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#2b2621]">${totalAllocated.toLocaleString()}</p>
          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                totalAllocated > totalBudget ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, Math.round((totalAllocated / totalBudget) * 100))}%`
              }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8a7f71]">
            <span className="text-xs uppercase font-bold tracking-wider">Remaining Buffer</span>
            <ArrowUpRight
              className={`w-4 h-4 ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
            />
          </div>
          <p
            className={`text-2xl font-bold ${
              remainingBudget >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            ${remainingBudget.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#7d7265]">
            {remainingBudget >= 0 ? 'Safe within target budget' : 'Exceeding budget plan'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8a7f71]">
            <span className="text-xs uppercase font-bold tracking-wider">Daily Burn Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#2b2621]">${dailyAverage.toLocaleString()} / day</p>
          <p className="text-[11px] text-[#7d7265]">Across {itinerary.totalDays} full days</p>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="p-6 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#2b2621] flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-[#c85a32]" />
          <span>Category Expense Allocation</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTotals
            .filter((c) => c.amount > 0)
            .map((cat) => {
              const colorInfo = CATEGORY_COLORS[cat.category];
              return (
                <div
                  key={cat.category}
                  className={`p-4 rounded-2xl ${colorInfo.bg} border ${colorInfo.border} space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${colorInfo.text}`}>{cat.category}</span>
                    <span className="text-xs font-bold text-[#2b2621]">${cat.amount}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorInfo.fill}`}
                      style={{ width: `${Math.round(cat.percent)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#7d7265] block text-right font-medium">
                    {Math.round(cat.percent)}% of spend
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Expense Item List with Category Filters */}
      <div className="p-6 rounded-3xl bg-white border border-[#dfd4c5] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-[#c85a32]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2b2621]">
              Itemized Expenses ({filteredExpenses.length})
            </h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'All'
                  ? 'bg-[#2b2621] text-white'
                  : 'bg-[#faf7f2] text-[#6e6357] border border-[#dfd4c5] hover:text-[#2b2621]'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === c
                    ? 'bg-[#2b2621] text-white'
                    : 'bg-[#faf7f2] text-[#6e6357] border border-[#dfd4c5] hover:text-[#2b2621]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#dfd4c5] rounded-2xl bg-[#faf7f2]">
            <p className="text-xs text-[#8a7f71]">No expenses recorded under this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e8ded1]">
            {filteredExpenses.map((exp) => {
              const colorInfo = CATEGORY_COLORS[exp.category];
              return (
                <div
                  key={exp.id}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#faf7f2]/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleTogglePaid(exp.id)}
                      className="text-[#8a7f71] hover:text-emerald-600 transition-colors"
                      title={exp.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                    >
                      {exp.isPaid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Clock className="w-5 h-5 text-[#baa996]" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs sm:text-sm font-bold text-[#2b2621] truncate">
                          {exp.title}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorInfo.bg} ${colorInfo.text}`}
                        >
                          {exp.category}
                        </span>
                        {exp.isPaid ? (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                            Paid
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                      {exp.notes && (
                        <p className="text-[11px] text-[#7d7265] truncate">{exp.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold text-[#2b2621]">
                      ${exp.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-1.5 text-[#8a7f71] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#dfd4c5] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8ded1]">
              <h3 className="font-serif-heading text-lg font-bold text-[#2b2621]">
                Log Trip Expense
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8a7f71] hover:text-[#2b2621] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2b2621] mb-1">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bullet Train ticket, Sunset dinner"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2b2621] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
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
                  <label className="block font-bold text-[#2b2621] mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2b2621] mb-1">Notes / Confirmation</label>
                <input
                  type="text"
                  placeholder="e.g. Table reservation for 2, receipt saved"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#dfd4c5] focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isPaidCheck"
                  checked={newIsPaid}
                  onChange={(e) => setNewIsPaid(e.target.checked)}
                  className="rounded text-[#c85a32] focus:ring-[#c85a32]"
                />
                <label htmlFor="isPaidCheck" className="text-[#2b2621] font-semibold">
                  Already paid & settled
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-[#e8ded1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-[#7d7265] hover:bg-[#faf7f2] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#c85a32] text-white hover:bg-[#b34822] font-semibold shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
