import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'GlycoPulse AI - Diabetes & Blood Pressure Management',
  description: 'AI-Powered Clinical Health Management Platform for Diabetes and Hypertension Care.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Navigation />
          <main className="pb-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
