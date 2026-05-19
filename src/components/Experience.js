"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Experience = ({ experience }) => {
  return (
    <section id="experience" className="bg-surface-low py-24 relative overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-8">
        <h2 className="text-h2 text-primary mb-20 text-center">Professional Journey</h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-outline-variant/30 -translate-x-1/2"></div>
          
          {experience.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div 
                key={index}
                className={`mb-16 relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Content Area */}
                <div className={`md:w-1/2 w-full pl-12 md:pl-0 ${isEven ? 'md:pl-16 text-left' : 'md:pr-16 md:text-right'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 hover:border-accent/30 transition-colors">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${index === 0 ? 'bg-accent text-white' : 'bg-surface-high text-secondary'}`}>
                      {item.year || item.period}
                    </span>
                    <h3 className="text-h3 text-primary mt-1">{item.title || item.role}</h3>
                    <p className="font-bold text-accent mb-3">{item.company}</p>
                    <p className="text-secondary text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className={`absolute left-4 md:left-1/2 w-5 h-5 rounded-full border-4 border-white shadow-md -translate-x-1/2 z-10 ${index === 0 ? 'bg-accent scale-125' : 'bg-primary'}`}></div>
                
                {/* Spacer for Desktop */}
                <div className="md:w-1/2 hidden md:block"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
