# 0013. Stability means "energy does not grow after the input stops"

- Status: Accepted
- Date: 2026-09-30

## Context

`tools/check.py` sweeps all 19 materials through 11 control extremes at
48 kHz, plus defaults at 44.1 and 96 kHz, with hot input (peaks near
−1 dBFS). Its first criterion — "fail if the output sits at the ceiling" —
flagged 20 cases, all of which were just loud. The second — "fail if the last
0.5 s is still loud" — flagged 4, all at Size 400 % + Decay 400 % + Tuning −12,
where decays last minutes (the piano's 12.5 s T60 becomes ~200 s). Neither
distinguishes a long decay from a runaway loop.

## Decision

A render fails only if it returns an error, produces a non-finite sample, or
its **energy grows after the input stops**: RMS of the last 0.25 s greater
than 1.1 × the RMS of a 0.25 s window 0.75 s earlier. Soft-ceiling engagement
is reported as a note.

## Consequences

- The sweep reports 0 failures across all cases and sample rates.
- The sweep must be run after any change to losses, dispersion or routing.
