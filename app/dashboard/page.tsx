"use client";

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dashboard } from "./Dashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}