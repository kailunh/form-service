"use client";

import { CustomAuthenticator } from "@/components/CustomAuthenticator";
import { IncomeReportingForm } from "@/components/IncomeReportingForm";
import { GlobalHeader } from "@/components/GlobalHeader";
import { useTranslation } from '@/lib/translations';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomAuthenticator>
        {({ signOut, user }) => (
          <>
            <GlobalHeader signOut={signOut} />
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* <h1 className="text-3xl font-bold mb-8">
                {t('welcome')}, {user.attributes.email}
              </h1> */}
              <IncomeReportingForm />
            </div>
          </>
        )}
      </CustomAuthenticator>
    </div>
  );
}