import React, { createContext, useContext, useState, useEffect } from 'react';
import { openDB } from '../utils/indexedDB';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [dataUsed, setDataUsed] = useState(0);
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    // Initialize IndexedDB
    const initDB = async () => {
      const database = await openDB();
      setDb(database);
    };
    initDB();

    // Load data usage from localStorage
    const savedDataUsage = localStorage.getItem('dataUsed');
    if (savedDataUsage) {
      setDataUsed(parseInt(savedDataUsage));
    }
  }, []);

  useEffect(() => {
    // Persist data usage
    localStorage.setItem('dataUsed', dataUsed.toString());
  }, [dataUsed]);

  const incrementDataUsage = (bytes) => {
    const megabytes = bytes / (1024 * 1024);
    setDataUsed(prev => prev + megabytes);
  };

  const addToDownloadQueue = (lecture, quality) => {
    setDownloadQueue(prev => [...prev, { lecture, quality, progress: 0, id: Date.now() }]);
  };

  const updateDownloadProgress = (id, progress) => {
    setDownloadQueue(prev =>
      prev.map(item => item.id === id ? { ...item, progress } : item)
    );
  };

  const removeFromDownloadQueue = (id) => {
    setDownloadQueue(prev => prev.filter(item => item.id !== id));
  };

  const value = {
    dataUsed,
    incrementDataUsage,
    downloadQueue,
    addToDownloadQueue,
    updateDownloadProgress,
    removeFromDownloadQueue,
    db
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};