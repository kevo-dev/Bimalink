
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComparisonProvider } from "@/context/ComparisonContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BimaLink Kenya | Compare & Save on Insurance",
  description: "Affordable and transparent insurance comparison for Motor, Health, and Life insurance in Kenya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

// Wrapper to inject context data into Navbar
import NavbarWrapper from './NavbarWrapper';
