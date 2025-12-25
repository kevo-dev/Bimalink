
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Compare } from './pages/Compare';
import { Blog } from './pages/Blog';
import { Community } from './pages/Community';
import { Contact } from './pages/Contact';
import { Product } from './types';

const App: React.FC = () => {
  const [selectedForComparison, setSelectedForComparison] = useState<Product[]>([]);

  const toggleComparison = (product: Product) => {
    setSelectedForComparison(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) {
          alert("You can only compare up to 3 products at a time.");
          return prev;
      }
      return [...prev, product];
    });
  };

  const clearComparison = () => setSelectedForComparison([]);

  // Scroll to top on route change
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar comparisonCount={selectedForComparison.length} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onCompareToggle={toggleComparison} selectedIds={selectedForComparison.map(p => p.id)} />} />
            <Route path="/products" element={<Products onCompareToggle={toggleComparison} selectedIds={selectedForComparison.map(p => p.id)} />} />
            <Route path="/compare" element={<Compare selectedProducts={selectedForComparison} onClear={clearComparison} onRemove={toggleComparison} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Comparison Bar */}
        {selectedForComparison.length > 0 && (
          <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 bg-white shadow-2xl border border-blue-100 rounded-xl p-4 z-50 animate-bounce-subtle">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-blue-900">Comparison ({selectedForComparison.length}/3)</h3>
              <button onClick={clearComparison} className="text-xs text-red-500 hover:underline">Clear all</button>
            </div>
            <div className="flex gap-2 mb-3">
              {selectedForComparison.map(p => (
                <div key={p.id} className="relative w-12 h-12 border rounded p-1">
                  <img src={p.logo} alt={p.name} className="w-full h-full object-contain" />
                  <button 
                    onClick={() => toggleComparison(p)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Link 
              to="/compare" 
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Compare Now
            </Link>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
