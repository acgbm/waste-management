import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import WasteGuide from "./pages/WasteGuide";
import Scheduling from "./pages/Scheduling";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

// Root redirect component
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If authenticated, redirect based on role
  if (user.isAdmin) {
    return <Navigate to="/admin" />;
  }
  return <Navigate to="/dashboard" />;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Public Route component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is authenticated, redirect them to their appropriate dashboard
  if (user) {
    return <Navigate to={user.isAdmin ? "/admin" : "/dashboard"} />;
  }

  // If not authenticated, show the public route (login/signup)
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><RootRedirect /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/scheduling" element={<AdminRoute><Scheduling /></AdminRoute>} />
            <Route path="/waste-guide" element={<ProtectedRoute><WasteGuide /></ProtectedRoute>} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
