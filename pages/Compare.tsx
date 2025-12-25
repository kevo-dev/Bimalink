
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface CompareProps {
  selectedProducts: Product[];
  onClear: () => void;
  onRemove: (p: Product) => void;
}

export const Compare: React.FC<CompareProps> = ({ selectedProducts, onClear, onRemove }) => {
  // Logic to identify highlights
  const { cheapestId, topRatedId } = useMemo(() => {
    if (selectedProducts.length < 2) return { cheapestId: null, topRatedId: null };

    // Find the minimum price
    const minPrice = Math.min(...selectedProducts.map(p => p.basePrice));
    const cheapest = selectedProducts.find(p => p.basePrice === minPrice);

    // Find the maximum rating
    const maxRating = Math.max(...selectedProducts.map(p => p.rating));
    const topRated = selectedProducts.find(p => p.rating === maxRating);

    return {
      cheapestId: cheapest?.id || null,
      topRatedId: topRated?.id || null
    };
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
        <Link to="/products" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">
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
            <nav className="text-sm text-slate-400 mb-2">
              <Link to="/products" className="hover:text-blue-600">Products</Link> / <span className="text-slate-600">Comparison</span>
            </nav>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Compare Your Options</h1>
            <p className="text-slate-500 text-lg mt-2">Helping you make the most informed decision for your protection.</p>
          </div>
          <button 
            onClick={onClear} 
            className="flex items-center space-x-2 text-red-500 font-bold hover:text-red-600 transition group"
          >
            <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition">
              <i className="fas fa-trash-alt"></i>
            </div>
            <span>Reset Comparison</span>
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {selectedProducts.map((p) => {
            const isCheapest = p.id === cheapestId;
            const isTopRated = p.id === topRatedId;

            return (
              <div 
                key={p.id} 
                className={`relative bg-white rounded-3xl border transition-all duration-500 flex flex-col ${
                  isCheapest || isTopRated 
                    ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-2xl scale-[1.02] z-10' 
                    : 'border-slate-200 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Highlight Badges Container */}
                <div className="absolute -top-4 left-0 right-0 flex flex-col items-center gap-1.5 z-20">
                  {isCheapest && (
                    <span className="bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-white/20 animate-in slide-in-from-top-2">
                      <i className="fas fa-tag mr-1"></i> Best Value
                    </span>
                  )}
                  {isTopRated && (
                    <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-white/20 animate-in slide-in-from-top-2">
                      <i className="fas fa-crown mr-1"></i> Top Rated
                    </span>
                  )}
                </div>

                {/* Card Header */}
                <div className="p-8 pb-4 border-b border-slate-50">
                  <button 
                    onClick={() => onRemove(p)}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition shadow-sm"
                    title="Remove from comparison"
                  >
                    <i className="fas fa-times"></i>
                  </button>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl p-2 border border-slate-100 flex items-center justify-center shadow-inner">
                      <img src={p.logo} alt={p.provider} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-blue-600 text-xs font-black uppercase tracking-tighter">{p.provider}</p>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{p.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900">KES {p.basePrice.toLocaleString()}</span>
                    <span className="text-slate-400 font-bold text-sm">/ year</span>
                  </div>
                  <div className="flex items-center mt-2 text-yellow-500 space-x-1">
                    <i className="fas fa-star text-xs"></i>
                    <span className="text-sm font-bold text-slate-700">{p.rating} Trust Score</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-8 pt-6 space-y-6 flex-grow">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Benefits</h4>
                    <div className="space-y-3">
                      {allBenefits.map((benefit, idx) => {
                        const hasBenefit = p.benefits.includes(benefit);
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-start space-x-3 text-sm p-3 rounded-xl transition-all duration-300 ${
                              hasBenefit ? 'bg-blue-50/50 text-slate-700' : 'opacity-30 grayscale scale-95'
                            }`}
                          >
                            <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                              hasBenefit ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                            }`}>
                              <i className={`fas ${hasBenefit ? 'fa-check' : 'fa-times'} text-[8px]`}></i>
                            </div>
                            <span className={hasBenefit ? 'font-medium' : 'line-through'}>{benefit}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 pt-0 mt-auto">
                  <Link 
                    to="/contact" 
                    className="block w-full text-center bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    Select Plan
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Add More Slot */}
          {selectedProducts.length < 3 && (
            <Link 
              to="/products"
              className="group border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center p-8 min-h-[400px] hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition shadow-sm">
                <i className="fas fa-plus text-slate-400 group-hover:text-blue-600"></i>
              </div>
              <p className="font-bold text-slate-500 group-hover:text-blue-600">Add Another Plan</p>
              <p className="text-sm text-slate-400 text-center mt-2 max-w-[180px]">Compare up to 3 different options at once.</p>
            </Link>
          )}
        </div>

        {/* Comparison Insight Footer */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl shadow-inner">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Need expert advice?</h4>
              <p className="text-slate-600">Our certified brokers can help you understand the fine print of these specific plans.</p>
            </div>
          </div>
          <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition whitespace-nowrap shadow-lg shadow-blue-200">
            Request Callback
          </Link>
        </div>
      </div>
    </div>
  );
};
