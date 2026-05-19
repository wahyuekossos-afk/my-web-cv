"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { saveMessage } from '@/lib/db';

const ContactForm = ({ contactData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'SEO Optimization',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      await saveMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', category: 'SEO Optimization', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const contactInfos = [
    { icon: <Mail size={24} />, label: 'Email me at', value: contactData.email, color: 'text-accent' },
    { icon: <Phone size={24} />, label: 'WhatsApp', value: contactData.phone, color: 'text-primary' },
    { icon: <MapPin size={24} />, label: 'Location', value: contactData.location, color: 'text-primary' },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="max-w-[1120px] mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h2 text-primary">{contactData.contactTitle || "Let's Create Success Together"}</h2>
            <p className="text-secondary text-body-lg max-w-md">
              {contactData.contactDescription || "Ready to take your digital presence to the next level? I'm available for consultations and full-time opportunities."}
            </p>
            
            <div className="space-y-6">
              {contactInfos.map((info, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className={`w-14 h-14 bg-surface-low rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-md ${info.color}`}>
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">{info.label}</p>
                    <p className="font-bold text-primary text-lg">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form 
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-10 rounded-[32px] shadow-2xl border border-outline-variant/10 relative overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary ml-1">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full p-4 rounded-xl bg-surface-low border-transparent focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary ml-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full p-4 rounded-xl bg-surface-low border-transparent focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary ml-1">Project Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-4 rounded-xl bg-surface-low border-transparent focus:bg-white focus:ring-2 focus:ring-accent transition-all outline-none appearance-none"
                >
                  <option>SEO Optimization</option>
                  <option>Content Strategy</option>
                  <option>Full Digital Marketing</option>
                  <option>Consultation</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary ml-1">Message</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell me about your goals..."
                  className="w-full p-4 rounded-xl bg-surface-low border-transparent focus:bg-white focus:ring-2 focus:ring-accent transition-all outline-none resize-none"
                />
              </div>
              
              <button 
                disabled={status === 'sending'}
                className={`w-full p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-accent/20 ${
                  status === 'success' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary text-on-primary hover:bg-accent'
                }`}
              >
                {status === 'idle' && <><Send size={18} /> Send Message</>}
                {status === 'sending' && <span className="animate-pulse">Sending...</span>}
                {status === 'success' && <><CheckCircle size={18} /> Message Sent!</>}
                {status === 'error' && "Error! Try again."}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
