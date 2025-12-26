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
    logo: 'https://images.unsplash.com/photo-1549890762-0a3f8933ad76?auto=format&fit=crop&q=80&w=100'
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
    logo: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=100'
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
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '4',
    name: 'UAP Old Mutual Motor',
    provider: 'UAP Old Mutual',
    type: InsuranceType.MOTOR,
    basePrice: 11000,
    benefits: ['Loss of keys cover', 'Personal accident', 'Authorized repairers', 'Political violence cover', 'Towing services', 'Emergency medical expenses'],
    description: 'High-tier protection for your luxury and utility vehicles. UAP Old Mutual leverages international standards to provide premium roadside assistance and security.',
    rating: 4.6,
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '5',
    name: 'GA Smart Travel',
    provider: 'GA Insurance',
    type: InsuranceType.TRAVEL,
    basePrice: 2500,
    benefits: ['Emergency medical', 'Baggage loss', 'Trip cancellation', 'COVID-19 cover', 'Flight delay compensation', 'Legal assistance abroad'],
    description: 'Worry-free travel with worldwide assistance networks. Whether you are flying to Europe for business or the Coast for a holiday, GA has your back.',
    rating: 4.9,
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '6',
    name: 'Madison Life Planner',
    provider: 'Madison Insurance',
    type: InsuranceType.LIFE,
    basePrice: 5000,
    benefits: ['Education savings', 'Retirement plan', 'Term life benefits', 'Bonus payments', 'Flexible contribution', 'Guaranteed maturity value'],
    description: 'Madison Life Planner is more than just insurance; it is a long-term savings partner that ensures your children\'s education is secure regardless of life\'s surprises.',
    rating: 4.4,
    logo: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=100'
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
  },
  {
    id: 'b2',
    title: 'Top 5 Health Insurance Providers for Families',
    excerpt: 'A comprehensive comparison of inpatient limits and outpatient benefits across major Kenyan insurance providers.',
    date: 'Nov 12, 2023',
    author: 'Insurance Guru',
    source: 'The Standard',
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200'
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

const summarizeNews = async (content: string) => {
  try {
    const ai = getAIInstance();
    if (!ai) return content;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this Kenyan insurance news into exactly 2 short sentences: ${content}`,
    });
    return response.text || content;
  } catch (error) {
    return content;
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

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem('bimalink_comparison');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map saved IDs back to full product objects from our mock data
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
      if (prev.length >= 3) {
        alert("You can only compare up to 3 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearComparison = () => setSelectedProducts([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

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

const ProductDetailModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { setView, toggleComparison, selectedProducts } = useApp();
  const isSelected = selectedProducts.some(p => p.id === product.id);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors z-20 bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Sidebar Panel */}
        <div className="md:w-1/3 bg-slate-50 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100">
          <div className="bg-white rounded-2xl p-4 w-28 h-28 shadow-sm border border-slate-200 mb-6 flex items-center justify-center">
            <img src={product.logo} alt={product.provider} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="text-center">
            <h4 className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">{product.provider}</h4>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">{product.name}</h2>
            <div className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-bold mb-8">
              <i className="fas fa-star"></i>
              <span>{product.rating} Industry Rating</span>
            </div>
          </div>
          
          <div className="mt-auto w-full text-center p-6 bg-white rounded-2xl border border-blue-50 shadow-sm">
             <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-tighter">Annual Premium</p>
             <p className="text-2xl font-black text-blue-600">KES {product.basePrice.toLocaleString()}</p>
             <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Inclusive of IRA Levy</p>
          </div>
        </div>

        {/* Details Panel */}
        <div className="md:w-2/3 p-8 md:p-12 overflow-y-auto">
          <div className="mb-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Description</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{product.description}</p>
          </div>
          
          <div className="mb-12">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Benefits</h3>
            <div className="grid grid-cols-1 gap-3">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start space-x-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="mt-0.5 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  <span className="font-bold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { onClose(); setView('contact'); }}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-200 flex items-center justify-center"
            >
              Get Custom Quote <i className="fas fa-arrow-right ml-3"></i>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleComparison(product); }}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center ${isSelected ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-600'}`}
            >
              <i className={`fas ${isSelected ? 'fa-minus-circle' : 'fa-plus-circle'} mr-2`}></i>
              {isSelected ? 'Remove from Comparison' : 'Add to Comparison'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; isSelected: boolean; onDetailClick: (p: Product) => void }> = ({ product, isSelected, onDetailClick }) => {
  const { toggleComparison, setView } = useApp();
  return (
    <div 
      onClick={() => onDetailClick(product)}
      className={`group cursor-pointer bg-white rounded-2xl border transition-all duration-500 flex flex-col hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-lg' : 'border-slate-200 shadow-sm'}`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-50 rounded-xl p-2 w-16 h-16 flex items-center justify-center border border-slate-100 group-hover:border-blue-100 transition-colors">
            <img src={product.logo} alt={product.provider} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
            <i className="fas fa-star"></i>
            <span>{product.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{product.name}</h3>
        <p className="text-blue-600 text-sm font-semibold mb-4 uppercase tracking-widest text-[10px]">{product.provider}</p>
        <div className="space-y-2 mb-6 min-h-[100px]">
          {product.benefits.slice(0, 3).map((benefit, idx) => (
            <div key={idx} className="flex items-center text-sm text-slate-600">
              <i className="fas fa-check text-green-500 mr-2 text-[10px]"></i>
              <span className="line-clamp-1">{benefit}</span>
            </div>
          ))}
          {product.benefits.length > 3 && (
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mt-1">+ {product.benefits.length - 3} additional benefits</p>
          )}
        </div>
        <div className="mt-auto pt-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Premium from</p>
              <p className="text-xl font-black text-slate-900">KES {product.basePrice.toLocaleString()}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleComparison(product); }}
              className={`p-3 rounded-xl transition-all border flex items-center justify-center ${
                isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600'
              }`}
              title={isSelected ? "Remove from comparison" : "Add to comparison"}
            >
              <i className={`fas ${isSelected ? 'fa-minus' : 'fa-plus'}`}></i>
            </button>
          </div>
          
          {isSelected && (
            <button 
              onClick={(e) => { e.stopPropagation(); setView('compare'); }}
              className="w-full bg-blue-50 text-blue-600 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all animate-in fade-in"
            >
              Compare Now <i className="fas fa-arrow-right ml-1"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { currentView, setView } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'insights', label: 'Insights' },
    { id: 'community', label: 'Community' },
    { id: 'contact', label: 'Get Quote' },
  ];

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
          {links.map(link => (
            <button 
              key={link.id} 
              onClick={() => setView(link.id)}
              className={`text-sm font-bold transition ${currentView === link.id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              {link.label}
            </button>
          ))}
          <button onClick={() => setView('contact')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition shadow-lg">
            Start Saving
          </button>
        </div>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-slate-600 p-2">
          <i className={`fas ${mobileMenu ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
        </button>
      </div>
      {mobileMenu && (
        <div className="md:hidden bg-white border-t p-4 space-y-2 animate-in">
          {links.map(link => (
            <button 
              key={link.id} 
              onClick={() => { setView(link.id); setMobileMenu(false); }}
              className="block w-full text-left p-4 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { setView } = useApp();
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <i className="fas fa-shield-alt text-blue-500 text-2xl"></i>
              <span className="text-2xl font-bold text-white">BimaLink</span>
            </div>
            <p className="text-sm leading-relaxed">The smartest way for Kenyans to compare and buy insurance from Jubilee, Britam, APA, and more.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setView('products')} className="hover:text-blue-400">All Products</button></li>
              <li><button onClick={() => setView('insights')} className="hover:text-blue-400">Industry News</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-blue-400">Talk to Broker</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <p className="text-xs mb-2">Call us: +254 700 000 000</p>
            <p className="text-xs">Email: hello@bimalink.co.ke</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <input type="email" placeholder="Email" className="bg-transparent px-3 py-2 text-xs w-full outline-none" />
              <button className="bg-blue-600 text-white px-4 rounded-md"><i className="fas fa-paper-plane text-xs"></i></button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs">© {new Date().getFullYear()} BimaLink Kenya. Licensed by Insurance Regulatory Authority (IRA).</p>
      </div>
    </footer>
  );
};

// --- View Components ---
const HomeView = () => {
  const { setView, selectedProducts } = useApp();
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const selectedIds = selectedProducts.map(p => p.id);
  
  return (
    <div className="animate-in">
      <section className="relative h-[80vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" />
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Featured Covers</h2>
            <p className="text-slate-500">Chosen by 50,000+ Kenyans this month.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.slice(0, 3).map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                isSelected={selectedIds.includes(p.id)} 
                onDetailClick={setActiveProduct}
              />
            ))}
          </div>
        </div>
      </section>
      {activeProduct && <ProductDetailModal product={activeProduct} onClose={() => setActiveProduct(null)} />}
    </div>
  );
};

const ProductsView = () => {
  const { selectedProducts } = useApp();
  const [filter, setFilter] = useState<InsuranceType | 'All'>('All');
  const [search, setSearch] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const selectedIds = selectedProducts.map(p => p.id);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesType = filter === 'All' || p.type === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.provider.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="bg-slate-50 py-16 min-h-screen animate-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Insurance Marketplace</h1>
          <p className="text-slate-500 font-medium">Transparent quotes from the best providers.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All', ...Object.values(InsuranceType)].map(t => (
              <button 
                key={t} onClick={() => setFilter(t as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96 ml-auto">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
            <input 
              type="text" placeholder="Search provider..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isSelected={selectedIds.includes(p.id)} 
              onDetailClick={setActiveProduct}
            />
          ))}
        </div>
      </div>
      {activeProduct && <ProductDetailModal product={activeProduct} onClose={() => setActiveProduct(null)} />}
    </div>
  );
};

const CompareView = () => {
  const { selectedProducts, clearComparison, setView } = useApp();
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  if (selectedProducts.length === 0) {
    return (
      <div className="py-32 text-center animate-in">
        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <i className="fas fa-layer-group text-4xl text-slate-300"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Your list is empty</h2>
        <p className="text-slate-500 mb-10">Select at least two products to see a side-by-side comparison.</p>
        <button onClick={() => setView('products')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-100">Browse Products</button>
      </div>
    );
  }

  const allBenefits = Array.from(new Set(selectedProducts.flatMap(p => p.benefits)));

  return (
    <div className="bg-slate-50 py-16 animate-in min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={() => setView('products')} className="text-blue-600 font-bold mb-4 flex items-center hover:translate-x-[-4px] transition-transform">
              <i className="fas fa-arrow-left mr-2"></i> Back to Products
            </button>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Plan Comparison</h1>
            <p className="text-slate-500">Comparing {selectedProducts.length} plans side-by-side.</p>
          </div>
          <button onClick={clearComparison} className="text-red-500 font-bold hover:bg-red-50 px-6 py-3 rounded-xl border border-red-100 transition-colors">Clear All Selection</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedProducts.map(p => (
            <div 
              key={p.id} 
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col hover:border-blue-200 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group"
              onClick={() => setActiveProduct(p)}
            >
              <div className="flex items-center space-x-4 mb-8">
                <img src={p.logo} alt={p.name} className="w-12 h-12 object-contain bg-slate-50 p-1 rounded-lg" />
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{p.provider}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl mb-8 text-center border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Yearly Premium</p>
                <p className="text-3xl font-black text-slate-900">KES {p.basePrice.toLocaleString()}</p>
              </div>
              <div className="space-y-4 flex-grow mb-8">
                {allBenefits.map((b, i) => (
                  <div key={i} className={`flex items-start text-sm ${p.benefits.includes(b) ? 'text-slate-700' : 'text-slate-300'}`}>
                    <i className={`fas ${p.benefits.includes(b) ? 'fa-check text-green-500' : 'fa-times'} mr-3 mt-1`}></i>
                    <span className={!p.benefits.includes(b) ? 'line-through' : 'font-medium'}>{b}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setView('contact'); }} 
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition"
              >
                Select This Plan
              </button>
            </div>
          ))}
        </div>
      </div>
      {activeProduct && <ProductDetailModal product={activeProduct} onClose={() => setActiveProduct(null)} />}
    </div>
  );
};

const InsightsView = () => {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const s: Record<string, string> = {};
      for (const blog of MOCK_BLOGS) {
        s[blog.id] = await summarizeNews(blog.excerpt);
      }
      setSummaries(s);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="bg-white py-24 animate-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Insurance Insights</h1>
          <p className="text-slate-500">AI-powered summaries of the latest industry news in Kenya.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {MOCK_BLOGS.map(blog => (
            <article key={blog.id} className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:shadow-xl transition-all duration-300">
              <img src={blog.imageUrl} className="w-full md:w-48 h-48 object-cover rounded-2xl" />
              <div className="flex-grow">
                <div className="text-[10px] font-bold text-blue-600 uppercase mb-2">{blog.source} • {blog.date}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{blog.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{loading ? 'AI is summarizing...' : (summaries[blog.id] || blog.excerpt)}</p>
                <button className="text-slate-900 font-bold text-xs uppercase hover:text-blue-600 transition">Read Original <i className="fas fa-external-link-alt ml-1"></i></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommunityView = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([
    { id: '1', author: 'Njoroge M.', content: 'Has anyone tried the UAP motor cover? How is their claim process?', likes: 4, timestamp: '1 hour ago', replies: [] },
    { id: '2', author: 'Amina S.', content: 'What is the best maternity cover for Aga Khan Hospital?', likes: 12, timestamp: '3 hours ago', replies: [{ id: 'r1', author: 'Sarah K.', content: 'Britam Milele covers Aga Khan fully!', timestamp: '2 hours ago' }] }
  ]);
  const [newPost, setNewPost] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const p: CommunityPost = { id: Date.now().toString(), author: 'Guest User', content: newPost, likes: 0, timestamp: 'Just now', replies: [] };
    setPosts([p, ...posts]);
    setNewPost('');
    if (newPost.includes('?')) {
      setIsBotThinking(true);
      const advice = await getInsuranceAdvice(newPost);
      setPosts(prev => prev.map(post => post.id === p.id ? { ...post, replies: [{ id: 'ai'+Date.now(), author: 'BimaBot AI', content: advice, timestamp: 'Moments later' }] } : post));
      setIsBotThinking(false);
    }
  };

  return (
    <div className="bg-slate-50 py-24 animate-in">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-black text-slate-900 mb-8 text-center tracking-tighter">Community Board</h1>
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <form onSubmit={handlePost}>
            <textarea 
              className="w-full bg-slate-50 rounded-2xl p-6 min-h-[140px] outline-none border border-slate-100 focus:border-blue-300 transition mb-4 font-medium"
              placeholder="Ask a question about Kenyan insurance..."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase"><i className="fas fa-robot mr-1 text-blue-500"></i> BimaBot AI answers questions</span>
              <button disabled={isBotThinking} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100">
                {isBotThinking ? 'Thinking...' : 'Post Message'}
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">{post.author[0]}</div>
                <div><h4 className="font-bold text-slate-900">{post.author}</h4><p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{post.timestamp}</p></div>
              </div>
              <p className="text-slate-700 mb-6 font-medium text-lg leading-relaxed">{post.content}</p>
              {post.replies.map(r => (
                <div key={r.id} className={`p-6 rounded-2xl mb-2 border ${r.author.includes('AI') ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                   <h5 className="text-xs font-black text-slate-900 mb-1">{r.author.includes('AI') && <i className="fas fa-robot text-blue-600 mr-1"></i>}{r.author}</h5>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContactView = () => {
  const [sent, setSent] = useState(false);
  return (
    <div className="bg-white min-h-[80vh] flex animate-in">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2">
        <div className="bg-slate-900 text-white p-12 lg:p-24 flex flex-col justify-center">
          <h1 className="text-5xl font-black mb-8 leading-tight tracking-tighter">Expert Brokerage at Your <span className="text-blue-500">Service.</span></h1>
          <p className="text-xl text-slate-400 mb-12 font-medium">Submit your details and a licensed advisor will call you to finalize your selection with any of our 25+ partners.</p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4"><div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 shadow-inner"><i className="fas fa-phone"></i></div><div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Call our team</p><p className="font-black text-xl tracking-tight">+254 700 123 456</p></div></div>
            <div className="flex items-center space-x-4"><div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-green-400 shadow-inner"><i className="fas fa-envelope"></i></div><div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email support</p><p className="font-black text-xl tracking-tight">hello@bimalink.co.ke</p></div></div>
          </div>
        </div>
        <div className="p-12 lg:p-24 bg-slate-50 flex items-center justify-center">
          {sent ? (
            <div className="text-center animate-in">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-3xl shadow-xl shadow-green-100"><i className="fas fa-check"></i></div>
               <h2 className="text-3xl font-black mb-2 tracking-tighter">Request Sent!</h2>
               <p className="text-slate-500 mb-8 font-medium">An advisor will call you within 30 minutes.</p>
               <button onClick={() => setSent(false)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-slate-100">New Quote Request</button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="w-full max-w-md space-y-6">
              <input required placeholder="Full Name" className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition font-medium" />
              <input required type="tel" placeholder="Phone Number" className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition font-medium" />
              <input required type="email" placeholder="Email Address" className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition font-medium" />
              <textarea placeholder="Tell us more about your needs..." className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition font-medium h-32" />
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-95">Get Expert Callback</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ComparisonBar = () => {
  const { selectedProducts, clearComparison, setView, toggleComparison } = useApp();
  if (selectedProducts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[350px] bg-white rounded-3xl shadow-2xl border-2 border-blue-500 p-6 z-50 animate-in zoom-in duration-300 transform-gpu">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-slate-900 flex items-center">
          <i className="fas fa-columns text-blue-600 mr-2"></i> Compare ({selectedProducts.length}/3)
        </h3>
        <button onClick={clearComparison} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline">Clear</button>
      </div>
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {selectedProducts.map(p => (
          <div key={p.id} className="relative w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl p-2 flex-shrink-0 group">
             <img src={p.logo} className="w-full h-full object-contain" />
             <button onClick={() => toggleComparison(p)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow-lg hover:bg-red-600 transition">×</button>
          </div>
        ))}
        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => <div key={i} className="w-14 h-14 bg-slate-50 border border-dashed border-slate-200 rounded-xl" />)}
      </div>
      <button 
        onClick={() => setView('compare')} 
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center"
      >
        View Full Comparison <i className="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  );
};

// --- Main App ---
const App = () => {
  const { currentView } = useApp();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'compare' && <CompareView />}
        {currentView === 'insights' && <InsightsView />}
        {currentView === 'community' && <CommunityView />}
        {currentView === 'contact' && <ContactView />}
      </main>
      <Footer />
      <ComparisonBar />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<AppProvider><App /></AppProvider>);
}
