import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, User, Users } from 'lucide-react';
import { getAllLiveClasses } from '../services/liveClassService';
import { useNetwork } from '../context/NetworkContext';

const LiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOnline } = useNetwork();

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const response = await getAllLiveClasses({ upcoming: true });
      setLiveClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching live classes:', error);
      // Mock data
      setLiveClasses([
        {
          _id: '1',
          title: 'Machine Learning Basics',
          instructor: 'Dr. Sharma',
          subject: 'Artificial Intelligence',
          scheduledTime: new Date(Date.now() + 86400000).toISOString(),
          duration: 60,
          status: 'scheduled'
        },
        {
          _id: '2',
          title: 'Wind Energy Technologies',
          instructor: 'Prof. Verma',
          subject: 'Renewable Energy',
          scheduledTime: new Date(Date.now() + 172800000).toISOString(),
          duration: 45,
          status: 'scheduled'
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
                        LIVE
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{liveClass.title}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {liveClass.instructor}
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
                </div>

                <div className="ml-4">
                  <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    {liveClass.status === 'live' ? 'Join Now' : 'Set Reminder'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveClasses;