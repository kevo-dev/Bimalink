
"use client";

import React, { useState } from 'react';
import { InsuranceType, Lead } from '@/types';

export default function ContactPage() {
  const [form, setForm] = useState<Lead>({
    name: '', email: '', phone: '', insuranceType: InsuranceType.MOTOR, message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-slate-900 text-white p-12 lg:p-24">
          <h1 className="text-4xl font-extrabold mb-8">Let's find the <span className="text-blue-400">right cover</span> for you.</h1>
          <p className="text-xl text-slate-400 mb-12">Our advisors will reach out with customized quotes from Kenya's top providers.</p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4"><i className="fas fa-phone text-blue-400"></i><span>+254 700 000 000</span></div>
            <div className="flex items-center space-x-4"><i className="fas fa-envelope text-green-400"></i><span>hello@bimalink.co.ke</span></div>
          </div>
        </div>
        <div className="p-12 bg-slate-50 flex items-center justify-center">
          {status === 'success' ? (
            <div className="text-center">
              <i className="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
              <h2 className="text-3xl font-bold">Message Sent!</h2>
              <button onClick={() => setStatus('idle')} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">New Request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              <input required type="text" placeholder="Full Name" className="w-full p-3 rounded-xl border" onChange={e => setForm({...form, name: e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full p-3 rounded-xl border" onChange={e => setForm({...form, email: e.target.value})} />
              <input required type="tel" placeholder="Phone" className="w-full p-3 rounded-xl border" onChange={e => setForm({...form, phone: e.target.value})} />
              <select className="w-full p-3 rounded-xl border" onChange={e => setForm({...form, insuranceType: e.target.value as InsuranceType})}>
                {Object.values(InsuranceType).map(t => <option key={t}>{t}</option>)}
              </select>
              <textarea placeholder="Message" className="w-full p-3 rounded-xl border h-32" onChange={e => setForm({...form, message: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">{status === 'submitting' ? 'Sending...' : 'Request Quote'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
