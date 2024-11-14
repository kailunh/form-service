"use client";

import React from 'react';
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
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tax Go
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button 
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="outline"
            size="sm"
          >
            {isSigningOut ? t('signingOut') : t('signOut')}
          </Button>
        </div>
      </div>
    </header>
  );
}