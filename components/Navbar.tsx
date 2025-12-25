
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC<{ comparisonCount: number }> = ({ comparisonCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-2 rounded-lg">
                <i className="fas fa-shield-alt text-white"></i>
              </div>
              <span className="text-xl font-bold text-slate-900">Bima<span className="text-blue-600">Link</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`${isActive(link.path) ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-500'} transition-colors`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/contact" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
              Get Quote
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-600">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2">
          {navLinks.map(link => (
            <Link key={link.path} href={link.path} className="block p-3 rounded-lg hover:bg-slate-50">
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
