# 0008. Level-dependent effects are feed-forward only, with calibrated Drive curves

- Status: Accepted
- Date: 2026-09-30

## Context

Several materials are defined partly by how they behave when hit hard: a
fence and a tin roof rattle, cling film buzzes like a kazoo, foil crackles, a
tam-tam blooms into shimmer, drum skins glide in pitch. All of these are
nonlinear. A nonlinearity inside a feedback loop can create energy and run
away; proving stability for 19 materials × all settings would be impractical.

## Decision

- Every feedback loop in the plugin is **lossy and linear** (plus unit-gain
  allpasses). All nonlinear paths are **feed-forward**: a rattle may read the
  waveguides, FDN or modes and write to the modes or the output, but never
  back into the engine it reads from. (Cling film rattles *from* its modes, so
  it writes only to the output.)
- Pitch glide modulates mode frequencies by at most 6 %, well inside the
  resonators' stable range.
- **Drive** scales all of them, with curves calibrated by measuring the
  nonlinear part (drive-N output minus drive-0 output) on the test program:
  - Rattle gain = amount × `rat_ref` × (0.3 + 12 d + 30 d²), output scaled by
    1/√(1 + 0.5 × gain); `rat_ref` per material so that the default Drive
    (30 %) puts the rattle about 15–23 dB under the clean sound and 100 %
    puts it around 0 dB (fence −17/+3, car −23/+2, cling film −17/−2, roof
    −16/−3 dB).
  - Shimmer gain = 1.2 × amount × d² (the first, linear-in-d version put the
    gong's shimmer 5 dB *over* the clean sound at full Drive).

## Consequences

- Every material is stable by construction; the sweep confirmed it (ADR 0013).
- The rattles are statistical (a dead-zone and a high-pass), not collision
  models: they have the right threshold behaviour, not individual impacts.
- A real cascade of energy back into low modes (as a true tam-tam has) is
  absent.
