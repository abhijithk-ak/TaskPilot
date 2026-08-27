import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import PwaRegister from '@/components/PwaRegister';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TaskPilot — AI-Powered Productivity Workspace',
  description: 'The intelligent task manager with AI categorization, Pomodoro timer, quick notes, daily habit tracking, and smart productivity insights.',
  keywords: ['task manager', 'AI productivity', 'pomodoro', 'habit tracker', 'notes'],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'TaskPilot' },
  openGraph: {
    title: 'TaskPilot — AI-Powered Productivity',
    description: 'Plan smarter. Do more. TaskPilot brings AI into your daily workflow.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#6457E8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <PwaRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
