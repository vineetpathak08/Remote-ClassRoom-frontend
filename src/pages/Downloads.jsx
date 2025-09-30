import React, { useState, useEffect } from 'react';
import { Trash2, Play } from 'lucide-react';
import useIndexedDB from '../hooks/useIndexedDB';
import VideoPlayer from '../components/lecture/VideoPlayer';

const Downloads = () => {
  const { offlineLectures, loading, deleteOffline, loadOfflineLectures } = useIndexedDB();
  const [selectedLecture, setSelectedLecture] = useState(null);

  const handleDelete = async (lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      await deleteOffline(lectureId);
      await loadOfflineLectures();
    }
  };

  const calculateTotalSize = () => {
    // Approximate calculation
    return offlineLectures.length * 75; // Average 75 MB per lecture
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Downloaded Lectures</h2>
        <p className="text-gray-600">
          You have {offlineLectures.length} lecture{offlineLectures.length !== 1 ? 's' : ''} available offline
          {offlineLectures.length > 0 && ` (${calculateTotalSize()} MB total)`}
        </p>
      </div>

      {offlineLectures.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Downloaded Lectures</h3>
          <p className="text-gray-600 mb-4">
            Download lectures from the Lectures page to watch them offline
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offlineLectures.map((lecture) => (
            <div key={lecture.id} className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {lecture.videoBlob && (
                    <video
                      src={URL.createObjectURL(lecture.videoBlob)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{lecture.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{lecture.instructor}</span>
                    <span>•</span>
                    <span>{lecture.duration} min</span>
                    <span>•</span>
                    <span>{lecture.quality || 'medium'} quality</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Downloaded on {new Date(lecture.downloadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setSelectedLecture(lecture)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Watch
                </button>
                <button
                  onClick={() => handleDelete(lecture.lectureId)}
                  className="border border-red-300 text-red-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedLecture && (
        <VideoPlayer
          lecture={selectedLecture}
          onClose={() => setSelectedLecture(null)}
          isOffline={true}
        />
      )}
    </div>
  );
};

export default Downloads;