"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { GlobalHeader } from "@/components/GlobalHeader";
import { useTranslation } from '@/lib/translations';
import { Loader2 } from 'lucide-react';

const DynamicIncomeReportingForm = dynamic(
  () => import('@/components/IncomeReportingForm').then((mod) => mod.IncomeReportingForm),
  {
    loading: () => <Loader2 className="animate-spin h-8 w-8" />,
    ssr: false
  }
);

export default function NewFormPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main className="container mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <DynamicIncomeReportingForm />
        )}
      </main>
    </div>
  );
}
