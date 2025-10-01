import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Play, Clock, Bell, TrendingUp, BookOpen, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [recentLectures, setRecentLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Poll for live class notifications every 30 seconds
    const interval = setInterval(() => {
      fetchLiveNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchLiveNotifications(),
        fetchRecentLectures()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/live-classes/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newNotifications = data.data || [];
        
        // Show toast notification if there's a new live class
        if (newNotifications.length > liveNotifications.length) {
          const newClass = newNotifications[0];
          if (newClass.status === 'live') {
            toast.info(`🔴 ${newClass.title} is now LIVE!`, {
              position: "top-right",
              autoClose: 5000,
              onClick: () => navigate('/live-classes')
            });
          }
        }
        
        setLiveNotifications(newNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchRecentLectures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/lectures?limit=6', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentLectures(data.data?.lectures || []);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const handleJoinLiveClass = (liveClass) => {
    navigate('/live-classes', { state: { autoJoin: liveClass } });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">Ready to continue your learning journey?</p>
      </div>

      {/* Live Class Notifications */}
      {liveNotifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b bg-red-50">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-red-600 animate-bounce" />
              <h2 className="text-lg font-semibold text-red-900">Live Classes</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {liveNotifications.map((liveClass) => (
              <div
                key={liveClass._id}
                className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {liveClass.status === 'live' && (
                        <span className="flex items-center text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                          LIVE NOW
                        </span>
                      )}
                      <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {liveClass.subject}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{liveClass.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{liveClass.instructorName || liveClass.instructor?.name}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {liveClass.status === 'live' 
                          ? 'Started at ' + formatTime(liveClass.actualStartTime)
                          : 'Starts at ' + formatTime(liveClass.scheduledTime)
                        }
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinLiveClass(liveClass)}
                    className={`${
                      liveClass.status === 'live'
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-6 py-2 rounded-lg font-medium transition flex items-center space-x-2`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{liveClass.status === 'live' ? 'Join Now' : 'Set Reminder'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{recentLectures.length}</span>
          </div>
          <h3 className="text-gray-600 text-sm">Available Lectures</h3>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Downloaded</h3>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">85%</span>
          </div>
          <h3 className="text-gray-600 text-sm">Progress</h3>
        </div>
      </div>

      {/* Recent Lectures */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Lectures</h2>
          <button
            onClick={() => navigate('/lectures')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="p-6">
          {recentLectures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No lectures available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate('/lectures')}
                >
                  <div className="relative">
                    <img
                      src={lecture.thumbnail || 'https://via.placeholder.com/300x180'}
                      alt={lecture.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {lecture.duration} min
                    </div>
                  </div>
                  <div className="p-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {lecture.subject}
                    </span>
                    <h3 className="font-medium text-gray-900 mt-2 line-clamp-2 text-sm">
                      {lecture.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{lecture.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Learning Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Download lectures when you have WiFi to watch offline later</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Join live classes early to test your audio and ask questions</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Use audio-only mode in live classes if your internet is slow</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Raise your hand during live classes to interact with instructors</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;