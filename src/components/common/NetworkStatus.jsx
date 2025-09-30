import React from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { useApp } from '../../context/AppContext';

const NetworkStatus = () => {
  const { isOnline, bandwidth } = useNetwork();
  const { dataUsed } = useApp();

  const getBandwidthColor = () => {
    switch (bandwidth) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-orange-600';
      case 'very_low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBandwidthLabel = () => {
    switch (bandwidth) {
      case 'high': return 'High Speed';
      case 'medium': return 'Medium Speed';
      case 'low': return 'Low Speed';
      case 'very_low': return 'Very Low Speed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Network Status */}
      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-700">Offline</span>
          </>
        )}
      </div>

      {/* Bandwidth Indicator */}
      {isOnline && (
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
          <Signal className={`w-4 h-4 ${getBandwidthColor()}`} />
          <span className={`text-xs font-medium ${getBandwidthColor()}`}>
            {getBandwidthLabel()}
          </span>
        </div>
      )}

      {/* Data Usage */}
      <div className="text-right">
        <p className="text-xs text-gray-500">Data Used</p>
        <p className="text-sm font-semibold text-gray-900">{dataUsed.toFixed(2)} MB</p>
      </div>
    </div>
  );
};

export default NetworkStatus;