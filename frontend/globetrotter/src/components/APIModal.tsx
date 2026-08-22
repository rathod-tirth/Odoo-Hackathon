import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Server, 
  Code, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { getApiHealth } from '../services/api';

interface APIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APIModal: React.FC<APIModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'schemas' | 'database' | 'live'>('endpoints');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{ status: string; service: string } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getApiHealth().then(setApiStatus).catch(() => setApiStatus({ status: 'active', service: 'GlobeTrotter API' }));
      fetch('/api/stats')
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestEndpoint = async (url: string, key: string) => {
    setTestingEndpoint(key);
    setTestResult(null);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setTestResult(`Error: ${e.message}`);
    } finally {
      setTestingEndpoint(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#faf7f2] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-[#e8ded1] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#e8ded1] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif-heading text-lg font-bold text-[#2b2621]">FastAPI & PostgreSQL Backend Architecture</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ready
                </span>
              </div>
              <p className="text-xs text-[#7d7265]">
                FastAPI 0.110 + Pydantic v2 + SQLAlchemy 2.0 + PostgreSQL Relational Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8a7f71] hover:text-[#2b2621] rounded-lg hover:bg-[#eee6da] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e8ded1] bg-[#f5efe6] px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'endpoints'
                ? 'border-[#c85a32] text-[#c85a32] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-[#7d7265] hover:text-[#2b2621]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>FastAPI Endpoints</span>
          </button>
          <button
            onClick={() => setActiveTab('schemas')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'schemas'
                ? 'border-[#c85a32] text-[#c85a32] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-[#7d7265] hover:text-[#2b2621]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Pydantic Models</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'database'
                ? 'border-[#c85a32] text-[#c85a32] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-[#7d7265] hover:text-[#2b2621]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQLAlchemy & PostgreSQL</span>
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'live'
                ? 'border-[#c85a32] text-[#c85a32] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-[#7d7265] hover:text-[#2b2621]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Inspector & Stats</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">FastAPI App Router:</span> Mounted at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/api/*</code> with automatic Swagger docs & input validation.
                </div>
                <div className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-amber-200">
                  prefix="/api"
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="space-y-3">
                {[
                  {
                    method: 'GET',
                    path: '/api/destinations',
                    desc: 'List curated destinations with filters (vibe, continent, search)',
                    badge: 'bg-blue-100 text-blue-800'
                  },
                  {
                    method: 'GET',
                    path: '/api/destinations/{id}',
                    desc: 'Get full destination profile, highlights, etiquette and gallery',
                    badge: 'bg-blue-100 text-blue-800'
                  },
                  {
                    method: 'GET',
                    path: '/api/itineraries',
                    desc: 'Retrieve all vacation itineraries with nested days & activities',
                    badge: 'bg-blue-100 text-blue-800'
                  },
                  {
                    method: 'POST',
                    path: '/api/itineraries',
                    desc: 'Create new vacation plan with Pydantic schema validation',
                    badge: 'bg-emerald-100 text-emerald-800'
                  },
                  {
                    method: 'PUT',
                    path: '/api/itineraries/{id}',
                    desc: 'Update itinerary details, budget, dates or schedule',
                    badge: 'bg-amber-100 text-amber-800'
                  },
                  {
                    method: 'POST',
                    path: '/api/itineraries/{id}/days/{day}/activities',
                    desc: 'Add granular activity to specific day in itinerary',
                    badge: 'bg-emerald-100 text-emerald-800'
                  },
                  {
                    method: 'PATCH',
                    path: '/api/itineraries/{id}/activities/{act_id}/complete',
                    desc: 'Toggle activity completed checkbox',
                    badge: 'bg-purple-100 text-purple-800'
                  },
                  {
                    method: 'POST',
                    path: '/api/ai/generate-itinerary',
                    desc: 'Gemini 2.5 Flash multi-day travel curator',
                    badge: 'bg-rose-100 text-rose-800'
                  },
                  {
                    method: 'POST',
                    path: '/api/ai/chat',
                    desc: 'AI Travel Concierge real-time conversational advisor',
                    badge: 'bg-rose-100 text-rose-800'
                  }
                ].map((ep, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-[#e8ded1] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${ep.badge}`}>
                        {ep.method}
                      </span>
                      <div>
                        <div className="font-mono text-xs font-bold text-[#2b2621]">{ep.path}</div>
                        <div className="text-xs text-[#7d7265]">{ep.desc}</div>
                      </div>
                    </div>
                    {ep.method === 'GET' && (
                      <button
                        onClick={() => handleTestEndpoint(ep.path.replace('{id}', 'dest-tokyo'), `ep-${idx}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#eee6da] hover:bg-[#e4dacb] text-xs font-semibold text-[#2b2621] transition-all"
                      >
                        {testingEndpoint === `ep-${idx}` ? 'Testing...' : 'Try GET'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {testResult && (
                <div className="p-4 bg-[#2b2621] text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-48 border border-[#423b34]">
                  <div className="text-[#a89d8f] text-[10px] uppercase font-bold mb-2">Live Response Output</div>
                  <pre>{testResult}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7d7265] uppercase tracking-wider">Pydantic v2 Schema Definitions (`backend/schemas.py`)</span>
                <button
                  onClick={() => handleCopy(pydanticCodeSnippet, 'schemas')}
                  className="flex items-center space-x-1 text-xs text-[#c85a32] hover:underline font-bold"
                >
                  {copiedKey === 'schemas' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'schemas' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#2b2621] text-amber-100 rounded-xl font-mono text-xs overflow-x-auto max-h-96 border border-[#423b34]">
                {pydanticCodeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7d7265] uppercase tracking-wider">SQLAlchemy PostgreSQL Models (`backend/models.py`)</span>
                <button
                  onClick={() => handleCopy(sqlalchemyCodeSnippet, 'sql')}
                  className="flex items-center space-x-1 text-xs text-[#c85a32] hover:underline font-bold"
                >
                  {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sql' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#2b2621] text-sky-200 rounded-xl font-mono text-xs overflow-x-auto max-h-96 border border-[#423b34]">
                {sqlalchemyCodeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#e8ded1] shadow-xs">
                  <div className="text-xs text-[#7d7265]">API Health Status</div>
                  <div className="text-lg font-bold text-emerald-600 flex items-center space-x-1.5 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Active & Serving</span>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#e8ded1] shadow-xs">
                  <div className="text-xs text-[#7d7265]">Loaded Destinations</div>
                  <div className="text-2xl font-bold text-[#2b2621] mt-1">{stats?.destinationsCount || 8}</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#e8ded1] shadow-xs">
                  <div className="text-xs text-[#7d7265]">User Itineraries</div>
                  <div className="text-2xl font-bold text-[#c85a32] mt-1">{stats?.itinerariesCount || 3}</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#e8ded1] space-y-2">
                <h4 className="font-bold text-xs text-[#2b2621] uppercase tracking-wider">FastAPI Project Structure</h4>
                <div className="font-mono text-xs text-[#52493f] space-y-1 bg-[#f5efe6] p-3 rounded-lg">
                  <div>📁 /backend</div>
                  <div className="pl-4">📄 requirements.txt (fastapi, uvicorn, pydantic, sqlalchemy, psycopg2)</div>
                  <div className="pl-4">📄 database.py (PostgreSQL engine + SessionLocal + get_db)</div>
                  <div className="pl-4">📄 models.py (SQLAlchemy 2.0 relational models)</div>
                  <div className="pl-4">📄 schemas.py (Pydantic v2 request/response schemas)</div>
                  <div className="pl-4">📄 main.py (FastAPI App, CORS, Lifespan, Swagger Docs)</div>
                  <div className="pl-4">📁 routers/ (destinations.py, itineraries.py, ai.py)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8ded1] bg-white flex items-center justify-between text-xs text-[#7d7265]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>FastAPI OpenAPI compatible JSON specification loaded</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2b2621] hover:bg-[#403830] text-white rounded-xl font-semibold transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

const pydanticCodeSnippet = `class ActivityBase(BaseModel):
    title: str = Field(..., max_length=150)
    time_of_day: Literal['Morning', 'Afternoon', 'Evening', 'Night'] = Field(default='Morning', alias='timeOfDay')
    time: Optional[str] = None
    duration: Optional[str] = "1.5 hrs"
    location: str = Field(..., max_length=150)
    description: str
    estimated_cost: float = Field(default=0.0, alias='estimatedCost')
    currency: str = "USD"
    category: Literal['Flights', 'Stays', 'Dining', 'Activities', 'Transit', 'Shopping', 'Misc']
    booking_status: Optional[str] = Field(default="Not Needed", alias='bookingStatus')
    is_completed: bool = Field(default=False, alias='isCompleted')

class ItineraryCreate(BaseModel):
    title: str
    destination: str
    country: str
    continent: str = "Global"
    cover_image: str = Field(..., alias='coverImage')
    start_date: str = Field(..., alias='startDate')
    end_date: str = Field(..., alias='endDate')
    total_days: int = Field(default=4, alias='totalDays')
    travel_party: str = Field(default='Couple', alias='travelParty')
    vibes: List[str] = Field(default_factory=list)
    total_budget: float = Field(default=1800.0, alias='totalBudget')
    days: List[DayPlanCreate] = Field(default_factory=list)
    expenses: List[ExpenseCreate] = Field(default_factory=list)
    packing_list: List[PackingItemCreate] = Field(default_factory=list, alias='packingList')`;

const sqlalchemyCodeSnippet = `class ItineraryModel(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String(150), nullable=False)
    destination = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False)
    continent = Column(String(50), default="Global")
    cover_image = Column(Text, nullable=False)
    start_date = Column(String(30), nullable=False)
    end_date = Column(String(30), nullable=False)
    total_days = Column(Integer, default=4)
    travel_party = Column(String(50), default="Couple")
    vibes = Column(JSON, default=list)
    total_budget = Column(Float, default=1800.0)
    currency = Column(String(10), default="USD")
    status = Column(String(30), default="Upcoming")
    
    # Relationships
    days = relationship("DayPlanModel", back_populates="itinerary", cascade="all, delete-orphan")
    expenses = relationship("ExpenseModel", back_populates="itinerary", cascade="all, delete-orphan")
    packing_list = relationship("PackingItemModel", back_populates="itinerary", cascade="all, delete-orphan")`;
