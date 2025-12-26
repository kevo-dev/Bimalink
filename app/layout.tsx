import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { ComparisonProvider } from "@/context/ComparisonContext";
import NavbarWrapper from './NavbarWrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BimaLink Kenya | Compare & Save on Insurance",
  description: "Affordable and transparent insurance comparison for Motor, Health, and Life insurance in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <ComparisonProvider>
          <NavbarWrapper />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ComparisonProvider>
      </body>
    </html>
  );
}