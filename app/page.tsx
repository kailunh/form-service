"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { CustomAuthenticator } from "@/components/CustomAuthenticator";
import { IncomeReportingForm } from "@/components/IncomeReportingForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslation } from '@/lib/translations';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

Amplify.configure(outputs);

export default function App() {
  const [authState, setAuthState] = useState("signIn");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { t, language } = useTranslation();

  console.log('Current language in App:', language);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await getCurrentUser();
      console.log('User data:', userData);
      setUser(userData);
      setAuthState("authenticated");
    } catch (err) {
      console.error('Error checking user:', err);
      setUser(null);
      setAuthState("signIn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthStateChange = (state, loading, userData = null) => {
    console.log('Auth state changed:', state);
    setAuthState(state);
    setIsLoading(loading);
    if (state === "authenticated") {
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthState("signIn");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <CustomAuthenticator onAuthStateChange={handleAuthStateChange}>
          {authState === "authenticated" && user ? (
            <main className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <div className="flex items-center space-x-4">
                  <span>{user.email}</span>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline"
                  >
                    {t('signOut')}
                  </Button>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
                <IncomeReportingForm />
              </div>
            </main>
          ) : (
            <CustomAuthenticator onAuthStateChange={handleAuthStateChange} />
          )}
        </CustomAuthenticator>
      </div>
      <Toaster />
    </div>
  );
}
