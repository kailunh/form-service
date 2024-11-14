"use client";

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FormDetails } from "./FormDetails";

export default function FormDetailsPage() {
  return (
    <ProtectedRoute>
      <FormDetails />
    </ProtectedRoute>
  );
}