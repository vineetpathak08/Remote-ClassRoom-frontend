import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, User, Play } from 'lucide-react';
import { getAllLiveClasses } from '../services/liveClassService';
import { useNetwork } from '../context/NetworkContext';
import { useAuth } from '../context/AuthContext';
import LiveClassRoom from '../components/liveClass/LiveClassRoom';

const LiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [inClass, setInClass] = useState(false);
  const { isOnline } = useNetwork();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchLiveClasses();
    }
  }, [token]);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const response = await getAllLiveClasses({ upcoming: true });
      setLiveClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching live classes:', error);
      // Mock data for testing
      setLiveClasses([
        {
          _id: '1',
          title: 'Machine Learning Basics',
          instructor: {
            _id: 'inst1',
            name: 'Dr. Sharma'
          },
          instructorName: 'Dr. Sharma',
          subject: 'Artificial Intelligence',
          scheduledTime: new Date().toISOString(),
          duration: 60,
          status: 'live',
          roomId: 'room-ml-basics-001'
        },
        {
          _id: '2',
          title: 'Wind Energy Technologies',
          instructor: {
            _id: 'inst2',
            name: 'Prof. Verma'
          },
          instructorName: 'Prof. Verma',
          subject: 'Renewable Energy',
          scheduledTime: new Date(Date.now() + 3600000).toISOString(),
          duration: 45,
          status: 'scheduled',
          roomId: 'room-wind-energy-002'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleJoinClass = (liveClass) => {
    // Ensure we have all required data
    if (!liveClass || !liveClass.roomId) {
      toast.error('Invalid class data');
      return;
    }
    
    console.log('Joining class:', liveClass); // Debug log
    setSelectedClass(liveClass);
    setInClass(true);
  };

  const handleLeaveClass = () => {
    setInClass(false);
    setSelectedClass(null);
    // Refresh classes list
    fetchLiveClasses();
  };

  // Show live class room if user has joined
  if (inClass && selectedClass) {
    return (
      <LiveClassRoom 
        liveClass={selectedClass} 
        onLeave={handleLeaveClass}
      />
    );
  }

  if (!isOnline) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">You are Offline</h3>
        <p className="text-gray-600">
          Live classes require an internet connection. Please connect to view upcoming classes.
        </p>
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Classes</h2>
        <p className="text-gray-600">Join live interactive sessions with expert instructors</p>
      </div>

      {liveClasses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Classes</h3>
          <p className="text-gray-600 mb-4">Check back later for new live class schedules</p>
        </div>
      ) : (
        <div className="space-y-4">
          {liveClasses.map((liveClass) => (
            <div key={liveClass._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      {liveClass.subject}
                    </span>
                    {liveClass.status === 'live' && (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded flex items-center">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{liveClass.title}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {liveClass.instructorName || liveClass.instructor?.name || 'Instructor'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(liveClass.scheduledTime)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(liveClass.scheduledTime)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {liveClass.duration} minutes
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      ✓ Audio-first streaming
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      ✓ Live chat & Q&A
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      ✓ Screen sharing
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      ✓ Auto recording
                    </span>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => handleJoinClass(liveClass)}
                    className={`${
                      liveClass.status === 'live'
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white py-3 px-6 rounded-lg font-medium transition flex items-center space-x-2`}
                  >
                    {liveClass.status === 'live' ? (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Join Now</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        <span>Set Reminder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Before Joining a Live Class:
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Allow microphone access when prompted</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Find a quiet place to minimize background noise</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Test your internet connection (audio-only mode works on 2G)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use headphones for better audio quality</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Keep your device charged or plugged in</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LiveClasses;