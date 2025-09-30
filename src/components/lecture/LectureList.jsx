import React from 'react';
import LectureCard from './LectureCard';
import { Loader } from 'lucide-react';

const LectureList = ({ lectures, loading, onWatch, isOffline = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lectures || lectures.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No lectures available</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lectures.map((lecture) => (
        <LectureCard
          key={lecture._id || lecture.id}
          lecture={lecture}
          onWatch={onWatch}
          isOffline={isOffline}
        />
      ))}
    </div>
  );
};

export default LectureList;