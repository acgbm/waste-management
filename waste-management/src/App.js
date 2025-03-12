import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ AuthProvider for authentication
import Sidebar from "./components/Sidebar"; // ✅ Import Sidebar
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WasteGuide from "./pages/WasteGuide"; // ✅ Import Waste Sorting Guide page

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap Everything Inside */}
      <Router>
        <div className="app-container">
          <Sidebar /> {/* ✅ Sidebar is always visible */}
          <div className="content">
            <Routes>
              <Route path="/" element={<Login />} />  {/* ✅ Default route to Login */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/waste-guide" element={<WasteGuide />} /> {/* ✅ New Route */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
