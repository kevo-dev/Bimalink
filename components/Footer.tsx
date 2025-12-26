
"use client";

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <i className="fas fa-shield-alt text-blue-500 text-2xl"></i>
              <span className="text-2xl font-bold text-white">BimaLink</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6">
              Empowering Kenyans with transparent, affordable, and accessible insurance solutions from trusted providers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="hover:text-blue-400 transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-blue-400 transition"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="hover:text-blue-400">All Products</Link></li>
              <li><Link href="/compare" className="hover:text-blue-400">Compare Plans</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400">Insurance News</Link></li>
              <li><Link href="/community" className="hover:text-blue-400">Community Wall</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Insurance Types</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="hover:text-blue-400">Motor Insurance</Link></li>
              <li><Link href="/products" className="hover:text-blue-400">Medical Cover</Link></li>
              <li><Link href="/products" className="hover:text-blue-400">Life Insurance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-slate-800 rounded-l-lg px-4 py-2 w-full" />
              <button className="bg-blue-600 rounded-r-lg px-4 py-2"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BimaLink Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
