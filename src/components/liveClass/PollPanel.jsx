import React, { useState, useEffect } from "react";
import {
  BarChart3,
  CheckCircle,
  Clock,
  Minimize2,
  Maximize2,
  X,
} from "lucide-react";

const PollPanel = ({
  poll,
  onSubmit,
  userRole,
  results,
  isMinimized,
  onMinimize,
  onMaximize,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [openEndedAnswer, setOpenEndedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(poll?.duration || 60);

  useEffect(() => {
    if (!poll || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [poll, submitted]);

  const handleSubmit = () => {
    let answer;

    if (poll.type === "multiple-choice") {
      answer = selectedOption?.toString();
    } else if (poll.type === "open-ended") {
      answer = openEndedAnswer;
    } else if (poll.type === "true-false") {
      answer = selectedOption?.toString();
    }

    if (answer !== null && answer !== undefined && answer !== "") {
      onSubmit(poll.id, answer);
      setSubmitted(true);
    }
  };

  if (!poll) return null;

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border-2 border-blue-600 p-3 min-w-64">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Poll Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <button
                onClick={onMaximize}
                className="p-1 hover:bg-gray-100 rounded transition"
                title="Open Poll"
              >
                <Maximize2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 truncate">{poll.question}</p>
          {!submitted && (
            <div className="mt-2 flex space-x-2">
              <button
                onClick={onMaximize}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded transition"
              >
                {submitted ? "View Results" : "Respond"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Poll</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={onMinimize}
                className="p-1 hover:bg-gray-100 rounded transition"
                title="Minimize Poll"
              >
                <Minimize2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900">{poll.question}</p>
        </div>

        {/* Options */}
        {!submitted ? (
          <div className="space-y-3 mb-6">
            {poll.type === "multiple-choice" &&
              poll.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full text-left px-4 py-3 border-2 rounded-lg transition ${
                    selectedOption === index
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === index
                          ? "border-blue-600"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedOption === index && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}

            {poll.type === "true-false" && (
              <>
                <button
                  onClick={() => setSelectedOption(0)}
                  className={`w-full text-left px-4 py-3 border-2 rounded-lg transition ${
                    selectedOption === 0
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        selectedOption === 0
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="text-gray-900 font-medium">True</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedOption(1)}
                  className={`w-full text-left px-4 py-3 border-2 rounded-lg transition ${
                    selectedOption === 1
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        selectedOption === 1 ? "text-red-600" : "text-gray-400"
                      }`}
                    />
                    <span className="text-gray-900 font-medium">False</span>
                  </div>
                </button>
              </>
            )}

            {poll.type === "open-ended" && (
              <textarea
                value={openEndedAnswer}
                onChange={(e) => setOpenEndedAnswer(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                rows={4}
                placeholder="Type your answer here..."
              />
            )}
          </div>
        ) : (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                Response submitted successfully!
              </span>
            </div>
          </div>
        )}

        {/* Results (Instructor View) */}
        {userRole === "instructor" && results && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Results</h4>
            <div className="space-y-2">
              {poll.options?.map((option, index) => {
                const votes = results.filter(
                  (r) => r.answer === index.toString()
                ).length;
                const percentage =
                  results.length > 0 ? (votes / results.length) * 100 : 0;

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{option}</span>
                      <span className="font-medium text-gray-900">
                        {votes} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Total responses: {results.length}
            </p>
          </div>
        )}

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              (poll.type === "multiple-choice" && selectedOption === null) ||
              (poll.type === "true-false" && selectedOption === null) ||
              (poll.type === "open-ended" && !openEndedAnswer.trim()) ||
              timeLeft === 0
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit Response
          </button>
        )}

        {timeLeft === 0 && !submitted && (
          <p className="text-center text-red-600 font-medium mt-4">
            Time's up! Poll has ended.
          </p>
        )}
      </div>
    </div>
  );
};

export default PollPanel;
