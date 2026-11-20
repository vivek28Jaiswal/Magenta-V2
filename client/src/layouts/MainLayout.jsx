import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0B0A] text-stone-100 font-['PP_Neue_Montreal',_'General_Sans',_sans-serif] selection:bg-[#FF4124]/30 selection:text-white antialiased">
      <Navbar />
      <main className={`flex-1 w-full ${isLanding ? '' : 'px-4 sm:px-6 lg:px-[40px] pt-6 sm:pt-8 pb-16'}`}>
        <Outlet />
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}
