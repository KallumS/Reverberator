# 0001. Ship as JSFX first; CLAP later if wanted

- Status: Accepted
- Date: 2026-09-30

## Context

The brief allowed JSFX or CLAP. The user is not a programmer and works in
REAPER. Trombolese, the sibling project, chose Faust → CLAP, but its Faust
port was written without a compiler available and never became a working
plugin; its session log records that JSFX "can run per-sample DSP ... and is
an excellent scratchpad, but it is Reaper-only, has no real GUI, no SIMD, and
no distributable installer."

This project's risk was not the plugin format but whether 19 physical models
would sound right and stay stable. The fastest route to a playable,
verifiable result was the one that needs no build step.

## Decision

Write the plugin as a single JSFX file, `Reverberator.jsfx`.

## Consequences

- Install is "drop one file in a folder"; any edit is live on reload. No
  compiler, toolchain or signing for the user to deal with.
- REAPER only (or hosts that embed ysfx). A CLAP build would need a port.
- EEL2's quirks become design constraints: case-insensitive names, no
  scientific notation, no SIMD, a flat memory model (ADR 0010).
- Performance is adequate: 2–17 % of one core at 48 kHz for every material.
- The same EEL2 engine is available as a library (ysfx), which made
  headless testing possible (ADR 0009).

## Alternatives considered

- **CLAP in C++**: portable across DAWs, faster, real GUI; but a compile and
  distribution burden, and slower iteration while the physics was unproven.
- **Faust → both**: Faust can emit JSFX and CLAP from one source, but its
  compile-time-fixed structure fights material switching (different engine
  counts per material) and waveguides whose length changes — the same
  problem Trombolese's port documented.

The DSP is written as plain loops over flat arrays so a later C/C++ port is
mechanical.
