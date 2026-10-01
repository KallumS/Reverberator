# CLAUDE.md

Working notes for Reverberator: a JSFX reverb that sends audio through
physical models of odd materials. The user is not a programmer: explain
results in plain language, and keep `README.md` readable for them.

Where things are documented:

- `README.md` — for the user: install, controls, what each material sounds like.
- `docs/MATERIALS.md` — how each material's physics was arrived at, with numbers.
- `docs/PHYSICS.md` — formulas, reference tables, known simplifications.
- `docs/adr/` — one record per design decision. Read before changing a
  design rule below; write a new record when making a new one.
- `docs/SESSION-LOG.md` — the build history: measurements and dead ends.
  Check it before re-measuring or re-trying something; append to it for
  substantial work.
- This file — the traps.

## Layout

```
Reverberator.jsfx      the plugin: physics helpers, 20 material setups, 3 engines
docs/MATERIALS.md      per-material derivations
docs/PHYSICS.md        formulas, derived and measured values, simplifications
docs/adr/              architecture decision records 0001-0016 (index in README.md)
docs/gui.png           interface screenshot used by README (regenerate with tools/build/gui)
docs/SESSION-LOG.md    session history
tools/build_host.sh    builds a headless JSFX host (ysfx) into tools/build/
tools/render.cpp       raw float32 stereo in -> out through the plugin
tools/inspect.cpp      dump plugin variables/memory after N blocks
tools/gui.cpp          run @gfx headlessly: draw to an image, simulate mouse, print sliders/vars
tools/gui_png.py       convert gui's raw BGRA output to PNG
tools/gui_check.py     simulated-mouse tests of the interface (must report 0 failures)
tools/check.py         loudness table, trim suggestions, stability sweep
tools/render_demos.py  WAV demos of every material
tools/spectrograms.py  impulse-response spectrogram grid
tools/test_signals.py  synthesised drum + pluck program
tools/analyse.py       IR metrics (T60, centroid) and the material names list
demos/                 rendered WAVs, git-ignored (tools/render_demos.py demos)
```

Python tools need numpy, scipy and matplotlib. The tools default to
`tools/build/render`; override with `RENDER=/path/to/render`.

## Commands

```bash
tools/build_host.sh                       # ~30 s, needs cmake + g++
python3 tools/check.py --no-sweep         # ~1 min: loudness/peak/CPU/T60 table
python3 tools/check.py                    # ~10 min: + 20 materials x 11 extremes x 3 sample rates
python3 tools/check.py --trims --no-sweep # after any physics change
python3 tools/gui_check.py                # ~10 s: after any change to @gfx
```

Run the sweep in the background. It must report `0 failure(s)`. "note" lines
(hot input reaching the soft ceiling at extreme settings) are expected.

## Changing or adding a material

1. Edit its block in `setup_material()`; keep the comment above it stating
   the object, its dimensions and why it sounds the way it does. Add a new
   material at the end of the Material slider list (and its range) and of
   `NAMES` in `tools/analyse.py`, with a `trim_tab` entry (and the loop that
   zeroes the table), name and description string slots (100+i, 150+i) and
   the tile loop count in @gfx. The grid is 5 x 4 and now full: a 21st
   material needs a new layout row.
2. Read the derived values back (`tools/build/inspect`) and compare with a
   hand calculation.
3. Look at it: `python3 tools/spectrograms.py out.png` (add `8=0` to exclude
   Drive effects), then view the PNG.
4. Re-run trims twice: `check.py --trims --no-sweep`, apply, repeat.
5. If it has rattle/shimmer, measure the nonlinear share at Drive 30/60/100 %
   (method in SESSION-LOG §11) and set `rat_ref`.
6. Run the full sweep in the background.
7. Update `docs/MATERIALS.md`, the tables in `docs/PHYSICS.md` and
   `README.md`, and ADR 0014 if it is a new interpretation.

## EEL2 traps (all of these bit) — ADR 0010

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

## GUI (@gfx) rules — ADR 0016

- **@gfx runs on the UI thread and shares every variable with the audio
  code.** Every variable it uses is prefixed `ui_`. Function `local()`s are
  kept per code section (so they are not the risk), but any *global* a
  function touches is shared, so the GUI calls only `ui_` functions, which
  touch only `ui_` globals. Read engine memory, never write it.
- **Moving a slider from @gfx does not run @slider.** Use `ui_setslider()`,
  which calls `slider_automate` and sets `ui_changed`; `@block` then runs
  `apply_params()`.
- Sliders are hidden with a `-` prefix on their names; keep it on any new
  slider, and add a knob or control for it in the GUI.
- `mouse_wheel` is 120 per notch in REAPER; ysfx (and so `tools/build/gui`)
  uses 512.
- Check GUI changes by rendering:
  `tools/build/gui Reverberator.jsfx out.bgra 760 480 2 1=<material>` then
  `python3 tools/gui_png.py out.bgra 1520 960 out.png`, and look at it.
  Simulate clicks with `EVENTS="x,y,buttons;..."` and check engine variables
  with `VARS=`.

## Facts checked against the official JSFX reference

The user supplied REAPER's JSFX Programming Reference and API list (not
committed: they are REAPER's documents). Points that matter here:

- `@init` runs on load, sample-rate change **and every transport start**, and
  all variables and memory are zeroed before it (unless `@serialize` exists).
  So every table must be rebuilt in `@init`, and pressing play restarts the
  tail — expected. `@slider` always runs after `@init`.
- `==` and `!=` compare with a 0.00001 tolerance; `&&`/`||` and `|`/`&`/`~`
  have equal precedence within each group — parenthesise mixtures.
- Memory index = value + 0.00001, truncated: index with integers.
- Functions may call only functions declared *before* them; 0–40 parameters;
  `local()`s persist across calls and are kept per code section.
- `slider_automate(mask[, end_touch])`: mask bit n−1 for slider n;
  `end_touch` (6.74+) closes a touch-automation pass — call it when a GUI
  gesture ends (`ui_endtouch`).
- `gfx_setfont` sizes must be 8–100; `gfx_drawstr` clips to its box unless
  flag 256; `mouse_cap` 8 = Shift, 4 = Ctrl/Cmd, 16 = Alt/Option;
  `mouse_wheel` is 120 per notch and must be reset by the script;
  `gfx_ext_retina` doubles `gfx_w/gfx_h` on macOS only; `gfx_ext_flags & 1`
  means embedded in the track/mixer panel.
- `gfx_rect`'s 5th argument (filled) is optional and defaults to filled; we
  omit it.

## Design rules

- **Nothing is fed back into the engine that drives it through a
  nonlinearity.** Rattle may read the waveguides/FDN/modes and write to the
  modes or the output, but a material that rattles *from* the modes must not
  rattle *into* them. That is what keeps every material unconditionally
  stable (all loops are lossy-linear; nonlinear paths are feed-forward). ADR 0008.
- **Tune loops by phase, not by length.** Every filter in a loop adds phase;
  `wg_make` solves the integer delay + Thiran fraction so the total phase at
  the fundamental is 2π (π for an inverting loop). This is the Trombolese
  lesson, and so is distributing dispersion through the loop. ADR 0006.
- **Loss filters are fitted at DC and one high frequency**, never at two
  non-zero frequencies: fitting away from DC can put the DC gain above 1. ADR 0006.
- **Dispersion has a budget.** A first-order allpass has π radians to spend in
  total. Clamp its coefficient (`disp_lim`) or the delay piles up in the bass
  and the "pew" disappears; stretch it (z^-K) to spend the budget in the band
  that matters, and low-pass the loop input to hide the images. ADR 0005.
- **FDN total delay = modal density**, capped at 0.3 x T60 (once modes
  overlap, longer lines only make discrete echoes). ADR 0004.
- **Normalisation is analytic and exact for loops** (`loop_energy`), measured
  for the FDN (`FDN_E_CAL = 0.65`), then per-material trims (`trim_tab`) from
  `check.py --trims`. Any physics change moves loudness: re-run the trims,
  iterate twice (the soft ceiling compresses loud cases on the first pass). ADR 0007.
- Normalisation is computed at default Decay/Brightness (pass 1 of
  `rebuild`), so those controls still change level the way a real reverb does.
- Allocation happens only when Material, Size or Tuning change. Pass 2 must
  create waveguides and modes in exactly the same order as pass 1; it reuses
  their buffers by index. ADR 0011.

## Measurement traps

- **`pkill -f <pattern>` kills its own shell** when the pattern is in the
  command line. It did, once, here too.
- The runaway test compares tail energy late vs early *after the input stops*.
  At the extremes (Size 400 %, Decay 400 %, Tuning −12) decays last minutes,
  so "still loud at the end" is not instability. ADR 0013.
- `inspect` prints memory with `%.6g`; recovering a very low mode frequency
  from its `2r cos θ` coefficient loses precision there. Don't chase it.
