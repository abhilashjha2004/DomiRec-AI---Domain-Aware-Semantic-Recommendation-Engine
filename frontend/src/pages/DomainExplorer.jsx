import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Film, 
  Trophy, 
  Compass, 
  Tv, 
  Music, 
  Gamepad, 
  Newspaper, 
  DollarSign, 
  BookOpen, 
  HeartPulse,
  Layers,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Cpu,
  Star
} from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../api';
import { useApp } from '../context/AppContext';
import { getDomainConfig } from './Home';

export default function DomainExplorer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentDomain, setDomainLock, selectActiveContent } = useApp();

  const [domains, setDomains] = useState([]);
  const [activeDomain, setActiveDomain] = useState('');
  const [contentList, setContentList] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingDomains, setLoadingDomains] = useState(true);

  // Load active domain from navigation state, if present
  useEffect(() => {
    if (location.state && location.state.activeDomain) {
      setActiveDomain(location.state.activeDomain);
    }
  }, [location.state]);

  // Fetch all dynamic domains
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await axios.get(`${API_BASE}/domains`);
        setDomains(res.data);
        if (res.data.length > 0 && !activeDomain) {
          const stateDomain = location.state?.activeDomain;
          setActiveDomain(stateDomain || res.data[0].name);
        }
      } catch (err) {
        console.error("Error loading domains:", err);
      } finally {
        setLoadingDomains(false);
      }
    };
    fetchDomains();
  }, []);

  // Fetch content list for the active domain
  useEffect(() => {
    if (!activeDomain) return;
    
    const fetchContent = async () => {
      setLoadingContent(true);
      try {
        const res = await axios.get(`${API_BASE}/content?domain=${activeDomain}`);
        setContentList(res.data);
      } catch (err) {
        console.error("Error loading domain contents:", err);
      } finally {
        setLoadingContent(false);
      }
    };
    fetchContent();
  }, [activeDomain]);

  const handleDomainSelect = (domainName) => {
    setActiveDomain(domainName);
  };

  const handleCardClick = (item) => {
    setCurrentDomain(item.domain);
    setDomainLock(true);
    selectActiveContent(item.id);
    navigate(`/recommendations/${item.id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  const activeConfig = getDomainConfig(activeDomain);

  return (
    <div className="space-y-8 pb-16 relative">
      
      {/* Header section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <FolderOpen className={`w-6 h-6 animate-pulse-slow ${activeConfig.textClass}`} />
          Domain Library Explorer
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Select any available domain to browse all catalog items. Click an item to analyze its vector recommendations.
        </p>
      </div>

      {/* Dynamic Domain Navigation Tabs */}
      {loadingDomains ? (
        <div className="flex gap-4 overflow-x-auto py-2">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="w-28 h-10 rounded-xl bg-space-800 border border-white/5 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto scrollbar-hide py-2 gap-4 border-b border-white/5 pb-5">
          {domains.map((dom) => {
            const config = getDomainConfig(dom.name);
            const Icon = config.icon || Layers;
            const isActive = activeDomain === dom.name;
            
            return (
              <button
                key={dom.name}
                onClick={() => handleDomainSelect(dom.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shrink-0 border ${
                  isActive 
                    ? `bg-gradient-to-r ${config.btnGradient} text-space-950 border-transparent shadow-lg` 
                    : 'bg-space-800 hover:bg-space-850 text-slate-400 hover:text-white border-white/5'
                }`}
                style={{ 
                  boxShadow: isActive ? `0 10px 20px -8px ${config.shadowColor}` : 'none'
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {dom.name === 'Entertainment' ? 'Comedy' : dom.name}
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${isActive ? 'bg-space-950/40 text-space-900' : 'bg-space-900 text-slate-500'}`}>
                  {dom.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Content Grid */}
      {loadingContent ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto animate-spin">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Loading local dataset catalog...</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-6xl">
          <div className="px-1 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            {activeDomain === 'Entertainment' ? 'Comedy' : activeDomain} Catalog ({contentList.length})
          </div>

          {contentList.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {contentList.map((item) => {
                const itemConfig = getDomainConfig(item.domain);
                const Icon = itemConfig.icon || Layers;
                const ratingValue = ((item.popularity || 80) / 20).toFixed(1);

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    variants={cardVariants}
                    whileHover={{ 
                      y: -5, 
                      scale: 1.025,
                      boxShadow: `0 12px 25px -8px ${itemConfig.shadowColor}`
                    }}
                    className="cursor-pointer group rounded-2xl bg-space-800 border border-white/5 p-4 hover:border-white/10 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Gradient card top */}
                      <div className={`w-full aspect-video rounded-xl bg-gradient-to-tr ${itemConfig.gradient} border border-white/5 flex flex-col items-center justify-center relative overflow-hidden`}>
                        {Icon && <Icon className="w-7 h-7 opacity-85 group-hover:scale-110 transition-transform duration-300" />}
                        <div className="absolute inset-0 bg-grid opacity-10"></div>
                        
                        {/* Rating overlay badge */}
                        <div className="absolute top-2 right-2 text-[9px] font-extrabold bg-space-950/90 border border-white/5 px-1.5 py-0.5 rounded text-accent-amber flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {ratingValue}
                        </div>
                      </div>

                      <div className="mt-3.5 space-y-1.5">
                        <h4 className="text-xs sm:text-sm font-black text-slate-200 group-hover:text-white line-clamp-1 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed line-clamp-3 font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-4">
                        {item.tags.slice(0, 2).map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="text-[9px] font-bold text-slate-500 bg-space-900 border border-white/5 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">
              No content items found inside {activeDomain} dataset
            </div>
          )}
        </div>
      )}

    </div>
  );
}
