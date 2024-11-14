"use client";

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { IncomeReportingForm } from "./IncomeReportingForm";

export default function NewFormPage() {
  return (
    <ProtectedRoute>
      <IncomeReportingForm />
    </ProtectedRoute>
  );
}