import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-stone-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-[40px] font-['PP_Neue_Montreal',_'General_Sans',_sans-serif] selection:bg-[#FF4124]/30 selection:text-white antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Transparent Logo ONLY - No text "Magenta" */}
        <Link to="/" className="inline-block hover:opacity-90 transition">
          <img 
            src="/LogoTransparent.png" 
            alt="Logo" 
            className="h-10 w-auto mx-auto object-contain"
          />
        </Link>
        <p className="mt-3 text-[14px] text-stone-400 font-normal">
          Evidence-based candidate intelligence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141210] text-stone-100 py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-[4px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
