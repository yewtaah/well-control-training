"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A deliberately small choke drill (issue #7): enough to teach the one thing
 * Course 9 keeps repeating — the choke's effect arrives late, so corrections
 * have to be small and patient — without pretending to be a real simulator.
 */

const TARGET_PSI = 620;
const TOLERANCE_PSI = 25;
/** Seconds for the well to reach ~63% of the pressure a choke setting implies. */
const LAG_SECONDS = 2.5;
const RUN_SECONDS = 60;
const TICK_MS = 100;
const TRACE_SAMPLES = RUN_SECONDS * (1000 / TICK_MS);

/** Casing pressure a given choke opening will settle at, before disturbance. */
function settlingPressure(chokePercent: number): number {
  return 1100 - chokePercent * 9;
}

function statusFor(pressure: number): {
  label: string;
  tone: string;
  hint: string;
} {
  const error = pressure - TARGET_PSI;
  if (Math.abs(error) <= TOLERANCE_PSI) {
    return {
      label: "On target",
      tone: "text-emerald-700",
      hint: "Hold the choke where it is and let the well settle.",
    };
  }
  if (error > 0) {
    return {
      label: "Pressure high",
      tone: "text-amber-700",
      hint: "Open the choke slightly — then wait for the lag before adjusting again.",
    };
  }
  return {
    label: "Pressure low",
    tone: "text-amber-700",
    hint: "Close the choke slightly — then wait for the lag before adjusting again.",
  };
}

export function ChokeDrill() {
  const [choke, setChoke] = useState(50);
  const [pressure, setPressure] = useState(settlingPressure(50));
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RUN_SECONDS);
  const [onTargetPercent, setOnTargetPercent] = useState<number | null>(null);
  const [trace, setTrace] = useState<number[]>([]);

  const chokeRef = useRef(choke);
  const pressureRef = useRef(pressure);
  const driftRef = useRef(0);
  const samplesRef = useRef({ total: 0, onTarget: 0 });

  /** The sim loop reads the choke from a ref, so it never restarts on a drag. */
  const handleChokeChange = useCallback((value: number) => {
    chokeRef.current = value;
    setChoke(value);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setSecondsLeft(RUN_SECONDS);
    setOnTargetPercent(null);
    setTrace([]);
    driftRef.current = 0;
    samplesRef.current = { total: 0, onTarget: 0 };
    pressureRef.current = settlingPressure(chokeRef.current);
    setPressure(pressureRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      const dt = TICK_MS / 1000;

      // The formation wanders, so a set-and-forget choke position drifts off.
      driftRef.current +=
        (Math.random() - 0.5) * 18 * dt - driftRef.current * 0.05 * dt;

      const target = settlingPressure(chokeRef.current) + driftRef.current;
      pressureRef.current +=
        ((target - pressureRef.current) * dt) / LAG_SECONDS;

      const current = pressureRef.current;
      samplesRef.current.total += 1;
      if (Math.abs(current - TARGET_PSI) <= TOLERANCE_PSI) {
        samplesRef.current.onTarget += 1;
      }

      setPressure(current);
      setTrace((previous) =>
        [...previous, current].slice(-TRACE_SAMPLES)
      );
      setSecondsLeft((previous) => {
        const next = Math.max(0, previous - dt);
        if (next === 0) {
          setRunning(false);
          const { total, onTarget } = samplesRef.current;
          setOnTargetPercent(
            total === 0 ? 0 : Math.round((onTarget / total) * 100)
          );
        }
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [running]);

  const status = statusFor(pressure);
  const traceMin = 200;
  const traceMax = 1100;
  const points = trace
    .map((value, index) => {
      const x = (index / Math.max(1, TRACE_SAMPLES - 1)) * 100;
      const y =
        100 - ((value - traceMin) / (traceMax - traceMin)) * 100;
      return `${x.toFixed(2)},${Math.min(100, Math.max(0, y)).toFixed(2)}`;
    })
    .join(" ");
  const bandTop =
    100 - ((TARGET_PSI + TOLERANCE_PSI - traceMin) / (traceMax - traceMin)) * 100;
  const bandBottom =
    100 - ((TARGET_PSI - TOLERANCE_PSI - traceMin) / (traceMax - traceMin)) * 100;

  return (
    <div className="rounded-lg border border-[var(--brand-border)] bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-brand-navy">
          Choke drill
        </h3>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-gold-ink">
          Preview
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Hold casing pressure at {TARGET_PSI} psi (&plusmn;{TOLERANCE_PSI}) for{" "}
        {RUN_SECONDS} seconds. The well answers the choke about{" "}
        {LAG_SECONDS} seconds late, so over-correcting is the fastest way to
        lose control of it.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Casing pressure
          </dt>
          <dd className="mt-1 font-serif text-2xl font-semibold tabular-nums text-brand-navy">
            {Math.round(pressure)}
            <span className="ml-1 text-sm font-normal text-zinc-500">psi</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Target
          </dt>
          <dd className="mt-1 font-serif text-2xl font-semibold tabular-nums text-brand-navy">
            {TARGET_PSI}
            <span className="ml-1 text-sm font-normal text-zinc-500">psi</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Choke open
          </dt>
          <dd className="mt-1 font-serif text-2xl font-semibold tabular-nums text-brand-navy">
            {choke}
            <span className="ml-1 text-sm font-normal text-zinc-500">%</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Time left
          </dt>
          <dd className="mt-1 font-serif text-2xl font-semibold tabular-nums text-brand-navy">
            {Math.ceil(secondsLeft)}
            <span className="ml-1 text-sm font-normal text-zinc-500">s</span>
          </dd>
        </div>
      </dl>

      <figure className="mt-6">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-40 w-full rounded border border-[var(--brand-border)] bg-zinc-50"
          role="img"
          aria-label={`Casing pressure trace. Currently ${Math.round(
            pressure
          )} psi against a target of ${TARGET_PSI} psi.`}
        >
          <rect
            x="0"
            y={bandTop}
            width="100"
            height={Math.max(0, bandBottom - bandTop)}
            className="fill-emerald-100"
          />
          <line
            x1="0"
            x2="100"
            y1={(bandTop + bandBottom) / 2}
            y2={(bandTop + bandBottom) / 2}
            className="stroke-emerald-500"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
          {points ? (
            <polyline
              points={points}
              fill="none"
              className="stroke-brand-navy"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>
        <figcaption className={`mt-2 text-sm font-medium ${status.tone}`}>
          {status.label} &mdash;{" "}
          <span className="font-normal text-zinc-600">{status.hint}</span>
        </figcaption>
      </figure>

      <label className="mt-6 block">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Choke position — {choke}% open
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={choke}
          onChange={(event) => handleChokeChange(Number(event.target.value))}
          aria-valuetext={`${choke} percent open`}
          className="mt-2 w-full accent-brand-gold"
        />
        <span className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>Closed — pressure rises</span>
          <span>Open — pressure falls</span>
        </span>
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => (running ? setRunning(false) : setRunning(true))}
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
        >
          {running ? "Pause drill" : secondsLeft === RUN_SECONDS ? "Start drill" : "Resume drill"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full border border-brand-navy px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          Reset
        </button>
        {onTargetPercent !== null ? (
          <p
            className="text-sm text-zinc-600"
            role="status"
            aria-live="polite"
          >
            On target for{" "}
            <span className="font-semibold tabular-nums text-brand-navy">
              {onTargetPercent}%
            </span>{" "}
            of the run.
          </p>
        ) : null}
      </div>
    </div>
  );
}
