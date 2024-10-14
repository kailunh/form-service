"use client";

import { CustomAuthenticator } from "@/components/CustomAuthenticator";
import { IncomeReportingForm } from "@/components/IncomeReportingForm";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <CustomAuthenticator>
      {({ signOut, user }) => {
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
              Welcome, {user.attributes.email}
            </h1>
            <Button onClick={signOut}>Sign out</Button>
            <IncomeReportingForm />
          </div>
        );
      }}
    </CustomAuthenticator>
  );
}
