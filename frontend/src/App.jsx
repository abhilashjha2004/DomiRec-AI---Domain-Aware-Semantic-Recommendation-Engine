import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import BackgroundGlow from './components/BackgroundGlow';
import Home from './pages/Home';
import Search from './pages/Search';
import History from './pages/History';
import AboutAI from './pages/AboutAI';
import RecommendationDetail from './pages/RecommendationDetail';
import DomainExplorer from './pages/DomainExplorer';

// Layout wrapper to inject sidebar, navbar, and background glows
function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-space-900 text-slate-100 relative">
      {/* Animated Gradient Background and Grid */}
      <BackgroundGlow />
      
      {/* Main Content Pane */}
      <div className="flex h-full w-full overflow-hidden relative z-10">
        {/* Sidebar Left */}
        <Sidebar />
        
        {/* Main Content Area Right */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <Navbar />
          
          {/* Main Panel Content Scroll */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Internal Discovery Dashboard Pages */}
          <Route 
            path="/" 
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            } 
          />
          <Route 
            path="/search" 
            element={
              <AppLayout>
                <Search />
              </AppLayout>
            } 
          />
          <Route 
            path="/history" 
            element={
              <AppLayout>
                <History />
              </AppLayout>
            } 
          />
          <Route 
            path="/about" 
            element={
              <AppLayout>
                <AboutAI />
              </AppLayout>
            } 
          />
          <Route 
            path="/recommendations/:contentId" 
            element={
              <AppLayout>
                <RecommendationDetail />
              </AppLayout>
            } 
          />
          <Route 
            path="/domains" 
            element={
              <AppLayout>
                <DomainExplorer />
              </AppLayout>
            } 
          />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
