"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProgressContext } from "@/components/ProgressProvider";
import {
  certificateRef,
  formatCertificateDate,
} from "@/lib/certificate";

export type CertificateProps = {
  /** `programme`, or a course slug — also the reference's scope. */
  scope: string;
  /** Awarded for … */
  title: string;
  /** The line under the title, e.g. "Course 3 of 12 · 8 lessons". */
  subtitle: string;
  /** What the learner is certified to have done. */
  statement: string;
  earned: boolean;
  completedAt: string | null;
  /** Shown when the certificate has not been earned yet. */
  outstanding: string[];
  backHref: string;
  backLabel: string;
};

export function Certificate({
  scope,
  title,
  subtitle,
  statement,
  earned,
  completedAt,
  outstanding,
  backHref,
  backLabel,
}: CertificateProps) {
  const { loaded, traineeId, traineeEmail, traineeName, setTraineeName } =
    useProgressContext();
  const [draftName, setDraftName] = useState<string | null>(null);

  if (!loaded) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <p className="text-sm text-zinc-500">Loading your record…</p>
      </main>
    );
  }

  const fallbackName = traineeEmail.split("@")[0] ?? "Trainee";
  const printedName = (draftName ?? traineeName ?? "").trim() || fallbackName;
  const reference = traineeId ? certificateRef(traineeId, scope) : "—";

  if (!earned) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link
          href={backHref}
          className="text-sm font-medium text-zinc-500 hover:text-brand-navy"
        >
          &larr; {backLabel}
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-navy">
          Certificate not yet earned
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          {title} issues a completion record once every requirement below is
          met.
        </p>
        <ul className="mt-6 flex flex-col gap-2 rounded-lg border border-[var(--brand-border)] bg-zinc-50 p-6">
          {outstanding.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-6 text-zinc-700"
            >
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold"
              />
              {item}
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <div className="print-hide">
        <Link
          href={backHref}
          className="text-sm font-medium text-zinc-500 hover:text-brand-navy"
        >
          &larr; {backLabel}
        </Link>

        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-[var(--brand-border)] bg-zinc-50 p-5 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex-1">
            <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Name on certificate
            </span>
            <input
              type="text"
              value={draftName ?? traineeName}
              placeholder={fallbackName}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={() => {
                if (draftName !== null) setTraineeName(draftName);
              }}
              className="mt-1.5 w-full rounded-md border border-[var(--brand-border)] bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-gold"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (draftName !== null) setTraineeName(draftName);
              window.print();
            }}
            className="shrink-0 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
          >
            Print or save as PDF
          </button>
        </div>
      </div>

      <article className="certificate-sheet mt-8 border-8 border-brand-navy bg-white p-2">
        <div className="flex flex-col items-center border border-brand-gold px-8 py-12 text-center sm:px-14">
          <Image
            src="/logo.png"
            alt="Well Command  Assurance"
            width={64}
            height={64}
            className="rounded-full"
          />
          <p className="mt-4 font-serif text-lg font-semibold text-brand-navy">
            Well Command  Assurance
          </p>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-brand-gold-ink">
            Well Control Training
          </p>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
            Certificate of Completion
          </p>
          <p className="mt-6 text-sm text-zinc-500">This certifies that</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-brand-navy sm:text-4xl">
            {printedName}
          </p>

          <div
            aria-hidden
            className="mt-6 h-px w-24 bg-brand-gold"
          />

          <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-600">
            {statement}
          </p>
          <p className="mt-4 font-serif text-xl font-semibold text-brand-navy">
            {title}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
            {subtitle}
          </p>

          <dl className="mt-12 grid w-full max-w-lg grid-cols-2 gap-6 border-t border-[var(--brand-border)] pt-6 text-left">
            <div>
              <dt className="text-[0.65rem] font-medium uppercase tracking-wide text-zinc-500">
                Date of completion
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">
                {formatCertificateDate(completedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-medium uppercase tracking-wide text-zinc-500">
                Certificate reference
              </dt>
              <dd className="mt-1 font-mono text-sm tabular-nums text-brand-navy">
                {reference}
              </dd>
            </div>
          </dl>
        </div>
      </article>

      <p className="print-hide mt-4 text-xs text-zinc-500">
        Issued against {traineeEmail || "your account"}. The reference above is
        tied to your account and this course, and can be quoted back to
        Well Command  Assurance to verify the record.
      </p>
    </main>
  );
}
