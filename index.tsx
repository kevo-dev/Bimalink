
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// --- Types ---
export enum InsuranceType {
  MOTOR = 'Motor',
  HEALTH = 'Health',
  LIFE = 'Life',
  TRAVEL = 'Travel',
  BUSINESS = 'Business'
}

export interface Product {
  id: string;
  name: string;
  provider: string;
  type: InsuranceType;
  basePrice: number;
  benefits: string[];
  description: string;
  rating: number;
  logo: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  source: string;
  imageUrl: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  replies: CommunityReply[];
  timestamp: string;
}

export interface CommunityReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// --- Constants & Mock Data ---
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Jubilee Motoring Plus',
    provider: 'Jubilee Insurance',
    type: InsuranceType.MOTOR,
    basePrice: 12500,
    benefits: ['Comprehensive coverage', '24/7 Roadside assistance', 'Windscreen cover', 'Excess protector', 'Personal Accident Cover', 'Authorized Repair Network'],
    description: 'The Gold Standard for Kenyan motorists. This comprehensive policy covers accidental damage, theft, and fire, with the fastest claim settlement track record in East Africa.',
    rating: 4.8,
    logo: 'https://images.unsplash.com/photo-1549890762-0a3f8933ad76?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: 'Britam Milele Health',
    provider: 'Britam',
    type: InsuranceType.HEALTH,
    basePrice: 15000,
    benefits: ['Inpatient up to 10M', 'Maternity cover', 'Chronic conditions included', 'Global referral', 'Post-hospitalization benefit', 'Funeral expense cover'],
    description: 'Designed for the modern Kenyan family, Milele Health offers unmatched flexibility with access to premium hospitals globally and local favorites like Nairobi Hospital.',
    rating: 4.7,
    logo: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    name: 'APA Afya Nafuu',
    provider: 'APA Insurance',
    type: InsuranceType.HEALTH,
    basePrice: 8500,
    benefits: ['Affordable premiums', 'Inpatient & Outpatient', 'Dental/Optical options', 'Last expense', 'HIV/AIDS Care', 'No Co-payment at selected hospitals'],
    description: 'Ensuring that every Kenyan has access to quality healthcare. Afya Nafuu offers a reliable safety net for outpatient visits and major hospital stays at an affordable monthly cost.',
    rating: 4.5,
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200'
  }
];

const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'New Motor Insurance Regulations in Kenya 2024',
    excerpt: 'The Insurance Regulatory Authority (IRA) has announced new guidelines focusing on digital-first valuation processes.',
    date: 'Oct 24, 2023',
    author: 'Admin',
    source: 'Business Daily',
    imageUrl: 'https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&q=80&w=1200'
  }
];

// --- Gemini Services ---
const getAIInstance = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const getInsuranceAdvice = async (query: string) => {
  try {
    const ai = getAIInstance();
    if (!ai) return "I'm currently in offline mode. For expert advice, please contact our licensed brokers at BimaLink.";
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a professional Kenyan Insurance Broker. Provide a short, helpful response to this query: ${query}. Focus on local context (Kenyan Shillings, local providers like Britam, Jubilee, APA). Keep it under 100 words.`,
    });
    return response.text || "Our brokers are reviewing your query.";
  } catch (error) {
    return "Comparing quotes is the best way to save. Jubilee and Britam are excellent options for comprehensive cover.";
  }
};

// --- Context ---
interface AppContextType {
  selectedProducts: Product[];
  toggleComparison: (product: Product) => void;
  clearComparison: () => void;
  currentView: string;
  setView: (view: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [currentView, setView] = useState('home');

  useEffect(() => {
    const saved = localStorage.getItem('bimalink_comparison');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const restored = parsed.map((id: string) => MOCK_PRODUCTS.find(p => p.id === id)).filter(Boolean);
        setSelectedProducts(restored);
      } catch (e) {
        console.error("Failed to restore comparison", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bimalink_comparison', JSON.stringify(selectedProducts.map(p => p.id)));
  }, [selectedProducts]);

  const toggleComparison = (product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  const clearComparison = () => setSelectedProducts([]);

  return (
    <AppContext.Provider value={{ selectedProducts, toggleComparison, clearComparison, currentView, setView }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- UI Components ---
const Navbar = () => {
  const { currentView, setView } = useApp();
  return (
    <nav className="bg-white border-b sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-20 items-center">
        <button onClick={() => setView('home')} className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <i className="fas fa-shield-alt text-xl"></i>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">Bima<span className="text-blue-600">Link</span></span>
        </button>
        <div className="hidden md:flex space-x-8 items-center">
          {['home', 'products', 'insights', 'community', 'contact'].map(view => (
            <button 
              key={view} 
              onClick={() => setView(view)}
              className={`text-sm font-bold transition capitalize ${currentView === view ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              {view}
            </button>
          ))}
          <button onClick={() => setView('contact')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition shadow-lg">
            Start Saving
          </button>
        </div>
      </div>
    </nav>
  );
};

const HomeView = () => {
  const { setView } = useApp();
  return (
    <div className="animate-in">
      <section className="relative h-[80vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2074" 
            className="w-full h-full object-cover" 
            alt="Hero"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Insurance That Works for <span className="text-blue-500">You.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Compare motor, health, and life insurance in seconds. Get honest advice and the lowest premiums in Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setView('products')} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-600/30">
                Compare Quotes <i className="fas fa-arrow-right ml-2"></i>
              </button>
              <button onClick={() => setView('contact')} className="bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
                Talk to an Expert
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const App = () => {
  const { currentView } = useApp();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {/* Placeholder logic for other views for local preview */}
        {currentView !== 'home' && <div className="py-20 text-center font-bold">View: {currentView} (Check Next.js deployment for full page)</div>}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800">
        © {new Date().getFullYear()} BimaLink Kenya
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<AppProvider><App /></AppProvider>);
}
