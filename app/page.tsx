"use client";

import { useState, useEffect, useCallback } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser, AuthUser } from 'aws-amplify/auth';
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { CustomAuthenticator } from "@/components/CustomAuthenticator";
import { useTranslation } from '@/lib/translations';
import { Toaster } from "@/components/ui/toaster";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Dashboard } from "@/components/Dashboard";
import { Storage } from 'aws-amplify/storage';

Amplify.configure(outputs);

export type AuthState = "signIn" | "signUp" | "confirmSignUp" | "forgotPassword" | "resetPassword" | "authenticated";

export default function App(): JSX.Element {
  const [authState, setAuthState] = useState<AuthState>("signIn");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { t } = useTranslation();

  const checkUser = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void checkUser();
  }, [checkUser]);

  const handleAuthStateChange = useCallback((
    state: AuthState,
    loading: boolean,
    userData: AuthUser | null = null
  ) => {
    setAuthState(state);
    setIsLoading(loading);
    if (state === "authenticated") {
      setUser(userData);
    } else {
      setUser(null);
    }
  }, []);

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
        ) : null}
      </CustomAuthenticator>
      <Toaster />
    </div>
  );
}
