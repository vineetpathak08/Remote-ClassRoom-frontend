import React, { useState } from "react";
import { Play, Download, FileText, Clock, User, Wifi } from "lucide-react";
import { toast } from "react-toastify";
import { VIDEO_QUALITIES } from "../../utils/constants";
import useDownload from "../../hooks/useDownload";

const LectureCard = ({ lecture, onWatch, isOffline = false }) => {
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const { startDownload, downloading, progress } = useDownload();

  const handleDownload = async (quality) => {
    setShowQualityMenu(false);
    const success = await startDownload(lecture, quality);
    if (success) {
      toast.success("Lecture downloaded successfully!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={lecture.thumbnail || "https://via.placeholder.com/400x225"}
          alt={lecture.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2">
          {isOffline && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Download className="w-3 h-3 mr-1" />
              Offline
            </span>
          )}
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {lecture.duration} min
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Subject Badge */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {lecture.subject}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {lecture.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <User className="w-3 h-3 mr-1" />
          {lecture.instructor}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {lecture.duration} min
          </span>
          <span>
            {lecture.fileSize
              ? `${(lecture.fileSize / (1024 * 1024)).toFixed(0)} MB`
              : "N/A"}
          </span>
        </div>

        {/* Download Progress */}
        {downloading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onWatch(lecture)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
          >
            <Play className="w-4 h-4 mr-1" />
            Watch
          </button>

          {!isOffline && (
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                disabled={downloading}
                className="border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center disabled:bg-gray-200"
              >
                <Download className="w-4 h-4" />
              </button>

              {showQualityMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Select Quality:
                    </p>
                    {Object.values(VIDEO_QUALITIES).map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => handleDownload(quality.value)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        <div className="font-medium">{quality.label}</div>
                        <div className="text-xs text-gray-500">
                          {quality.size}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button className="border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50">
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureCard;
