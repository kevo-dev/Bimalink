
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC<{ comparisonCount: number }> = ({ comparisonCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Bima<span className="text-blue-600">Link</span></span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActive(link.path) ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-500'} transition-colors duration-200 relative`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            ))}
            <Link
              to="/compare"
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
              title="Compare Plans"
            >
              <i className="fas fa-columns text-lg"></i>
              {comparisonCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {comparisonCount}
                </span>
              )}
            </Link>
            <Link to="/contact" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95">
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
             <Link
              to="/compare"
              className="relative p-2 text-slate-600"
            >
              <i className="fas fa-columns"></i>
              {comparisonCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {comparisonCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsOpen(true)} 
              className="text-slate-600 p-2 focus:outline-none hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div 
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop Overlay */}
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b">
              <span className="text-lg font-bold text-slate-900">Bima<span className="text-blue-600">Link</span> Menu</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"
                aria-label="Close menu"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-4 w-full p-4 rounded-xl text-lg font-medium transition-all ${
                    isActive(link.path) 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <i className={`fas w-6 ${
                    link.name === 'Home' ? 'fa-home' :
                    link.name === 'Products' ? 'fa-list' :
                    link.name === 'Blog' ? 'fa-newspaper' :
                    link.name === 'Community' ? 'fa-users' :
                    'fa-envelope'
                  }`}></i>
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <Link
                to="/compare"
                className="flex items-center space-x-4 w-full p-4 rounded-xl text-lg font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <i className="fas fa-columns w-6"></i>
                <div className="flex items-center justify-between flex-1">
                  <span>Compare Plans</span>
                  {comparisonCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{comparisonCount}</span>
                  )}
                </div>
              </Link>
            </div>

            <div className="p-6 border-t bg-slate-50">
              <Link
                to="/contact"
                className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform"
              >
                Get a Free Quote
              </Link>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                Talk to an expert: <span className="text-slate-600">+254 700 000 000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
