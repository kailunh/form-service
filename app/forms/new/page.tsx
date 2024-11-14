"use client";

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { IncomeReportingForm } from "@/components/IncomeReportingForm";

export default function NewFormPage() {
  return (
    <ProtectedRoute>
      <IncomeReportingForm />
    </ProtectedRoute>
  );
}