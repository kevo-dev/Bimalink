
"use client";

import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '@/constants';
import { ProductCard } from '@/components/ProductCard';
import { InsuranceType } from '@/types';
import { useComparison } from '@/context/ComparisonContext';

export default function ProductsPage() {
  const { toggleComparison, selectedProducts } = useComparison();
  const selectedIds = selectedProducts.map(p => p.id);
  const [filter, setFilter] = useState<InsuranceType | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesType = filter === 'All' || p.type === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.provider.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Insurance Products</h1>
          <p className="text-slate-600">Explore and compare the best insurance deals in Kenya.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="w-full md:w-auto flex flex-wrap gap-2">
            {['All', ...Object.values(InsuranceType)].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="w-full md:w-80 relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search provider..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Results */}
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
      </div>
    </div>
  );
}
