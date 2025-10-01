import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { NetworkProvider } from "./context/NetworkContext";
import { AppProvider } from "./context/AppContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import Header from "./components/common/Header";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import Lectures from "./pages/Lectures";
import LiveClasses from "./pages/LiveClasses";
import InstructorLiveClasses from "./pages/InstructorLiveClasses";
import Downloads from "./pages/Downloads";
import Faculty from "./pages/Faculty";

// Component to route live classes based on user role
const LiveClassesRouter = () => {
  const { user } = useAuth();

  return user?.role === "instructor" ? (
    <InstructorLiveClasses />
  ) : (
    <LiveClasses />
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NetworkProvider>
            <AppProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Navbar />
                        <main className="max-w-7xl mx-auto px-4 py-6">
                          <Routes>
                            <Route
                              path="/"
                              element={<Navigate to="/dashboard" replace />}
                            />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/lectures" element={<Lectures />} />
                            <Route
                              path="/live-classes"
                              element={
                                <ProtectedRoute>
                                  <LiveClassesRouter />
                                </ProtectedRoute>
                              }
                            />
                            <Route path="/downloads" element={<Downloads />} />
                            <Route
                              path="/faculty"
                              element={
                                <ProtectedRoute requireInstructor>
                                  <Faculty />
                                </ProtectedRoute>
                              }
                            />
                          </Routes>
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>

              {/* Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </AppProvider>
          </NetworkProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
