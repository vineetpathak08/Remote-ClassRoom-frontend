import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useApp } from '../../context/AppContext';

const DownloadManager = () => {
  const { downloadQueue, removeFromDownloadQueue } = useApp();

  if (downloadQueue.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border z-40">
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Download className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Downloads</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {downloadQueue.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {downloadQueue.map((item) => (
          <div key={item.id} className="relative">
            <ProgressBar
              progress={item.progress}
              status={item.progress === 100 ? 'completed' : 'downloading'}
              fileName={item.lecture.title}
            />
            {item.progress === 100 && (
              <button
                onClick={() => removeFromDownloadQueue(item.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadManager;