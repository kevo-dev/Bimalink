
"use client";

import React from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/constants';
import { ProductCard } from '@/components/ProductCard';
import { useComparison } from '@/context/ComparisonContext';

export default function Home() {
  const { toggleComparison, selectedProducts } = useComparison();
  const selectedIds = selectedProducts.map(p => p.id);
  const featured = MOCK_PRODUCTS.slice(0, 3);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
            alt="Professional Kenyan team in a modern office" 
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
              <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg text-center transition-all transform hover:scale-105 shadow-xl shadow-blue-900/40">
                Compare Quotes
              </Link>
              <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-8 py-4 rounded-lg font-bold text-lg text-center transition">
                Talk to an Expert
              </Link>
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
            <Link href="/products" className="hidden sm:block text-blue-600 font-semibold hover:underline">
              View All Products <i className="fas fa-arrow-right ml-2"></i>
            </Link>
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

      {/* Trust Section */}
      <section className="py-16 bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by Thousands Across Kenya</h3>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
             <div className="flex items-center space-x-2"><i className="fas fa-landmark text-3xl"></i><span className="font-bold">KCB Bank</span></div>
             <div className="flex items-center space-x-2"><i className="fas fa-hand-holding-heart text-3xl"></i><span className="font-bold">Equity</span></div>
             <div className="flex items-center space-x-2"><i className="fas fa-building text-3xl"></i><span className="font-bold">Britam</span></div>
             <div className="flex items-center space-x-2"><i className="fas fa-shield-alt text-3xl"></i><span className="font-bold">Jubilee</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
