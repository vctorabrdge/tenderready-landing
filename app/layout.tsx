import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TenderReady (working title) — Cyber Essentials readiness for tender deadlines',
  description:
    'Cyber Essentials readiness tracker for UK construction & trades. Tasks + evidence vault + exportable MSP/assessor handoff pack.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
