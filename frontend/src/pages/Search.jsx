import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  Sparkles, 
  Compass, 
  Layers,
  ShieldAlert,
  FolderLock,
  ArrowLeftRight,
  Star,
  X,
  History,
  BookOpen,
  Trophy,
  Film,
  GraduationCap,
  Tv,
  Music,
  Gamepad,
  Newspaper,
  DollarSign,
  HeartPulse,
  Cpu,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDomainConfig } from './Home';
import axios from 'axios';

// Helper to get domain icons dynamically
const getDomainIcon = (domainName) => {
  switch (domainName) {
    case 'Education': return GraduationCap;
    case 'Movies': return Film;
    case 'Sports': return Trophy;
    case 'Blogging': return Compass;
    case 'Entertainment':
    case 'Comedy': return Tv;
    case 'Music': return Music;
    case 'Gaming': return Gamepad;
    case 'Books': return BookOpen;
    case 'News': return Newspaper;
    case 'Finance': return DollarSign;
    case 'Health': return HeartPulse;
    case 'Technology': return Cpu;
    default: return Layers;
  }
};

// Helper for similarity score pills
const getSimilarityPill = (score) => {
  if (score >= 95) {
    return {
      text: `${score}% Match`,
      class: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
    };
  } else if (score >= 90) {
    return {
      text: `${score}% Match`,
      class: "bg-blue-500/10 border-blue-500/20 text-blue-400 font-bold"
    };
  } else if (score >= 80) {
    return {
      text: `${score}% Match`,
      class: "bg-amber-500/10 border-amber-500/20 text-amber-400 font-bold"
    };
  } else {
    return {
      text: `${score}% Match`,
      class: "bg-space-850 border-white/5 text-slate-450 font-semibold"
    };
  }
};

// Domain chips color helper
const getDomainChipClass = (domainName) => {
  switch (domainName) {
    case 'Movies': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'Education': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Sports': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Music': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    case 'Technology': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'Books': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default: return 'bg-space-800 text-slate-400 border-white/5';
  }
};

// Quick Tags mappings based on active domain
const getQuickTags = (domainName) => {
  switch (domainName) {
    case 'Movies':
      return ['Marvel', 'Christopher Nolan', 'Sci-Fi', 'Action', 'DC', 'Oscar Winners'];
    case 'Education':
      return ['Algorithms', 'Data Structures', 'Machine Learning', 'Python', 'Web Dev', 'DBMS'];
    case 'Sports':
      return ['Messi', 'Virat Kohli', 'IPL Highlights', 'Football', 'World Cup', 'Cricket'];
    case 'Technology':
      return ['Quantum Computing', 'Artificial Intelligence', 'Hardware Specs', 'Tech Trends', 'AI Models'];
    case 'Books':
      return ['Pride and Prejudice', 'To Kill a Mockingbird', 'Classic Literature', 'Fiction Summaries', 'Novels'];
    default:
      return ['Introduction', 'Guide', 'Tutorial', 'Core Principles', 'Highlights'];
  }
};

export default function Search() {
  const navigate = useNavigate();
  const { 
    selectActiveContent, 
    currentDomain, 
    setCurrentDomain,
    setDomainLock
  } = useApp();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState('');
  
  // Suggestion Modal State
  const [suggestedDomain, setSuggestedDomain] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Recent Searches List
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('domirec_recent_searches');
    return saved ? JSON.parse(saved) : ['Inception', 'Interstellar', 'Data Structures', 'Python Basics'];
  });

  // Animated Placeholder cycle
  const placeholders = [
    "Search movies, courses, books, creators...",
    "Query concepts in machine learning...",
    "Find Christopher Nolan collections...",
    "Explore football highlights and goals..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Fetch domains on load
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/domains");
        setDomains(res.data);
      } catch (err) {
        console.error("Error fetching domains:", err);
      }
    };
    fetchDomains();
    setDomainLock(true);
  }, []);

  const handleSearch = async (e, forceQuery = null, forceDomain = null) => {
    if (e) e.preventDefault();
    const searchQuery = forceQuery !== null ? forceQuery : query;
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setShowPrompt(false);
    
    const targetDomain = forceDomain || currentDomain;
    
    // Save to recents
    const updatedRecents = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updatedRecents);
    localStorage.setItem('domirec_recent_searches', JSON.stringify(updatedRecents));

    try {
      const res = await axios.post("http://localhost:8000/api/content/search", {
        query: searchQuery,
        domain_lock: true,
        current_domain: targetDomain
      });

      setResults(res.data.results || []);
      setSearched(true);

      // Check if another domain fits better and prompt user
      if (res.data.suggested_domain && res.data.suggested_domain.toLowerCase() !== targetDomain.toLowerCase()) {
        setSuggestedDomain(res.data.suggested_domain);
        setShowPrompt(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search query execution failed. Check backend status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDomainChange = (e) => {
    setCurrentDomain(e.target.value);
    setResults([]);
    setSearched(false);
    setShowPrompt(false);
  };

  const handleSwitchDomain = () => {
    if (suggestedDomain) {
      setCurrentDomain(suggestedDomain);
      setShowPrompt(false);
      handleSearch(null, query, suggestedDomain);
    }
  };

  const handleCardClick = (id) => {
    selectActiveContent(id);
    navigate(`/recommendations/${id}`);
  };

  const handleChipClick = (tag) => {
    setQuery(tag);
    handleSearch(null, tag);
  };

  const clearQuery = () => {
    setQuery('');
  };

  const activeConfig = getDomainConfig(currentDomain);
  const ActiveIcon = getDomainIcon(currentDomain);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="space-y-8 pb-16 relative">
      
      {/* Header section (Polished Typography System) */}
      <div className="space-y-2">
        <h2 className="text-[32px] font-black text-white flex items-center gap-3 tracking-tight leading-none">
          <Sparkles className="w-7 h-7 text-blue-500 animate-pulse" />
          Semantic Search
        </h2>
        <p className="text-[16px] text-slate-400 font-medium font-sans">
          Search intelligently inside the selected domain using AI-powered semantic similarity.
        </p>
      </div>

      {/* Main Unified Search Workspace Card (Consistent spacing & layout) */}
      <div 
        style={{ boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)` }}
        className="glass-panel rounded-[20px] p-6 sm:p-8 space-y-6 max-w-4xl relative overflow-hidden bg-space-950/40"
      >
        
        {/* Top bar: Domain Chip and Dropdown selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <span 
              style={{ boxShadow: `0 4px 12px -2px ${activeConfig.shadowColor}` }}
              className={`flex items-center gap-2 text-xs font-black uppercase border px-4 py-2 rounded-full transition-all duration-300 ${getDomainChipClass(currentDomain)}`}
            >
              <ActiveIcon className="w-5 h-5 shrink-0" />
              Current Domain: {currentDomain === 'Entertainment' ? 'Comedy' : currentDomain}
            </span>
          </div>

          {/* Polished dropdown matching dark mockup specs */}
          <div className="flex items-center gap-3">
            <label className="text-[12px] uppercase tracking-widest font-extrabold text-slate-500">Index Focus:</label>
            <div className="relative">
              <select
                value={currentDomain}
                onChange={handleDomainChange}
                className="bg-[#161B22] border border-white/12 hover:border-blue-500/40 text-white rounded-xl py-2 pl-4 pr-10 text-xs font-bold focus:outline-none cursor-pointer hover:bg-space-800 transition-all appearance-none h-[38px] min-w-[170px]"
              >
                {domains.map(d => (
                  <option key={d.name} value={d.name}>{d.name === 'Entertainment' ? 'Comedy' : d.name} ({d.count} items)</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Form Section (Perfect alignment and offsets) */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative flex items-center h-[58px]">
            
            {/* Search Icon (Strict left offset, centered vertically) */}
            <div className="absolute left-5 text-slate-400 pointer-events-none z-10 top-1/2 -translate-y-1/2">
              <SearchIcon className="w-5 h-5" />
            </div>

            {/* Premium Input Field (60px left padding to prevent overlaps) */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              style={{ fontSize: '18px' }}
              className="w-full bg-[#161B22] border border-white/[0.06] focus:border-blue-500/40 focus:shadow-[0_0_15px_rgba(37,99,235,0.15)] rounded-2xl h-full pl-16 pr-44 font-medium text-white placeholder-[#94A3B8] focus:outline-none transition-all duration-300 font-sans focus:scale-[1.006] caret-white"
            />

            {/* Actions area inside input right */}
            <div className="absolute right-2.5 flex items-center gap-3 top-1/2 -translate-y-1/2">
              {query && (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="h-[44px] px-6 rounded-[14px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40 transition-all duration-300 hover:scale-103 active:scale-95 flex items-center gap-2"
              >
                <SearchIcon className="w-4 h-4" />
                Search with AI
              </button>
            </div>

          </div>
        </form>

        {/* Quick Search Chips */}
        <div className="space-y-3 pt-1">
          <span className="text-[12px] uppercase tracking-widest font-extrabold text-slate-500 block">Quick Tags</span>
          <div className="flex flex-wrap gap-2">
            {getQuickTags(currentDomain).map((tag, index) => {
              const isSelected = query.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={index}
                  onClick={() => handleChipClick(tag)}
                  className={`px-4.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-r ${activeConfig.btnGradient} text-space-950 border-transparent shadow-md`
                      : 'bg-space-850 hover:bg-space-800 text-slate-350 hover:text-white border-white/[0.03] hover:border-slate-700'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-3 pt-1.5 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-slate-500">
              <History className="w-3.5 h-3.5" />
              <span className="text-[12px] uppercase tracking-widest font-extrabold text-slate-500">Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((rec, index) => (
                <button
                  key={index}
                  onClick={() => handleChipClick(rec)}
                  className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-200 cursor-pointer"
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {error && (
        <div className="max-w-4xl p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Cross-Domain Suggestion Dialog Box */}
      <AnimatePresence>
        {showPrompt && suggestedDomain && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl glass-panel rounded-[20px] border border-white/10 p-5 bg-white/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-100 uppercase">Cross-Domain Match Detected</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans">
                  This content belongs to **{suggestedDomain === 'Entertainment' ? 'Comedy' : suggestedDomain}**. Would you like to switch domains and search there?
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowPrompt(false)}
                className="px-4 py-2 rounded-xl bg-space-850 hover:bg-space-800 border border-white/5 text-[10px] font-extrabold uppercase tracking-wider text-slate-350 active:scale-95 transition-all"
              >
                Stay Here
              </button>
              <button
                onClick={handleSwitchDomain}
                className="px-4 py-2 rounded-xl bg-white text-space-950 text-[10px] font-extrabold uppercase tracking-wider active:scale-95 transition-all"
              >
                Switch Domain
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="max-w-4xl py-20 text-center space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto animate-spin">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-xs text-slate-455 font-bold uppercase tracking-wider">Querying locked domain index...</p>
        </div>
      )}

      {/* Search Results Workspace */}
      {searched && !loading && (
        <div className="space-y-4 pt-4 border-t border-white/5 max-w-6xl">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-slate-400">
              AI Recommendations
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              {results.length} Results Found
            </span>
          </div>
          
          {results.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {results.map((item) => {
                const itemConfig = getDomainConfig(item.domain);
                const ItemIcon = getDomainIcon(item.domain);
                const scorePill = getSimilarityPill(item.similarity_score);
                const ratingValue = ((item.popularity || 80) / 20).toFixed(1);
                
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -4, 
                      boxShadow: `0 12px 25px -8px ${itemConfig.shadowColor}`
                    }}
                    className="group rounded-[20px] bg-space-800 border border-white/5 p-5 hover:border-white/10 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Flex layout with Movie Poster Box on left, details on right */}
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        {/* Poster box */}
                        <div className={`w-full sm:w-28 aspect-video sm:aspect-square shrink-0 rounded-2xl bg-gradient-to-tr ${itemConfig.gradient} border border-white/5 flex items-center justify-center relative overflow-hidden`}>
                          {ItemIcon && React.createElement(ItemIcon, { className: "w-8 h-8 opacity-80" })}
                          <div className="absolute inset-0 bg-grid opacity-10"></div>
                        </div>

                        {/* Text details */}
                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Similarity Pill */}
                            <span className={`text-[9px] font-extrabold uppercase border px-2.5 py-0.5 rounded-full ${scorePill.class}`}>
                              {scorePill.text}
                            </span>
                            
                            {/* Star rating */}
                            <div className="text-[9px] font-bold text-accent-amber bg-space-950/80 px-2 py-0.5 border border-white/5 rounded flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              {ratingValue}
                            </div>
                            
                            <span className="text-[9px] font-bold text-slate-500 uppercase">
                              {item.domain === 'Entertainment' ? 'Comedy' : item.domain}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-black text-slate-100 group-hover:text-white transition-colors truncate">
                            {item.title}
                          </h4>
                          
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-sans">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* AI Reason box */}
                      <div className="mt-4 text-[10.5px] text-slate-350 bg-white/[0.015] border border-white/[0.03] rounded-2xl p-3.5 font-sans leading-relaxed">
                        <span className="font-bold text-blue-405 mr-1">💡 AI Reason:</span>
                        {item.explanation || `Recommended because it shares common themes, storytelling components, and core tags of #${item.tags?.slice(0,2).join(', #')} with your search.`}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2.5 pt-4.5 border-t border-white/[0.04] mt-4">
                      <button
                        onClick={() => handleCardClick(item.id)}
                        className="flex-1 py-2.5 rounded-xl bg-space-850 hover:bg-space-800 border border-white/5 text-slate-200 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleChipClick(item.title)}
                        className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${itemConfig.btnGradient} text-space-950 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center hover:opacity-90`}
                      >
                        Recommend Similar
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-black text-slate-300 uppercase">No similar content found.</h4>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">
                No matching topics were found inside the active domain index focus. Adjust your filters or switch to another index below.
              </p>
              <button
                onClick={() => {
                  setCurrentDomain('Education');
                  setResults([]);
                  setSearched(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-white text-space-950 text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all cursor-pointer mx-auto"
              >
                Explore Another Domain
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
