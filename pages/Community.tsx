
import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { getInsuranceAdvice } from '../services/geminiService';

export const Community: React.FC = () => {
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

    // AI Logic: If it looks like a question, BimaBot responds
    if (newPost.includes('?')) {
        setIsAskingAI(true);
        const advice = await getInsuranceAdvice(newPost);
        const aiReply = {
            id: 'ai-' + Date.now(),
            author: 'BimaBot AI',
            content: advice,
            timestamp: 'Moments later'
        };
        
        setPosts(prev => prev.map(p => 
            p.id === post.id ? { ...p, replies: [aiReply, ...p.replies] } : p
        ));
        setIsAskingAI(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Community Wall</h1>
          <p className="text-slate-600">Share your experience and get answers from experts and peers.</p>
        </div>

        {/* Post Input */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
          <form onSubmit={handlePost}>
            <textarea 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              placeholder="Ask a question or share a review... (e.g., 'Is Britam Milele better than APA Afya?')"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-medium">
                <i className="fas fa-info-circle mr-1"></i> Questions usually get an AI response instantly.
              </span>
              <button 
                type="submit"
                disabled={isAskingAI}
                className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isAskingAI ? 'Processing...' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Feed */}
        <div className="space-y-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {post.author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{post.author}</h4>
                      <p className="text-xs text-slate-400">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-red-500 transition">
                    <i className="far fa-heart mr-1"></i> {post.likes}
                  </button>
                </div>
                <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                  {post.content}
                </p>
                
                {/* Replies */}
                {post.replies.length > 0 && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    {post.replies.map(reply => (
                      <div key={reply.id} className={`flex space-x-3 ${reply.author.includes('AI') ? 'bg-blue-50 p-4 rounded-xl' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          reply.author.includes('AI') ? 'bg-blue-600 text-white' : 'bg-slate-100'
                        }`}>
                          {reply.author === 'BimaBot AI' ? <i className="fas fa-robot"></i> : reply.author[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className={`font-bold text-sm ${reply.author.includes('AI') ? 'text-blue-700' : 'text-slate-900'}`}>
                              {reply.author}
                            </h5>
                            <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{reply.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex items-center space-x-4">
                  <button className="text-blue-600 text-sm font-bold hover:underline">Reply</button>
                  <button className="text-slate-400 text-sm font-bold hover:underline">Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
