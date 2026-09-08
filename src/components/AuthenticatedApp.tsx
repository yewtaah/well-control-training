"use client";

import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import type { ReactNode } from "react";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

function SiteHeader() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <header className="border-b border-white/10 bg-brand-navy">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-white"
        >
          WellCommand Assurance Training
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-white/80">
          <Link href="/courses" className="hover:text-white">
            Courses
          </Link>
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
    <Authenticator>
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </Authenticator>
  );
}
