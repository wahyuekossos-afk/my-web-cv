"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Skills = ({ skills, title = "Core Expertise" }) => {
  // Group skills by category
  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="skills" className="py-24">
      <div className="max-w-[1120px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-h2 text-primary inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-accent after:rounded-full">
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, catIdx) => (
            <motion.div 
              key={catIdx}
              className="glass-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            >
              <h3 className="text-h3 mb-6 text-primary border-b border-outline-variant/30 pb-4">{cat}</h3>
              <div className="space-y-6">
                {skills.filter(s => s.category === cat).map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-primary">{skill.name}</span>
                      <span className="text-secondary font-medium">{skill.level}%</span>
                    </div>
                    <div className="skill-bar overflow-hidden">
                      <motion.div 
                        className="skill-progress"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
