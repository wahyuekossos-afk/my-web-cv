"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ZoomIn } from 'lucide-react';

const Portfolio = ({ projects }) => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-[1120px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-12">
          <div>
            <h2 className="text-h2 text-primary">Selected Works</h2>
            <p className="text-secondary mt-2">A glimpse into successful campaigns and content strategies.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat 
                    ? 'bg-primary text-white shadow-md scale-105' 
                    : 'bg-surface-low text-secondary hover:bg-surface-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl bg-surface-high aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all"
                onClick={() => setSelectedProject(project)}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 translate-y-2 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
                  <span className="text-accent text-label-caps mb-2">{project.category}</span>
                  <h4 className="text-white text-h3 font-bold">{project.title}</h4>
                  <div className="flex items-center gap-2 mt-4 text-white/70 text-sm font-medium">
                    <ZoomIn size={16} /> <span>View Details</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
              />
              <motion.div 
                className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
              >
                <button 
                  className="absolute top-6 right-6 z-10 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-accent transition-colors"
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={24} />
                </button>
                
                <div className="h-80 w-full relative">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <span className="text-accent text-label-caps mb-2 block">{selectedProject.category}</span>
                    <h3 className="text-white text-h2 font-extrabold">{selectedProject.title}</h3>
                  </div>
                </div>
                
                <div className="p-10 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-h3 text-primary">Project Overview</h4>
                    <p className="text-secondary leading-relaxed text-body-lg">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-outline-variant/30 flex justify-end items-center gap-3 flex-wrap">
                    {selectedProject.driveLink && (
                      <a 
                        href={selectedProject.driveLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-surface-low text-primary px-6 py-3 rounded-xl font-bold hover:bg-surface-high transition-all border border-outline-variant/20"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download File
                      </a>
                    )}
                    {selectedProject.link && (
                      <a 
                        href={selectedProject.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:bg-accent transition-all"
                      >
                        Visit Project <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;
