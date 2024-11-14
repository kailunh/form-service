"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { CustomAuthenticator } from "@/components/CustomAuthenticator";
import { useTranslation } from '@/lib/translations';
import { Toaster } from "@/components/ui/toaster";

export type AuthState = "signIn" | "signUp" | "confirmSignUp" | "forgotPassword" | "resetPassword" | "authenticated";

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
        router.push('/dashboard');
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    void checkAuth();
  }, [router]);

  const handleAuthStateChange = (state: AuthState) => {
    if (state === "authenticated") {
      router.push('/dashboard');
    }
  };

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomAuthenticator onAuthStateChange={handleAuthStateChange} />
      <Toaster />
    </div>
  );
}