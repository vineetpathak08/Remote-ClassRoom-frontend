import React, { useState } from 'react';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Circle,
  Square,
  BarChart3,
  Settings
} from 'lucide-react';

const InstructorControls = ({ 
  socket, 
  roomId, 
  onStartPoll, 
  onEndClass,
  isRecording,
  onToggleRecording,
  participants 
}) => {
  const [showPollModal, setShowPollModal] = useState(false);
  const [showParticipantControls, setShowParticipantControls] = useState(false);

  const handleMuteAll = () => {
    if (window.confirm('Are you sure you want to mute all students?')) {
      socket.emit('mute-all', { roomId });
    }
  };

  const handleMuteStudent = (studentSocketId) => {
    socket.emit('mute-student', { roomId, studentSocketId });
  };

  const handleRemoveStudent = (studentSocketId, studentName) => {
    if (window.confirm(`Remove ${studentName} from the class?`)) {
      socket.emit('remove-student', { roomId, studentSocketId });
    }
  };

  const handleStartPoll = () => {
    setShowPollModal(true);
  };

  const handleEndClass = () => {
    if (window.confirm('Are you sure you want to end this class? All students will be disconnected.')) {
      onEndClass();
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700">
      {/* Main Controls */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Recording Control */}
          <button
            onClick={onToggleRecording}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Circle className="w-5 h-5" />
                <span>Start Recording</span>
              </>
            )}
          </button>

          {/* Start Poll */}
          <button
            onClick={handleStartPoll}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Start Poll</span>
          </button>

          {/* Mute All */}
          <button
            onClick={handleMuteAll}
            className="flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <MicOff className="w-5 h-5" />
            <span>Mute All</span>
          </button>

          {/* Participant Controls */}
          <button
            onClick={() => setShowParticipantControls(!showParticipantControls)}
            className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <Users className="w-5 h-5" />
            <span>Manage ({participants.length})</span>
          </button>
        </div>
      </div>

      {/* Participant Controls Panel */}
      {showParticipantControls && (
        <div className="border-t border-gray-700 bg-gray-750">
          <div className="px-6 py-4 max-h-64 overflow-y-auto">
            <h3 className="text-white font-semibold mb-3">Manage Participants</h3>
            <div className="space-y-2">
              {participants
                .filter(p => p.userRole === 'student')
                .map((participant) => (
                  <div
                    key={participant.socketId}
                    className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {participant.userName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{participant.userName}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          {participant.audioEnabled ? (
                            <Mic className="w-3 h-3 text-green-500" />
                          ) : (
                            <MicOff className="w-3 h-3 text-red-500" />
                          )}
                          {participant.handRaised && (
                            <span className="text-yellow-500">✋ Hand Raised</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMuteStudent(participant.socketId)}
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
                        title="Mute student"
                      >
                        <MicOff className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveStudent(participant.socketId, participant.userName)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                        title="Remove student"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Poll Modal */}
      {showPollModal && (
        <PollModal
          onClose={() => setShowPollModal(false)}
          onStart={onStartPoll}
          socket={socket}
          roomId={roomId}
        />
      )}
    </div>
  );
};

// Poll Modal Component
const PollModal = ({ onClose, onStart, socket, roomId }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [type, setType] = useState('multiple-choice');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleStartPoll = () => {
    const poll = {
      question,
      options: type === 'multiple-choice' ? options.filter(o => o.trim()) : [],
      type,
      id: Date.now()
    };

    socket.emit('start-poll', { roomId, poll });
    onStart(poll);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Create Poll</h3>

        <div className="space-y-4">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What is your question?"
            />
          </div>

          {/* Poll Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="open-ended">Open Ended</option>
            </select>
          </div>

          {/* Options (for multiple choice) */}
          {type === 'multiple-choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                <button
                  onClick={handleAddOption}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStartPoll}
            disabled={!question.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorControls;