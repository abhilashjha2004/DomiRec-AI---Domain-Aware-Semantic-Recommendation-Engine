import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
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
  Brain,
  ArrowRight,
  Flame,
  Cpu,
  Star
} from 'lucide-react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

// Comprehensive domain-specific styling configurations
export const getDomainConfig = (domainName) => {
  const normalized = domainName === 'Entertainment' ? 'Comedy' : domainName;
  switch (normalized) {
    case 'Trending':
    case '🔥 Trending':
      return {
        icon: Flame,
        desc: "The most popular topics and cinematic masterpieces across all domains.",
        gradient: "from-amber-500/25 via-red-500/10 to-orange-500/5",
        textClass: "text-amber-500",
        borderClass: "hover:border-amber-500/40 group-hover:border-amber-500/40",
        badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        shadowColor: "rgba(245, 158, 11, 0.25)",
        btnGradient: "from-amber-500 to-orange-600"
      };
    case 'Education':
      return {
        icon: GraduationCap,
        desc: "Learn essential computer science topics, software engineering, and logic.",
        gradient: "from-cyan-500/20 to-blue-600/5",
        textClass: "text-cyan-400",
        borderClass: "hover:border-cyan-500/40 group-hover:border-cyan-500/40",
        badgeBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
        shadowColor: "rgba(6, 182, 212, 0.25)",
        btnGradient: "from-cyan-500 to-blue-600"
      };
    case 'Movies':
      return {
        icon: Film,
        desc: "Explore blockbuster hits, mind-bending sci-fi, and timeless classics.",
        gradient: "from-red-500/20 to-orange-600/5",
        textClass: "text-red-400",
        borderClass: "hover:border-red-500/40 group-hover:border-red-500/40",
        badgeBg: "bg-red-500/10 border-red-500/20 text-red-405",
        shadowColor: "rgba(239, 68, 68, 0.25)",
        btnGradient: "from-red-500 to-orange-650"
      };
    case 'Sports':
      return {
        icon: Trophy,
        desc: "Relive cricket highlights, football tributes, analyses, and goals.",
        gradient: "from-emerald-500/20 to-lime-600/5",
        textClass: "text-emerald-400",
        borderClass: "hover:border-emerald-500/40 group-hover:border-emerald-500/40",
        badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        shadowColor: "rgba(16, 185, 129, 0.25)",
        btnGradient: "from-emerald-500 to-lime-650"
      };
    case 'Blogging':
      return {
        icon: Compass,
        desc: "Travel the world, explore winter vlogs, and master lifestyle guides.",
        gradient: "from-orange-500/20 to-yellow-600/5",
        textClass: "text-orange-400",
        borderClass: "hover:border-orange-500/40 group-hover:border-orange-500/40",
        badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-400",
        shadowColor: "rgba(249, 115, 22, 0.25)",
        btnGradient: "from-orange-500 to-yellow-550"
      };
    case 'Entertainment':
    case 'Comedy':
      return {
        icon: Tv,
        desc: "Unwind with comedy highlights, reviews, and light entertainment.",
        gradient: "from-yellow-500/20 to-orange-600/5",
        textClass: "text-yellow-400",
        borderClass: "hover:border-yellow-500/40 group-hover:border-yellow-500/40",
        badgeBg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        shadowColor: "rgba(234, 179, 8, 0.25)",
        btnGradient: "from-yellow-500 to-orange-500"
      };
    case 'Music':
      return {
        icon: Music,
        desc: "Relax with chill instrumental beats and track overlays.",
        gradient: "from-pink-500/20 to-purple-650/5",
        textClass: "text-pink-400",
        borderClass: "hover:border-pink-500/40 group-hover:border-pink-500/40",
        badgeBg: "bg-pink-500/10 border-pink-500/20 text-pink-400",
        shadowColor: "rgba(236, 72, 153, 0.25)",
        btnGradient: "from-pink-550 to-purple-600"
      };
    case 'Gaming':
      return {
        icon: Gamepad,
        desc: "Discover Minecraft builds, Elden Ring strategy guides, and walkthroughs.",
        gradient: "from-violet-500/20 to-indigo-600/5",
        textClass: "text-violet-400",
        borderClass: "hover:border-violet-500/40 group-hover:border-violet-500/40",
        badgeBg: "bg-violet-500/10 border-violet-500/20 text-violet-400",
        shadowColor: "rgba(139, 92, 246, 0.25)",
        btnGradient: "from-violet-500 to-indigo-650"
      };
    case 'Books':
      return {
        icon: BookOpen,
        desc: "Explore classic literature book reviews, guides, and novels.",
        gradient: "from-amber-600/20 to-amber-900/5",
        textClass: "text-amber-500",
        borderClass: "hover:border-amber-550/40 group-hover:border-amber-550/40",
        badgeBg: "bg-amber-650/10 border-amber-650/20 text-amber-500",
        shadowColor: "rgba(217, 119, 6, 0.2)",
        btnGradient: "from-amber-600 to-amber-800"
      };
    case 'Technology':
      return {
        icon: Cpu,
        desc: "Learn quantum computing basics, AI updates, and specs.",
        gradient: "from-cyan-500/20 to-blue-650/5",
        textClass: "text-cyan-400",
        borderClass: "hover:border-cyan-550/40 group-hover:border-cyan-550/40",
        badgeBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
        shadowColor: "rgba(6, 182, 212, 0.25)",
        btnGradient: "from-cyan-550 to-blue-600"
      };
    case 'Finance':
      return {
        icon: DollarSign,
        desc: "Study budgeting strategies, stock indices, and crypto investing.",
        gradient: "from-emerald-500/20 to-emerald-700/5",
        textClass: "text-emerald-400",
        borderClass: "hover:border-emerald-500/40 group-hover:border-emerald-500/40",
        badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        shadowColor: "rgba(16, 185, 129, 0.25)",
        btnGradient: "from-emerald-500 to-emerald-750"
      };
    case 'Health':
      return {
        icon: HeartPulse,
        desc: "Master stretching routines, mindfulness, and sleep optimization.",
        gradient: "from-teal-500/20 to-teal-700/5",
        textClass: "text-teal-400",
        borderClass: "hover:border-teal-550/40 group-hover:border-teal-550/40",
        badgeBg: "bg-teal-500/10 border-teal-500/20 text-teal-400",
        shadowColor: "rgba(20, 184, 166, 0.25)",
        btnGradient: "from-teal-500 to-teal-700"
      };
    case 'News':
      return {
        icon: Newspaper,
        desc: "Analyze global policies, news summaries, and current summits.",
        gradient: "from-slate-500/20 to-indigo-750/5",
        textClass: "text-slate-350",
        borderClass: "hover:border-slate-400/40 group-hover:border-slate-400/40",
        badgeBg: "bg-slate-500/10 border-slate-500/20 text-slate-400",
        shadowColor: "rgba(100, 116, 139, 0.2)",
        btnGradient: "from-slate-550 to-indigo-700"
      };
    default:
      return {
        icon: Layers,
        desc: "Browse semantic recommendations isolation structures.",
        gradient: "from-space-700/20 to-space-800/5",
        textClass: "text-slate-400",
        borderClass: "hover:border-space-600/40 group-hover:border-space-600/40",
        badgeBg: "bg-space-800 border-white/5 text-slate-400",
        shadowColor: "rgba(148, 163, 184, 0.15)",
        btnGradient: "from-space-700 to-space-600"
      };
  }
};

// Component for scrollable content row
function CategoryRow({ title, items, onCardClick }) {
  const rowRef = useRef(null);
  const config = getDomainConfig(title);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const IconComponent = config.icon || Layers;

  return (
    <div className="space-y-5 relative group/row border-b border-white/[0.03] pb-10 last:border-0 last:pb-0">
      
      {/* Dynamic Descriptive Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className={`w-6 h-6 ${config.textClass}`} />}
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{title}</h3>
            <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-full ${config.badgeBg}`}>
              {items.length} titles
            </span>
          </div>
          <p className="text-xs text-slate-450 leading-relaxed max-w-2xl font-sans">
            {config.desc}
          </p>
        </div>

        {/* Dynamic Theme Color Button */}
        {title !== '🔥 Trending' && (
          <Link 
            to="/domains" 
            state={{ activeDomain: title === 'Comedy' ? 'Entertainment' : title }}
            className={`px-4 py-1.5 rounded-xl border border-white/5 bg-space-850 hover:bg-gradient-to-r ${config.btnGradient} text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-space-950 transition-all duration-300 flex items-center gap-1 cursor-pointer`}
          >
            See All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Decorative Accent Separator Line */}
      <div className="h-0.5 w-full bg-white/[0.02] relative rounded-full overflow-hidden">
        <div className={`absolute top-0 left-0 w-28 h-full bg-gradient-to-r ${config.btnGradient}`}></div>
      </div>

      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-space-900/95 border border-white/5 hover:border-slate-700 text-white flex items-center justify-center cursor-pointer shadow-lg hover:shadow-neon-green/5 active:scale-95 transition-all opacity-0 group-hover/row:opacity-100 z-20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Horizontal Rail Container */}
        <div
          ref={rowRef}
          className="flex overflow-x-auto scrollbar-hide py-3 gap-6 px-1 scroll-smooth"
        >
          {items.slice(0, 10).map((item) => {
            const itemConfig = getDomainConfig(item.domain);
            const ItemIcon = itemConfig.icon || Layers;
            const ratingValue = ((item.popularity || 80) / 20).toFixed(1);

            return (
              <motion.div
                key={item.id}
                onClick={() => onCardClick(item)}
                whileHover={{ 
                  y: -6, 
                  scale: 1.025,
                  boxShadow: `0 15px 30px -10px ${itemConfig.shadowColor}`
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`w-60 sm:w-64 flex-shrink-0 cursor-pointer group rounded-2xl bg-space-800 border border-white/5 hover:border-white/10 transition-colors duration-300 p-4`}
              >
                {/* Visual Thumbnail Area */}
                <div className={`w-full aspect-video rounded-xl bg-gradient-to-tr ${itemConfig.gradient} border border-white/5 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300`}>
                  {ItemIcon && <ItemIcon className="w-8 h-8 opacity-85 group-hover:scale-110 transition-transform duration-300" />}
                  
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none"></div>
                  
                  {/* Category Pill Tag */}
                  <div className="absolute bottom-2 left-2 text-[8px] font-extrabold uppercase bg-space-950/95 border border-white/5 px-2 py-0.5 rounded text-slate-300">
                    {item.domain === 'Entertainment' ? 'Comedy' : item.domain}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 text-[9px] font-extrabold bg-space-950/90 border border-white/5 px-1.5 py-0.5 rounded text-accent-amber flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {ratingValue}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="mt-3.5 space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-white line-clamp-1 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-space-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Tags footer */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
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
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-space-900/90 border border-white/5 hover:border-slate-700 text-white flex items-center justify-center cursor-pointer shadow-lg hover:shadow-neon-green/5 active:scale-95 transition-all opacity-0 group-hover/row:opacity-100 z-20 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { selectActiveContent } = useApp();

  const [homeData, setHomeData] = useState({
    trending: [],
    education: [],
    movies: [],
    sports: [],
    blogging: [],
    entertainment: [],
    technology: [],
    gaming: [],
    books: [],
    music: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/home");
        setHomeData(res.data);
      } catch (err) {
        console.error("CRITICAL ERROR: Failed to load dataset payload from home API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleCardClick = (item) => {
    selectActiveContent(item.id);
    navigate(`/recommendations/${item.id}`);
  };

  const hasData = Object.values(homeData).some(arr => arr && arr.length > 0);

  if (loading || !hasData) {
    return (
      <div className="py-44 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald mx-auto animate-spin shadow-neon-green/5">
          <Brain className="w-6 h-6 animate-pulse" />
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Content Discovery Catalogs...</p>
      </div>
    );
  }

  // Domain Order
  const categoriesList = [
    { key: 'movies', title: '🎬 Movies' },
    { key: 'education', title: '🎓 Education' },
    { key: 'sports', title: '⚽ Sports' },
    { key: 'blogging', title: '🎥 Blogging' },
    { key: 'music', title: '🎵 Music' },
    { key: 'books', title: '📚 Books' },
    { key: 'technology', title: '💻 Technology' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-12"
    >
      {/* 🔥 Global Trending shelf at the top */}
      {homeData.trending && homeData.trending.length > 0 && (
        <motion.div variants={itemVariants}>
          <CategoryRow
            title="🔥 Trending"
            items={homeData.trending}
            onCardClick={handleCardClick}
          />
        </motion.div>
      )}

      {/* Dynamic domain shelves */}
      {categoriesList.map((cat) => {
        const items = homeData[cat.key];
        if (!items || items.length === 0) return null;
        return (
          <motion.div key={cat.key} variants={itemVariants}>
            <CategoryRow
              title={cat.title}
              items={items}
              onCardClick={handleCardClick}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
