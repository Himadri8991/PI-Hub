import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PI Hub — Every Tool You Need to Edit Images & PDFs in Bulk",
  description:
    "Free, high-performance, privacy-first online media and document studio. Compress, resize, crop, convert, watermark, and manipulate images and PDFs in bulk without uploads leaving your browser.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
