"use client";

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/lib/translations';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export function Dashboard(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const [forms, setForms] = React.useState([]);

  const fetchForms = useCallback(async () => {
    try {
      const { data } = await client.models.IncomeReport.list();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
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
    <div key={form.id} className="p-4 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => handleViewForm(form.id)}>
      <h2 className="font-semibold">{form.companyName}</h2>
      <p className="text-sm text-muted-foreground">{new Date(form.createdAt).toLocaleDateString()}</p>
    </div>
  )), [forms, handleViewForm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        <Button onClick={handleCreateNewForm}>{t('createNewForm')}</Button>
      </div>
      <div className="grid gap-4">
        {memoizedForms}
      </div>
    </div>
  );
}
