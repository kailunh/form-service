"use client";

import React from 'react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/lib/translations';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from "lucide-react";

export function GlobalHeader() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button onClick={handleBack} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t('back')}</span>
          </Button>
          <h1 className="text-xl font-bold">Income Reporting System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button onClick={handleSignOut}>{t('signOut')}</Button>
        </div>
      </div>
    </header>
  );
}