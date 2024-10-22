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
<header className="bg-background shadow-sm">
<div className="container py-4 flex flex-col sm:flex-row justify-between items-center">
<Button onClick={handleBack} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t('back')}</span>
          </Button>
  <div className="flex space-x-4">
    <ThemeToggle />
    <LanguageSwitcher />
    <Button onClick={handleSignOut}>{t('signOut')}</Button>
  </div>
</div>
</header>
  );
}