import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Cpu, 
  Layers, 
  Database,
  Workflow,
  Network,
  Binary,
  Compass
} from 'lucide-react';

export default function AboutAI() {
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
          <Brain className="w-6 h-6 text-accent-emerald animate-pulse-slow" />
          AI Engine & Offline Architecture
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore the high-dimensional vector pipeline and offline semantic matching mechanics behind DomiRec AI.
        </p>
      </div>

      {/* SVG Pipeline Architecture Diagram */}
      <motion.div variants={itemVariants} className="glass-panel rounded-3xl border border-white/5 p-6 sm:p-8 space-y-6">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
          <Workflow className="w-4 h-4 text-accent-teal" />
          Offline Recommendation Pipeline
        </h3>

        <div className="w-full overflow-x-auto flex justify-center py-4 bg-space-950/40 rounded-2xl border border-white/5">
          <svg width="840" height="280" viewBox="0 0 840 280" className="min-w-[840px] text-slate-450">
            {/* Definitions for Glow Filters */}
            <defs>
              <linearGradient id="emeraldTeal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
              <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting lines */}
            <path d="M 140 140 L 220 140" stroke="url(#emeraldTeal)" strokeWidth="2.5" strokeDasharray="5 5" className="animate-pulse" />
            <path d="M 360 140 L 440 140" stroke="url(#emeraldTeal)" strokeWidth="2.5" />
            <path d="M 580 140 L 660 140" stroke="url(#emeraldTeal)" strokeWidth="2.5" strokeDasharray="5 5" />

            {/* Node 1: Local Datasets */}
            <g transform="translate(20, 95)" className="cursor-default">
              <rect width="120" height="90" rx="16" fill="#111827" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
              <rect width="120" height="90" rx="16" fill="rgba(16, 185, 129, 0.02)" />
              <text x="60" y="38" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="800">Local JSON</text>
              <text x="60" y="54" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="700">Datasets</text>
              <text x="60" y="70" textAnchor="middle" fill="#94A3B8" fontSize="8">12 catalog domains</text>
            </g>

            {/* Node 2: Sentence Transformer */}
            <g transform="translate(220, 95)">
              <rect width="140" height="90" rx="16" fill="#111827" stroke="#10B981" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.2))" }} />
              <text x="70" y="32" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="800">Sentence Embedder</text>
              <text x="70" y="48" textAnchor="middle" fill="#14B8A6" fontSize="10" fontWeight="700">all-MiniLM-L6-v2</text>
              <text x="70" y="64" textAnchor="middle" fill="#94A3B8" fontSize="8">Hugging Face dense</text>
              <text x="70" y="76" textAnchor="middle" fill="#94A3B8" fontSize="8">384 dimension space</text>
            </g>

            {/* Node 3: FAISS Index splits */}
            <g transform="translate(440, 95)">
              <rect width="140" height="90" rx="16" fill="#111827" stroke="#14B8A6" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(20, 184, 166, 0.2))" }} />
              <text x="70" y="32" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="800">Granular FAISS</text>
              <text x="70" y="48" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="700">Index Splits</text>
              <text x="70" y="64" textAnchor="middle" fill="#94A3B8" fontSize="8">Isolated search index</text>
              <text x="70" y="76" textAnchor="middle" fill="#94A3B8" fontSize="8">per domain folder</text>
            </g>

            {/* Node 4: Similarity Re-ranking */}
            <g transform="translate(660, 95)">
              <rect width="140" height="90" rx="16" fill="#111827" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
              <rect width="140" height="90" rx="16" fill="rgba(20, 184, 166, 0.02)" />
              <text x="70" y="32" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="800">Cosine Match &</text>
              <text x="70" y="48" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="700">Heuristic Ranker</text>
              <text x="70" y="64" textAnchor="middle" fill="#94A3B8" fontSize="8">Popularity boosts</text>
              <text x="70" y="76" textAnchor="middle" fill="#94A3B8" fontSize="8">and shared tags map</text>
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Grid of detailed explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Block 1: Sentence Transformers */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald shrink-0">
              <Network className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-white">Sentence Transformers</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            DomiRec AI uses the Hugging Face <code className="text-accent-teal bg-space-950 px-1 py-0.5 rounded font-mono text-[10px]">all-MiniLM-L6-v2</code> model to parse titles, descriptions, and tags. This deep learning transformer maps sentences into dense, high-dimensional vectors where semantic similarity corresponds directly to spatial proximity.
          </p>
        </motion.div>

        {/* Core Block 2: Dense Embeddings */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal shrink-0">
              <Binary className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-white">High-Dimensional Embeddings</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Each content catalog item is encoded into a **384-dimensional floating point array** (vector). Instead of checking for literal keyword occurrences, these embeddings capture conceptual contexts, letting the engine understand that "operating systems" and "CPU scheduling" are mathematically related.
          </p>
        </motion.div>

        {/* Core Block 3: FAISS Index Splits */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber shrink-0">
              <Database className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-white">Granular FAISS Index Splits</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            To prevent cross-domain content leakage, the engine compiles a separate **FAISS (Facebook AI Similarity Search)** index file for each category (Movies, Education, Gaming, etc.). When a content card is clicked, the engine locks into that specific index file, restricting vector searches to that segment.
          </p>
        </motion.div>

        {/* Core Block 4: PCA Reduction */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald shrink-0">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-white">Principal Component Analysis (PCA)</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            To verify high-dimensional clustering correctness, the engine computes **PCA (Principal Component Analysis)**. By mathematical coordinate projection, the 384 dimensions of the dense embedding vectors are reduced to 2D coordinates, preserving the primary clusters for index diagnostics.
          </p>
        </motion.div>
      </div>

      {/* Incremental Cache details */}
      <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 space-y-4 bg-space-850/50">
        <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wide">Incremental Indexing & Caching</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          To ensure quick load times, the backend computes SHA-256 hashes of all datasets. It skips embedding generation for any item that is already present inside the locally saved `embeddings_cache.pkl` file. When the server launches, it scans files incrementally and updates FAISS indices in milliseconds.
        </p>
      </motion.div>

    </motion.div>
  );
}
