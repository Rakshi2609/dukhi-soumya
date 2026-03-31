import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MoodDetection from './pages/MoodDetection';
import Communication from './pages/Communication';
import ParentDashboard from './pages/ParentDashboard';
import Activities from './pages/Activities';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mood" element={<ProtectedRoute><MoodDetection /></ProtectedRoute>} />
        <Route path="/communicate" element={<ProtectedRoute><Communication /></ProtectedRoute>} />
        <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
