"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A choke drill, not an engineering simulator.
 *
 * It models the two things that make choke work hard to learn from a kill
 * sheet: an adjustment does not reach the drill pipe gauge immediately, and gas
 * migrating up the annulus raises casing pressure on its own. Everything else —
 * well geometry, compressibility, temperature — is deliberately out of scope.
 * See docs/simulator.md.
 */

const TARGET_DPP = 800; // psi — the initial circulating pressure to hold
const TOLERANCE = 25; // psi — inside this band counts as "on target"
const TICK_MS = 200;
const DRILL_SECONDS = 60;

/** Backpressure the choke adds, rising steeply as it closes. */
function backpressure(chokeOpenPercent: number): number {
  const closed = (100 - chokeOpenPercent) / 100;
  return 1400 * closed * closed;
}

type Phase = "idle" | "running" | "finished";

export function ChokeDrill() {
  const [choke, setChoke] = useState(50);
  const [phase, setPhase] = useState<Phase>("idle");
  const [drillPipe, setDrillPipe] = useState(TARGET_DPP);
  const [casing, setCasing] = useState(backpressure(50));
  const [secondsLeft, setSecondsLeft] = useState(DRILL_SECONDS);
  const [onTargetTicks, setOnTargetTicks] = useState(0);
  const [totalTicks, setTotalTicks] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  // Read the live choke position inside the interval without restarting it.
  const chokeRef = useRef(choke);
  const migrationRef = useRef(0);

  useEffect(() => {
    chokeRef.current = choke;
  }, [choke]);

  const reset = useCallback(() => {
    setChoke(50);
    setDrillPipe(TARGET_DPP);
    setCasing(backpressure(50));
    setSecondsLeft(DRILL_SECONDS);
    setOnTargetTicks(0);
    setTotalTicks(0);
    setHistory([]);
    migrationRef.current = 0;
    setPhase("idle");
  }, []);

  useEffect(() => {
    if (phase !== "running") return;

    const interval = window.setInterval(() => {
      // Gas migrating up the annulus adds pressure whatever the operator does.
      migrationRef.current += 3.5;

      const demanded = backpressure(chokeRef.current) + migrationRef.current;

      setCasing((current) => current + (demanded - current) * 0.35);
      setDrillPipe((current) => {
        // First-order lag: the gauge chases the new equilibrium, it does not
        // jump to it. This is what makes over-correction feel realistic.
        const equilibrium =
          TARGET_DPP + (demanded - backpressure(50) - migrationRef.current) * 0.9;
        const next = current + (equilibrium - current) * 0.18;
        setHistory((previous) => [...previous.slice(-119), next]);
        setTotalTicks((ticks) => ticks + 1);
        if (Math.abs(next - TARGET_DPP) <= TOLERANCE) {
          setOnTargetTicks((ticks) => ticks + 1);
        }
        return next;
      });

      setSecondsLeft((remaining) => {
        const next = remaining - TICK_MS / 1000;
        if (next <= 0) {
          setPhase("finished");
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [phase]);

  const onTarget = Math.abs(drillPipe - TARGET_DPP) <= TOLERANCE;
  const score =
    totalTicks === 0 ? 0 : Math.round((onTargetTicks / totalTicks) * 100);

  return (
    <div className="rounded-lg border border-[var(--brand-border)] bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold text-brand-navy">
          Choke drill
        </h2>
        <p className="text-sm text-zinc-500">
          Hold drill pipe pressure at {TARGET_DPP} psi (&plusmn;{TOLERANCE})
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Drill pipe
          </p>
          <p
            className={`mt-1 font-serif text-2xl font-semibold tabular-nums ${
              onTarget ? "text-emerald-700" : "text-brand-navy"
            }`}
          >
            {Math.round(drillPipe)}
            <span className="ml-1 text-sm font-normal text-zinc-500">psi</span>
          </p>
          <p className="text-xs text-zinc-500">
            {onTarget ? "On target" : drillPipe > TARGET_DPP ? "High" : "Low"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Casing
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-brand-navy">
            {Math.round(casing)}
            <span className="ml-1 text-sm font-normal text-zinc-500">psi</span>
          </p>
          <p className="text-xs text-zinc-500">Rising with gas migration</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Time left
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-brand-navy">
            {Math.ceil(secondsLeft)}
            <span className="ml-1 text-sm font-normal text-zinc-500">s</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            On target
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-brand-navy">
            {score}
            <span className="ml-1 text-sm font-normal text-zinc-500">%</span>
          </p>
        </div>
      </div>

      {/* Single-series trace of drill pipe pressure against the target band. */}
      <div className="relative mt-6 h-28 overflow-hidden rounded border border-[var(--brand-border)] bg-zinc-50">
        <div
          className="absolute inset-x-0 bg-emerald-100"
          style={{ top: "42%", height: "16%" }}
          aria-hidden
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 120 100"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Drill pipe pressure trace, currently ${Math.round(drillPipe)} psi`}
        >
          <polyline
            fill="none"
            stroke="var(--brand-navy)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            points={history
              .map((value, index) => {
                const y = 100 - ((value - 400) / 800) * 100;
                return `${index},${Math.max(0, Math.min(100, y))}`;
              })
              .join(" ")}
          />
        </svg>
      </div>

      <div className="mt-6">
        <label
          htmlFor="choke-position"
          className="flex items-baseline justify-between text-sm font-medium text-brand-navy"
        >
          <span>Choke position</span>
          <span className="tabular-nums text-zinc-500">{choke}% open</span>
        </label>
        <input
          id="choke-position"
          type="range"
          min={0}
          max={100}
          value={choke}
          disabled={phase === "finished"}
          onChange={(event) => setChoke(Number(event.target.value))}
          className="mt-2 w-full accent-[var(--brand-gold)]"
        />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Closed &mdash; more backpressure</span>
          <span>Open &mdash; less backpressure</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {phase === "idle" ? (
          <button
            type="button"
            onClick={() => setPhase("running")}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
          >
            Start the drill
          </button>
        ) : null}
        {phase === "running" ? (
          <button
            type="button"
            onClick={() => setPhase("finished")}
            className="inline-flex h-11 items-center justify-center rounded-full border border-brand-navy px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          >
            Stop
          </button>
        ) : null}
        {phase === "finished" ? (
          <>
            <p
              role="status"
              className="rounded-lg border border-[var(--brand-border)] bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
            >
              You held drill pipe pressure on target for{" "}
              <strong className="text-brand-navy">{score}%</strong> of the
              circulation.{" "}
              {score >= 80
                ? "That is steady choke work."
                : "Try smaller adjustments and wait for the gauge to respond."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
            >
              Run it again
            </button>
          </>
        ) : null}
      </div>

      <p className="mt-6 border-t border-[var(--brand-border)] pt-4 text-xs leading-5 text-zinc-500">
        A training aid for the feel of choke work — the lag between an
        adjustment and the gauge, and the pressure that gas migration adds on its
        own. It does not model well geometry, fluid compressibility, or
        temperature, and it is not a substitute for a certified simulator.
      </p>
    </div>
  );
}
