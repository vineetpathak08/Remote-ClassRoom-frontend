import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Calendar,
  Clock,
  User,
  Play,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  StopCircle,
  Users,
  Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getInstructorClasses } from "../services/liveClassService";
import { useNetwork } from "../context/NetworkContext";
import LiveClassRoom from "../components/liveClass/LiveClassRoom";
import { toast } from "react-toastify";

const InstructorLiveClasses = () => {
  const [myClasses, setMyClasses] = useState([]);
  const [otherLiveClasses, setOtherLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState("my-classes");
  const [startingClassId, setStartingClassId] = useState(null);
  const { user, token } = useAuth();
  const { isOnline } = useNetwork();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      fetchInstructorClasses();
    }
  }, [token, user]);

  const fetchInstructorClasses = async () => {
    try {
      setLoading(true);
      const data = await getInstructorClasses();
      setMyClasses(data.data.myClasses || []);
      setOtherLiveClasses(data.data.otherLiveClasses || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");

      // Fallback to mock data for development
      setMyClasses([
        {
          _id: "1",
          title: "Machine Learning Fundamentals",
          subject: "Artificial Intelligence",
          scheduledTime: new Date().toISOString(),
          duration: 60,
          status: "live",
          roomId: "room-ml-001",
          participants: [
            { name: "John Doe", joined: true },
            { name: "Jane Smith", joined: false },
          ],
        },
      ]);

      setOtherLiveClasses([
        {
          _id: "2",
          title: "Web Development Basics",
          instructor: { name: "Prof. Wilson" },
          subject: "Computer Science",
          scheduledTime: new Date(
            Date.now() + 2 * 60 * 60 * 1000
          ).toISOString(),
          duration: 90,
          status: "live",
          roomId: "room-web-002",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartClass = async (classId) => {
    try {
      setStartingClassId(classId); // Set loading state for this specific class

      // Find the class object before starting
      const classToStart = myClasses.find((cls) => cls._id === classId);
      if (!classToStart) {
        toast.error("Class not found");
        setStartingClassId(null);
        return;
      }

      // API call to start class
      const response = await fetch(
        `http://localhost:5000/api/live-classes/${classId}/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Class started successfully! Joining now...");

        // Update the class status to live and immediately join
        const updatedClass = {
          ...classToStart,
          status: "live",
        };

        // Join the live class immediately
        setSelectedClass(updatedClass);

        // Clear loading state
        setStartingClassId(null);

        // Also refresh data in background for other components
        fetchInstructorClasses();
      } else {
        toast.error("Failed to start class");
        setStartingClassId(null);
      }
    } catch (error) {
      console.error("Error starting class:", error);
      toast.error("Failed to start class");
      setStartingClassId(null);
    }
  };

  const handleEndClass = async (classId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/live-classes/${classId}/end`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Class ended successfully!");
        fetchInstructorClasses(); // Refresh data
      } else {
        toast.error("Failed to end class");
      }
    } catch (error) {
      console.error("Error ending class:", error);
      toast.error("Failed to end class");
    }
  };

  const handleJoinClass = (liveClass) => {
    setSelectedClass(liveClass);
  };

  const handleLeaveClass = () => {
    setSelectedClass(null);
  };

  const handleScheduleClass = () => {
    // Navigate to Faculty page with live tab active
    navigate("/faculty?tab=live");
  };

  const handleStartInstantClass = () => {
    // Navigate to Faculty page for instant class creation
    navigate("/faculty");
  };

  if (selectedClass) {
    return (
      <LiveClassRoom
        liveClass={selectedClass}
        onLeave={handleLeaveClass}
        isInstructor={activeTab === "my-classes"}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Live Classes</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleStartInstantClass}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start Instant Class</span>
          </button>
          <button
            onClick={handleScheduleClass}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Class</span>
          </button>
        </div>
      </div>

      {/* Network Status Warning */}
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="text-sm">
            ⚠️ You're currently offline. Some features may not be available.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("my-classes")}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "my-classes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Classes ({myClasses.length})
          </button>
          <button
            onClick={() => setActiveTab("other-classes")}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "other-classes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Other Live Classes ({otherLiveClasses.length})
          </button>
        </nav>
      </div>

      {/* My Classes Tab */}
      {activeTab === "my-classes" && (
        <div className="space-y-4">
          {myClasses.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No scheduled classes
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't scheduled any live classes yet.
              </p>
              <button
                onClick={handleScheduleClass}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Schedule Your First Class
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myClasses.map((liveClass) => (
                <div
                  key={liveClass._id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {liveClass.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {liveClass.subject}
                      </p>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(liveClass.scheduledTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {liveClass.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {liveClass.participants?.length || 0} participants
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        liveClass.status === "live"
                          ? "bg-green-100 text-green-800"
                          : liveClass.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {liveClass.status === "live"
                        ? "🔴 Live"
                        : liveClass.status === "scheduled"
                        ? "📅 Scheduled"
                        : "⏹️ Ended"}
                    </span>

                    <div className="flex space-x-2">
                      {liveClass.status === "scheduled" && (
                        <button
                          onClick={() => handleStartClass(liveClass._id)}
                          disabled={startingClassId === liveClass._id}
                          className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                            startingClassId === liveClass._id
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {startingClassId === liveClass._id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>Starting...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>Start</span>
                            </>
                          )}
                        </button>
                      )}

                      {liveClass.status === "live" && (
                        <>
                          <button
                            onClick={() => handleJoinClass(liveClass)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                          >
                            <Video className="w-3 h-3" />
                            <span>Join</span>
                          </button>
                          <button
                            onClick={() => handleEndClass(liveClass._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                          >
                            <StopCircle className="w-3 h-3" />
                            <span>End</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other Live Classes Tab */}
      {activeTab === "other-classes" && (
        <div className="space-y-4">
          {otherLiveClasses.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No other live classes
              </h3>
              <p className="text-gray-600">
                There are no other instructors conducting live classes right
                now.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherLiveClasses.map((liveClass) => (
                <div
                  key={liveClass._id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {liveClass.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {liveClass.subject}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {liveClass.instructor?.name || "Unknown Instructor"}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(liveClass.scheduledTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {liveClass.duration} minutes
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🔴 Live
                    </span>

                    <button
                      onClick={() => handleJoinClass(liveClass)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Observe</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorLiveClasses;
