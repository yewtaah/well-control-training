import Link from "next/link";
import { ChokeDrill } from "@/components/ChokeDrill";

export const metadata = {
  title: "Simulator | Well Command WC Training",
};

const ROADMAP = [
  {
    title: "Choke drill",
    status: "Preview below",
    detail:
      "Hold casing pressure against a lagging well. Teaches the feel of small, patient corrections.",
  },
  {
    title: "Kick detection drill",
    status: "Next",
    detail:
      "Read pit volume, flow-out and pump pressure trends, and call the shut-in at the right moment.",
  },
  {
    title: "Driller's and Wait & Weight kill sheets",
    status: "Planned",
    detail:
      "Work a kill sheet against a generated well, with the pressure schedule checked step by step.",
  },
  {
    title: "Full circulating simulation",
    status: "Under evaluation",
    detail:
      "Either an in-house model or an integration with an established well control simulator — see docs/simulator.md.",
  },
];

export default function SimulatorPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link
        href="/courses"
        className="text-sm font-medium text-zinc-500 hover:text-brand-navy"
      >
        &larr; Curriculum
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-brand-gold bg-brand-gold/10 px-3 py-1 text-xs font-medium text-brand-navy">
          Coming soon
        </span>
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        Simulator practice
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
        Hands-on practice is part of the programme objective: theory tells you
        what a kick is, but the response has to be rehearsed. The drill below is
        a working preview of that idea, sized to one lesson from Course 9.
      </p>

      <div className="mt-10">
        <ChokeDrill />
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-semibold text-brand-navy">
          What comes next
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {ROADMAP.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-[var(--brand-border)] bg-white p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-lg font-semibold text-brand-navy">
                  {item.title}
                </h3>
                <span className="text-xs font-medium uppercase tracking-wide text-brand-gold-dark">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
