import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LocomotiveScroll from 'locomotive-scroll';

import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationClarityPage from './pages/ApplicationClarityPage';
import ApplicationReportPage from './pages/ApplicationReportPage';
import JobsDiscoveryPage from './pages/JobsDiscoveryPage';
import SavedJobsPage from './pages/SavedJobsPage';
import MyResumePage from './pages/MyResumePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  // Smooth scroll initialization with Locomotive Scroll
  useEffect(() => {
    let scrollInstance = null;
    try {
      scrollInstance = new LocomotiveScroll({
        lenisOptions: {
          smoothWheel: true,
          duration: 1.2,
        },
      });
    } catch (e) {
      // Graceful fallback if window or context doesn't support
    }

    return () => {
      if (scrollInstance && typeof scrollInstance.destroy === 'function') {
        scrollInstance.destroy();
      }
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#141210',
              color: '#FFFFFF',
              fontSize: '12px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontFamily: "'PP Neue Montreal', 'General Sans', sans-serif",
            },
          }}
        />

        <Routes>
          {/* Public Landing Page */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Authentication Pages */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Application Routes (Accessible to any logged-in user) */}
          <Route element={<ProtectedRoute requireOnboarding={false} />}>
            <Route element={<MainLayout />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/application" element={<ApplicationClarityPage />} />
              <Route path="/application/:id" element={<ApplicationReportPage />} />
              <Route path="/jobs" element={<JobsDiscoveryPage />} />
              <Route path="/saved" element={<SavedJobsPage />} />
              <Route path="/resume" element={<MyResumePage />} />
              <Route path="/profile" element={<MyResumePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route element={<MainLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
