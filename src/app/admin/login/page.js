"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/auth';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // Mock login for demo
        router.push('/admin/dashboard');
        return;
      }
      await loginAdmin(email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/20">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
              <Lock size={32} />
            </div>
            <h1 className="text-h2 text-primary">Admin Access</h1>
            <p className="text-secondary text-sm">Manage your CV content and messages</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-error text-sm font-bold bg-error/10 p-3 rounded-lg text-center">
                {error}
              </p>
            )}

            <button 
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all shadow-xl shadow-primary/10"
            >
              {loading ? "Authenticating..." : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <div className="text-center pt-4">
            <a href="/" className="text-secondary text-sm hover:text-primary transition-colors">
              ← Back to Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
