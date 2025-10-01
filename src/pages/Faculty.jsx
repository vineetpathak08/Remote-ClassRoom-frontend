import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Calendar,
  Clock,
  Plus,
  Play,
  Users,
  BookOpen,
  Settings,
  Monitor,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  createLiveClass,
  startLiveClass,
  getInstructorClasses,
} from "../services/liveClassService";
import LiveClassRoom from "../components/liveClass/LiveClassRoom";
import { toast } from "react-toastify";

const Faculty = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStartingInstant, setIsStartingInstant] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    scheduledTime: "",
    duration: 60,
    maxParticipants: 100,
  });

  const [instantFormData, setInstantFormData] = useState({
    title: "",
  });

  useEffect(() => {
    if (user && token) {
      fetchUpcomingClasses();
    }
  }, [user, token]);

  const fetchUpcomingClasses = async () => {
    try {
      const response = await getInstructorClasses();
      // Filter for upcoming scheduled classes
      const upcoming =
        response.data.myClasses?.filter(
          (cls) =>
            cls.status === "scheduled" &&
            new Date(cls.scheduledTime) > new Date()
        ) || [];
      setUpcomingClasses(upcoming.slice(0, 3)); // Show only next 3 classes
    } catch (error) {
      console.error("Error fetching upcoming classes:", error);
    }
  };

  const handleLeaveClass = () => {
    setSelectedClass(null);
    // Refresh upcoming classes when leaving
    fetchUpcomingClasses();
  };

  const handleScheduleClass = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("You must be logged in to schedule a class");
      return;
    }

    setLoading(true);

    try {
      await createLiveClass(formData);
      toast.success("Class scheduled successfully!");
      setShowCreateForm(false);
      setFormData({
        title: "",
        subject: "",
        scheduledTime: "",
        duration: 60,
        maxParticipants: 100,
      });
      fetchUpcomingClasses();
    } catch (error) {
      console.error("Error scheduling class:", error);
      toast.error(error.response?.data?.message || "Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstantInputChange = (e) => {
    const { name, value } = e.target;
    setInstantFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartInstantClass = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      toast.error("You must be logged in to start a class");
      return;
    }

    if (!instantFormData.title.trim()) {
      toast.error("Please enter a class title");
      return;
    }

    setIsStartingInstant(true);

    try {
      // Create instant class with user-provided title and teacher's name
      const classData = {
        title: instantFormData.title,
        subject: "Live Session",
        scheduledTime: new Date().toISOString(),
        duration: 60,
        maxParticipants: 100,
      };

      const createResponse = await createLiveClass(classData);
      const newClass = createResponse.data;

      // Start the class immediately
      await startLiveClass(newClass._id);

      toast.success("Instant class started successfully!");
      
      // Reset form
      setInstantFormData({ title: "" });

      // Set the selected class to enter the live room
      setSelectedClass({
        ...newClass,
        status: "live",
      });
    } catch (error) {
      console.error("Error starting instant class:", error);
      toast.error(
        error.response?.data?.message || "Failed to start instant class"
      );
    } finally {
      setIsStartingInstant(false);
    }
  };

  // If a class is selected, show the live class room
  if (selectedClass) {
    return (
      <LiveClassRoom liveClass={selectedClass} onLeave={handleLeaveClass} />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Faculty Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your live classes and virtual meetings
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Start Instant Class */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Start Instant Class
                </h3>
                <p className="text-red-100">Begin a live class immediately</p>
              </div>
              <Video className="h-8 w-8 text-red-200" />
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleStartInstantClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={instantFormData.title}
                  onChange={handleInstantInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter class title"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Instructor: <strong>{user?.name || 'Unknown'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Starting: <strong>Immediately</strong></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isStartingInstant}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isStartingInstant ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Class
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Schedule Class */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Schedule Class</h3>
              <p className="text-blue-100">Plan a future live session</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-200" />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule
          </button>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Classes
          </h2>
        </div>
        <div className="p-6">
          {upcomingClasses.length > 0 ? (
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {classItem.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {classItem.subject}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(classItem.scheduledTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {classItem.participants?.length || 0}/
                      {classItem.maxParticipants}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming classes scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/live-classes")}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <Monitor className="h-8 w-8 text-gray-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">All Live Classes</h3>
          <p className="text-gray-600 text-sm">
            View and manage all your classes
          </p>
        </button>

        <button
          onClick={() => navigate("/lectures")}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <BookOpen className="h-8 w-8 text-gray-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Lecture Library</h3>
          <p className="text-gray-600 text-sm">Upload and manage lectures</p>
        </button>

        <button
          onClick={() => navigate("/downloads")}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <Settings className="h-8 w-8 text-gray-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
          <p className="text-gray-600 text-sm">Configure your preferences</p>
        </button>
      </div>

      {/* Schedule Class Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Schedule New Class</h2>
            <form onSubmit={handleScheduleClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter class title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="480"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    max="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Scheduling..." : "Schedule Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Faculty;
