# Simulator practice — options

The programme objective calls for hands-on simulator practice, and Course 9
("Choke Operations & Pressure Control") references choke drills directly.
Full simulation is out of scope for v1. This note lays out the options so we
can pick a direction deliberately rather than by default.

**What exists today:** a working choke-drill preview at `/simulator`. It models
one thing — the lag between a choke adjustment and the pressure response — and
scores how much of a 60-second run the trainee held pressure inside a ±25 psi
band. It is honest about being a preview and is not presented as certification-
grade simulation.

## The three options

| | **A. Drill library (in-house)** | **B. Integrate a WC simulator** | **C. Partner for in-person practice** |
|---|---|---|---|
| **What trainees get** | A dozen focused browser drills — choke control, kick detection, kill-sheet arithmetic | A full circulating well model, the same class of tool used for IWCF/IADC practice | Classroom or rig-floor simulator time, booked through a training provider |
| **Fidelity** | Low — one mechanism per drill | High — full wellbore hydraulics | Highest |
| **Build cost** | Low. Each drill is a self-contained component, days not weeks | High. Licence fees, plus an integration and SSO effort | None to build |
| **Running cost** | Effectively zero — it is static frontend | Per-seat or per-site licensing, renewed annually | Per-trainee, per-session |
| **Works on a phone** | Yes | Usually not — these are desktop applications | No |
| **Credential value** | None on its own; supports the knowledge checks | Recognised as practice toward certification | Counts toward certification |
| **Time to value** | Weeks | Months, mostly commercial rather than technical | Immediate, but not scalable |

## Recommendation

**A now, C alongside it, B only if a customer asks for it.**

The audience is "all critical safety roles, office and field", much of it on a
phone. Browser drills reach that audience; a desktop simulator licence does
not, and it would sit behind the same paywall problem for every new trainee.
Building out the drill library also keeps the platform self-contained: each
drill is a React component with no backend and no licence to renew.

If a client needs certification-grade simulator hours, that is a referral to a
partner (option C) rather than something the platform should try to replicate.
Option B only becomes worth its cost if Well Command  Assurance starts delivering
accredited courses itself.

## Proposed drill order

1. **Choke drill** — built, in preview. Lag and small corrections.
2. **Kick detection** — pit volume, flow-out and pump pressure trends; the
   trainee calls the shut-in and is scored on how early and how confidently.
3. **Shut-in sequence** — order-of-operations drill against a clock (hard vs.
   soft shut-in, per Course 6).
4. **Kill sheet** — fill in a Driller's or Wait & Weight sheet against a
   generated well; each figure is checked as it is entered.

Each slots under the course it supports, and each is scoreable, so the results
can feed the same `QuizAttempt`/`ActivityEvent` tables the knowledge checks
already write to.

## Open questions for Chris

- Do any current or prospective clients specifically ask for simulator hours,
  or is the theory plus drills enough for the audience you have in mind?
- Should drill scores count toward the course completion certificate, or stay
  practice-only?
- Is there a Well Control simulator you have used and rate, that we should
  price out for option B?
