import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import { LanguageProvider } from '@/lib/LanguageContext';
import { ThemeProvider } from '@/components/theme-provider';

Amplify.configure({ ...awsconfig, ssr: true });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Income Reporting Form',
  description: 'Report your personal and business income',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}