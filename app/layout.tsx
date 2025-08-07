import './globals.css';
import React, { useEffect } from 'react';

export const metadata = {
  title: 'CookQuest',
  description: 'Log recipes, earn XP, unlock badges.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(console.error);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="manifest.webmanifest" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-2xl mx-auto p-4">
          <header className="py-3">
            <h1 className="text-2xl font-bold">🍳 CookQuest</h1>
            <p className="text-sm text-slate-600">PWA scaffold — offline-first recipe logger with XP & badges.</p>
          </header>
          <main>{children}</main>
          <footer className="py-8 text-xs text-slate-500">
            <p>Install this app from your browser menu to use offline and get an app-like experience.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
