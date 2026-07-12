import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/home':
        return 'Content Discovery Dashboard';
      case '/search':
        return 'Semantic Search Space';
      case '/history':
        return 'Offline History & Bookmarks';
      case '/about':
        return 'About the AI Engine';
      default:
        return 'DomiRec AI';
    }
  };

  return (
    <header className="glass-panel border-b border-white/5 sticky top-0 z-20 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Page Title */}
      <div>
        <h1 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
          {getPageTitle()}
        </h1>
      </div>

      {/* Offline Status */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-accent-emerald uppercase tracking-widest bg-accent-emerald/5 px-3 py-1.5 rounded-xl border border-accent-emerald/10 shadow-neon-green/5">
          Local Engine Active
        </span>
      </div>
    </header>
  );
}
