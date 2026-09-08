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
    <header className="border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50"
        >
          Well Control Training
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/courses" className="hover:text-black dark:hover:text-zinc-50">
            Courses
          </Link>
          <span className="hidden text-zinc-400 sm:inline">
            {user?.signInDetails?.loginId}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-black/[.08] px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.08]"
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
