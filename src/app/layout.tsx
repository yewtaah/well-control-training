import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { AuthenticatedApp } from "@/components/AuthenticatedApp";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Well Command WC Training",
  description:
    "Well control training for all critical safety roles, office and field, from WellCommand Assurance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-[var(--foreground)]">
        <AuthenticatedApp>{children}</AuthenticatedApp>
        <SiteFooter />
      </body>
    </html>
  );
}
