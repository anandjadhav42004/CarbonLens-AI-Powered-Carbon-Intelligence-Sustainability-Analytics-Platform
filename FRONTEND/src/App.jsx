import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicPageShell from './components/PublicPageShell';

// Pages
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CuratorAPI from './pages/CuratorAPI';
import TelemetrySpecs from './pages/TelemetrySpecs';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Insights from './pages/Insights';
import Community from './pages/Community';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/features"
            element={
              <PublicPageShell active="Features">
                <Features />
              </PublicPageShell>
            }
          />
          <Route
            path="/insights"
            element={
              <PublicPageShell active="Insights">
                <Insights />
              </PublicPageShell>
            }
          />
          <Route
            path="/community"
            element={
              <PublicPageShell active="Community">
                <Community />
              </PublicPageShell>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/curator-api" element={<CuratorAPI />} />
          <Route path="/telemetry-specs" element={<TelemetrySpecs />} />

          {/* Protected Ledger Routes wrapped in Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculator"
            element={
              <ProtectedRoute>
                <Layout>
                  <Calculator />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/insights"
            element={
              <ProtectedRoute>
                <Layout>
                  <Insights />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/community"
            element={
              <ProtectedRoute>
                <Layout>
                  <Community />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Leaderboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Dynamic Global Toast system matching our luxury jade aesthetic */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#274a31',
              border: '1px solid #cce6ce',
              fontFamily: 'monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
