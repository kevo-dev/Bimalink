
import React, { useState } from 'react';
import { InsuranceType, Lead } from '../types';

export const Contact: React.FC = () => {
  const [form, setForm] = useState<Lead>({
    name: '',
    email: '',
    phone: '',
    insuranceType: InsuranceType.MOTOR,
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      console.log('Lead Captured:', form);
      setStatus('success');
      setForm({
          name: '',
          email: '',
          phone: '',
          insuranceType: InsuranceType.MOTOR,
          message: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Info */}
        <div className="bg-slate-900 text-white p-12 lg:p-24 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
            Let's find the <span className="text-blue-400">right cover</span> for you.
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            Fill out the form and our certified insurance advisors will reach out with customized quotes from Kenya's top providers.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="bg-blue-600/20 w-14 h-14 rounded-full flex items-center justify-center text-blue-400 text-xl border border-blue-500/30">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Call Us</p>
                <p className="text-xl font-bold">+254 700 000 000</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="bg-green-600/20 w-14 h-14 rounded-full flex items-center justify-center text-green-400 text-xl border border-green-500/30">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Email Us</p>
                <p className="text-xl font-bold">hello@bimalink.co.ke</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="bg-purple-600/20 w-14 h-14 rounded-full flex items-center justify-center text-purple-400 text-xl border border-purple-500/30">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Visit Us</p>
                <p className="text-xl font-bold">Westlands, Nairobi, KE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 lg:p-24 bg-slate-50 flex items-center justify-center">
          <div className="max-w-md w-full">
            {status === 'success' ? (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  <i className="fas fa-check"></i>
                </div>
                <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                <p className="text-slate-600 text-lg mb-8">
                  Thank you for reaching out. An advisor will contact you within 30 minutes during business hours.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0712345678"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Insurance Type</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.insuranceType}
                    onChange={(e) => setForm({...form, insuranceType: e.target.value as InsuranceType})}
                  >
                    {Object.values(InsuranceType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tell us more (Optional)</label>
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                    placeholder="E.g. I'm looking for a third party cover for my 2015 Toyota Vitz."
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {status === 'submitting' ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Request a Quote'}
                </button>
                <p className="text-center text-xs text-slate-400">
                  By submitting, you agree to our privacy policy and terms.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
