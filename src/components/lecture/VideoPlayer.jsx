import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, FileText, BookOpen, X } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import useIndexedDB from '../../hooks/useIndexedDB';

const VideoPlayer = ({ lecture, onClose, isOffline = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = useRef(null);
  const { bandwidth } = useNetwork();
  const { updateProgress } = useIndexedDB();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Save progress every 5 seconds
      if (Math.floor(video.currentTime) % 5 === 0) {
        updateProgress(lecture._id || lecture.lectureId, video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      updateProgress(lecture._id || lecture.lectureId, video.duration, true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [lecture, updateProgress]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (video) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getQualityRecommendation = () => {
    switch (bandwidth) {
      case 'high': return 'Medium Quality';
      case 'medium': return 'Low Quality';
      case 'low': return 'Audio Only Recommended';
      case 'very_low': return 'Audio Only';
      default: return 'Auto';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{lecture.title}</h3>
            <p className="text-sm text-gray-500">{lecture.instructor}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Video Section */}
          <div className="flex-1 flex flex-col bg-black">
            {/* Video */}
            <div className="relative flex-1 flex items-center justify-center">
              {isOffline && lecture.videoBlob ? (
                <video
                  ref={videoRef}
                  src={URL.createObjectURL(lecture.videoBlob)}
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                />
              ) : (
                <div className="text-white text-center p-8">
                  <p className="mb-4">Video Player Demo</p>
                  <p className="text-sm text-gray-400">
                    {isOffline ? 'Playing offline content' : 'Streaming from server'}
                  </p>
                </div>
              )}
              
              {/* Play Button Overlay */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-blue-600 bg-opacity-90 rounded-full p-6 hover:bg-opacity-100 transition">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="bg-gray-900 p-4">
              {/* Progress Bar */}
              <div
                className="w-full bg-gray-700 h-2 rounded-full mb-3 cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-blue-400"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-400"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>

                  <span className="text-white text-sm">
{formatTime(currentTime)} / {formatTime(duration)}
</span>
</div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-white hover:text-blue-400 text-sm flex items-center"
              >
                <FileText className="w-5 h-5 mr-1" />
                Transcript
              </button>

              <span className="text-xs text-gray-400">
                Quality: {getQualityRecommendation()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Sidebar */}
      {showTranscript && (
        <div className="w-80 bg-gray-50 border-l overflow-y-auto">
          <div className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Transcript
            </h4>
            <div className="text-sm text-gray-700 space-y-2">
              {lecture.transcript ? (
                <p>{lecture.transcript}</p>
              ) : (
                <p className="text-gray-500 italic">
                  Transcript not available for this lecture.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Footer with Additional Info */}
    <div className="p-4 bg-gray-50 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{lecture.subject}</span>
          </div>
          <div className="text-sm text-gray-600">
            Duration: {lecture.duration} minutes
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Notes
          </button>
          <button className="border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Slides
          </button>
        </div>
      </div>
      
      {!isOffline && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Download this lecture to watch offline and save data. 
            Recommended quality for your connection: <strong>{getQualityRecommendation()}</strong>
          </p>
        </div>
      )}
    </div>
  </div>
</div>
);
};
export default VideoPlayer;