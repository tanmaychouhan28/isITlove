import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="discover" element={<Discover />} />
        <Route path="matches" element={<Matches />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
