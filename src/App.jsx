import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
import AuthSuccess from "./pages/AuthSuccess";
import Chatbot from "./components/chatbot/Chatbot";
import { getData } from "./context/userContext";
import axios from "axios";

const AppLayout = ({ children }) => {
  const { user, setUser } = getData();

  // Restore user session on app load
  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && !user) {
        try {
          const res = await axios.get("http://localhost:8000/auth/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error("Failed to restore session:", error);
          // If token is invalid, remove it
          localStorage.removeItem("accessToken");
        }
      }
    };

    restoreSession();
  }, [setUser, user]);

  return (
    <>
      {children}
      {/* Show chatbot only for authenticated users */}
      {user && <Chatbot />}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <>
          <Navbar />
          <Home />
        </>
      </AppLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AppLayout>
        <Signup />
      </AppLayout>
    ),
  },
  {
    path: "/verify",
    element: (
      <AppLayout>
        <VerifyEmail />
      </AppLayout>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <AppLayout>
        <Verify />
      </AppLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AppLayout>
        <Login />
      </AppLayout>
    ),
  },
  {
    path: "/auth-success",
    element: (
      <AppLayout>
        <AuthSuccess />
      </AppLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AppLayout>
        <ForgotPassword />
      </AppLayout>
    ),
  },
  {
    path: "/verify-otp/:email",
    element: (
      <AppLayout>
        <VerifyOTP />
      </AppLayout>
    ),
  },
  {
    path: "/change-password/:email",
    element: (
      <AppLayout>
        <ChangePassword />
      </AppLayout>
    ),
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
