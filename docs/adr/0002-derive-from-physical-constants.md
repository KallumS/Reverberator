# 0002. Derive every sound from physical constants

- Status: Accepted
- Date: 2026-09-30

## Context

A "material reverb" could be built three ways: record impulse responses of
real objects, hand-tune reverb presets until they sound right, or model the
physics. The user asked for simulation, pointed at a physical-modelling
project (Trombolese) as reference, and no recordings of the 19 objects exist.
The author of this plugin also cannot listen, so tuning by ear was not
available; tuning by physics and by measurement was.

## Decision

Each material is specified by physical quantities — dimensions, Young's
modulus, density, Poisson's ratio, tension, loss factor η — and the plugin
computes its resonance frequencies, decay times, modal density and dispersion
from textbook formulas at load time. Where a quantity is a design fact rather
than a material property (a handpan's 1 : 2 : 3 tuning, a guitar body's
measured modes) the published value is used directly and documented as such.

## Consequences

- Size, Tuning, Decay and Brightness act physically and consistently across
  all materials (ADR 0011).
- Results can be sanity-checked against the real world: the wine bottle's
  Helmholtz resonance comes out at 109.6 Hz (real bottles ≈ 110 Hz), piano
  inharmonicity at 1–3 × 10⁻⁴ (as measured on pianos).
- The weakest input is η, which depends on mounting and coating; twice it was
  adjusted after measurement (ice, car panel), and those changes are recorded.
- Adding a material means choosing an object and its numbers, not inventing
  a preset. `docs/MATERIALS.md` records the reasoning for each.

## Alternatives considered

- **Convolution with recorded IRs**: most realistic for one static object, but
  no recordings, no Size/Tuning/Drive, and no level-dependent behaviour.
- **Hand-tuned algorithmic presets**: impossible to verify without listening,
  and arbitrary.
