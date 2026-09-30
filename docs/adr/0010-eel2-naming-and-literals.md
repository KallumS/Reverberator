# 0010. EEL2 conventions: unambiguous names, decimal literals

- Status: Accepted
- Date: 2026-09-30

## Context

Two EEL2 properties bit during development:

1. **No scientific notation.** `1.506e-5` is a syntax error. The first
   compile failed on it.
2. **Identifiers are case-insensitive.** The waveguide table's base address
   was `WGM` and the waveguides' mono output signal was `wgM`: the same
   variable. It worked while the output stayed below ±1 (the address
   truncated to 0), and failed when the piano's 24 strings summed above 1:
   the table address shifted by −1, every string's descriptor was
   overwritten, and the plugin ran 450× slower than real time while writing
   over its own memory. Found by stepping one sample at a time with
   `inspect` and bisecting to the first corrupted sample (170), where every
   descriptor's fields at offsets 1, 4 and 8 had changed — the signature of a
   stride-20 writer offset by −1.

## Decision

- Memory-map constants have long, unambiguous names (`WG_BASE`, `MOD_BASE`,
  `FDN_BASE`, `PLATE_TMP`, `BESSEL_TAB`...), and signals have descriptive
  lower-case names (`wg_mono`, `mod_mono`, `fdn_mono`).
- No two identifiers anywhere, including locals within one function, may
  differ only in case (`d`/`D`, `k`/`K`, `h`/`H` were also renamed).
- Numbers are written as decimals, or as `200*10^9` for moduli.

## Consequences

- A class of silent, level-dependent memory corruption is ruled out by
  convention; CLAUDE.md lists it first among the traps.
- Some constants read less naturally than in C.
