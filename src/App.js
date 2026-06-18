import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TCSTracker from "./pages/TCSTracker";
import GeneralTracker from "./pages/GeneralTracker";
import ExcelPlanner from "./pages/ExcelPlanner";
import "./App.css";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/study-tracker">
        <Toaster position="top-right" toastOptions={{
          style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155" }
        }} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tcs" element={<PrivateRoute><TCSTracker /></PrivateRoute>} />
          <Route path="/general" element={<PrivateRoute><GeneralTracker /></PrivateRoute>} />
          <Route path="/excel-planner" element={<PrivateRoute><ExcelPlanner /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
