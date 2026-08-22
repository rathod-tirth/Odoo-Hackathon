import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Compass, 
  MapPin, 
  Utensils, 
  Navigation, 
  Info,
  ChevronRight
} from 'lucide-react';
import { AIChatMessage, Itinerary } from '../types';

interface AIConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeItinerary: Itinerary | null;
  initialQuery?: string;
}

const QUICK_SUGGESTIONS = [
  'Best hidden local dinner spots near here?',
  'What is the public transit etiquette & ticketing advice?',
  'What are top 3 sunset viewpoints for photos?',
  'How much should I budget for daily street food & tipping?'
];

export const AIConciergeDrawer: React.FC<AIConciergeDrawerProps> = ({
  isOpen,
  onClose,
  activeItinerary,
  initialQuery
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello! I am your GlobeTrotter AI Concierge. I have your ${activeItinerary ? activeItinerary.destination : 'travel'} itinerary in view. Ask me anything about restaurant picks, transportation hacks, secret viewpoints, or local customs!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          activeDestination: activeItinerary?.destination || 'Global',
          activeItineraryTitle: activeItinerary?.title,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      const assistantReply =
        data.reply ||
        'I am ready to help you plan further details or recommend specific spots!';

      const assistantMsg: AIChatMessage = {
        id: `msg-bot-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble reaching the concierge network. Please try again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf7f2] border-l border-[#dfd4c5] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#e8ded1] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c85a32] to-[#e68c52] flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-serif-heading text-base font-bold text-[#2b2621]">
                    GlobeTrotter Concierge
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] text-[#7d7265]">
                  {activeItinerary ? `Advisor for ${activeItinerary.destination}` : 'Global Travel Guide'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#faf7f2] text-[#8a7f71] hover:text-[#2b2621] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#c85a32] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-[#2b2621] border border-[#dfd4c5] rounded-bl-none shadow-xs whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-[#8a7f71] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-[#7d7265] bg-white p-3 rounded-2xl border border-[#dfd4c5] self-start max-w-[80%]">
                <Loader2 className="w-4 h-4 animate-spin text-[#c85a32]" />
                <span>Concierge is typing local recommendations...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Prompt suggestions pills */}
          <div className="p-3 bg-white/60 border-t border-[#e8ded1] space-y-1.5">
            <p className="text-[10px] uppercase font-bold text-[#8a7f71] tracking-wider px-1">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 rounded-lg bg-[#faf7f2] hover:bg-[#f1ebe2] text-[#6e6357] hover:text-[#2b2621] text-[11px] border border-[#e8ded1] transition-all text-left truncate max-w-full"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#e8ded1] flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask about trains, dinner reservations, secret spots..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-[#dfd4c5] text-xs focus:outline-none focus:ring-1 focus:ring-[#c85a32]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-[#c85a32] hover:bg-[#b34822] disabled:opacity-50 text-white rounded-xl shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
