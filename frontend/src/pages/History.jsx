import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Star, 
  CheckCircle, 
  Play, 
  Trash2,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function History() {
  const navigate = useNavigate();
  const { 
    history, 
    bookmarks, 
    toggleBookmark, 
    markAsCompleted, 
    selectActiveContent 
  } = useApp();

  const handleOpenItem = (id) => {
    selectActiveContent(id);
    navigate(`/recommendations/${id}`);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Group history items
  const completedHistory = history.filter(h => h.completed);
  const inProgressHistory = history.filter(h => !h.completed);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      className="space-y-10 pb-16 relative"
    >
      {/* Header section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-accent-emerald animate-pulse-slow" />
          Offline Progress & Bookmarks
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review your completed topics, resume your in-progress tracks, and view bookmarked items saved locally in this browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bookmarks Section (1/3 width) */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Star className="w-4 h-4 text-accent-emerald fill-current animate-pulse" />
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
              Bookmarks ({bookmarks.length})
            </h3>
          </div>

          <div className="glass-panel rounded-3xl p-5 space-y-4 min-h-[400px]">
            {bookmarks.length > 0 ? (
              <div className="space-y-3">
                {bookmarks.map(item => (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-2xl bg-space-850/80 border border-white/5 hover:border-accent-emerald/20 transition-all flex justify-between items-start gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-accent-emerald truncate transition-colors">{item.title}</p>
                      <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wide mt-1 block">{item.domain}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenItem(item.id)}
                        className="p-1.5 rounded-lg bg-space-800 hover:bg-accent-emerald hover:text-space-900 border border-white/5 hover:border-transparent text-slate-400 transition-all cursor-pointer"
                        title="Open Details"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className="p-1.5 rounded-lg bg-space-800 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center text-slate-550 text-xs space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No bookmarked items found.</p>
                <p className="text-[10px] text-slate-600">Click bookmark on content cards to save for later.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* History Logs (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active / In Progress list */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">
              In-Progress Tracker ({inProgressHistory.length})
            </h3>
            
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              {inProgressHistory.length > 0 ? (
                <div className="divide-y divide-white/5 space-y-4">
                  {inProgressHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white hover:text-accent-emerald transition-colors cursor-pointer truncate" onClick={() => handleOpenItem(item.id)}>
                          {item.title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-500 font-semibold">
                          <span className="px-2 py-0.5 rounded bg-space-900 border border-white/5 text-accent-teal uppercase text-[9px] font-bold">
                            {item.domain}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            {item.duration} mins
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-600" />
                            Viewed: {formatDate(item.viewed_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button
                          onClick={() => handleOpenItem(item.id)}
                          className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 border border-white/5 text-slate-200 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Resume
                        </button>
                        <button
                          onClick={() => markAsCompleted(item.id)}
                          className="px-4 py-2 rounded-xl bg-accent-emerald/10 hover:bg-accent-emerald/20 border border-accent-emerald/20 text-accent-emerald text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-550 text-xs">
                  No active progress tracks. Discover and open items on the homepage to start tracking.
                </div>
              )}
            </div>
          </motion.div>

          {/* Completed tracks */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">
              Completed Topics ({completedHistory.length})
            </h3>
            
            <div className="glass-panel rounded-3xl p-6">
              {completedHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {completedHistory.map(item => (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-2xl bg-accent-emerald/5 border border-accent-emerald/10 hover:border-accent-emerald/25 transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 
                          onClick={() => handleOpenItem(item.id)}
                          className="text-xs font-bold text-slate-200 group-hover:text-accent-emerald truncate cursor-pointer transition-colors"
                        >
                          {item.title}
                        </h4>
                        <p className="text-[9px] font-bold text-accent-emerald/80 uppercase tracking-wider mt-1">
                          {item.domain} Completed
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-accent-emerald shrink-0 fill-accent-emerald/5" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-550 text-xs">
                  No completed topics yet. Mark progress tracks as complete to see them here.
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
}
