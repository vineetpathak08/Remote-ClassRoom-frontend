import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Hand,
  Phone,
  Settings,
  Send,
  X,
  BarChart3,
} from "lucide-react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { SOCKET_URL } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import BandwidthMonitor from "./BandwidthMonitor";
import InstructorControls from "./InstructorControls";
import StudentControls from "./StudentControls";
import ChatBox from "./ChatBox";
import ParticipantsList from "./ParticipantsList";
import PollPanel from "./PollPanel";
import { toast } from "react-toastify";

const LiveClassRoom = ({ liveClass, onLeave }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [peers, setPeers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResponses, setPollResponses] = useState([]);
  const [pollMinimized, setPollMinimized] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [bandwidthInfo, setBandwidthInfo] = useState(null);
  const [forceAudioOnly, setForceAudioOnly] = useState(false);

  const userVideo = useRef();
  const peersRef = useRef([]);
  const recordingChunks = useRef([]);
  const mediaRecorder = useRef(null);

  const isInstructor = user?.role === "instructor";

  // Utility function to remove duplicate participants
  const removeDuplicateParticipants = (participantsList) => {
    const seen = new Set();
    return participantsList.filter((participant) => {
      const key = `${participant.userId}-${participant.socketId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Get user media
    initializeMedia();

    // Cleanup on unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (newSocket) {
        newSocket.emit("leave-class", {
          roomId: liveClass.roomId,
          userId: user.id,
        });
        newSocket.disconnect();
      }
      peers.forEach((peer) => {
        if (peer.peer) peer.peer.destroy();
      });
    };
  }, []);

  useEffect(() => {
    if (!socket || !localStream) return;

    // Clean up specific event listeners to prevent duplicates
    socket.off("room-state");
    socket.off("user-joined");
    socket.off("user-left");
    socket.off("webrtc-offer");
    socket.off("webrtc-answer");
    socket.off("webrtc-ice-candidate");
    socket.off("chat-message");
    socket.off("slide-changed");
    socket.off("hand-raised");
    socket.off("participant-media-changed");
    socket.off("mute-all-command");
    socket.off("force-mute");
    socket.off("removed-from-class");
    socket.off("new-poll");
    socket.off("poll-response");
    socket.off("poll-ended");
    socket.off("recording-started");
    socket.off("recording-stopped");
    socket.off("participant-bandwidth-update");

    // Join the class room
    socket.emit("join-class", {
      roomId: liveClass.roomId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
    });

    // Handle room state
    socket.on("room-state", (data) => {
      const cleanParticipants = removeDuplicateParticipants(data.participants);
      setParticipants(cleanParticipants);
      if (data.currentSlide) {
        setCurrentSlide(data.currentSlide);
      }
      setIsRecording(data.isRecording || false);
    });

    // Handle new user joined
    socket.on("user-joined", (data) => {
      setParticipants((prev) => {
        // Check if participant already exists to prevent duplicates
        const existingParticipant = prev.find(
          (p) =>
            p.userId === data.participant.userId ||
            p.socketId === data.participant.socketId
        );
        if (existingParticipant) {
          return prev;
        }
        return [...prev, data.participant];
      });
      // Since backend now excludes the joiner, all received events are for other users
      addChatMessage(`${data.participant.userName} joined the class`, "system");

      // If you're the instructor, create peer connection to new student
      if (isInstructor) {
        createPeer(data.participant.socketId, socket.id, localStream);
      }
    });

    // Handle user left
    socket.on("user-left", (data) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== data.userId));
      addChatMessage(`${data.userName} left the class`, "system");

      // Remove peer connection
      const peerObj = peersRef.current.find((p) => p.userId === data.userId);
      if (peerObj) {
        peerObj.peer.destroy();
        peersRef.current = peersRef.current.filter(
          (p) => p.userId !== data.userId
        );
        setPeers(peersRef.current);
      }
    });

    // WebRTC signaling
    socket.on("webrtc-offer", async ({ offer, fromSocketId }) => {
      const peer = addPeer(offer, fromSocketId, localStream);

      peersRef.current.push({
        peerID: fromSocketId,
        peer,
      });
      setPeers(peersRef.current);
    });

    socket.on("webrtc-answer", ({ answer, fromSocketId }) => {
      const item = peersRef.current.find((p) => p.peerID === fromSocketId);
      if (item) {
        item.peer.signal(answer);
      }
    });

    socket.on("webrtc-ice-candidate", ({ candidate, fromSocketId }) => {
      const item = peersRef.current.find((p) => p.peerID === fromSocketId);
      if (item) {
        item.peer.signal(candidate);
      }
    });

    // Handle chat messages
    socket.on("chat-message", (data) => {
      // Only add message if it's not from the current user (to prevent duplicates)
      if (data.userId !== user.id) {
        addChatMessage(data.message, "user", data.userName);
        if (!showChat) {
          setUnreadMessages((prev) => prev + 1);
        }
      }
    });

    // Handle slide changes
    socket.on("slide-changed", (data) => {
      setCurrentSlide(data);
      toast.info("Instructor changed the slide");
    });

    // Handle hand raised
    socket.on("hand-raised", (data) => {
      if (data.raised) {
        addChatMessage(`${data.userName} raised their hand`, "system");
        if (isInstructor) {
          toast.info(`${data.userName} raised their hand`, {
            icon: "✋",
          });
        }
      }
    });

    // Handle participant media changes
    socket.on("participant-media-changed", (data) => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.userId === data.userId) {
            return {
              ...p,
              [`${data.mediaType}Enabled`]: data.enabled,
            };
          }
          return p;
        })
      );
    });

    // Handle mute all command (students only)
    socket.on("mute-all-command", () => {
      if (!isInstructor) {
        setAudioEnabled(false);
        if (localStream) {
          const audioTrack = localStream.getAudioTracks()[0];
          if (audioTrack) audioTrack.enabled = false;
        }
        toast.warning("You have been muted by the instructor");
      }
    });

    // Handle force mute (specific student)
    socket.on("force-mute", () => {
      setAudioEnabled(false);
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = false;
      }
      toast.error("You have been muted by the instructor");
    });

    // Handle removal from class
    socket.on("removed-from-class", (data) => {
      toast.error(data.reason || "You have been removed from the class");
      setTimeout(() => {
        onLeave();
      }, 2000);
    });

    // Handle polls
    socket.on("new-poll", (data) => {
      setCurrentPoll(data.poll);
      setPollResponses([]);
      setPollMinimized(false); // Show poll when new one starts
      toast.info("New poll started!");
    });

    socket.on("poll-response", (data) => {
      if (isInstructor) {
        setPollResponses((prev) => [...prev, data]);
      }
    });

    socket.on("poll-ended", (data) => {
      setCurrentPoll(null);
      setPollMinimized(false);
      toast.success("Poll has ended");
    });

    // Handle recording
    socket.on("recording-started", (data) => {
      setIsRecording(true);
      // Since backend now excludes the initiator, all received events are from others
      toast.info("🔴 Recording started");
    });

    socket.on("recording-stopped", (data) => {
      setIsRecording(false);
      // Since backend now excludes the initiator, all received events are from others
      toast.success("Recording stopped and saved");
    });

    // Handle bandwidth updates from students (instructor only)
    socket.on("participant-bandwidth-update", (data) => {
      if (isInstructor) {
        setParticipants((prev) =>
          prev.map((p) => {
            if (p.userId === data.userId) {
              return { ...p, connectionQuality: data.connectionQuality };
            }
            return p;
          })
        );
      }
    });

    // Periodic cleanup of duplicate participants
    const cleanupInterval = setInterval(() => {
      setParticipants((prev) => removeDuplicateParticipants(prev));
    }, 5000); // Clean up every 5 seconds

    // Cleanup function
    return () => {
      clearInterval(cleanupInterval);
      if (socket) {
        socket.off("room-state");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("webrtc-offer");
        socket.off("webrtc-answer");
        socket.off("webrtc-ice-candidate");
        socket.off("chat-message");
        socket.off("slide-changed");
        socket.off("hand-raised");
        socket.off("participant-media-changed");
        socket.off("mute-all-command");
        socket.off("force-mute");
        socket.off("removed-from-class");
        socket.off("new-poll");
        socket.off("poll-response");
        socket.off("poll-ended");
        socket.off("recording-started");
        socket.off("recording-stopped");
        socket.off("participant-bandwidth-update");
      }
    };
  }, [socket, localStream, isInstructor, showChat]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false, // Start with audio only
      });

      setLocalStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Please allow microphone access to join the class");
    }
  };

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("webrtc-offer", {
        roomId: liveClass.roomId,
        targetSocketId: userToSignal,
        offer: signal,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("webrtc-answer", {
        targetSocketId: callerID,
        answer: signal,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);

        socket.emit("toggle-media", {
          roomId: liveClass.roomId,
          mediaType: "audio",
          enabled: audioTrack.enabled,
        });
      }
    }
  };

  const toggleVideo = async () => {
    // Check bandwidth before enabling video
    if (
      !videoEnabled &&
      (forceAudioOnly || bandwidthInfo?.shouldUseAudioOnly)
    ) {
      toast.warning(
        "Video disabled due to poor connection. Please improve your internet connection."
      );
      return;
    }

    if (!videoEnabled) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = videoStream.getVideoTracks()[0];

        if (localStream) {
          localStream.addTrack(videoTrack);
          setVideoEnabled(true);

          socket.emit("toggle-media", {
            roomId: liveClass.roomId,
            mediaType: "video",
            enabled: true,
          });
        }
      } catch (error) {
        console.error("Error enabling video:", error);
        toast.error("Failed to enable video");
      }
    } else {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        localStream.removeTrack(videoTrack);
        setVideoEnabled(false);

        socket.emit("toggle-media", {
          roomId: liveClass.roomId,
          mediaType: "video",
          enabled: false,
        });
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isInstructor) {
      toast.error("Only instructors can share their screen");
      return;
    }

    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: false,
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track with screen track
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            localStream.removeTrack(videoTrack);
          }
          localStream.addTrack(screenTrack);
        }

        setScreenSharing(true);
        socket.emit("start-screen-share", { roomId: liveClass.roomId });

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (error) {
        console.error("Error sharing screen:", error);
        toast.error("Failed to share screen");
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (localStream) {
      const screenTrack = localStream.getVideoTracks()[0];
      if (screenTrack) {
        screenTrack.stop();
        localStream.removeTrack(screenTrack);
      }
    }
    setScreenSharing(false);
    socket.emit("stop-screen-share", { roomId: liveClass.roomId });
  };

  const sendChatMessage = (message) => {
    if (socket && message.trim()) {
      // Add message locally for immediate feedback
      addChatMessage(message, "user", user.name);

      // Send message to other participants
      socket.emit("chat-message", {
        roomId: liveClass.roomId,
        message,
        userName: user.name,
        userId: user.id,
      });
    }
  };

  const toggleRaiseHand = () => {
    const newState = !handRaised;
    setHandRaised(newState);

    socket.emit("raise-hand", {
      roomId: liveClass.roomId,
      userName: user.name,
      userId: user.id,
      raised: newState,
    });

    if (newState) {
      toast.success("Hand raised!");
    }
  };

  const addChatMessage = (message, type, userName = "") => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        message,
        type,
        userName,
        timestamp: new Date(),
      },
    ]);
  };

  const handleBandwidthChange = (info) => {
    setBandwidthInfo(info);

    // Automatically disable video if bandwidth is too low
    if (info.shouldUseAudioOnly && videoEnabled) {
      toggleVideo();
      setForceAudioOnly(true);
      toast.warning("Video disabled automatically due to poor connection");
    } else if (!info.shouldUseAudioOnly && forceAudioOnly) {
      setForceAudioOnly(false);
      toast.success("Connection improved! You can now enable video.");
    }
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    try {
      if (!localStream) return;

      recordingChunks.current = [];
      mediaRecorder.current = new MediaRecorder(localStream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunks.current.push(event.data);

          // Send chunk to server
          socket.emit("recording-chunk", {
            roomId: liveClass.roomId,
            chunk: event.data,
          });
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordingChunks.current, { type: "video/webm" });
        // Handle the recording blob (upload to server, etc.)
        console.log("Recording stopped, blob size:", blob.size);
      };

      mediaRecorder.current.start(1000); // Collect data every second

      socket.emit("start-recording", {
        roomId: liveClass.roomId,
        initiatedBy: user.id,
      });
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }

    socket.emit("stop-recording", {
      roomId: liveClass.roomId,
      initiatedBy: user.id,
    });
    setIsRecording(false);
    toast.success("Recording stopped");
  };

  const handleStartPoll = (poll) => {
    setCurrentPoll(poll);
    setPollResponses([]);
    setPollMinimized(false);
  };

  const handleSubmitPollResponse = async (pollId, answer) => {
    socket.emit("submit-poll-response", {
      roomId: liveClass.roomId,
      pollId,
      response: answer,
      userId: user.id,
      userName: user.name,
    });

    // Also save to database
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/polls/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pollId: liveClass._id + "-" + pollId,
          answer,
        }),
      });
    } catch (error) {
      console.error("Error saving poll response:", error);
    }
  };

  const handleEndClass = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:5000/api/live-classes/${liveClass._id}/end`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Notify all participants
      socket.emit("end-class", { roomId: liveClass.roomId });

      toast.success("Class ended successfully");
      setTimeout(() => {
        onLeave();
      }, 2000);
    } catch (error) {
      console.error("Error ending class:", error);
      toast.error("Failed to end class");
    }
  };

  const leaveClass = () => {
    if (socket) {
      socket.emit("leave-class", {
        roomId: liveClass.roomId,
        userId: user.id,
      });
    }
    onLeave();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div>
          <h2 className="text-lg font-semibold">{liveClass.title}</h2>
          <p className="text-sm text-gray-400">{liveClass.instructorName}</p>
        </div>

        <div className="flex items-center space-x-4">
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}

          <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">LIVE</span>
          </div>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">{participants.length}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video/Slide Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black relative">
          {/* Local Video (Small Preview) */}
          <video
            ref={userVideo}
            autoPlay
            muted
            playsInline
            className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 object-cover z-10"
          />

          {/* Main Content */}
          {currentSlide ? (
            <div className="w-full h-full flex items-center justify-center p-8">
              <img
                src={currentSlide.url}
                alt="Current Slide"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="text-center text-white">
              <VideoIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">
                {isInstructor
                  ? "Share your screen or slides to start teaching"
                  : "Waiting for instructor to share content..."}
              </p>
            </div>
          )}
          {/* Bandwidth Monitor */}
          <div className="absolute top-4 left-4 z-10">
            <BandwidthMonitor
              onBandwidthChange={handleBandwidthChange}
              socket={socket}
              roomId={liveClass.roomId}
            />
          </div>

          {/* Participant Videos (if enabled) */}
          <div className="absolute top-4 right-4 space-y-2 z-10">
            {peers.map((peer, index) => (
              <PeerVideo key={index} peer={peer} />
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <ChatBox
            messages={chatMessages}
            onSendMessage={sendChatMessage}
            onClose={() => {
              setShowChat(false);
              setUnreadMessages(0);
            }}
          />
        )}

        {/* Participants Sidebar */}
        {showParticipants && (
          <ParticipantsList
            participants={participants}
            onClose={() => setShowParticipants(false)}
            isInstructor={isInstructor}
          />
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition ${
              audioEnabled
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-red-600 hover:bg-red-700"
            }`}
            title={audioEnabled ? "Mute" : "Unmute"}
          >
            {audioEnabled ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            disabled={forceAudioOnly}
            className={`p-3 rounded-full transition ${
              videoEnabled
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-700 hover:bg-gray-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              forceAudioOnly
                ? "Video disabled due to poor connection"
                : videoEnabled
                ? "Stop Video"
                : "Start Video"
            }
          >
            {videoEnabled ? (
              <VideoIcon className="w-5 h-5 text-white" />
            ) : (
              <VideoOff className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Screen Share (Instructor only) */}
          {isInstructor && (
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition ${
                screenSharing
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              title={screenSharing ? "Stop Sharing" : "Share Screen"}
            >
              {screenSharing ? (
                <MonitorOff className="w-5 h-5 text-white" />
              ) : (
                <Monitor className="w-5 h-5 text-white" />
              )}
            </button>
          )}

          {/* Student Controls */}
          {!isInstructor && (
            <StudentControls
              handRaised={handRaised}
              onToggleHand={toggleRaiseHand}
              onOpenChat={() => {
                setShowChat(true);
                setUnreadMessages(0);
              }}
              unreadMessages={unreadMessages}
            />
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Chat Toggle */}
          {!showChat && (
            <button
              onClick={() => {
                setShowChat(true);
                setUnreadMessages(0);
              }}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition relative"
              title="Open Chat"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {unreadMessages}
                </span>
              )}
            </button>
          )}

          {/* Poll Toggle (when minimized) */}
          {currentPoll && pollMinimized && (
            <button
              onClick={() => setPollMinimized(false)}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition relative animate-pulse"
              title="Open Active Poll"
            >
              <BarChart3 className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                !
              </span>
            </button>
          )}

          {/* Settings */}
          <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>

          {/* Leave Call */}
          <button
            onClick={leaveClass}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition"
          >
            <Phone className="w-5 h-5 rotate-135" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Instructor Controls (Additional Bottom Panel) */}
      {isInstructor && (
        <InstructorControls
          socket={socket}
          roomId={liveClass.roomId}
          onStartPoll={handleStartPoll}
          onEndClass={handleEndClass}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          participants={participants}
        />
      )}

      {/* Poll Panel */}
      {currentPoll && (
        <PollPanel
          poll={currentPoll}
          onSubmit={handleSubmitPollResponse}
          userRole={user.role}
          results={pollResponses}
          isMinimized={pollMinimized}
          onMinimize={() => setPollMinimized(true)}
          onMaximize={() => setPollMinimized(false)}
        />
      )}
    </div>
  );
};
// Video Component for displaying peer videos
const PeerVideo = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <video
      playsInline
      autoPlay
      ref={ref}
      className="w-32 h-24 bg-gray-800 rounded-lg border border-gray-600 object-cover"
    />
  );
};
export default LiveClassRoom;
