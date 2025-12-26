
"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useComparison } from '@/context/ComparisonContext';

export default function ComparePage() {
  const { selectedProducts, clearComparison, toggleComparison } = useComparison();

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedProducts.map((p) => (
            <div key={p.id} className={`relative bg-white rounded-3xl border p-8 flex flex-col ${p.id === cheapestId || p.id === topRatedId ? 'border-blue-500 ring-4 ring-blue-500/5' : 'border-slate-200 shadow-sm'}`}>
              <button onClick={() => toggleComparison(p)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><i className="fas fa-times"></i></button>
              <img src={p.logo} alt={p.provider} className="h-12 w-auto mb-6 object-contain" />
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              <p className="text-blue-600 text-sm mb-4">{p.provider}</p>
              <div className="text-2xl font-black mb-6">KES {p.basePrice.toLocaleString()} <span className="text-sm text-slate-400 font-normal">/ yr</span></div>
              <div className="space-y-4 flex-grow">
                {allBenefits.map((benefit, i) => (
                  <div key={i} className={`flex items-center text-sm ${p.benefits.includes(benefit) ? 'text-slate-700' : 'text-slate-300 line-through'}`}>
                    <i className={`fas ${p.benefits.includes(benefit) ? 'fa-check text-green-500' : 'fa-times'} mr-2`}></i>
                    {benefit}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-8 block text-center bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition">Select Plan</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
