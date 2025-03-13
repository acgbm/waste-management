import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WasteGuide from "./pages/WasteGuide";
import AdminDashboard from "./pages/AdminDashboard";
import Scheduling from "./pages/Scheduling";
import "./App.css";

// Root redirect component
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.isAdmin ? "/admin" : "/dashboard"} replace />;
};

// Protected Route Component with Sidebar
const ProtectedRoute = ({ children, requireAdmin, allowBoth }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowBoth) {
    return (
      <>
        <Sidebar />
        <div className="content">
          {children}
        </div>
      </>
    );
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireAdmin && user.isAdmin && !allowBoth) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </>
  );
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user) {
    return <Navigate to={user.isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Separate component for content that needs auth context
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/waste-guide" element={
          <ProtectedRoute allowBoth={true}>
            <WasteGuide />
          </ProtectedRoute>
        } />
        <Route path="/scheduling" element={
          <ProtectedRoute requireAdmin={true}>
            <Scheduling />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
