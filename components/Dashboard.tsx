"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/lib/translations';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import { PlusCircle, Loader2 } from 'lucide-react'; // Import Loader2 icon

const client = generateClient<Schema>();

export function Dashboard(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const fetchForms = useCallback(async () => {
    setIsLoading(true); // Set loading to true when starting to fetch
    try {
      const { data } = await client.models.IncomeReport.list();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      // Optionally, you can set an error state here and display an error message
    } finally {
      setIsLoading(false); // Set loading to false when fetch completes (success or error)
    }
  }, []);

  React.useEffect(() => {
    void fetchForms();
  }, [fetchForms]);

  const handleCreateNewForm = useCallback(() => {
    router.push('/new-form');
  }, [router]);

  const handleViewForm = useCallback((id: string) => {
    router.push(`/form/${id}`);
  }, [router]);

  const memoizedForms = useMemo(() => forms.map((form) => (
    <div key={form.id} className="p-4 border border-theme rounded-lg hover:bg-accent cursor-pointer" onClick={() => handleViewForm(form.id)}>
      <h2 className="font-semibold">{form.companyName}</h2>
      <p className="text-sm text-muted-foreground">{new Date(form.createdAt).toLocaleDateString()}</p>
    </div>
  )), [forms, handleViewForm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
      </div>
      {forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Button onClick={handleCreateNewForm} size="lg" className="px-8">
            <PlusCircle className="mr-2 h-5 w-5" />
            {t('createNewForm')}
          </Button>
        </div>
      ) : (
        <>
          <Button onClick={handleCreateNewForm}>{t('createNewForm')}</Button>
          <div className="grid gap-4">
            {memoizedForms}
          </div>
        </>
      )}
    </div>
  );
}
