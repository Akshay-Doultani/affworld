import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext";
import RequestPasswordReset from "./components/RequestPasswordReset.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import ResetPasswordWithOTP from "./components/ResetPasswordWithOTP.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import PostForm from "./components/PostForm";
import Feed from "./pages/Feed.jsx";

const App = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/request-reset-password" element={<RequestPasswordReset />} />
            <Route path="/reset-password-otp/:email" element={<ResetPasswordWithOTP />} />
            <Route path="/reset-password/:email" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:postId"
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              }
            />

            {/* Default route */}
            <Route path="/" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
            />
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
