import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';

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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}