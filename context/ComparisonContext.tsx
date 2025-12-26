
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';
import Link from 'next/link';

interface ComparisonContextType {
  selectedProducts: Product[];
  toggleComparison: (product: Product) => void;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

// Fix: Use React.FC to correctly type children for the provider, resolving TS error in layout.tsx line 27
export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

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

  return (
    <ComparisonContext.Provider value={{ selectedProducts, toggleComparison, clearComparison }}>
      {children}
      {/* Floating Comparison Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 bg-white shadow-2xl border border-blue-100 rounded-xl p-4 z-50 animate-bounce-subtle">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-blue-900">Comparison ({selectedProducts.length}/3)</h3>
            <button onClick={clearComparison} className="text-xs text-red-500 hover:underline">Clear all</button>
          </div>
          <div className="flex gap-2 mb-3">
            {selectedProducts.map(p => (
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
            href="/compare" 
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Compare Now
          </Link>
        </div>
      )}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
