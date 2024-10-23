"use client";

import React, { useState } from 'react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/lib/translations';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function GlobalHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Clear any client-side auth state
      localStorage.removeItem("user");
      sessionStorage.clear();
      // Use window.location for a full page reload
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out: ", error);
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-background shadow-sm">
      <div className="container py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tax Go
            </h1>
          </Link>
        </div>
        <div className="flex space-x-2 sm:space-x-4 items-center">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button 
            onClick={handleSignOut} 
            size="sm" 
            className="text-xs sm:text-sm"
            disabled={isSigningOut}
          >
            {isSigningOut ? t('signingOut') : t('signOut')}
          </Button>
        </div>
      </div>
    </header>
  );
}
