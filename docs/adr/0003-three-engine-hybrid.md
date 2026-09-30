# 0003. A hybrid of three engines: waveguides, modes and a dispersive FDN

- Status: Accepted
- Date: 2026-09-30

## Context

The 19 materials are physically very different: 1-D media with harmonic or
stiff-string series (wires, strings, pipes); objects with a few strong,
audible resonances (bottle, handpan, membranes); and objects with thousands
of overlapping resonances (plates, shells, foil). Most real objects combine
two or more of these (a guitar is strings through a body; a barrel is air,
lids and shell).

No single method is efficient for all three: a modal bank of thousands of
modes is too expensive; a feedback delay network cannot place individual
tuned resonances; a waveguide represents only one 1-D system.

## Decision

Implement three engines and let each material use any combination:

1. **Waveguides** (up to 32): delay loop + Thiran fractional delay + one-pole
   loss + allpass dispersion chain.
2. **Modes** (up to 64): two-pole resonators with per-mode decay and
   left/right gains from the mode shape at two pickup points.
3. **Dispersive FDN**: 8 delay lines, Hadamard mixing, one-pole loss and four
   allpass stages per line.

Routing between them is feed-forward (waveguides → modes/FDN, modes → FDN),
with per-material input and output weights.

## Consequences

- Every material could be expressed with the right tool for each part.
- Each engine is normalised independently (ADR 0007), so the weights are
  meaningful power proportions.
- Three code paths to maintain, and a material setup is a small program
  rather than a table of numbers.
- CPU stays low because only the engines a material uses run.

## Alternatives considered

- **2-D waveguide mesh / finite differences for plates**: physically closest
  but far too expensive for JSFX at audio rates and a plate of realistic size.
- **Modal only**: can't reach reverb-like density.
- **FDN only**: can't do tuned strings, a Helmholtz boom or a handpan scale.
