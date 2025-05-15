import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import WasteGuide from "./pages/WasteGuide";
import Scheduling from "./pages/Scheduling";
import Sidebar from "./components/Sidebar";
import SmartWaste from "./pages/SmartWaste";
import { AuthProvider, useAuth } from "./context/AuthContext";
import WasteLog from "./pages/wastelog";
import Profile from "./pages/Profile";
import TestProfile from "./pages/TestProfile";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";


// Layout component to wrap protected routes
const Layout = ({ children }) => {  
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

// Root redirect component
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

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

  return <Layout>{children}</Layout>;
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

  return <Layout>{children}</Layout>;
};

// Public Route component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user) {
    return <Navigate to={user.isAdmin ? "/admin" : "/dashboard"} />;
  }

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
            <Route path="/admin" element={<AdminRoute><ErrorBoundary><AdminDashboard /></ErrorBoundary></AdminRoute>} />
            <Route path="/scheduling" element={<AdminRoute><Scheduling /></AdminRoute>} />
            <Route path="/waste-guide" element={<ProtectedRoute><WasteGuide /></ProtectedRoute>} />
            <Route path="/submit-waste" element={<ProtectedRoute><WasteLog /></ProtectedRoute>} />
            <Route path="/smart-waste" element={<ProtectedRoute><SmartWaste /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/test-profile" element={<TestProfile />} />

            {/* Redirect to login if no match */}

          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
