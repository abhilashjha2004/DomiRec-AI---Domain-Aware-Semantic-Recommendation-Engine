import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Search, 
  History,
  Sparkles,
  Brain
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'History', path: '/history', icon: History },
    { name: 'About AI', path: '/about', icon: Sparkles },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col h-screen sticky top-0 z-30">
      {/* Brand Logo */}
      <div className="p-6 pb-9 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-emerald to-accent-teal flex items-center justify-center shadow-neon-green/10 animate-pulse-slow">
          <Brain className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tight text-white flex items-center gap-1">
            DomiRec<span className="text-accent-emerald">AI</span>
          </h1>
          <div className="text-[10px] text-accent-emerald font-semibold uppercase tracking-widest mt-0.5">Offline Engine</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-3 mb-3">Discovery</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-accent-emerald/15 to-accent-teal/5 border-l-2 border-accent-emerald text-white shadow-neon-green/5'
                  : 'text-slate-400 hover:text-white hover:bg-space-800/40 border-l-2 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive(item.path) ? 'text-accent-emerald' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Details */}
      <div className="p-5 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-550 uppercase tracking-widest">v1.2.0 (Offline-Mode)</p>
      </div>
    </aside>
  );
}
