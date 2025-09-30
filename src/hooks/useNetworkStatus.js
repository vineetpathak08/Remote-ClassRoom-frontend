import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [bandwidth, setBandwidth] = useState('medium');
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const updateConnectionInfo = () => {
      if (navigator.connection) {
        const conn = navigator.connection;
        setConnectionType(conn.effectiveType || 'unknown');
        
        // Determine bandwidth level
        if (conn.effectiveType === '4g' || conn.effectiveType === 'wifi') {
          setBandwidth('high');
        } else if (conn.effectiveType === '3g') {
          setBandwidth('medium');
        } else if (conn.effectiveType === '2g') {
          setBandwidth('low');
        } else {
          setBandwidth('very_low');
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  return { isOnline, bandwidth, connectionType };
};

export default useNetworkStatus;