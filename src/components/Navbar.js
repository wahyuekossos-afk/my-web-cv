"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = ({ name }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-surface/70 backdrop-blur-md border-b border-outline-variant/30 shadow-sm py-4' : 'bg-transparent py-6'
    }`}>
      <nav className="max-w-[1120px] mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="text-h3 font-extrabold tracking-tighter text-primary">
          {name || 'Wahyu Eko Saputra'}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-body-md text-secondary hover:text-primary transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => window.print()} 
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold hover:bg-accent transition-all duration-300"
          >
            Download CV
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-outline-variant/30 p-8 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-h3 text-secondary hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              window.print();
            }} 
            className="bg-primary text-on-primary w-full py-4 rounded-xl font-bold"
          >
            Download CV
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
