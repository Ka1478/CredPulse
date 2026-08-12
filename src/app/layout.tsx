import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CredPulse - Credit Card Transactions, Spend Analytics & Coin Rewards Dashboard',
  description: 'Manage credit card bill payments, track 10,000+ transactions with server-side pagination & cross-filtering, analyze spending habits, and redeem coin rewards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
