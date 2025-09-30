import React, { createContext, useContext, useState, useEffect } from 'react';

const NetworkContext = createContext();

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [bandwidth, setBandwidth] = useState('medium'); // high, medium, low, very_low

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate bandwidth detection
    const detectBandwidth = () => {
      if (navigator.connection) {
        const effectiveType = navigator.connection.effectiveType;
        if (effectiveType === '4g') setBandwidth('high');
        else if (effectiveType === '3g') setBandwidth('medium');
        else if (effectiveType === '2g') setBandwidth('low');
        else setBandwidth('very_low');
      }
    };

    detectBandwidth();
    if (navigator.connection) {
      navigator.connection.addEventListener('change', detectBandwidth);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', detectBandwidth);
      }
    };
  }, []);

  const value = {
    isOnline,
    bandwidth
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};