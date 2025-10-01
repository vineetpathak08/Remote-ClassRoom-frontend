import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import useBandwidthMonitor from '../../hooks/useBandwidthMonitor';

const BandwidthMonitor = ({ onBandwidthChange, socket, roomId }) => {
  const { 
    bandwidth, 
    connectionQuality, 
    downloadSpeed, 
    shouldUseAudioOnly,
    getRecommendedQuality 
  } = useBandwidthMonitor();

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Notify parent component about bandwidth changes
    if (onBandwidthChange) {
      onBandwidthChange({
        bandwidth,
        connectionQuality,
        shouldUseAudioOnly,
        recommendedQuality: getRecommendedQuality()
      });
    }

    // Send bandwidth update to server via socket
    if (socket && roomId) {
      socket.emit('bandwidth-update', {
        roomId,
        bandwidth,
        connectionQuality
      });
    }

    // Show warning if connection is poor
    if (connectionQuality === 'poor' && !showWarning) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    }
  }, [bandwidth, connectionQuality, shouldUseAudioOnly, socket, roomId]);

  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
      case 'good':
        return <Wifi className="w-4 h-4" />;
      case 'fair':
        return <Signal className="w-4 h-4" />;
      case 'poor':
        return <WifiOff className="w-4 h-4" />;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-2">
      {/* Connection Quality Indicator */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getQualityColor()}`}>
        {getQualityIcon()}
        <div className="flex-1">
          <p className="text-xs font-medium">
            Connection: {connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1)}
          </p>
          {downloadSpeed > 0 && (
            <p className="text-xs opacity-75">{downloadSpeed.toFixed(2)} Mbps</p>
          )}
        </div>
      </div>

      {/* Warning Message */}
      {showWarning && connectionQuality === 'poor' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse">
          <p className="text-xs text-red-800 font-medium">
            ⚠️ Poor connection detected. Switching to audio-only mode for better experience.
          </p>
        </div>
      )}

      {/* Audio-Only Mode Indicator */}
      {shouldUseAudioOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            🎧 Audio-only mode active to save bandwidth
          </p>
        </div>
      )}
    </div>
  );
};

export default BandwidthMonitor;