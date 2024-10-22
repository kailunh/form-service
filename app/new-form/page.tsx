"use client";

import { GlobalHeader } from "@/components/GlobalHeader";
import { useParams, useRouter } from 'next/navigation';
import { IncomeReportingForm } from "@/components/IncomeReportingForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/lib/translations';
import { ArrowLeft } from "lucide-react";

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