'use client';

import { LanguageProvider } from '@/lib/LanguageContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}