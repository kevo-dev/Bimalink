import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { Product, InsuranceType, BlogPost, CommunityPost } from './types';
import { MOCK_PRODUCTS, MOCK_BLOGS } from './constants';
import { getInsuranceAdvice, summarizeNews } from './services/geminiService';
import { ProductCard } from './components/ProductCard';

// --- Context & State Management ---

interface ComparisonContextType {
  selectedProducts: Product[];
  toggleComparison: (product: Product) => void;
  clearComparison: () => void;
  currentView: string;
  setView: (view: string) => void;
}

const AppContext = createContext<ComparisonContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [currentView, setView] = useState('home');

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

// --- Components ---

const Navbar = () => {
  const { currentView, setView, selectedProducts } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { id: 'home', name: 'Home' },
    { id: 'products', name: 'Products' },
    { id: 'blog', name: 'Insights' },
    { id: 'community', name: 'Community' },
    { id: 'contact', name: 'Get Quotes' },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => setView('home')} className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Bima<span className="text-blue-600">Link</span></span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => setView(link.id)}
                className={`text-sm font-bold transition-all duration-200 ${
                  currentView === link.id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => setView('contact')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
            >
              Start Saving
            </button>
          </div>

          <div className="flex md:hidden items-center">
             <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
             </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2 animate-in">
          {links.map(link => (
            <button 
              key={link.id} 
              onClick={() => { setView(link.id); setIsOpen(false); }} 
              className="block w-full text-left p-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
            >
              {link.name}
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
    <footer className="bg-slate-900 text-slate-400 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <i className="fas fa-shield-alt text-blue-500 text-2xl"></i>
              <span className="text-2xl font-bold text-white">BimaLink</span>
            </div>
            <p className="leading-relaxed mb-8">
              Protecting Kenyan families and businesses with transparent, AI-powered insurance comparison tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Products</h4>
            <ul className="space-y-4 font-medium">
              <li><button onClick={() => setView('products')} className="hover:text-white transition">Motor Insurance</button></li>
              <li><button onClick={() => setView('products')} className="hover:text-white transition">Health Cover</button></li>
              <li><button onClick={() => setView('products')} className="hover:text-white transition">Life & Savings</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 font-medium">
              <li><button onClick={() => setView('blog')} className="hover:text-white transition">Blog</button></li>
              <li><button onClick={() => setView('community')} className="hover:text-white transition">Community</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-white transition">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">Get the latest insurance updates in Kenya.</p>
            <div className="flex p-1 bg-slate-800 rounded-xl">
              <input type="email" placeholder="Email address" className="bg-transparent px-4 py-2 w-full outline-none text-white text-sm" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} BimaLink Kenya. Licensed by IRA.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Views ---

const HomeView = () => {
  const { setView, toggleComparison, selectedProducts } = useApp();
  const featured = MOCK_PRODUCTS.slice(0, 3);
  const selectedIds = selectedProducts.map(p => p.id);

  return (
    <div className="animate-in">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/30">
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
               <span>Now Serving 50,000+ Kenyans</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              Smarter Insurance for <span className="text-blue-500">Every Kenyan.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Don't overpay for peace of mind. Compare top-rated motor, health, and life insurance plans from Jubilee, Britam, APA, and more in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setView('products')} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center">
                Compare Quotes <i className="fas fa-arrow-right ml-3"></i>
              </button>
              <button onClick={() => setView('contact')} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-10 py-5 rounded-2xl font-bold text-lg transition text-center">
                Free Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Insurance Partners', value: '25+' },
              { label: 'Quotes Generated', value: '1.2M+' },
              { label: 'Claims Assisted', value: '45k+' },
              { label: 'Saved per Client', value: 'KES 15k' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Trending Insurance Plans</h2>
              <p className="text-lg text-slate-600">Explore the most popular covers selected by Kenyans this month.</p>
            </div>
            <button onClick={() => setView('products')} className="text-blue-600 font-bold hover:underline flex items-center">
              View All Products <i className="fas fa-chevron-right ml-2 text-xs"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onCompareToggle={toggleComparison}
                isSelected={selectedIds.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsView = () => {
  const { toggleComparison, selectedProducts } = useApp();
  const [filter, setFilter] = useState<InsuranceType | 'All'>('All');
  const [search, setSearch] = useState('');
  const selectedIds = selectedProducts.map(p => p.id);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesType = filter === 'All' || p.type === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.provider.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="bg-slate-50 min-h-screen py-20 animate-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Marketplace</h1>
          <p className="text-xl text-slate-500">Compare over 100+ insurance products in real-time.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-12 flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {['All', ...Object.values(InsuranceType)].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  filter === type 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search provider or plan name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onCompareToggle={toggleComparison}
                isSelected={selectedIds.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <i className="fas fa-search-minus text-5xl text-slate-200 mb-4"></i>
            <p className="text-slate-500 font-bold">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CompareView = () => {
  const { selectedProducts, clearComparison, toggleComparison, setView } = useApp();

  const { cheapestId, topRatedId } = useMemo(() => {
    if (selectedProducts.length < 2) return { cheapestId: null, topRatedId: null };
    const minPrice = Math.min(...selectedProducts.map(p => p.basePrice));
    const cheapest = selectedProducts.find(p => p.basePrice === minPrice);
    const maxRating = Math.max(...selectedProducts.map(p => p.rating));
    const topRated = selectedProducts.find(p => p.rating === maxRating);
    return { cheapestId: cheapest?.id || null, topRatedId: topRated?.id || null };
  }, [selectedProducts]);

  if (selectedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in">
        <div className="bg-slate-100 inline-block p-12 rounded-full mb-8">
          <i className="fas fa-layer-group text-6xl text-slate-300"></i>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Comparison list is empty</h1>
        <p className="text-slate-500 text-xl mb-12 max-w-lg mx-auto leading-relaxed">
          Select at least two plans to see a side-by-side comparison of benefits, limits, and pricing.
        </p>
        <button onClick={() => setView('products')} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">
          Start Browsing Products
        </button>
      </div>
    );
  }

  const allBenefits = Array.from(new Set(selectedProducts.flatMap(p => p.benefits)));

  return (
    <div className="bg-slate-50 min-h-screen py-20 animate-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Comparison Analysis</h1>
            <p className="text-slate-500 text-lg mt-2 font-medium">Objective data to help you pick the perfect policy.</p>
          </div>
          <button onClick={clearComparison} className="flex items-center space-x-3 text-red-500 font-bold hover:text-red-600 transition group bg-white px-6 py-3 rounded-2xl shadow-sm border">
            <i className="fas fa-trash-alt"></i>
            <span>Clear List</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {selectedProducts.map((p) => (
            <div key={p.id} className={`relative bg-white rounded-3xl border p-10 flex flex-col transition-all ${p.id === cheapestId || p.id === topRatedId ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-2xl' : 'border-slate-200 shadow-sm'}`}>
              {p.id === cheapestId && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Best Value</div>}
              {p.id === topRatedId && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Highest Rated</div>}
              
              <button onClick={() => toggleComparison(p)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition"><i className="fas fa-times"></i></button>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl p-2 flex items-center justify-center border border-slate-100">
                  <img src={p.logo} alt={p.provider} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                   <p className="text-blue-600 text-xs font-bold uppercase tracking-wide">{p.provider}</p>
                </div>
              </div>

              <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Annual Premium</p>
                 <div className="text-3xl font-black text-slate-900">KES {p.basePrice.toLocaleString()}</div>
                 <p className="text-slate-400 text-xs mt-1">incl. taxes</p>
              </div>

              <div className="space-y-4 flex-grow mb-10">
                {allBenefits.map((benefit, i) => (
                  <div key={i} className={`flex items-start text-sm ${p.benefits.includes(benefit) ? 'text-slate-700' : 'text-slate-300'}`}>
                    <div className={`mt-1 mr-3 w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ${p.benefits.includes(benefit) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                       <i className={`fas ${p.benefits.includes(benefit) ? 'fa-check' : 'fa-times'} text-[8px]`}></i>
                    </div>
                    <span className={!p.benefits.includes(benefit) ? 'line-through' : 'font-medium'}>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setView('contact')} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition shadow-xl shadow-slate-200">
                Choose This Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BlogView = () => {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generate = async () => {
      const s: Record<string, string> = {};
      for (const blog of MOCK_BLOGS) {
        s[blog.id] = await summarizeNews(blog.excerpt);
      }
      setSummaries(s);
      setLoading(false);
    };
    generate();
  }, []);

  return (
    <div className="bg-white py-24 animate-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Market Insights</h1>
          <p className="text-xl text-slate-600 font-medium">AI-summarized news and professional guides for the savvy Kenyan policyholder.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {MOCK_BLOGS.map(blog => (
            <article key={blog.id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-blue-100 hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden h-64">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-sm uppercase tracking-widest">{blog.source}</div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-slate-400 text-xs font-bold mb-4">{blog.date}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition leading-tight">{blog.title}</h3>
                <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed flex-grow">
                  {loading ? 'Analyzing with AI...' : (summaries[blog.id] || blog.excerpt)}
                </p>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs">{blog.author[0]}</div>
                      <span className="text-xs font-bold text-slate-900">{blog.author}</span>
                   </div>
                   <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center group-hover:translate-x-1 transition">Read Full <i className="fas fa-arrow-right ml-2"></i></button>
                </div>
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
    {
      id: 'p1', author: 'Kamau N.', content: 'Which insurance company has the fastest claim settlement for motor vehicles in Kenya?', likes: 12, timestamp: '2 hours ago',
      replies: [{ id: 'r1', author: 'Sarah W.', content: 'Jubilee is usually very fast. I got my payout in 7 days.', timestamp: '1 hour ago' }]
    },
    { id: 'p2', author: 'Fatuma O.', content: 'Is maternity cover worth it for Nairobi Hospital? The premiums look quite high.', likes: 8, timestamp: '5 hours ago', replies: [] }
  ]);
  const [newPost, setNewPost] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const p: CommunityPost = { id: Date.now().toString(), author: 'Guest User', content: newPost, likes: 0, timestamp: 'Just now', replies: [] };
    setPosts([p, ...posts]);
    setNewPost('');
    if (newPost.includes('?')) {
      setIsAskingAI(true);
      const advice = await getInsuranceAdvice(newPost);
      setPosts(prev => prev.map(post => post.id === p.id ? { ...post, replies: [{ id: 'ai'+Date.now(), author: 'BimaBot AI', content: advice, timestamp: 'Moments later' }, ...post.replies] } : post));
      setIsAskingAI(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24 animate-in">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Community Wall</h1>
          <p className="text-lg text-slate-600 font-medium">Unbiased advice from fellow Kenyans and our AI experts.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <form onSubmit={handlePost}>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[140px] focus:ring-4 focus:ring-blue-100 outline-none mb-6 font-medium transition-all"
              placeholder="What insurance question is on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                <i className="fas fa-magic text-blue-500"></i>
                <span>Ask a question to trigger BimaBot AI response.</span>
              </div>
              <button type="submit" disabled={isAskingAI} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200">
                {isAskingAI ? 'Thinking...' : 'Post Message'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">{post.author[0]}</div>
                  <div>
                    <h4 className="font-black text-slate-900">{post.author}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.timestamp}</p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-red-500 transition"><i className="fas fa-heart"></i> <span className="text-xs font-bold">{post.likes}</span></button>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">{post.content}</p>
              {post.replies.map(reply => (
                <div key={reply.id} className={`p-6 rounded-2xl mt-4 border ${reply.author.includes('AI') ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {reply.author.includes('AI') && <i className="fas fa-robot text-blue-600 text-xs"></i>}
                    <h5 className="font-black text-sm text-slate-900">{reply.author}</h5>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{reply.content}</p>
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  return (
    <div className="bg-white min-h-[80vh] flex animate-in">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-slate-900 text-white p-12 lg:p-24 flex flex-col justify-center">
           <div className="inline-block bg-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase mb-8 shadow-lg">Contact Us</div>
           <h1 className="text-5xl font-black mb-8 tracking-tighter leading-tight">Your insurance search ends <span className="text-blue-500">here.</span></h1>
           <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed">Our licensed brokers are standing by to verify quotes and finalize your application with any of our 25+ partner companies.</p>
           <div className="space-y-8">
              <div className="flex items-center space-x-6">
                 <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400 text-xl shadow-inner"><i className="fas fa-phone-alt"></i></div>
                 <div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Call Our Office</p><p className="text-xl font-black">+254 700 123 456</p></div>
              </div>
              <div className="flex items-center space-x-6">
                 <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-green-400 text-xl shadow-inner"><i className="fas fa-envelope"></i></div>
                 <div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Send an Email</p><p className="text-xl font-black">hello@bimalink.co.ke</p></div>
              </div>
           </div>
        </div>
        <div className="p-12 lg:p-24 bg-slate-50 flex flex-col justify-center">
          {status === 'success' ? (
            <div className="text-center animate-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 text-4xl"><i className="fas fa-check"></i></div>
              <h2 className="text-3xl font-black mb-4">Request Received!</h2>
              <p className="text-slate-500 font-medium mb-10">An expert advisor will contact you within the next 30 minutes to discuss your selected plans.</p>
              <button onClick={() => setStatus('idle')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-slate-200">Submit Another Request</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setStatus('submitting'); setTimeout(() => setStatus('success'), 1500); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input required className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input required type="tel" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                 <input required type="email" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message (Optional)</label>
                 <textarea className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition font-medium h-40" placeholder="Tell us about your specific insurance needs..." />
              </div>
              <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center">
                {status === 'submitting' ? 'Processing...' : 'Get Expert Callback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ComparisonBar = () => {
  const { selectedProducts, setView, toggleComparison, clearComparison } = useApp();
  if (selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[380px] bg-white rounded-3xl shadow-2xl border border-blue-100 p-6 z-50 animate-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-slate-900 tracking-tight">Compare ({selectedProducts.length}/3)</h3>
        <button onClick={clearComparison} className="text-[10px] font-black uppercase text-red-500 tracking-widest hover:underline">Clear</button>
      </div>
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {selectedProducts.map(p => (
          <div key={p.id} className="relative w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl p-2 flex-shrink-0 group">
            <img src={p.logo} alt={p.name} className="w-full h-full object-contain" />
            <button 
              onClick={() => toggleComparison(p)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition"
            >
              ×
            </button>
          </div>
        ))}
        {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
          <div key={i} className="w-16 h-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300">
             <i className="fas fa-plus text-xs"></i>
          </div>
        ))}
      </div>
      <button 
        onClick={() => setView('compare')}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center"
      >
        View Analysis <i className="fas fa-analytics ml-2"></i>
      </button>
    </div>
  );
};

// --- App Root ---

const App = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch(currentView) {
      case 'home': return <HomeView />;
      case 'products': return <ProductsView />;
      case 'compare': return <CompareView />;
      case 'blog': return <BlogView />;
      case 'community': return <CommunityView />;
      case 'contact': return <ContactView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
      <ComparisonBar />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AppProvider>
      <App />
    </AppProvider>
  );
}