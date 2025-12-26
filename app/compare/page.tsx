
"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useComparison } from '@/context/ComparisonContext';

export default function ComparePage() {
  const { selectedProducts, clearComparison, toggleComparison } = useComparison();

  // Find the minimum price and maximum rating among selected products
  const { cheapestIds, topRatedIds } = useMemo(() => {
    if (selectedProducts.length === 0) return { cheapestIds: [], topRatedIds: [] };
    
    const minPrice = Math.min(...selectedProducts.map(p => p.basePrice));
    const cheapest = selectedProducts
      .filter(p => p.basePrice === minPrice)
      .map(p => p.id);

    const maxRating = Math.max(...selectedProducts.map(p => p.rating));
    const topRated = selectedProducts
      .filter(p => p.rating === maxRating)
      .map(p => p.id);

    return { cheapestIds: cheapest, topRatedIds: topRated };
  }, [selectedProducts]);

  if (selectedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-100 inline-block p-10 rounded-full mb-8">
          <i className="fas fa-columns text-6xl text-slate-300"></i>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Your comparison list is empty</h1>
        <p className="text-slate-500 text-xl mb-12 max-w-lg mx-auto">
          Start exploring our insurance products and add up to 3 plans to compare them side-by-side.
        </p>
        <Link href="/products" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">
          Browse All Products
        </Link>
      </div>
    );
  }

  const allBenefits = Array.from(new Set(selectedProducts.flatMap(p => p.benefits)));

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Compare Your Options</h1>
            <p className="text-slate-500 text-lg mt-2">Helping you make the most informed decision for your protection.</p>
          </div>
          <button onClick={clearComparison} className="flex items-center space-x-2 text-red-500 font-bold hover:text-red-600 transition group">
            <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition">
              <i className="fas fa-trash-alt"></i>
            </div>
            <span>Reset Comparison</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {selectedProducts.map((p) => {
            const isCheapest = cheapestIds.includes(p.id);
            const isTopRated = topRatedIds.includes(p.id);
            
            return (
              <div 
                key={p.id} 
                className={`relative bg-white rounded-3xl border p-8 flex flex-col transition-all duration-500 ${
                  isCheapest || isTopRated 
                    ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-2xl scale-[1.02]' 
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                
                {/* Feature Badges */}
                <div className="flex flex-wrap gap-2 absolute -top-4 left-6 z-10">
                  {isCheapest && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg border-2 border-white flex items-center animate-pulse">
                      <i className="fas fa-tag mr-1.5"></i> Lowest Price
                    </span>
                  )}
                  {isTopRated && (
                    <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg border-2 border-white flex items-center">
                      <i className="fas fa-crown mr-1.5"></i> Top Rated
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => toggleComparison(p)} 
                  className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove from comparison"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>

                <div className="h-16 flex items-center mb-6">
                  <img src={p.logo} alt={p.provider} className="h-full w-auto object-contain" />
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-slate-900">{p.name}</h3>
                <p className="text-blue-600 text-sm font-semibold mb-6 uppercase tracking-widest">{p.provider}</p>
                
                <div className={`rounded-2xl p-6 mb-8 border transition-colors duration-500 ${isCheapest ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isCheapest ? 'text-emerald-600' : 'text-slate-400'}`}>
                    Annual Premium
                  </p>
                  <div className="text-3xl font-black text-slate-900">
                    KES {p.basePrice.toLocaleString()} 
                    <span className="text-sm text-slate-400 font-normal ml-1">/ yr</span>
                  </div>
                </div>

                <div className="space-y-4 flex-grow mb-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Benefits</p>
                  {allBenefits.map((benefit, i) => (
                    <div 
                      key={i} 
                      className={`flex items-start text-sm transition-opacity duration-300 ${
                        p.benefits.includes(benefit) ? 'text-slate-700 font-medium' : 'text-slate-300 line-through opacity-50'
                      }`}
                    >
                      <div className={`mt-1 mr-3 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        p.benefits.includes(benefit) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <i className={`fas ${p.benefits.includes(benefit) ? 'fa-check' : 'fa-times'} text-[8px]`}></i>
                      </div>
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <Link 
                  href="/contact" 
                  className={`block text-center py-4 rounded-2xl font-black transition shadow-lg hover:shadow-blue-200 ${
                    isCheapest 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-slate-900 text-white hover:bg-blue-600'
                  }`}
                >
                  Select Plan
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
