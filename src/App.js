import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
