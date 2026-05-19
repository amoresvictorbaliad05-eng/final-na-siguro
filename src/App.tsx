import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIncident from './pages/ReportIncident';
import ReportDetail from './pages/ReportDetail';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Profile from './pages/Profile';
import AuthSuccess from './pages/AuthSuccess';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ReportProvider>
          <div className="min-h-screen bg-slate-50 font-sans antialiased">
            <Navbar />
            <Routes>

              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🔥 STEP 7 ADDED HERE */}
              <Route path="/auth-success" element={<AuthSuccess />} />

              {/* PROTECTED ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <ReportIncident />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute adminOnly>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports/:id"
                element={
                  <ProtectedRoute>
                    <ReportDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute adminOnly>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute adminOnly>
                    <Users />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </div>
        </ReportProvider>
      </AuthProvider>
    </Router>
  );
}