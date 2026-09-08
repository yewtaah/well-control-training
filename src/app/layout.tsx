import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthenticatedApp } from "@/components/AuthenticatedApp";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Well Control Training",
  description:
    "Courses and knowledge sharing for well control and oil & gas field readiness.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans dark:bg-black">
        <AuthenticatedApp>{children}</AuthenticatedApp>
        <footer className="border-t border-black/[.08] px-6 py-8 text-sm text-zinc-500 dark:border-white/[.145] dark:text-zinc-500">
          <div className="mx-auto w-full max-w-5xl">
            &copy; {new Date().getFullYear()} Well Control Training
          </div>
        </footer>
      </body>
    </html>
  );
}
