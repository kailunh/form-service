"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GlobalHeader } from "@/components/GlobalHeader";
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import { useTranslation } from '@/lib/translations';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const client = generateClient<Schema>();

export default function FormDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      const { data } = await client.models.IncomeReport.get({ id: id as string });
      setForm(data);
    } catch (error) {
      console.error("Error fetching form:", error);
      setError("Failed to fetch form details.");
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const renderShareholders = () => {
    if (!form || !form.shareholders) return null;

    try {
      const shareholders = JSON.parse(form.shareholders);
      return shareholders.map((shareholder, index) => (
        <div key={index} className="border p-4 rounded-lg mb-4">
          <p><strong>{t('name')}:</strong> {shareholder.name}</p>
          <p><strong>{t('title')}:</strong> {shareholder.title}</p>
          <p><strong>{t('sharePercentage')}:</strong> {shareholder.sharePercentage}</p>
          <p><strong>{t('nationality')}:</strong> {shareholder.nationality}</p>
        </div>
      ));
    } catch (error) {
      console.error("Error parsing shareholders:", error);
      return <p className="text-red-500">{t('errorParsingShareholders')}</p>;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <main className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">{t('formDetails')}</h1>
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <main className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">{t('formDetails')}</h1>
          <p>{t('loading')}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main className="container mx-auto p-4">
        <Button
          onClick={handleBack}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>
        <h1 className="text-2xl font-bold mb-6">{t('formDetails')}</h1>
        <div className="space-y-4">
          <p><strong>{t('companyName')}:</strong> {form.companyName}</p>
          <p><strong>{t('companyAddress')}:</strong> {form.companyAddress}</p>
          <p><strong>{t('cityStateCountryZip')}:</strong> {form.cityStateCountryZip}</p>
          <p><strong>{t('ein')}:</strong> {form.ein}</p>
          <p><strong>{t('dateIncorporated')}:</strong> {form.dateIncorporated}</p>
          <p><strong>{t('isInitialReturn')}:</strong> {form.isInitialReturn ? t('yes') : t('no')}</p>
          <p><strong>{t('isFinalReturn')}:</strong> {form.isFinalReturn ? t('yes') : t('no')}</p>
          <p><strong>{t('hasNameChanged')}:</strong> {form.hasNameChanged ? t('yes') : t('no')}</p>
          <p><strong>{t('hasAddressChanged')}:</strong> {form.hasAddressChanged ? t('yes') : t('no')}</p>
          <p><strong>{t('accountingMethod')}:</strong> {form.accountingMethod}</p>
          <p><strong>{t('naicsCode')}:</strong> {form.naicsCode}</p>
          <p><strong>{t('address')}:</strong> {form.address}</p>
          <p><strong>{t('city')}:</strong> {form.city}</p>
          <p><strong>{t('state')}:</strong> {form.state}</p>
          <p><strong>{t('zipCode')}:</strong> {form.zipCode}</p>
          <p><strong>{t('country')}:</strong> {form.country}</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">{t('shareholders')}</h2>
          {renderShareholders()}
        </div>
      </main>
    </div>
  );
}