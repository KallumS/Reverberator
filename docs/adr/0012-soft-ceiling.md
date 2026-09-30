# 0012. A soft ceiling on the wet signal only

- Status: Accepted
- Date: 2026-09-30

## Context

Resonant materials can produce large peaks when the input sits on a
resonance, at extreme settings (Size 400 %, Decay 400 %) or with hot input.
A hard clip would be harsh; a full limiter would change the character and
add latency or pumping.

## Decision

The wet signal passes through a ceiling that is exactly linear below 0.9 and
approaches 1.0 smoothly above it (0.9 + 0.1·e/(0.1 + e), slope 1 at the
knee). The dry signal is never touched.

## Consequences

- At default settings on the calibration program the ceiling never engages
  (0.00 % of samples).
- At extremes with input near 0 dBFS it does (up to ~11 % of samples for the
  violin at Size 400 %); the stability sweep reports these as notes, not
  failures.
- The first trim pass under-measures the loudest materials because the
  ceiling compresses them; trims are iterated (ADR 0007).
