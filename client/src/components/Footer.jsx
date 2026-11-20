import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0908] py-8 mt-auto text-stone-400">
      <div className="w-full px-4 sm:px-6 lg:px-[40px] flex flex-col sm:flex-row items-center justify-between text-[13px] gap-4">
        <div className="flex items-center space-x-3">
          <Link to="/" title="Home">
            <img 
              src="/LogoTransparent.png" 
              alt="Logo" 
              className="h-7 w-auto object-contain inline-block" 
            />
          </Link>
          <span className="text-white/20">•</span>
          <span className="text-stone-400">Understand your application before you apply.</span>
        </div>
        <div className="flex items-center space-x-6 text-[12px] font-mono">
          <div className="flex items-center space-x-1.5 text-stone-300 bg-white/5 px-2.5 py-1 rounded-[4px] border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-300" weight="regular" />
            <span>100% Deterministic Engine</span>
          </div>
          <span>© 2025 All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
