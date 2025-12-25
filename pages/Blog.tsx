
import React, { useState, useEffect } from 'react';
import { MOCK_BLOGS } from '../constants';
import { summarizeNews } from '../services/geminiService';

export const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState(MOCK_BLOGS);
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simulate AI summary generation for featured posts
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
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Stay updated with the latest trends in the Kenyan insurance industry, from policy changes to expert advice.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="relative group overflow-hidden rounded-3xl shadow-xl">
            <img 
              src={MOCK_BLOGS[0].imageUrl} 
              alt="Featured" 
              className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Featured</span>
                <span className="text-slate-300 text-sm">{MOCK_BLOGS[0].date}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {MOCK_BLOGS[0].title}
              </h2>
              <p className="text-slate-300 text-xl mb-8 leading-relaxed">
                {summaries[MOCK_BLOGS[0].id] || MOCK_BLOGS[0].excerpt}
              </p>
              <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition">
                Read Full Story
              </button>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_BLOGS.map(blog => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-6 shadow-sm">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title} 
                  className="w-full h-64 object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-600 font-bold mb-3">
                <span>{blog.source}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-medium">{blog.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
                {blog.title}
              </h3>
              <p className="text-slate-600 mb-6 line-clamp-2">
                {blog.excerpt}
              </p>
              <button className="text-slate-900 font-bold border-b-2 border-slate-900 group-hover:text-blue-600 group-hover:border-blue-600 transition">
                Read More
              </button>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-20 text-center">
          <button className="border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition">
            Load Older Articles
          </button>
        </div>
      </div>
    </div>
  );
};
