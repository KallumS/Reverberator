# 0011. Two-pass rebuild; reallocate only when the geometry changes

- Status: Accepted
- Date: 2026-09-30

## Context

A material's setup computes delay lengths, allocates delay lines and
dispersion state from a pool, and fits filters. Three constraints pull
against each other:

- Delay lengths depend on Material, Size and Tuning; reallocating clears the
  buffers, so the tail restarts.
- Decay and Brightness only change loss filters, and users automate them; they
  must not restart the tail.
- Normalisation should be computed at default Decay/Brightness (ADR 0007),
  but the running filters must use the user's values.

## Decision

`rebuild(alloc)` runs the material setup twice:

1. **Pass 1** at default Decay and Brightness, allocating if Material, Size
   or Tuning changed; the engine energies from this pass set the
   normalisation.
2. **Pass 2** (only if Decay or Brightness differ from default) with the
   user's values and no allocation, reusing pass 1's buffers **by index** —
   so pass 2 must create waveguides and modes in exactly the same order and
   number as pass 1. If memory ran out in pass 1, later items are skipped in
   both passes, keeping the indices aligned.

Size is a uniform scaling of the object: every frequency ÷ s, every time and
the modal density × s, and T60 × s (with η constant, a bigger object rings
longer). Tuning scales frequencies only.

## Consequences

- Decay and Brightness are smooth and automatable; Material, Size and Tuning
  restart the tail (documented in the README).
- Setup code must be deterministic in its ordering; an `if` that adds a mode
  only in one pass would corrupt the pairing.
