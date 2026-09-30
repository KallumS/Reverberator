# 0007. Loudness: exact energy normalisation per engine, then measured trims

- Status: Accepted
- Date: 2026-09-30

## Context

The materials differ enormously in decay (15 ms for the toilet roll tube,
16 s for the gong) and in how resonant they are. Without normalisation,
switching material would jump by tens of dB, and the per-material weights
between engines would be meaningless.

The first normalisation estimated each loop's energy from its gain at 1 kHz.
Measured per engine, with an impulse, it was badly wrong: modes came out at
≈ 1 (correct), but waveguides at 0.006–0.19 and the FDN at 0.025–0.24
instead of 1. The energy of a lossy loop is dominated by the frequencies
where it rings longest, not by 1 kHz.

## Decision

1. **Analytic, exact normalisation for loops.** For a loop whose only
   non-allpass element is the one-pole b/(1 − p z⁻¹), the impulse-response
   energy is the frequency average of |H|²/(1 − |H|²), which integrates in
   closed form:

       E = b² / √((1 + p² − b²)² − 4p²)

   After this, waveguides measured 0.93–0.97.
2. **FDN** uses the mean of its lines' loop energies ÷ 8 with a measured
   factor `FDN_E_CAL = 0.65` (the Hadamard mixing makes line outputs partly
   coherent). Measured after: 0.48–0.77.
3. **Modes** use Σ amp² / (2(1 − r²)).
4. **Per-material trims** (`trim_tab`) bring each material to −24 LUFS
   (ITU-R BS.1770 K-weighting, ungated) on a fixed test program at −6 dBFS
   peak, measured by `tools/check.py --trims`. Two passes are needed, because
   on the first pass the loudest materials are compressed by the soft
   ceiling (ADR 0012). Final spread: within 0.1 dB.
5. Normalisation is computed at **default Decay and Brightness** (pass 1 of
   `rebuild`), so turning Decay up still makes the reverb louder, as a real
   one would.

## Consequences

- Switching material does not jump in level; A/B comparison is fair.
- Any change to a material's physics changes its loudness, so trims must be
  re-measured (a rule in CLAUDE.md).
- Loudness is matched on one program (drums + plucks). Program material with
  very different spectra will land differently, most for the strongly tuned
  materials (piano, handpan, bottle), since resonances coinciding with the
  program's energy are louder. That is physical, and Output is there for it.
