"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from 'aws-amplify/auth';
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { CustomAuthenticator } from "@/components/CustomAuthenticator";
import { useTranslation } from '@/lib/translations';
import { Toaster } from "@/components/ui/toaster";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Dashboard } from "@/components/Dashboard";

Amplify.configure(outputs);

export default function App() {
  const [authState, setAuthState] = useState("signIn");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setAuthState("authenticated");
    } catch (err) {
      setUser(null);
      setAuthState("signIn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthStateChange = (state, loading, userData = null) => {
    setAuthState(state);
    setIsLoading(loading);
    if (state === "authenticated") {
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomAuthenticator onAuthStateChange={handleAuthStateChange}>
        {authState === "authenticated" && user ? (
          <>
            <GlobalHeader />
            <main className="container mx-auto p-4">
              <Dashboard />
            </main>
          </>
        ) : (
          <CustomAuthenticator onAuthStateChange={handleAuthStateChange} />
        )}
      </CustomAuthenticator>
      <Toaster />
    </div>
  );
}