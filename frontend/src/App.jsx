import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MoodDetection from './pages/MoodDetection';
import Communication from './pages/Communication';
import ParentDashboard from './pages/ParentDashboard';
import Activities from './pages/Activities';
import Register from './pages/Register';
import Login from './pages/Login';
import BubblePop from './pages/games/BubblePop';
import SoundMatch from './pages/games/SoundMatch';
import ColorSorting from './pages/games/ColorSorting';
import FeelingJournal from './pages/games/FeelingJournal';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
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
        <Route path="/games/bubble-pop" element={<ProtectedRoute><BubblePop /></ProtectedRoute>} />
        <Route path="/games/sound-match" element={<ProtectedRoute><SoundMatch /></ProtectedRoute>} />
        <Route path="/games/color-sorting" element={<ProtectedRoute><ColorSorting /></ProtectedRoute>} />
        <Route path="/games/feeling-journal" element={<ProtectedRoute><FeelingJournal /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
