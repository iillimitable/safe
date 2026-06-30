import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import WelcomePage from './pages/WelcomePage';
import ReportForm from './pages/ReportForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Incidents from './pages/Incidents';
import PostIncident from './pages/PostIncident';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/Admin/AdminPanel';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import UserDetail from './pages/Admin/UserDetail';
import IncidentManagement from './pages/Admin/IncidentManagement';
import ReportManagement from './pages/Admin/ReportManagement';
import Feedback from './pages/Feedback';
import FeedbackManagement from './pages/Admin/FeedbackManagement';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = React.useContext(AuthContext);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-cream text-text-main selection:bg-primary/20 selection:text-primary-dark">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
              <Route path="/data" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
              <Route path="/post-incident" element={<ProtectedRoute><PostIncident /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/:id" element={<UserDetail />} />
                <Route path="incidents" element={<IncidentManagement />} />
                <Route path="reports" element={<ReportManagement />} />
                <Route path="feedback" element={<FeedbackManagement />} />
              </Route>

              <Route path="/" element={<Navigate to="/welcome" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

