import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioControls = ({ stream }) => {
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !muted;
      }
    }
  }, [stream, muted]);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    if (stream) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      
      gainNode.gain.value = newVolume / 100;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-gray-700 px-4 py-2 rounded-lg">
      <button
        onClick={() => setMuted(!muted)}
        className="text-white hover:text-blue-400 transition"
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
      
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
        }}
      />
      
      <span className="text-white text-sm w-8">{volume}%</span>
    </div>
  );
};

export default AudioControls;