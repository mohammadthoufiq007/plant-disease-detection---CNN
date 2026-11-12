import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plant Disease Detection CNN | Next.js & AI Vision",
  description: "Identify crop leaf diseases instantly with Convolutional Neural Networks and Deep Learning",
};

export default function RootLayout({
  children,
}: ReadtemplateProps<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-mesh text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
type ReadtemplateProps<T> = T;
