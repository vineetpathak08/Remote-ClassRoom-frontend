import React from 'react';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

const ProgressBar = ({ progress, status = 'downloading', fileName }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'downloading':
        return <Loader className="w-5 h-5 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'downloading':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-gray-900">{fileName}</p>
            <p className="text-xs text-gray-500">
              {status === 'downloading' && `${Math.round(progress)}%`}
              {status === 'completed' && 'Download complete'}
              {status === 'failed' && 'Download failed'}
            </p>
          </div>
        </div>
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;