import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import Logo from './Logo';

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="bg-z-paper border-t-2 border-z-border pt-24 pb-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24 uppercase font-bold">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-10 hover:opacity-80 transition-opacity">
              <Logo size="footer" />
            </Link>
            <p className="text-z-muted max-w-sm leading-relaxed text-sm mb-10 font-mono tracking-tight font-bold">
              [ROMANTICIZING_THE_EVERYDAY] — We curate objects of intent for the modern digital native. Digital minimalism, brutalist impact.
            </p>
            <div className="flex space-x-8 text-z-ink">
              <Instagram className="w-5 h-5 hover:text-outline cursor-pointer transition-all" />
              <Twitter className="w-5 h-5 hover:text-outline cursor-pointer transition-all" />
              <Facebook className="w-5 h-5 hover:text-outline cursor-pointer transition-all" />
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-display font-black tracking-widest text-z-ink mb-10 border-b-2 border-z-border inline-block pb-1 italic">DIRECTORY</h4>
            <ul className="space-y-4 text-sm tracking-widest text-z-muted hoven:text-z-ink font-bold">
              <li><Link to="/shop" className="hover:text-z-accent transition-colors">All_Objects</Link></li>
              <li><Link to="/customize" className="hover:text-z-accent transition-colors">Build_Canvas</Link></li>
              <li><Link to="/story" className="hover:text-z-accent transition-colors">Mission_Brief</Link></li>
              <li><Link to="/archives" className="hover:text-z-accent transition-colors">Historical_Drop</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-[14px] font-display font-black tracking-widest text-z-ink mb-10 border-b-2 border-z-border inline-block pb-1 italic">SIGNAL_SUBSCRIBE</h4>
            <div className="relative w-full max-w-xs group">
              <input 
                type="email" 
                placeholder="YOUR_SIGNAL_ADDRESS" 
                className="w-full bg-z-white border-2 border-z-border p-4 text-[12px] tracking-widest focus:outline-none focus:bg-z-accent focus:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] group-hover:shadow-none translate-x-0 group-hover:translate-x-[2px] group-hover:translate-y-[2px] font-bold"
              />
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-z-ink group-hover:text-white cursor-pointer" />
            </div>
            <p className="text-[11px] text-z-muted mt-6 font-mono tracking-widest font-bold">GLOBAL_TERMINAL — EST. 2024</p>
          </div>
        </div>
        
        <div className="border-t-2 border-dash-z-border border-z-border pt-12 flex flex-col md:flex-row justify-between items-center text-z-muted font-mono text-[12px] tracking-[0.2em] font-bold">
          <p className="mb-6 md:mb-0">
            © {new Date().getFullYear()} — POSTER THEORY ARCHIVE SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-12">
            <a href="/terms" className="hover:text-z-accent transition-colors">TERMS_OF_USE</a>
            <a href="/privacy" className="hover:text-z-accent transition-colors">PRIVACY_PROTOCOL</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
