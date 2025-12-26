
"use client";

import React, { useState, useEffect } from 'react';
import { MOCK_BLOGS } from '@/constants';
import { summarizeNews } from '@/services/geminiService';

export default function BlogPage() {
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  useEffect(() => {
    const generateSummaries = async () => {
      const newSummaries: Record<string, string> = {};
      for (const blog of MOCK_BLOGS.slice(0, 2)) {
          newSummaries[blog.id] = await summarizeNews(blog.excerpt);
      }
      setSummaries(newSummaries);
    };
    generateSummaries();
  }, []);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Insurance News & Insights</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Stay updated with the latest trends in the Kenyan insurance industry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_BLOGS.map(blog => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-6 shadow-sm">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-64 object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-600 font-bold mb-3">
                <span>{blog.source}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-medium">{blog.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">{blog.title}</h3>
              <p className="text-slate-600 mb-6 line-clamp-2">{summaries[blog.id] || blog.excerpt}</p>
              <button className="text-slate-900 font-bold border-b-2 border-slate-900 hover:text-blue-600 hover:border-blue-600 transition">Read More</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
