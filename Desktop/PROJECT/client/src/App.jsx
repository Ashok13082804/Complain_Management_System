import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DummyLogin from './pages/DummyLogin';
import DummySignup from './pages/DummySignup';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dummy/login" element={<PublicRoute><DummyLogin /></PublicRoute>} />
          <Route path="/dummy/signup" element={<PublicRoute><DummySignup /></PublicRoute>} />

          {/* Landing Page might be public or private depending on user intent. 
                User said "first i want to signup and register then only it needs to show my web app".
                So I will protect the LandingPage too if it's the main app, or just the dashboard.
                The user mentioned "show my web app", usually implying the main functionality.
                Let's assume LandingPage is public for now (as it's a landing page), 
                but the complaint submission might require auth. 
                Actually, "show my web app" suggests the whole thing. 
                But a Landing Page usually is public. 
                However, for "complaint portal", maybe they want to force login first.
                Let's make root path redirect to login if not authenticated.
             */}

          <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />

          {/* Admin Routes - keeping separate or merging? 
                The new auth system seems to be for everyone. 
                I'll protect the dashboard.
            */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Legacy Admin Login - redirecting to new login or keeping? 
                I'll leave it reachable but new flow emphasizes /login
            */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
