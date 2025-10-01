
import React from 'react';
import { X, Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react';

const ParticipantsList = ({ participants, onClose }) => {
  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold">
          Participants ({participants.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {participants.map((participant, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {participant.userName?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Name and Role */}
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-white text-sm font-medium">
                    {participant.userName}
                  </p>
                  {participant.userRole === 'instructor' && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-gray-400 text-xs">
                  {participant.userRole === 'instructor' ? 'Instructor' : 'Student'}
                </p>
              </div>
            </div>

            {/* Media Status */}
            <div className="flex items-center space-x-2">
              {participant.audioEnabled ? (
                <Mic className="w-4 h-4 text-green-500" />
              ) : (
                <MicOff className="w-4 h-4 text-red-500" />
              )}
              {participant.videoEnabled ? (
                <Video className="w-4 h-4 text-green-500" />
              ) : (
                <VideoOff className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;