"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Mail, 
  LogOut, 
  Save, 
  Plus, 
  Trash2, 
  Upload,
  User,
  Image as ImageIcon,
  CheckCircle,
  X,
  Phone,
  Globe
} from 'lucide-react';
import { logoutAdmin } from '@/lib/auth';
import { 
  getCVContent, 
  updateCVContent, 
  getPortfolio, 
  addPortfolioItem, 
  updatePortfolioItem, 
  deletePortfolioItem,
  getMessages
} from '@/lib/db';
import { uploadProfilePic, uploadPortfolioImage, uploadCVFile } from '@/lib/storage';
import { mockData } from '@/lib/mockData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(mockData);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for forms
  const [personalInfo, setPersonalInfo] = useState(mockData.personalInfo);
  const [newProject, setNewProject] = useState({ title: '', category: '', description: '', image: '', link: '', driveLink: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cvData = await getCVContent();
        const portfolioData = await getPortfolio();
        const inboxData = await getMessages();
        
        if (cvData) {
          setContent({
            ...cvData,
            skills: cvData.skills || mockData.skills,
            experience: cvData.experience || mockData.experience
          });
          setPersonalInfo(cvData.personalInfo || mockData.personalInfo);
        }
        setProjects(portfolioData || []);
        setMessages(inboxData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  const handleSavePersonalInfo = async () => {
    setSaving(true);
    try {
      await updateCVContent({ ...content, personalInfo });
      setSuccessMsg('Personal information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async () => {
    setSaving(true);
    try {
      await addPortfolioItem(newProject);
      const updated = await getPortfolio();
      setProjects(updated);
      setNewProject({ title: '', category: '', description: '', image: '', link: '', driveLink: '' });
      setSuccessMsg('Project added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deletePortfolioItem(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e instanceof File ? e : e.target.files[0];
    if (!file) return;
    
    setSaving(true);
    try {
      let url = '';
      if (type === 'profile') url = await uploadProfilePic(file);
      if (type === 'cv') url = await uploadCVFile(file);
      if (type === 'portfolio') url = await uploadPortfolioImage(file);
      
      if (url) {
        if (type === 'portfolio') {
          setNewProject(prev => ({ ...prev, image: url }));
        } else {
          const updatedInfo = { ...personalInfo, [type === 'profile' ? 'profilePic' : 'cvPdf']: url };
          setPersonalInfo(updatedInfo);
          await updateCVContent({ ...content, personalInfo: updatedInfo });
        }
        setSuccessMsg('File uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePaste = async (e) => {
    if (saving) return; // Prevent multiple uploads at once
    
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          console.log("Paste detected: Image file found", file.size, "bytes");
          
          // Determine upload type based on active tab
          let type = 'portfolio'; 
          if (activeTab === 'content') type = 'profile';
          
          setSuccessMsg('Processing pasted image...');
          await handleFileUpload(file, type);
          break;
        }
      }
    }
  };

  if (loading) return null;

  return (
    <ProtectedRoute>
      <div 
        className="min-h-screen bg-surface-low flex"
        onPaste={handlePaste}
      >
        {/* Sidebar */}
        <aside className="w-64 bg-primary text-white flex flex-col p-6 fixed h-full z-10">
          <div className="mb-10 pt-4">
            <h1 className="text-xl font-black tracking-tighter">CV CMS v1.0</h1>
            <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-bold">Admin Dashboard</p>
          </div>
          
          <nav className="flex-1 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
              { id: 'content', label: 'CV Content', icon: <FileText size={20} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === tab.id ? 'bg-white text-primary shadow-lg' : 'hover:bg-white/10 text-white/70'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
            <button 
                onClick={() => setActiveTab('skills')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'skills' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-secondary hover:bg-white/50'}`}
              >
                <Plus size={20} /> <span className="font-bold">Skills</span>
              </button>
              <button 
                onClick={() => setActiveTab('experience')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'experience' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-secondary hover:bg-white/50'}`}
              >
                <Briefcase size={20} /> <span className="font-bold">Experience</span>
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'contact' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-secondary hover:bg-white/50'}`}
              >
                <Phone size={20} /> <span className="font-bold">Contact Info</span>
              </button>
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'portfolio' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-secondary hover:bg-white/50'}`}
              >
                <Briefcase size={20} /> <span className="font-bold">Portfolio</span>
              </button>
              <button 
                onClick={() => setActiveTab('inbox')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'inbox' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-secondary hover:bg-white/50'}`}
              >
                <Mail size={20} /> <span className="font-bold">Messages</span>
              </button>
          </nav>
          
          <div className="pt-6 border-t border-white/10 space-y-2">
            <a 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all font-bold text-sm"
            >
              <ImageIcon size={20} /> View Website
            </a>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-error/20 transition-all font-bold text-sm"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-10">
          {successMsg && (
            <div className="fixed top-10 right-10 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <CheckCircle size={24} /> {successMsg}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-h2 text-primary capitalize">{activeTab}</h2>
                <p className="text-secondary">Manage your website content efficiently.</p>
              </div>
              {saving && <span className="text-accent font-bold animate-pulse">Saving changes...</span>}
            </div>

            {/* Tabs Content */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
                    <p className="text-secondary text-label-caps mb-2">Projects</p>
                    <h3 className="text-h1">{projects.length}</h3>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
                    <p className="text-secondary text-label-caps mb-2">Messages</p>
                    <h3 className="text-h1">{messages.length}</h3>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
                    <p className="text-secondary text-label-caps mb-2">Status</p>
                    <h3 className="text-h1 text-green-500">Live</h3>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/20 space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b border-outline-variant/10">
                      <h4 className="text-h3 flex items-center gap-2"><User size={24} /> Personal Information</h4>
                      <button 
                        onClick={handleSavePersonalInfo}
                        className="bg-primary text-on-primary px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-all font-bold"
                      >
                        <Save size={18} /> Save Changes
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary">Full Name</label>
                        <input 
                          type="text" 
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary">Title</label>
                        <input 
                          type="text" 
                          value={personalInfo.title}
                          onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-bold text-primary">About Me</label>
                        <textarea 
                          rows="4"
                          value={personalInfo.about}
                          onChange={(e) => setPersonalInfo({...personalInfo, about: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                        />
                      </div>
                      
                      {/* Stats Section */}
                      <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-secondary">Exp Years</label>
                          <input 
                            type="text" 
                            value={personalInfo.stats?.experience || ''}
                            onChange={(e) => setPersonalInfo({...personalInfo, stats: {...personalInfo.stats, experience: e.target.value}})}
                            className="w-full p-3 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="e.g. 5+"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-secondary">Projects</label>
                          <input 
                            type="text" 
                            value={personalInfo.stats?.projects || ''}
                            onChange={(e) => setPersonalInfo({...personalInfo, stats: {...personalInfo.stats, projects: e.target.value}})}
                            className="w-full p-3 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="e.g. 150+"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-secondary">Tools</label>
                          <input 
                            type="text" 
                            value={personalInfo.stats?.tools || ''}
                            onChange={(e) => setPersonalInfo({...personalInfo, stats: {...personalInfo.stats, tools: e.target.value}})}
                            className="w-full p-3 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="e.g. 12+"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-secondary">Support</label>
                          <input 
                            type="text" 
                            value={personalInfo.stats?.support || ''}
                            onChange={(e) => setPersonalInfo({...personalInfo, stats: {...personalInfo.stats, support: e.target.value}})}
                            className="w-full p-3 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="e.g. 24/7"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary">Location</label>
                        <input 
                          type="text" 
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary">Status</label>
                        <input 
                          type="text" 
                          value={personalInfo.status || 'Open to Projects'}
                          onChange={(e) => setPersonalInfo({...personalInfo, status: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-outline-variant/10">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-primary flex items-center gap-2"><ImageIcon size={18} /> Profile Picture</label>
                        <div className="flex items-center gap-6">
                          <img src={personalInfo.profilePic} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
                          <label className="bg-surface-low hover:bg-surface-high p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center">
                            <Upload size={20} className="text-primary mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Upload New</span>
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'profile')} />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-primary flex items-center gap-2"><FileText size={18} /> CV PDF File</label>
                        <div className="flex items-center gap-4 h-full">
                          <label className="flex-1 bg-surface-low hover:bg-surface-high p-4 rounded-xl cursor-pointer transition-all border-2 border-dashed border-outline-variant/30 flex items-center justify-center gap-3">
                            <Upload size={20} className="text-primary" />
                            <span className="text-sm font-bold text-secondary">Upload CV File</span>
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'cv')} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-8">
                  {/* Category Manager */}
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/10">
                      <h4 className="text-h3 flex items-center gap-2">
                        <LayoutDashboard size={24} /> Skill Categories (Containers)
                      </h4>
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-bold text-secondary uppercase tracking-widest">Section Title:</label>
                        <input 
                          type="text"
                          value={content.skillsTitle || 'Core Expertise'}
                          onChange={(e) => setContent({...content, skillsTitle: e.target.value})}
                          className="bg-surface-low px-4 py-2 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary w-64"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...new Set(content.skills?.map(s => s.category))].map(cat => (
                        <div key={cat} className="bg-surface-low p-4 rounded-2xl flex justify-between items-center group">
                          <span className="font-bold text-primary truncate">{cat}</span>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete category "${cat}" and all its skills?`)) {
                                const newSkills = content.skills.filter(s => s.category !== cat);
                                setContent({...content, skills: newSkills});
                              }
                            }}
                            className="text-error opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="bg-surface-low p-2 rounded-2xl border-2 border-dashed border-outline-variant/30 flex items-center gap-2 px-4">
                        <input 
                          type="text"
                          placeholder="New Category..."
                          id="new-cat-input-field"
                          className="bg-transparent text-sm font-bold w-full outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = e.target.value;
                              if (val) {
                                const newSkills = [...(content.skills || []), { name: 'New Skill', category: val, level: 80 }];
                                setContent({...content, skills: newSkills});
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById('new-cat-input-field');
                            const val = input.value;
                            if (val) {
                              const newSkills = [...(content.skills || []), { name: 'New Skill', category: val, level: 80 }];
                              setContent({...content, skills: newSkills});
                              input.value = '';
                            }
                          }}
                          className="p-1 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                          title="Add Category"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Skills Items */}
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/10">
                      <h4 className="text-h3 flex items-center gap-2"><Plus size={24} /> Skill Items</h4>
                      <button 
                        onClick={async () => {
                          setSaving(true);
                          try {
                            await updateCVContent({ ...content, skills: content.skills });
                            setSuccessMsg('Skills updated successfully!');
                            setTimeout(() => setSuccessMsg(''), 3000);
                          } catch (error) {
                            console.error("Save error:", error);
                            alert("Failed to save: " + error.message);
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="bg-primary text-on-primary px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-all font-bold"
                      >
                        <Save size={18} /> Save All Changes
                      </button>
                    </div>

                    <div className="space-y-4">
                      {content.skills?.map((skill, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-surface-low p-4 rounded-2xl">
                          <div className="col-span-4">
                            <input 
                              type="text" 
                              value={skill.name}
                              onChange={(e) => {
                                const newSkills = [...content.skills];
                                newSkills[idx].name = e.target.value;
                                setContent({...content, skills: newSkills});
                              }}
                              className="w-full p-3 rounded-xl bg-white border-transparent focus:ring-2 focus:ring-primary text-sm outline-none font-bold"
                              placeholder="Skill Name"
                            />
                          </div>
                          <div className="col-span-4">
                            <select 
                              value={skill.category}
                              onChange={(e) => {
                                const newSkills = [...content.skills];
                                newSkills[idx].category = e.target.value;
                                setContent({...content, skills: newSkills});
                              }}
                              className="w-full p-3 rounded-xl bg-white border-transparent focus:ring-2 focus:ring-primary text-sm outline-none appearance-none font-bold"
                            >
                              {[...new Set(content.skills?.map(s => s.category))].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-3 flex items-center gap-2">
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => {
                                const newSkills = [...content.skills];
                                newSkills[idx].level = parseInt(e.target.value) || 0;
                                setContent({...content, skills: newSkills});
                              }}
                              className="w-full p-3 rounded-xl bg-white border-transparent focus:ring-2 focus:ring-primary text-sm outline-none"
                            />
                            <span className="text-xs font-bold text-secondary">%</span>
                          </div>
                          <div className="col-span-1">
                            <button 
                              onClick={() => {
                                const newSkills = content.skills.filter((_, i) => i !== idx);
                                setContent({...content, skills: newSkills});
                              }}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => {
                          const cats = [...new Set(content.skills?.map(s => s.category))];
                          const newSkills = [...(content.skills || []), { name: '', category: cats[0] || 'New Category', level: 80 }];
                          setContent({...content, skills: newSkills});
                        }}
                        className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-2xl text-secondary hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 font-bold mt-4"
                      >
                        <Plus size={20} /> Add New Skill Item
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/10">
                      <h4 className="text-h3 flex items-center gap-2"><Briefcase size={24} /> Professional Journey</h4>
                      <button 
                        onClick={async () => {
                          setSaving(true);
                          try {
                            // Robust Sort by year
                            const sortedExp = [...(content.experience || [])].sort((a, b) => {
                              const getYear = (str) => {
                                if (!str) return 0;
                                const match = str.match(/\d{4}/);
                                return match ? parseInt(match[0]) : 0;
                              };
                              return getYear(b.year) - getYear(a.year); // Newest first
                            });
                            
                            await updateCVContent({ ...content, experience: sortedExp });
                            setContent({...content, experience: sortedExp});
                            setSuccessMsg('Experience updated and sorted successfully!');
                            setTimeout(() => setSuccessMsg(''), 3000);
                          } catch (error) {
                            console.error("Save error:", error);
                            alert("Failed to save: " + error.message);
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="bg-primary text-on-primary px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-all font-bold"
                      >
                        <Save size={18} /> Save & Sort Timeline
                      </button>
                    </div>

                    <div className="space-y-6">
                      {content.experience?.map((exp, idx) => (
                        <div key={idx} className="bg-surface-low p-6 rounded-3xl border border-outline-variant/10 space-y-4 relative group">
                          <button 
                            onClick={() => {
                              const newExp = content.experience.filter((_, i) => i !== idx);
                              setContent({...content, experience: newExp});
                            }}
                            className="absolute top-4 right-4 p-2 text-error hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-3 space-y-2">
                              <label className="text-[10px] font-bold uppercase text-secondary">Year Range</label>
                              <input 
                                type="text" 
                                value={exp.year}
                                onChange={(e) => {
                                  const newExp = [...content.experience];
                                  newExp[idx].year = e.target.value;
                                  setContent({...content, experience: newExp});
                                }}
                                className="w-full p-3 rounded-xl bg-white border-transparent focus:ring-2 focus:ring-primary text-sm outline-none font-bold"
                                placeholder="e.g. 2021 - Present"
                              />
                            </div>
                            <div className="col-span-4 space-y-2">
                              <label className="text-[10px] font-bold uppercase text-secondary">Job Title</label>
                              <input 
                                type="text" 
                                value={exp.title}
                                onChange={(e) => {
                                  const newExp = [...content.experience];
                                  newExp[idx].title = e.target.value;
                                  setContent({...content, experience: newExp});
                                }}
                                className="w-full p-3 rounded-xl bg-white border-transparent focus:ring-2 focus:ring-primary text-sm outline-none font-bold"
                                placeholder="Job Title"
                              />
                            </div>
                            <div className="col-span-5 space-y-2">
                              <label className="text-[10px] font-bold uppercase text-secondary">Company</label>
                              <input 
                                type="text" 
                                value={exp.company}
                                onChange={(e) => {
                                  const newExp = [...content.experience];
                                  newExp[idx].company = e.target.value;
                                  setContent({...content, experience: newExp});
                                }}
                                className="w-full p-3 rounded-xl bg-white border-transparent focus:ring-2 focus:ring-primary text-sm outline-none font-bold"
                                placeholder="Company Name"
                              />
                            </div>
                            <div className="col-span-12 space-y-2">
                              <label className="text-[10px] font-bold uppercase text-secondary">Description</label>
                              <textarea 
                                rows="3"
                                value={exp.description}
                                onChange={(e) => {
                                  const newExp = [...content.experience];
                                  newExp[idx].description = e.target.value;
                                  setContent({...content, experience: newExp});
                                }}
                                className="w-full p-3 rounded-xl bg-white border-transparent focus:ring-2 focus:ring-primary text-sm outline-none resize-none"
                                placeholder="Describe your responsibilities..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => {
                          const newExp = [...(content.experience || []), { year: '2024 - Present', title: '', company: '', description: '' }];
                          setContent({...content, experience: newExp});
                        }}
                        className="w-full py-6 border-2 border-dashed border-outline-variant/30 rounded-[32px] text-secondary hover:text-primary hover:border-primary transition-all flex flex-col items-center justify-center gap-2 font-bold"
                      >
                        <Plus size={32} />
                        <span>Add New Career Step</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/10">
                      <h4 className="text-h3 flex items-center gap-2"><Phone size={24} /> Contact Section</h4>
                      <button 
                        onClick={handleSavePersonalInfo}
                        className="bg-primary text-on-primary px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-all font-bold"
                      >
                        <Save size={18} /> Save Contact Info
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-bold text-primary">Contact Title</label>
                        <input 
                          type="text" 
                          value={personalInfo.contactTitle || "Let's Create Success Together"}
                          onChange={(e) => setPersonalInfo({...personalInfo, contactTitle: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-bold text-primary">Contact Description</label>
                        <textarea 
                          rows="3"
                          value={personalInfo.contactDescription || "Ready to take your digital presence to the next level? I'm available for consultations and full-time opportunities."}
                          onChange={(e) => setPersonalInfo({...personalInfo, contactDescription: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary">Public Email</label>
                        <input 
                          type="email" 
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary">WhatsApp Number</label>
                        <input 
                          type="text" 
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-bold text-primary">Location Text</label>
                        <input 
                          type="text" 
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-10 pt-8 border-t border-outline-variant/10">
                      <h5 className="font-bold text-primary mb-6 flex items-center gap-2"><Globe size={18} /> Social Links (Footer)</h5>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-secondary uppercase">LinkedIn URL</label>
                          <input 
                            type="text" 
                            value={personalInfo.socials?.linkedin || ''}
                            onChange={(e) => setPersonalInfo({...personalInfo, socials: {...personalInfo.socials, linkedin: e.target.value}})}
                            className="w-full p-3 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-secondary uppercase">Instagram URL</label>
                          <input 
                            type="text" 
                            value={personalInfo.socials?.instagram || ''}
                            onChange={(e) => setPersonalInfo({...personalInfo, socials: {...personalInfo.socials, instagram: e.target.value}})}
                            className="w-full p-3 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-secondary uppercase">Behance/Other</label>
                          <input 
                            type="text" 
                            value={personalInfo.socials?.behance || ''}
                            onChange={(e) => setPersonalInfo({...personalInfo, socials: {...personalInfo.socials, behance: e.target.value}})}
                            className="w-full p-3 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="https://behance.net/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-8">
                  {/* Add New Project */}
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/20">
                    <h4 className="text-h3 mb-8 flex items-center gap-2"><Plus size={24} /> Add New Project</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Project Title</label>
                        <input 
                          type="text" 
                          value={newProject.title}
                          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Category</label>
                        <select 
                          value={newProject.category}
                          onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary appearance-none font-bold"
                        >
                          {[...new Set(content.skills?.map(s => s.category))].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-bold">Description</label>
                        <textarea 
                          rows="3"
                          value={newProject.description}
                          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Project Link (URL Website)</label>
                        <input 
                          type="text" 
                          value={newProject.link}
                          onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Google Drive Link (Download File)
                        </label>
                        <input 
                          type="text" 
                          value={newProject.driveLink || ''}
                          onChange={(e) => setNewProject({...newProject, driveLink: e.target.value})}
                          className="w-full p-4 rounded-xl bg-surface-low outline-none focus:ring-2 focus:ring-primary"
                          placeholder="https://drive.google.com/file/d/..."
                        />
                        <p className="text-xs text-secondary">Link ini akan muncul sebagai tombol &quot;Download File&quot; di pop-up portofolio.</p>
                      </div>
                      <div className="col-span-2 space-y-4">
                        <label className="text-sm font-bold flex items-center gap-2"><ImageIcon size={18} /> Project Image</label>
                        <div className="flex items-center gap-6 bg-surface-low p-6 rounded-3xl border-2 border-dashed border-outline-variant/30">
                          {newProject.image ? (
                            <div className="relative group">
                              <img src={newProject.image} alt="Preview" className="w-32 h-32 rounded-2xl object-cover shadow-lg" />
                              <button 
                                onClick={() => setNewProject({...newProject, image: ''})}
                                className="absolute -top-2 -right-2 bg-error text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-2xl bg-white/50 flex items-center justify-center text-secondary border border-outline-variant/10">
                              <ImageIcon size={32} />
                            </div>
                          )}
                          <div className="flex flex-col gap-3">
                            <label className="bg-primary text-on-primary px-8 py-3 rounded-2xl font-bold cursor-pointer hover:bg-accent transition-all flex items-center gap-2 shadow-lg">
                              <Upload size={20} /> 
                              {saving ? 'Uploading...' : 'Select Project Image'}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'portfolio')} />
                            </label>
                            <p className="text-xs text-secondary italic">Will be uploaded to Firebase Storage</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleAddProject}
                      className="mt-8 bg-primary text-on-primary w-full py-4 rounded-2xl font-bold hover:bg-accent transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> Add Project to Portfolio
                    </button>
                  </div>

                  {/* Projects List */}
                  <div className="space-y-4">
                    <h4 className="text-h3 ml-2">Existing Projects</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {projects.map(project => (
                        <div key={project.id} className="bg-white p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex gap-4 group">
                          <img src={project.image} className="w-20 h-20 rounded-2xl object-cover" />
                          <div className="flex-1">
                            <p className="text-accent text-[10px] font-bold uppercase tracking-widest">{project.category}</p>
                            <h5 className="font-bold text-primary">{project.title}</h5>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-error text-xs font-bold mt-2 hover:underline flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inbox' && (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] text-center border border-outline-variant/20">
                      <Mail size={48} className="mx-auto text-secondary mb-4 opacity-20" />
                      <p className="text-secondary font-bold">No messages yet.</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-lg text-primary">{msg.name}</h5>
                            <p className="text-secondary text-sm">{msg.email} • <span className="text-accent font-bold">{msg.category}</span></p>
                          </div>
                          <span className="text-xs text-secondary font-medium">
                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                        <p className="text-secondary bg-surface-low p-4 rounded-2xl text-sm leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
