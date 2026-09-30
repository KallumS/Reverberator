# 0009. Verify with a headless ysfx host, by measurement

- Status: Accepted
- Date: 2026-09-30

## Context

REAPER is not available in the build container, and the author cannot listen
to audio. Trombolese's notes warn that "compiling is not evidence" — its
Faust valve compiled and was wrong. A JSFX plugin that only compiles tells us
nothing about whether it is stable, in tune, or at a sensible level.

ysfx is a library that loads and runs JSFX files using the same EEL2
compiler and JIT that REAPER uses.

## Decision

Build ysfx headless (`tools/build_host.sh`) and write two small hosts:

- `render`: raw float32 stereo through the plugin, reporting CPU and any
  non-finite samples;
- `inspect`: run N blocks (optionally one sample at a time, with an impulse)
  and dump plugin variables and memory.

On top of these, Python tools measure what a listener would judge: loudness
(BS.1770), peak and soft-ceiling engagement, T60 (Schroeder integration),
spectrograms, the nonlinear share at each Drive, and a stability sweep
(ADR 0013). The plugin's own derived values (mode frequencies, loop lengths,
FDN sizes) are read back with `inspect` and compared to hand calculations.

## Consequences

- Every change can be checked in minutes, without REAPER.
- The inspect tool found the worst bug of the session (ADR 0010): a memory
  table being overwritten, located to the exact sample by bisection.
- CPU figures come from the same JIT as REAPER, so they are representative.
- ysfx is not REAPER: GUI and host integration are untested, and a check in
  REAPER itself is still recommended.
