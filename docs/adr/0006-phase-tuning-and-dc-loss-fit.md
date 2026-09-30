# 0006. Tune loops by exact phase; fit loss filters at DC

- Status: Accepted
- Date: 2026-09-30

## Context

A delay loop's pitch is set by its total phase, and every filter in the loop
(Thiran fraction, loss lowpass, dispersion allpasses) adds phase. Trombolese's
waveguide played 25–60 cents sharp until it modelled the extra delay that its
boundary-layer loss imposes — the same lesson: what the loop's filters do to
phase decides the pitch. The PVC pipe here has a strongly low-passing loop
(98 % loss per round trip at 4 kHz), so ignoring filter phase would detune it
noticeably.

Separately, the one-pole loss filter is fitted to two decay times. Fitting it
at two *non-zero* frequencies can leave its DC gain above 1 when the low T60
is long, which makes the loop unstable.

## Decision

- `wg_make` solves the integer delay and Thiran fraction so the loop's total
  phase lag at the fundamental is exactly 2π (π for a loop with an inverting
  reflection), including the allpass chain and the loss filter's phase, and
  refines the Thiran coefficient against its exact phase.
- Non-pitched loops (ice) are tuned to a target group delay instead.
- `op_fit` always matches the per-pass gain at **DC** and at one high
  frequency. A one-pole lowpass is then monotonic, so its gain is below 1 at
  every frequency.

## Consequences

- Strings are in tune regardless of dispersion or damping settings, and
  Tuning is exact.
- Every loop is unconditionally stable, whatever T60 is asked for.
