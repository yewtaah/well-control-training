"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ProgressProvider,
  useProgressContext,
} from "@/components/ProgressProvider";
// Configures Amplify as a side effect of the import.
import "@/lib/amplifyClient";

function AuthHeader() {
  return (
    <div className="flex flex-col items-center gap-3 bg-brand-navy px-8 pb-8 pt-10">
      <Image
        src="/logo.png"
        alt="WellCommand Assurance"
        width={72}
        height={72}
        className="rounded-full"
        priority
      />
      <div className="text-center">
        <p className="font-serif text-lg font-semibold text-white">
          WellCommand Assurance
        </p>
        <p className="text-xs font-medium uppercase tracking-widest text-brand-gold">
          Training Portal
        </p>
      </div>
    </div>
  );
}

function SiteHeader() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const { isAdmin } = useProgressContext();

  return (
    <header className="border-b border-white/10 bg-brand-navy">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="WellCommand Assurance"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-serif text-lg font-semibold tracking-tight text-white">
            WellCommand Assurance Training
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-white/80">
          <Link href="/courses" className="hover:text-white">
            Curriculum
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="hover:text-white">
              Analytics
            </Link>
          ) : null}
          <span className="hidden text-white/50 sm:inline">
            {user?.signInDetails?.loginId}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-white/25 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}

export function AuthenticatedApp({ children }: { children: ReactNode }) {
  return (
    <Authenticator components={{ Header: AuthHeader }}>
      <ProgressProvider>
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </ProgressProvider>
    </Authenticator>
  );
}
