import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plant Disease Detection CNN — AI Crop Health Diagnostic",
  description: "Identify crop leaf diseases with PyTorch CNN deep learning. Instant classification and actionable treatment plans across 39 plant categories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ambient text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
