import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
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
  TrendingUp,
  Clock,
  HelpCircle,
  FolderLock,
  Star
} from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../api';
import { useApp } from '../context/AppContext';
import { getDomainConfig } from './Home';

// Helper to calculate similarity score color bands
const getScoreChipClass = (score) => {
  if (score >= 95) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
  if (score >= 85) return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  if (score >= 70) return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
  return 'bg-space-850 border-white/5 text-slate-400';
};

export default function RecommendationDetail() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const { 
    setCurrentDomain, 
    setDomainLock,
    bookmarks, 
    toggleBookmark, 
    markAsCompleted, 
    history 
  } = useApp();

  const [activeItem, setActiveItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [learningPath, setLearningPath] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load detailed content and recommendations
  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch current content detail
        const contentRes = await axios.get(`${API_BASE}/content/${contentId}`);
        const item = contentRes.data;
        setActiveItem(item);
        
        // Locked Domain Setting
        setCurrentDomain(item.domain);
        setDomainLock(true);

        // 2. Fetch locked recommendations
        const recsRes = await axios.post(`${API_BASE}/recommendations`, {
          content_id: item.id,
          domain_lock: true,
          personalize: false
        });
        setRecommendations(recsRes.data);

        // 3. Fetch related roadmap graph
        const pathRes = await axios.get(`${API_BASE}/learning-paths?root_id=${item.id}`);
        setLearningPath(pathRes.data);

      } catch (err) {
        console.error("Failed to load details page:", err);
        setError("Content catalog item not found in local datasets.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [contentId]);

  const handleCardClick = (targetId) => {
    navigate(`/recommendations/${targetId}`);
  };

  if (loading) {
    return (
      <div className="py-44 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald mx-auto animate-spin shadow-neon-green/5">
          <Brain className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-black text-white uppercase tracking-wider">Analyzing Semantic Graph...</p>
          <p className="text-xs text-slate-400">Filtering candidates inside domain index</p>
        </div>
      </div>
    );
  }

  if (error || !activeItem) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto space-y-6">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-lg font-black text-white">Content Item Not Found</h3>
        <p className="text-xs text-slate-450 leading-relaxed">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-space-800 text-slate-200 border border-white/5 font-bold text-xs uppercase"
        >
          Return Home
        </button>
      </div>
    );
  }

  const config = getDomainConfig(activeItem.domain);
  const Icon = config.icon || Layers;
  const isBookmarked = bookmarks.some(b => b.id === activeItem.id);
  const isCompleted = history.some(h => h.id === activeItem.id && h.completed);

  // Generate related concept nodes for horizontal flowchart
  const getConceptNodes = () => {
    const list = [activeItem.title];
    if (activeItem.domain === 'Movies' && activeItem.title.toLowerCase().includes('avengers')) {
      return ['Avengers', 'Marvel MCU', 'Infinity Saga', 'Superheroes', 'Sagas'];
    }
    if (activeItem.domain === 'Movies' && activeItem.title.toLowerCase().includes('inception')) {
      return ['Inception', 'Nolan Thrillers', 'Dreams Heist', 'Cognitive Sci-Fi'];
    }
    if (activeItem.domain === 'Education') {
      return [activeItem.title, 'Core Principles', 'Foundational Theory', 'Advanced Concept'];
    }
    if (activeItem.tags && activeItem.tags.length > 0) {
      activeItem.tags.slice(0, 3).forEach(tag => {
        list.push(tag.charAt(0).toUpperCase() + tag.slice(1));
      });
    } else {
      list.push(activeItem.domain, 'Core Track');
    }
    return list;
  };

  const conceptNodes = getConceptNodes();

  return (
    <div className="space-y-8 pb-16 relative">
      
      {/* Main Three-Panel Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANEL 1: Left - Selected Content (4 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <FolderLock className={`w-3.5 h-3.5 ${config.textClass}`} />
            Selected Content
          </h3>

          <div 
            style={{ boxShadow: `0 10px 25px -5px ${config.shadowColor}` }}
            className={`glass-panel rounded-3xl p-5 space-y-6 relative overflow-hidden border border-white/5 transition-all duration-300`}
          >
            {/* Dynamic themed gradient thumbnail */}
            <div className={`w-full aspect-video rounded-2xl bg-gradient-to-tr ${config.gradient} border border-white/5 flex items-center justify-center relative overflow-hidden`}>
              {Icon && <Icon className="w-12 h-12" />}
              <div className="absolute inset-0 bg-grid opacity-15"></div>
            </div>

            {/* Meta tags and text details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase border px-2.5 py-0.5 rounded-full ${config.badgeBg}`}>
                  {activeItem.domain === 'Entertainment' ? 'Comedy' : activeItem.domain}
                </span>
                {activeItem.difficulty && (
                  <span className="text-[9px] font-bold uppercase bg-space-800 border border-white/5 text-slate-400 px-2.5 py-0.5 rounded-full">
                    {activeItem.difficulty}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                {activeItem.title}
              </h2>
              
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {activeItem.description}
              </p>
            </div>

            {/* Local persistence actions */}
            <div className="pt-5 border-t border-white/5 flex gap-2">
              <button
                onClick={() => toggleBookmark(activeItem.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  isBookmarked 
                    ? `bg-gradient-to-r ${config.gradient} border-white/10 text-white` 
                    : 'bg-space-800 border-white/5 hover:border-slate-700 text-slate-300'
                }`}
              >
                {isBookmarked ? '★ Saved' : '☆ Bookmark'}
              </button>
              <button
                onClick={() => markAsCompleted(activeItem.id)}
                disabled={isCompleted}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  isCompleted 
                    ? 'bg-space-850 border-white/5 text-slate-500 cursor-not-allowed' 
                    : `bg-gradient-to-r ${config.btnGradient} text-space-950 border-transparent hover:opacity-90`
                }`}
              >
                {isCompleted ? '✓ Completed' : 'Complete'}
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: Center - AI Recommendations (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <TrendingUp className={`w-3.5 h-3.5 ${config.textClass}`} />
            Recommended Content
          </h3>

          {recommendations.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">
              No recommendations inside this domain catalog.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.slice(0, 12).map((item) => {
                const itemConfig = getDomainConfig(item.domain);
                const RecIcon = itemConfig.icon || Layers;
                const scoreClass = getScoreChipClass(item.similarity_score);
                
                return (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item.id)}
                    className="cursor-pointer group rounded-2xl bg-space-800 border border-white/5 p-4 hover:border-white/15 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Gradient card top */}
                      <div className={`w-full aspect-video rounded-xl bg-gradient-to-tr ${itemConfig.gradient} border border-white/5 flex items-center justify-center relative overflow-hidden`}>
                        {RecIcon && <RecIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />}
                        <div className="absolute inset-0 bg-grid opacity-10"></div>
                        
                        {/* Similarity Score Overlay Badge - Colored Chips */}
                        <div className={`absolute top-2 right-2 text-[9px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${scoreClass}`}>
                          {item.similarity_score}% Match
                        </div>
                      </div>

                      <div className="mt-3.5 space-y-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-200 group-hover:text-white line-clamp-1 transition-colors">
                          {item.title}
                        </h4>
                        
                        {/* Why Recommended Explanation */}
                        {item.explanation && (
                          <div className={`text-[10px] bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5 leading-snug font-sans italic text-slate-350`}>
                            💡 {item.explanation}
                          </div>
                        )}
                        
                        <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2 pt-0.5 font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer tag tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-3">
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
                );
              })}
            </div>
          )}
        </div>

        {/* PANEL 3: Right - Category Statistics (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <Sparkles className={`w-3.5 h-3.5 ${config.textClass}`} />
            Category Insights
          </h3>

          <div className="glass-panel rounded-3xl p-5 space-y-5">
            {/* Stat Row 1 */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Locked Domain</span>
              <div className="flex items-center gap-2 pt-1">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${config.badgeBg}`}>
                  {Icon && React.createElement(Icon, { className: "w-4 h-4" })}
                </div>
                <span className="text-sm font-black text-white">{activeItem.domain === 'Entertainment' ? 'Comedy' : activeItem.domain}</span>
              </div>
            </div>

            {/* Stat Row 2 */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Highest Similarity</span>
              <p className={`text-base font-black ${config.textClass}`}>
                {recommendations.length > 0 ? `${recommendations[0].similarity_score}%` : 'N/A'}
              </p>
              <p className="text-[10px] font-semibold text-slate-550">Peak index match value</p>
            </div>

            {/* Stat Row 3 */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Cluster Index Nodes</span>
              <p className="text-sm font-black text-white">
                {recommendations.length + 1} catalog files
              </p>
              <p className="text-[10px] font-semibold text-slate-550">Scanned offline inside this folder</p>
            </div>

            {/* Safe zone isolation banner */}
            <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/[0.05] text-[10px] font-semibold text-slate-400 leading-relaxed font-sans">
              <p className={`font-bold mb-1 ${config.textClass}`}>🛡️ Focus Lock Active</p>
              No suggestions from other domains are displayed to prevent cross-domain content leakage. Check the "About AI" tab to inspect vector dimensions and model specifications.
            </div>
          </div>
        </div>

      </div>

      {/* Concept Flowchart Line */}
      {conceptNodes.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Related Topics
          </h3>
          
          <div className="glass-panel rounded-3xl p-5 overflow-x-auto">
            <div className="flex items-center gap-4 min-w-max py-1">
              {conceptNodes.map((concept, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="text-slate-600 font-extrabold">→</span>
                  )}
                  <div className="px-4 py-2.5 rounded-xl bg-space-850 border border-white/5 text-xs font-bold text-slate-300 hover:border-white/10 hover:text-white transition-all shadow-md">
                    {concept}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Learning Path Timeline Graph (if nodes exist) */}
      {learningPath.nodes && learningPath.nodes.length > 1 && (
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Prerequisite Track
          </h3>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="relative border-l border-white/5 ml-4 pl-8 space-y-6 py-2">
              {learningPath.nodes.map((node, index) => (
                <div key={node.id} className="relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-space-850 border border-white/5 hover:border-white/10 transition-all duration-200">
                  {/* Timeline Dot */}
                  <span className="absolute left-[-42px] top-4.5 w-5 h-5 rounded-full border border-white/5 bg-space-900 flex items-center justify-center text-[9px] font-bold text-slate-500 group-hover:border-white/20 group-hover:text-white transition-all duration-200">
                    {index + 1}
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                        {node.title}
                      </h4>
                      {node.difficulty && (
                        <span className="text-[9px] font-bold text-accent-teal bg-accent-teal/5 border border-accent-teal/10 px-2 py-0.5 rounded">
                          {node.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
                      {node.duration > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-655" />
                          <span>{node.duration} mins</span>
                        </div>
                      )}
                      <span>•</span>
                      <span>Category: {node.domain === 'Entertainment' ? 'Comedy' : node.domain}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCardClick(node.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-[10px] font-extrabold bg-space-800 hover:bg-white hover:text-space-950 text-white border border-white/5 hover:border-transparent transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Load Item
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
