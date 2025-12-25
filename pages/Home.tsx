
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  onCompareToggle: (p: any) => void;
  selectedIds: string[];
}

export const Home: React.FC<HomeProps> = ({ onCompareToggle, selectedIds }) => {
  const featured = MOCK_PRODUCTS.slice(0, 3);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=2070" 
            alt="Professional Kenyan Business Environment" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Protect What Matters Most in <span className="text-blue-400">Kenya</span>.
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Compare motor, health, and life insurance from top providers. Get instant quotes and expert advice tailored for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg text-center transition-all transform hover:scale-105 shadow-xl shadow-blue-900/40">
                Compare Quotes
              </Link>
              <Link to="/contact" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-8 py-4 rounded-lg font-bold text-lg text-center transition">
                Talk to an Expert
              </Link>
            </div>
            <div className="mt-10 flex items-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-green-500"></i>
                <span>100% Free Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-green-500"></i>
                <span>Verified Providers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Plans</h2>
              <p className="text-slate-600">Handpicked insurance plans from our top-rated partners.</p>
            </div>
            <Link to="/products" className="hidden sm:block text-blue-600 font-semibold hover:underline">
              View All Products <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onCompareToggle={onCompareToggle}
                isSelected={selectedIds.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by Thousands Across Kenya</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 grayscale opacity-60">
            <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=60&w=200" alt="Corporate Brand Placeholder" className="mx-auto h-8 object-contain" />
            <img src="https://images.unsplash.com/photo-1599305090748-366362a47c0a?auto=format&fit=crop&q=60&w=200" alt="Corporate Brand Placeholder" className="mx-auto h-8 object-contain" />
            <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=60&w=200" alt="Corporate Brand Placeholder" className="mx-auto h-8 object-contain" />
            <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=60&w=200" alt="Corporate Brand Placeholder" className="mx-auto h-8 object-contain" />
            <img src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=60&w=200" alt="Corporate Brand Placeholder" className="mx-auto h-8 object-contain" />
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=60&w=200" alt="Corporate Brand Placeholder" className="mx-auto h-8 object-contain" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
                alt="Diverse Team Working Together" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-8 rounded-2xl hidden md:block shadow-xl">
                <p className="text-4xl font-bold mb-1">10+</p>
                <p className="text-sm uppercase tracking-wider font-semibold opacity-80">Years of Experience</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose BimaLink?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 shadow-sm">
                    <i className="fas fa-search text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-slate-800">Unbiased Comparisons</h4>
                    <p className="text-slate-600 leading-relaxed">We are not owned by any insurance company. Our priority is finding you the best deal through transparent data.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4 shadow-sm">
                    <i className="fas fa-bolt text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-slate-800">Instant Quotes</h4>
                    <p className="text-slate-600 leading-relaxed">Stop waiting days for responses. Compare prices instantly on our secure platform optimized for Kenyan users.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4 shadow-sm">
                    <i className="fas fa-user-shield text-purple-600"></i>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-slate-800">Expert Support</h4>
                    <p className="text-slate-600 leading-relaxed">Our team of certified local brokers is available to help you navigate claims and policy terms seamlessly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to find your perfect plan?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">Join over 50,000 Kenyans who have saved an average of 15% on their insurance premiums this year.</p>
          <Link to="/products" className="bg-white text-blue-600 hover:bg-slate-100 px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
            Start Comparing Now
          </Link>
        </div>
      </section>
    </div>
  );
};
