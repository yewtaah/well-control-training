# Simulator roadmap

Chris's objective statement calls out **hands-on simulator practice**, and
section 9 of the curriculum lists *choke drills and simulator practice* as a
lesson. This document sets out what is built, and the options for going further.

## What is built today

`/simulator` hosts a **choke drill** — a browser exercise in holding constant
bottomhole pressure through a kill circulation. It models the two things that
make choke work difficult to learn from a kill sheet:

- **Lag.** A choke adjustment does not show up at the drill pipe gauge
  immediately; the pressure wave takes time to travel the wellbore. The drill
  applies a first-order lag so over-correction feels the way it does on a rig.
- **Migration.** Gas rising in the annulus pushes casing pressure up on its own,
  so holding still is not the same as doing nothing.

The learner is scored on time held within tolerance of the target drill pipe
pressure. It is a training aid for the *feel* of choke work, not an engineering
simulator — it does not model well geometry, fluid compressibility, or
temperature.

## Options for a full simulator

| Option | Effort | Fidelity | Notes |
|---|---|---|---|
| **Extend the in-house drill** | Low–medium | Low–medium | Add well geometry, real kill sheets, and scenario scripts (gas kick while tripping, losses at the shoe, plugged choke). Stays inside the existing stack, no licensing, full control of the data we capture for analytics. |
| **Licence a third-party WC simulator** | Medium (commercial) | High | Established vendors sell IADC/IWCF-aligned simulators. Highest fidelity and external credibility, but recurring licence cost, and progress data usually stays in their system rather than ours. |
| **Physics engine + custom UI** | High | High | Build on a transient multiphase flow model. Only worth it if simulation becomes the product rather than a supporting exercise. |

## Recommendation

Extend the in-house drill for v1 and v2. It is the only option that keeps
simulator activity inside the same `ActivityEvent` log as the rest of the
programme, which is what makes "who has practised, and how well" reportable
alongside lesson and knowledge-check progress. Revisit licensing once Chris has
decided whether simulator time needs to carry formal certification weight.
