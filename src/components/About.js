"use client";

import React from 'react';
import { motion } from 'framer-motion';

const About = ({ data }) => {
  const stats = [
    { label: 'Years Experience', value: data.stats.experience, color: 'border-accent' },
    { label: 'Projects Done', value: data.stats.projects, color: 'border-primary' },
    { label: 'Pro Tools', value: data.stats.tools, color: 'border-primary' },
    { label: 'Dedicated Support', value: data.stats.support, color: 'border-accent' },
  ];

  return (
    <section id="about" className="bg-surface-low py-24">
      <div className="max-w-[1120px] mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h2 text-primary">About Me</h2>
            <p className="text-body-lg text-secondary leading-relaxed">
              {data.about}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white rounded-xl border border-outline-variant/30 shadow-sm">
                <p className="text-secondary text-label-caps mb-1">Location</p>
                <p className="font-bold text-primary">{data.location}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-outline-variant/30 shadow-sm">
                <p className="text-secondary text-label-caps mb-1">Status</p>
                <p className="font-bold text-primary">{data.status || 'Open to Projects'}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className={`bg-white p-8 rounded-xl shadow-sm border-l-4 ${stat.color}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <span className="text-h1 text-primary block mb-2">{stat.value}</span>
                <p className="text-secondary font-bold text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
