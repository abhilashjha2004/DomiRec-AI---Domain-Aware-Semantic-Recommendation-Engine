import React from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  Star,
  GraduationCap,
  Film,
  Trophy,
  Compass,
  Tv,
  Music,
  Cpu,
  Gamepad,
  Newspaper,
  DollarSign,
  HeartPulse,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ContentCard({ item, onSelect }) {
  const { bookmarks, toggleBookmark, markAsCompleted, token } = useApp();
  
  const isBookmarked = bookmarks.some(b => b.id === item.id);
  const isCompleted = item.is_completed || item.completed;
  
  const getDomainIcon = (domain) => {
    switch (domain) {
      case 'Education': return <GraduationCap className="w-8 h-8 text-cyan-400" />;
      case 'Movies': return <Film className="w-8 h-8 text-indigo-400" />;
      case 'Sports': return <Trophy className="w-8 h-8 text-emerald-400" />;
      case 'Blogging': return <Compass className="w-8 h-8 text-amber-400" />;
      case 'Entertainment': return <Tv className="w-8 h-8 text-pink-400" />;
      case 'Music': return <Music className="w-8 h-8 text-violet-450" />;
      case 'Technology': return <Cpu className="w-8 h-8 text-purple-400" />;
      case 'Gaming': return <Gamepad className="w-8 h-8 text-rose-450" />;
      case 'News': return <Newspaper className="w-8 h-8 text-sky-400" />;
      case 'Finance': return <DollarSign className="w-8 h-8 text-green-450" />;
      default: return <HeartPulse className="w-8 h-8 text-slate-450" />;
    }
  };

  const getDomainGradient = (domain) => {
    switch (domain) {
      case 'Education': return 'from-cyan-900/40 via-space-850 to-space-950 border-cyan-500/20';
      case 'Movies': return 'from-indigo-900/40 via-space-850 to-space-950 border-indigo-500/20';
      case 'Sports': return 'from-emerald-900/40 via-space-850 to-space-950 border-emerald-500/20';
      case 'Blogging': return 'from-amber-900/40 via-space-850 to-space-950 border-amber-500/20';
      case 'Entertainment': return 'from-pink-900/40 via-space-850 to-space-950 border-pink-500/20';
      case 'Music': return 'from-violet-900/40 via-space-850 to-space-950 border-violet-500/20';
      case 'Technology': return 'from-purple-900/40 via-space-850 to-space-950 border-purple-500/20';
      case 'Gaming': return 'from-rose-900/40 via-space-850 to-space-950 border-rose-500/20';
      case 'News': return 'from-sky-900/40 via-space-850 to-space-950 border-sky-500/20';
      case 'Finance': return 'from-green-900/40 via-space-850 to-space-950 border-green-500/20';
      default: return 'from-slate-900/40 via-space-850 to-space-950 border-slate-500/20';
    }
  };

  const getDomainColor = (domain) => {
    switch (domain) {
      case 'Education': return 'from-blue-500/25 to-cyan-500/25 text-cyan-400 border-cyan-500/30';
      case 'Movies': return 'from-purple-500/25 to-indigo-500/25 text-indigo-400 border-indigo-500/30';
      case 'Sports': return 'from-emerald-500/25 to-teal-500/25 text-teal-400 border-teal-500/30';
      case 'Blogging': return 'from-orange-500/25 to-amber-500/25 text-amber-400 border-amber-500/30';
      case 'Entertainment': return 'from-rose-500/25 to-pink-500/25 text-pink-400 border-pink-500/30';
      case 'Music': return 'from-violet-500/25 to-purple-500/25 text-violet-400 border-violet-500/30';
      case 'Technology': return 'from-purple-500/25 to-fuchsia-500/25 text-purple-405 text-fuchsia-400 border-fuchsia-500/30';
      default: return 'from-slate-500/25 to-slate-650/25 text-slate-400 border-slate-500/30';
    }
  };

  const truncate = (str, len) => {
    if (!str) return "";
    return str.length > len ? str.substring(0, len) + "..." : str;
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 hover:border-accent-purple/40 transition-all duration-300 group shadow-lg hover:shadow-accent-purple/5 relative overflow-hidden flex flex-col justify-between">
      
      {/* 1. Dynamic Visual Thumbnail Banner */}
      <div className={`aspect-video w-full relative bg-gradient-to-br ${getDomainGradient(item.domain)} border-b flex flex-col items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        
        {/* Glow Sphere in center of thumbnail */}
        <div className="absolute w-12 h-12 rounded-full bg-accent-purple/10 filter blur-md group-hover:bg-accent-purple/20 transition-all duration-500"></div>
        
        {/* Floating Domain Icon */}
        <div className="relative z-10 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          {getDomainIcon(item.domain)}
        </div>

        {/* Overlay Similarity Score Badge (top right) */}
        {item.similarity_score !== undefined && (
          <span className="absolute top-3 right-3 text-[10px] font-extrabold tracking-wide text-accent-cyan bg-space-950/75 border border-slate-700/60 px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md">
            <span className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse"></span>
            {item.similarity_score}% Match
          </span>
        )}

        {/* Overlay Recommendation Score (top left, if different from similarity) */}
        {item.recommendation_score !== undefined && (
          <span className="absolute top-3 left-3 text-[10px] font-extrabold tracking-wide text-accent-pink bg-space-950/75 border border-slate-700/60 px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md">
            Rank: {item.recommendation_score}%
          </span>
        )}
      </div>

      {/* 2. Main Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Domain text tag */}
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider uppercase bg-gradient-to-r ${getDomainColor(item.domain)} border`}>
              {item.domain}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-extrabold text-white mb-1.5 leading-snug group-hover:text-accent-purple transition-colors duration-200 line-clamp-1">
            {item.title}
          </h3>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-3 min-h-[34px] line-clamp-2">
            {truncate(item.description, 95)}
          </p>
        </div>

        <div>
          {/* Attributes */}
          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold mb-3 border-t border-slate-800/40 pt-2.5">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{item.duration} mins</span>
            </div>
            {item.difficulty && (
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.difficulty}</span>
              </div>
            )}
          </div>

          {/* AI Recommendation Reason */}
          {item.explanation && (
            <div className="text-[10px] text-accent-pink bg-accent-pink/5 border border-accent-pink/10 rounded-lg px-2.5 py-1.5 mb-3 leading-snug italic">
              💡 {item.explanation.replace("Recommended because it is ", "").replace(".", "")}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(item.id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-space-800 hover:bg-gradient-to-r hover:from-accent-purple hover:to-accent-pink text-white font-extrabold text-[10px] uppercase py-2 rounded-xl border border-slate-700/60 hover:border-transparent transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              Open Content
            </button>

            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border bg-space-800 border-slate-800 hover:border-accent-cyan text-slate-450 hover:text-accent-cyan transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                title="View Source Link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Bookmark button */}
            {token && (
              <button
                onClick={() => toggleBookmark(item.id)}
                className={`p-2 rounded-xl border transition-all duration-300 ${
                  isBookmarked
                    ? 'bg-accent-purple/20 border-accent-purple/40 text-accent-purple shadow-neon-purple/5'
                    : 'bg-space-800 border-slate-800 hover:border-slate-650 text-slate-450 hover:text-white'
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Save for Later"}
              >
                <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Mark Completed button */}
            {token && !isCompleted && (
              <button
                onClick={() => markAsCompleted(item.id)}
                className="p-2 rounded-xl border bg-space-800 border-slate-800 hover:border-emerald-500/30 text-slate-450 hover:text-emerald-400 transition-all duration-300"
                title="Mark as Completed"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            )}

            {isCompleted && (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" title="Completed Topic">
                <CheckCircle className="w-3.5 h-3.5 fill-current text-space-900" />
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
