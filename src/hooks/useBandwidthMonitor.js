import { useState, useEffect, useCallback } from 'react';

const useBandwidthMonitor = () => {
  const [bandwidth, setBandwidth] = useState('medium');
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [shouldUseAudioOnly, setShouldUseAudioOnly] = useState(false);

  // Monitor network connection
  useEffect(() => {
    const updateConnectionInfo = () => {
      if (navigator.connection) {
        const conn = navigator.connection;
        const effectiveType = conn.effectiveType;
        const downlink = conn.downlink; // Mbps
        
        setDownloadSpeed(downlink);

        // Determine bandwidth level
        if (effectiveType === '4g' && downlink > 2) {
          setBandwidth('high');
          setConnectionQuality('excellent');
          setShouldUseAudioOnly(false);
        } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 1)) {
          setBandwidth('medium');
          setConnectionQuality('good');
          setShouldUseAudioOnly(false);
        } else if (effectiveType === '3g' || effectiveType === '2g') {
          setBandwidth('low');
          setConnectionQuality('fair');
          setShouldUseAudioOnly(downlink < 0.5);
        } else {
          setBandwidth('very_low');
          setConnectionQuality('poor');
          setShouldUseAudioOnly(true);
        }
      }
    };

    updateConnectionInfo();

    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateConnectionInfo);
    }

    // Also monitor using periodic speed tests
    const speedTestInterval = setInterval(() => {
      performSpeedTest();
    }, 30000); // Every 30 seconds

    return () => {
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateConnectionInfo);
      }
      clearInterval(speedTestInterval);
    };
  }, []);

  const performSpeedTest = useCallback(async () => {
    const imageUrl = 'https://via.placeholder.com/150';
    const startTime = Date.now();

    try {
      const response = await fetch(imageUrl + '?t=' + startTime, {
        cache: 'no-cache'
      });
      await response.blob();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const bitsLoaded = 150 * 150 * 8; // approximate bits
      const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);

      // Update connection quality based on speed
      if (speedMbps > 2) {
        setConnectionQuality('excellent');
      } else if (speedMbps > 1) {
        setConnectionQuality('good');
      } else if (speedMbps > 0.5) {
        setConnectionQuality('fair');
      } else {
        setConnectionQuality('poor');
        setShouldUseAudioOnly(true);
      }
    } catch (error) {
      console.error('Speed test failed:', error);
      setConnectionQuality('poor');
    }
  }, []);

  const getRecommendedQuality = useCallback(() => {
    switch (bandwidth) {
      case 'high':
        return { video: '720p', audio: '128kbps' };
      case 'medium':
        return { video: '480p', audio: '96kbps' };
      case 'low':
        return { video: '360p', audio: '64kbps' };
      case 'very_low':
        return { video: null, audio: '32kbps' };
      default:
        return { video: '480p', audio: '96kbps' };
    }
  }, [bandwidth]);

  return {
    bandwidth,
    connectionQuality,
    downloadSpeed,
    shouldUseAudioOnly,
    getRecommendedQuality,
    performSpeedTest
  };
};

export default useBandwidthMonitor;