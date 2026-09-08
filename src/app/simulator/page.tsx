import Link from "next/link";
import { ChokeDrill } from "@/components/ChokeDrill";

export const metadata = {
  title: "Simulator | Well Command WC Training",
};

export default function SimulatorPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        Simulator
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
        Hands-on exercises that build the judgement a kill sheet cannot teach.
        The choke drill below is the first; more scenarios follow as the
        programme develops.
      </p>

      <div className="mt-10">
        <ChokeDrill />
      </div>

      <section className="mt-10 rounded-lg border border-dashed border-[var(--brand-border)] bg-zinc-50 p-6">
        <h2 className="font-serif text-lg font-semibold text-brand-navy">
          Planned exercises
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-zinc-600">
          <li>Kick detection — spot the influx from live pit and flow trends</li>
          <li>Shut-in sequence — hard and soft, against the clock</li>
          <li>Kill sheet — work a full Wait &amp; Weight pump schedule</li>
          <li>Volumetric control — bleed mud against a migrating gas bubble</li>
        </ul>
        <p className="mt-4 text-sm text-zinc-600">
          See{" "}
          <Link
            href="/courses/choke-operations"
            className="underline underline-offset-2 hover:text-brand-navy"
          >
            Choke Operations &amp; Pressure Control
          </Link>{" "}
          for the theory behind this drill.
        </p>
      </section>
    </main>
  );
}
