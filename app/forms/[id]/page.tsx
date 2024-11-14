"use client";

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FormDetails } from "@/components/FormDetails";

export default function FormDetailsPage() {
  return (
    <ProtectedRoute>
      <FormDetails />
    </ProtectedRoute>
  );
}