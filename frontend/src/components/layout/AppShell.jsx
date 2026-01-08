import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f6] text-slate-900">
      <Navbar />
      <main className="flex-1 px-4 pb-16 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
