import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentDomain, setCurrentDomain] = useState(localStorage.getItem('currentDomain') || 'Education');
  const [domainLock, setDomainLock] = useState(localStorage.getItem('domainLock') === 'true' || true);
  const [activeContent, setActiveContent] = useState(null);
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize history and bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem('localHistory')) || [];
      const storedBookmarks = JSON.parse(localStorage.getItem('localBookmarks')) || [];
      setHistory(storedHistory);
      setBookmarks(storedBookmarks);
    } catch (e) {
      console.error("Failed to parse history or bookmarks from localStorage", e);
    }
  }, []);

  // Persist domain states
  useEffect(() => {
    localStorage.setItem('currentDomain', currentDomain);
  }, [currentDomain]);

  useEffect(() => {
    localStorage.setItem('domainLock', domainLock);
  }, [domainLock]);

  const toggleBookmark = async (contentId) => {
    try {
      const isBookmarked = bookmarks.some(b => b.id === contentId);
      let updatedBookmarks;
      
      if (isBookmarked) {
        updatedBookmarks = bookmarks.filter(b => b.id !== contentId);
      } else {
        // Fetch content details from API to bookmark it
        const detailRes = await axios.get(`${API_BASE}/content/${contentId}`);
        updatedBookmarks = [...bookmarks, detailRes.data];
      }
      
      setBookmarks(updatedBookmarks);
      localStorage.setItem('localBookmarks', JSON.stringify(updatedBookmarks));
      return { success: true };
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      return { success: false, message: "Action failed" };
    }
  };

  const selectActiveContent = async (contentId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/content/${contentId}`);
      setActiveContent(res.data);
      
      // Auto adjust domain selection to match the content domain
      if (res.data.domain !== currentDomain) {
        setCurrentDomain(res.data.domain);
      }
      
      // Log view in local history
      const now = new Date().toISOString();
      const storedHistory = JSON.parse(localStorage.getItem('localHistory')) || [];
      const existingIdx = storedHistory.findIndex(h => h.id === contentId);
      
      let updatedHistory;
      if (existingIdx !== -1) {
        // Update viewed timestamp
        updatedHistory = [...storedHistory];
        updatedHistory[existingIdx] = {
          ...updatedHistory[existingIdx],
          viewed_at: now
        };
      } else {
        // Add new record
        updatedHistory = [
          {
            ...res.data,
            viewed_at: now,
            completed: false
          },
          ...storedHistory
        ];
      }
      
      setHistory(updatedHistory);
      localStorage.setItem('localHistory', JSON.stringify(updatedHistory));
      
    } catch (err) {
      console.error("Error selecting content:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (contentId) => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem('localHistory')) || [];
      const updatedHistory = storedHistory.map(h => 
        h.id === contentId ? { ...h, completed: true } : h
      );
      
      setHistory(updatedHistory);
      localStorage.setItem('localHistory', JSON.stringify(updatedHistory));
      
      if (activeContent && activeContent.id === contentId) {
        setActiveContent(prev => ({ ...prev, completed: true }));
      }
    } catch (err) {
      console.error("Error completing content:", err);
    }
  };

  const semanticSearch = async (queryText) => {
    try {
      const res = await axios.post(`${API_BASE}/content/search`, {
        query: queryText,
        domain_lock: domainLock,
        current_domain: currentDomain
      });
      return res.data;
    } catch (err) {
      console.error("Semantic search failed:", err);
      return { query: queryText, detected_domain: currentDomain, results: [] };
    }
  };

  const getRecommendations = async (contentId) => {
    try {
      const res = await axios.post(`${API_BASE}/recommendations`, {
        content_id: contentId,
        domain_lock: domainLock,
        personalize: false
      });
      return res.data;
    } catch (err) {
      console.error("Error getting recommendations:", err);
      return [];
    }
  };

  const getLearningPath = async (rootId) => {
    try {
      const res = await axios.get(`${API_BASE}/learning-paths?root_id=${rootId}`);
      return res.data;
    } catch (err) {
      console.error("Error getting learning path:", err);
      return { nodes: [], edges: [] };
    }
  };

  return (
    <AppContext.Provider value={{
      currentDomain,
      setCurrentDomain,
      domainLock,
      setDomainLock,
      activeContent,
      setActiveContent,
      history,
      bookmarks,
      loading,
      toggleBookmark,
      selectActiveContent,
      markAsCompleted,
      semanticSearch,
      getRecommendations,
      getLearningPath
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
