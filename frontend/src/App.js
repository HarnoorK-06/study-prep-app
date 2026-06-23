// 1. Import React and hooks
import React from 'react';
import { useState, useEffect } from 'react';
// 2. Import React router components
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// 3. Import all page components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FolderPage from './pages/FolderPage';
// 4. Import CSS for global styling
import './App.css';

// 5. Main App component function
function App() {
  // 6. Create state for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 7. Check on page load if user already has a token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserToken(token);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  // 8. Handle login
  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setUserToken(token);
    setIsLoggedIn(true);
  };

  // 9. Handle signup (same as login - just different endpoint called)
  const handleSignup = (token) => {
    localStorage.setItem('token', token);
    setUserToken(token);
    setIsLoggedIn(true);
  };

  // 10. Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setIsLoggedIn(false);
  };

  // 11. Show loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // 12. Set up routing logic
  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
           <Route path="/dashboard" element={<DashboardPage userToken={userToken} onLogout={handleLogout} />} />
          <Route path="/folder/:folderId" element={<FolderPage userToken={userToken} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

// 13. Export app
export default App;
