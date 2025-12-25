
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onCompareToggle: (p: Product) => void;
  isSelected: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onCompareToggle, isSelected }) => {
  return (
    <div className={`bg-white rounded-2xl border ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-50 rounded-xl p-2 w-16 h-16 flex items-center justify-center border border-slate-100">
            <img src={product.logo} alt={product.provider} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
            <i className="fas fa-star"></i>
            <span>{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{product.name}</h3>
        <p className="text-blue-600 text-sm font-semibold mb-4">{product.provider}</p>
        
        <div className="space-y-2 mb-6">
          {product.benefits.slice(0, 3).map((benefit, idx) => (
            <div key={idx} className="flex items-center text-sm text-slate-600">
              <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
              <span>{benefit}</span>
            </div>
          ))}
          {product.benefits.length > 3 && (
            <p className="text-xs text-slate-400 font-medium">+ {product.benefits.length - 3} more benefits</p>
          )}
        </div>

        <div className="mt-auto pt-6 border-t flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">From</p>
            <p className="text-xl font-extrabold text-slate-900">KES {product.basePrice.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400">per annum</p>
          </div>
          
          <button 
            onClick={() => onCompareToggle(product)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
              isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <i className={`fas ${isSelected ? 'fa-check' : 'fa-plus'}`}></i>
            <span>{isSelected ? 'Selected' : 'Compare'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
