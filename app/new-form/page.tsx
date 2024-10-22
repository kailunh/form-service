"use client";

import { GlobalHeader } from "@/components/GlobalHeader";
import { IncomeReportingForm } from "@/components/IncomeReportingForm";

export default function NewFormPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create New Form</h1>
        <IncomeReportingForm />
      </main>
    </div>
  );
}