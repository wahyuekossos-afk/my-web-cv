import React from 'react';
import Link from 'next/link';

const Footer = ({ name, socials }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-16 border-t border-outline-variant/20">
      <div className="max-w-[1120px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <Link href="/" className="text-h3 font-black text-primary hover:text-accent transition-colors">
            {name}
          </Link>
          <p className="text-secondary mt-2 text-sm font-medium">
            © {currentYear} {name}. Crafted for Digital Excellence.
          </p>
        </div>
        
        <div className="flex gap-8">
          {Object.entries(socials).map(([platform, link]) => (
            <a 
              key={platform}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-accent transition-all font-bold text-sm uppercase tracking-widest"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
