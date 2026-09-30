# CLAUDE.md

Working notes for Reverberator: a JSFX reverb that sends audio through
physical models of odd materials. `README.md` is for the user;
`docs/PHYSICS.md` holds the formulas and numbers. This file is the traps.

## Layout

```
Reverberator.jsfx      the plugin: physics helpers, 19 material setups, 3 engines
docs/PHYSICS.md        formulas, derived and measured values, simplifications
tools/build_host.sh    builds a headless JSFX host (ysfx) into tools/build/
tools/render.cpp       raw float32 stereo in -> out through the plugin
tools/inspect.cpp      dump plugin variables/memory after N blocks
tools/check.py         loudness table, trim suggestions, stability sweep
tools/render_demos.py  WAV demos of every material
tools/spectrograms.py  impulse-response spectrogram grid
tools/test_signals.py  synthesised drum + pluck program
```

## Commands

```bash
tools/build_host.sh                       # ~30 s, needs cmake + g++
python3 tools/check.py --no-sweep         # ~1 min: loudness/peak/CPU/T60 table
python3 tools/check.py                    # ~10 min: + 19 materials x 11 extremes x 3 sample rates
python3 tools/check.py --trims --no-sweep # after any physics change
```

Run the sweep in the background. It must report `0 failure(s)`.

## EEL2 traps (all of these bit)

- **Variable names are case-insensitive.** `wgM` (a signal) and `WGM` (the
  waveguide table's base address) were the same variable; once the piano's 24
  strings summed past 1.0 the table address moved and the plugin overwrote
  itself — silent until then, 450x slower than realtime after. Memory-map
  constants now have long unambiguous names (`WG_BASE`, `MOD_BASE`...). Never
  name two things that differ only in case, including a function's locals
  against each other (`d`/`D`, `k`/`K`).
- **No scientific notation.** `1.5e-5` is a syntax error. Write decimals.
- **Functions are inlined, variables not declared `local` are global.**
- Compiling is not evidence. Render it (`tools/build/render`) and look.

## Design rules

- **Nothing is fed back into the engine that drives it through a
  nonlinearity.** Rattle may read the waveguides/FDN/modes and write to the
  modes or the output, but a material that rattles *from* the modes must not
  rattle *into* them. That is what keeps every material unconditionally
  stable (all loops are lossy-linear; nonlinear paths are feed-forward).
- **Tune loops by phase, not by length.** Every filter in a loop adds phase;
  `wg_make` solves the integer delay + Thiran fraction so the total phase at
  the fundamental is 2π (π for an inverting loop). This is the Trombolese
  lesson, and so is distributing dispersion through the loop.
- **Loss filters are fitted at DC and one high frequency**, never at two
  non-zero frequencies: fitting away from DC can put the DC gain above 1.
- **Dispersion has a budget.** A first-order allpass has π radians to spend in
  total. Clamp its coefficient (`disp_lim`) or the delay piles up in the bass
  and the "pew" disappears; stretch it (z^-K) to spend the budget in the band
  that matters, and low-pass the loop input to hide the images.
- **FDN total delay = modal density**, capped at 0.3 x T60 (once modes
  overlap, longer lines only make discrete echoes).
- **Normalisation is analytic and exact for loops** (`loop_energy`), measured
  for the FDN (`FDN_E_CAL = 0.65`), then per-material trims (`trim_tab`) from
  `check.py --trims`. Any physics change moves loudness: re-run the trims,
  iterate twice (the soft ceiling compresses loud cases on the first pass).
- Normalisation is computed at default Decay/Brightness (pass 1 of
  `rebuild`), so those controls still change level the way a real reverb does.
- Allocation happens only when Material, Size or Tuning change. Pass 2 must
  create waveguides and modes in exactly the same order as pass 1; it reuses
  their buffers by index.

## Measurement traps

- **`pkill -f <pattern>` kills its own shell** when the pattern is in the
  command line. It did, once, here too.
- The runaway test compares tail energy late vs early *after the input stops*.
  At the extremes (Size 400 %, Decay 400 %, Tuning −12) decays last minutes,
  so "still loud at the end" is not instability.
- `inspect` prints memory with `%.6g`; recovering a very low mode frequency
  from its `2r cos θ` coefficient loses precision there. Don't chase it.
