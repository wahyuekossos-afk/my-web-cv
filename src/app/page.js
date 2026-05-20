"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Portfolio from '@/components/Portfolio';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { getCVContent, getPortfolio } from '@/lib/db';
import { mockData } from '@/lib/mockData';

export default function Home() {
  const [data, setData] = useState(mockData.personalInfo);
  const [skills, setSkills] = useState(mockData.skills);
  const [skillsTitle, setSkillsTitle] = useState("Core Expertise");
  const [experience, setExperience] = useState(mockData.experience);
  const [projects, setProjects] = useState(mockData.portfolio);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const content = await getCVContent();
        const portfolioData = await getPortfolio();
        
        if (content) {
          setData(content.personalInfo || mockData.personalInfo);
          setSkills(content.skills || mockData.skills);
          setSkillsTitle(content.skillsTitle || "Core Expertise");
          setExperience(content.experience || mockData.experience);
        }
        
        if (portfolioData) {
          setProjects(portfolioData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="print:hidden">
        <Navbar name={data.name} />

        <Hero data={data} />
        <About data={data} />
        <Skills skills={skills} title={skillsTitle} />
        <Experience experience={experience} />
        <Portfolio projects={projects} />
        <ContactForm contactData={data} />
        <Footer name={data.name} socials={data.socials} />
        
        {/* Floating WhatsApp Button */}
        <a 
          href={`https://wa.me/${data.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.459 3.474 1.33 4.988l-1.417 5.176 5.308-1.392c1.462.797 3.102 1.215 4.766 1.215 5.508 0 9.987-4.479 9.987-9.987 0-5.508-4.479-9.987-9.987-9.987zm4.567 14.22c-.197.554-1.163 1.053-1.585 1.126-.421.073-.833.132-2.34-.464-1.82-.717-2.991-2.57-3.081-2.69-.091-.12-.736-.979-.736-1.879 0-.9.471-1.341.638-1.536.167-.195.364-.244.486-.244.122 0 .243.001.349.006.113.005.265-.043.415.318.156.376.533 1.298.58 1.393.047.095.078.205.015.331-.063.126-.094.205-.188.315-.094.109-.197.244-.28.328-.094.095-.192.198-.082.387.11.189.489.807 1.05 1.307.721.644 1.325.844 1.514.933.189.09.301.075.414-.055.113-.131.488-.567.619-.762.13-.195.261-.164.439-.098.178.066 1.127.532 1.323.63.196.098.327.147.374.229.047.083.047.478-.15 1.032z"></path>
          </svg>
        </a>
      </div>

      {/* Dynamic printable A4 CV layout (Bartholomew Henderson-style layout, print-only) */}
      <div 
        id="printable-cv" 
        className="font-serif text-[#111111] bg-white leading-relaxed max-w-[800px] mx-auto p-2"
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          pointerEvents: 'none'
        }}
      >
        {/* Header Block: Picture on left, Name & spaced Title on right */}

        <div className="flex items-center gap-6 pb-4">
          {/* Profile Picture Frame */}
          {data.profilePic ? (
            <div 
              className="border border-gray-300 p-0.5 bg-gray-50 flex-shrink-0"
              style={{ width: '4cm', height: '6cm' }}
            >
              <img 
                src={data.profilePic} 
                alt={data.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div 
              className="border border-gray-300 bg-gray-100 flex-shrink-0 flex items-center justify-center"
              style={{ width: '4cm', height: '6cm' }}
            >
              <span className="text-gray-400 text-[10px]">Photo</span>
            </div>
          )}

          {/* Name & Spaced Title Block */}
          <div className="flex-1 space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight uppercase text-black font-serif leading-tight">
              {data.name}
            </h1>
            <div className="border-t border-gray-400 my-0.5 w-full"></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700 font-serif">
              {data.title}
            </p>
          </div>
        </div>

        {/* Contact Info Row with Solid Circular Icons */}
        <div className="border-t border-b border-gray-400 py-2.5 my-2">
          <div className="flex justify-around items-center text-[10px] font-medium">
            {data.phone && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-sans">
                  📞
                </span>
                <span>{data.phone}</span>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-sans">
                  ✉
                </span>
                <span className="underline">{data.email}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-sans">
                  📍
                </span>
                <span>{data.location}</span>
              </div>
            )}
            <a 
              href="https://my-web-cv-theta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 underline text-black font-bold cursor-pointer"
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100 }}
            >
              <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-sans">
                🌐
              </span>
              <span>My Website</span>
            </a>
          </div>
        </div>

        {/* Section: ABOUT ME */}
        <div className="py-3 print-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5 mb-1.5">
            ABOUT ME
          </h2>
          <p className="text-[10.5px] text-gray-700 leading-relaxed text-justify">
            {data.about}
          </p>
        </div>

        {/* Section: EXPERIENCE */}
        <div className="py-3">
          <h2 className="text-xs font-bold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5 mb-2.5">
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="print-avoid-break text-[10.5px]">
                <h3 className="font-bold text-[11px] text-black font-serif uppercase">
                  {exp.title || exp.role}
                </h3>
                <p className="text-gray-700 italic font-medium mb-1">
                  {exp.company} | {exp.year || exp.period}
                </p>
                <div className="text-gray-600 leading-relaxed text-justify whitespace-pre-line pl-2.5 border-l border-gray-200">
                  {exp.description && exp.description.split('\n').map((line, lIdx) => {
                    const cleanLine = line.trim();
                    if (!cleanLine) return null;
                    if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
                      // Extract the content after the list symbol
                      const text = cleanLine.replace(/^[-•]\s*/, '');
                      return (
                        <div key={lIdx} className="flex gap-2 items-start mt-0.5">
                          <span className="text-[8px] mt-1">•</span>
                          <span>{text}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className="mt-0.5">{cleanLine}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: SKILLS */}
        <div className="py-3 print-avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5 mb-2">
            SKILLS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {})
            ).map(([category, catSkills]) => (
              <div key={category} className="space-y-1 print-avoid-break">
                <h3 className="font-bold text-[10px] text-gray-800 font-serif tracking-wide border-b border-gray-100 pb-0.5 uppercase">
                  {category}
                </h3>
                <ul className="text-[10px] text-gray-600 space-y-0.5">
                  {catSkills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                      <span className="text-[8px]">•</span>
                      <span>{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Document Footer */}
        <div className="mt-6 pt-3 border-t border-gray-200 text-center text-[8px] text-gray-400 print-avoid-break">
          <p>Generated dynamically from {data.name}&apos;s Live Portfolio on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
        </div>
      </div>
    </main>
  );
}


