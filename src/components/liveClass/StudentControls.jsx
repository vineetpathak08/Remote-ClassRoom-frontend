import React from 'react';
import { Hand, MessageSquare } from 'lucide-react';

const StudentControls = ({ 
  handRaised, 
  onToggleHand, 
  onOpenChat,
  unreadMessages 
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Raise Hand Button */}
      <button
        onClick={onToggleHand}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
          handRaised
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        title={handRaised ? 'Lower hand' : 'Raise hand'}
      >
        <Hand className={`w-5 h-5 ${handRaised ? 'animate-bounce' : ''}`} />
<span>{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
</button>
  {/* Chat Button */}
  <button
    onClick={onOpenChat}
    className="relative flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition"
    title="Open chat"
  >
    <MessageSquare className="w-5 h-5" />
    <span>Chat</span>
    {unreadMessages > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {unreadMessages}
      </span>
    )}
  </button>
</div>
);
};
export default StudentControls;
      