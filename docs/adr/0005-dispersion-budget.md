# 0005. Dispersion by distributed allpass chains, clamped and stretched to fit a budget

- Status: Accepted
- Date: 2026-09-30

## Context

In stiff strings and bending waves, high frequencies travel faster. That is
the "pew" of ice and tension wires and the inharmonicity of pianos. The
standard way to put it in a delay loop is a chain of first-order allpass
filters (unit gain, frequency-dependent delay).

Trombolese established that frequency-dependent delay must be **distributed
through the loop**, not lumped at one end. Here the whole chain sits inside
each loop, which satisfies that.

Measurement exposed a budget. A first-order allpass contributes exactly π
radians of phase over 0…Nyquist, so the area under its group-delay curve is
fixed. Physically sized chirps are huge: 96 ms between 250 Hz and 4 kHz for
the ice's 70 m path, which would need ~1000 stages per path. With too few
stages, the coefficient solver drives the allpasses towards −1, which piles
all the delay below a few hundred hertz: the first ice render had its chirps
squashed into the bass and effectively inaudible.

## Decision

- Solve each loop's allpass coefficient so the group delay matches the
  physics at two frequencies, but **clamp it** (`disp_lim`: −0.9 in general,
  −0.72 for the ice) so the delay spreads across the band.
- For chirp paths, **stretch** the allpasses (z⁻ᴷ in place of z⁻¹,
  K ≈ fs/12 kHz) so the whole budget is spent in 0–6 kHz, and put a 4th-order
  lowpass on the loop input to keep out the stretched filter's mirror images.
- Use 96 stages per path for ice and wire, 48 for the fence, 2–4 for strings
  and tubes.

## Consequences

- Each echo carries a fraction of the physical chirp (ice 43 %, tension wire
  62 %, fence 94 %, bass piano strings 43 %), with the right shape; because
  the loops recirculate, later echoes accumulate more, as in reality.
- The ice's highs above ~6 kHz are deliberately removed.
- Budget, clamp and stretch are documented in the code so nobody "fixes" the
  clamp away.

## Alternatives considered

- **More stages**: correct, but ~10× the CPU.
- **Lumped dispersion filter at the loop end**: rejected on Trombolese's
  evidence and because it cannot recirculate correctly.
