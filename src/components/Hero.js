"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ data }) => {
  return (
    <section className="max-w-[1120px] mx-auto px-8 py-24 mt-20 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
      <motion.div 
        className="flex-1 space-y-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <span className="text-accent text-label-caps tracking-widest">Available for Hire</span>
          <h1 className="text-h1 text-primary">{data.name}</h1>
          <p className="text-h3 text-secondary">{data.title}</p>
          <p className="text-body-lg text-secondary max-w-lg leading-relaxed">
            {data.about}
          </p>
        </div>
        
        <div className="flex gap-4">
          <motion.a 
            href="#contact" 
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold hover:bg-accent transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hire Me
          </motion.a>
          <motion.a 
            href="#portfolio" 
            className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Portfolio
          </motion.a>
        </div>
      </motion.div>

      <motion.div 
        className="flex-1 relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full aspect-square bg-surface-high rounded-[40px] overflow-hidden shadow-2xl border border-white/20">
          <img 
            src={data.profilePic} 
            alt={data.name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
