import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Letterboxd Watchlist Manager',
  description: 'Manage and explore your Letterboxd watchlist with advanced filtering and streaming availability',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
