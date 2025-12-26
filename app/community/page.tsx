
"use client";

import React, { useState } from 'react';
import { CommunityPost } from '@/types';
import { getInsuranceAdvice } from '@/services/geminiService';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'p1',
      author: 'Kamau N.',
      content: 'Which insurance company has the fastest claim settlement for motor vehicles in Kenya?',
      likes: 12,
      timestamp: '2 hours ago',
      replies: [
        { id: 'r1', author: 'Sarah W.', content: 'Jubilee is usually very fast. I got my payout in 7 days.', timestamp: '1 hour ago' }
      ]
    },
    {
      id: 'p2',
      author: 'Fatuma O.',
      content: 'Is maternity cover worth it for private hospitals in Nairobi? The premiums look quite high.',
      likes: 8,
      timestamp: '5 hours ago',
      replies: []
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: 'Guest User',
      content: newPost,
      likes: 0,
      timestamp: 'Just now',
      replies: []
    };

    setPosts([post, ...posts]);
    setNewPost('');

    if (newPost.includes('?')) {
        setIsAskingAI(true);
        const advice = await getInsuranceAdvice(newPost);
        const aiReply = {
            id: 'ai-' + Date.now(),
            author: 'BimaBot AI',
            content: advice,
            timestamp: 'Moments later'
        };
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, replies: [aiReply, ...p.replies] } : p));
        setIsAskingAI(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Community Wall</h1>
          <p className="text-slate-600">Share your experience and get answers from experts and peers.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-10">
          <form onSubmit={handlePost}>
            <textarea 
              className="w-full bg-slate-50 border rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              placeholder="Ask a question..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Questions get AI responses instantly.</span>
              <button type="submit" disabled={isAskingAI} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
                {isAskingAI ? 'Processing...' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">{post.author[0]}</div>
                <div><h4 className="font-bold">{post.author}</h4><p className="text-xs text-slate-400">{post.timestamp}</p></div>
              </div>
              <p className="text-slate-700 text-lg mb-6">{post.content}</p>
              {post.replies.map(reply => (
                <div key={reply.id} className={`p-4 rounded-xl mt-4 ${reply.author.includes('AI') ? 'bg-blue-50' : 'bg-slate-50'}`}>
                  <h5 className="font-bold text-sm mb-1">{reply.author}</h5>
                  <p className="text-sm text-slate-600">{reply.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
