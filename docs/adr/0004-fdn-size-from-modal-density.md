# 0004. Size the FDN from the material's modal density, capped by modal overlap

- Status: Accepted
- Date: 2026-09-30

## Context

A feedback delay network whose delay lines add up to T seconds has on
average T resonances per hertz. A thin plate has a modal density that is
independent of frequency:

    n = (S/2) √(ρh / D)   per hertz

So "how dense and smooth versus how sparse and metallic" a plate sounds is a
physical quantity that maps exactly onto the FDN's one structural parameter.

Two problems appear at the extremes. Foil's density is 2.7 per hertz (a
2.7 s network) while its T60 is 0.35 s: lines that long produce audible
discrete echoes, not a wash. And very long networks cost memory.

## Decision

Set the FDN's total delay to the material's modal density (orthotropic form
for the tin roof), then cap it at **0.3 × the low-frequency T60** and at 3 s.
The cap reflects the physics: once damping makes neighbouring modes overlap,
extra density is inaudible.

## Consequences

- Glass (31 ms) and marble (11 ms) come out sparse and ringing; car panel
  (355 ms) and barrel shell (411 ms) dense like a plate reverb; foil and the
  tin roof are capped (105 ms, 393 ms).
- Size scales density correctly (a bigger object is denser).
- The line lengths are spread geometrically and forced odd and distinct, so
  even very short networks (marble's lines are ~1.4 ms) don't collapse onto a
  single comb.
