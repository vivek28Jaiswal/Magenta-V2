import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ requireOnboarding = false }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0B0A]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF4124] rounded-full animate-spin" />
          <p className="text-xs font-medium text-stone-400 font-mono">Verifying Magenta Session...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Only redirect if specifically required for a dedicated flow
  if (requireOnboarding && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
