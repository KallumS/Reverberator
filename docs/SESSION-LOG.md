# Session log

A record of the session that took this repository from a licence file to a
working, measured plugin. `CLAUDE.md` is the distillation; this is the
archive. Numbers here came out of runs in this repository unless marked
otherwise. Decisions are cross-referenced to `docs/adr/`.

**Contents**

1. [The brief](#1-the-brief)
2. [Reading Trombolese](#2-reading-trombolese)
3. [Format and test rig](#3-format-and-test-rig)
4. [Designing the physics](#4-designing-the-physics)
5. [First compile, first render](#5-first-compile-first-render)
6. [The piano bug](#6-the-piano-bug)
7. [Normalisation](#7-normalisation)
8. [Loudness trims](#8-loudness-trims)
9. [The stability sweep](#9-the-stability-sweep)
10. [Looking at the sound: the ice sheet](#10-looking-at-the-sound-the-ice-sheet)
11. [Calibrating Drive](#11-calibrating-drive)
12. [Final state](#12-final-state)
13. [Documentation pass](#13-documentation-pass)
14. [Dead ends and corrections](#14-dead-ends-and-corrections)
15. [Open questions for the user](#15-open-questions-for-the-user)
16. [First run in REAPER, and the interface](#16-first-run-in-reaper-and-the-interface)

---

## 1. The brief

Build a reverb plugin, JSFX or CLAP, that simulates sending sound through odd
materials, the way plate and spring reverbs send it through steel: chain link
fence, ice sheet, tension wire, gong, PVC pipe, glass, marble, car body panel,
leather, wine bottle, piano string, guitar string, violin string, steel
handpan, toilet roll tube, aluminium foil, cling film, corrugated tin roof,
metal barrel. The user's other repository, Trombolese, was offered as a
physics reference. The user describes themselves as not technical.

The repository started with only `LICENSE` (MIT).

## 2. Reading Trombolese

Trombolese is a physical model of a trombone/oboe hybrid whose bore morphs
from cylinder to cone. Its stage 1 is a NumPy transfer-matrix model of the
bore; stage 2 a Kelly–Lochbaum waveguide with a morphable reed; a Faust port
was transliterated but not compiled. What was carried over:

- **Air physics** (`acoustics.py`, `constants.py`): Kirchhoff wide-tube
  boundary-layer loss α = √(ω/2) [√ν + (γ−1)√(ν/Pr)] / (a c), the fact that
  the same loss slows the wave (Re k = ω/c + α), the unflanged end correction
  0.6133 a, and air constants at 20 °C. Used for the PVC pipe and toilet roll
  tube.
- **Two waveguide lessons**: dispersion must be distributed through the loop,
  not lumped; and pitch is decided by the loop's total phase, including its
  filters (Trombolese's ladder was 25–60 cents sharp until it modelled the
  boundary layer's extra delay). → ADR 0005, 0006.
- **Working method**: "compiling is not evidence"; measure, don't reason; keep
  a CLAUDE.md of traps and a session log.
- **A trap**: `pkill -f <pattern>` kills its own shell. (It was then hit here
  anyway — §6.)

## 3. Format and test rig

**JSFX was chosen** (ADR 0001): single file, no build, the user is in REAPER.

REAPER is not available in the container, and the author cannot listen, so a
way to *run* the plugin was needed (ADR 0009). **ysfx** (JoepVanlier's
maintained fork), which embeds REAPER's EEL2 JIT, was cloned and built
headless (`-DYSFX_PLUGIN=OFF -DYSFX_GFX=OFF`). A 60-line C++ host,
`render`, was written: raw float32 stereo in and out, sliders as
`index=value`, reporting CPU and non-finite samples. A trivial gain JSFX
confirmed it: 0.25 in, 0.25 out.

numpy/scipy/matplotlib were installed for analysis.

## 4. Designing the physics

The design settled before any code:

- **Three engines** (ADR 0003): waveguides for 1-D media, a modal bank for
  strong resonances, a dispersive 8-line FDN for dense fields.
- **Every material from physical constants** (ADR 0002), with textbook models:
  stiff strings (B = π³Ed⁴/64TL²), air columns (Trombolese), simply-supported
  and orthotropic plates, circular membranes with air loading, free and
  clamped circular plates (Leissa's λ²), cylindrical-shell ring modes,
  closed-cylinder cavities, Helmholtz resonators, clamped–clamped beams.
- **FDN total delay = modal density** (ADR 0004).
- **Decay from loss factor**: T60 = 2.2/(fη), capped by `tmax`.
- **Dispersion** by allpass chains solved from group delay at two
  frequencies; loops tuned by exact phase (ADR 0005, 0006).
- **Nonlinearities** (rattle, crackle, shimmer, glide) feed-forward only
  (ADR 0008).
- **Controls**: Material, Mix, Size, Decay, Brightness, Tuning, Pre-delay,
  Drive, Width, Low cut, High cut, Output.
- **Material interpretations** (ADR 0014): tam-tam, stretched hide,
  pedal-down piano, all open strings, long guy wires, lake ice.

Hand calculations at this stage that later held up: wine bottle Helmholtz
≈ 110 Hz; ice flexural group velocity 548 m/s at 250 Hz vs 2194 m/s at 4 kHz;
cling-film air loading 13.7× its own mass; tin roof 1770× stiffer along its
ribs; piano B of 7 × 10⁻⁵ to 3 × 10⁻⁴.

The full plugin, ~1000 lines of EEL2, was then written in one pass.

## 5. First compile, first render

**First compile failed**: `NU_AIR = 1.506 <!> e-5` — EEL2 has no scientific
notation. A script replaced 37 literals with decimals (ADR 0010).

**First render**, an impulse through each material, 3 s at 48 kHz:
materials 0–9 rendered in 4.4–13.3 % of real time with no non-finite samples.
Material 10 (piano) did not finish in five minutes.

## 6. The piano bug

- 0.1 s of piano took **45.6 s** to render (45 620 % of real time); guitar
  587 %; fence 12 %. With *silent* input the piano was fast (15 %): the problem
  was signal-dependent.
- A first attempt to stop the stuck render with `pkill -f "harness/render
  Reverberator"` killed the shell running it (exit 144) — the Trombolese trap,
  repeated.
- An `inspect` tool was written: load, set sliders, run N blocks (optionally
  with an impulse, optionally one sample per block), print variables and
  memory ranges.
- Setup values were sane. After an impulse, by block 3 the waveguide
  descriptor table (memory 0–479) was mostly zeros and the allpass state held
  values of 10²³⁰.
- At block size 1, the FDN was fine through its first echo (sample 154).
  Bisection on "any static descriptor field changed" found the **first
  corrupted sample: 170**, where every waveguide descriptor had changed at
  offsets 1, 4 and 8 — the pattern of the waveguide loop's own writes
  (offsets 2, 5, 9) shifted by −1.
- **Cause**: EEL2 identifiers are case-insensitive. `WGM` (the table's base
  address, 0) and `wgM` (the waveguides' mono output) were one variable. With
  output below ±1 the address truncated to 0 and everything worked; the
  piano's 24 strings summed past ±1 and the table moved.
- **Fix**: memory-map constants renamed (`WG_BASE`, `MOD_BASE`, `FDN_BASE`,
  `FDN_TMP`, `FDN_SIGN`, `PLATE_TMP`, `BESSEL_TAB`, `BIQ`...), signals renamed
  (`wg_mono`, `mod_mono`, `fdn_mono`), and case-only pairs inside functions
  (`d`/`D`, `k`/`K`, `h`/`H`) removed (ADR 0010).

After the fix all 19 materials rendered in 2.1–15.3 % of real time.

## 7. Normalisation

IR energies with the first normalisation ranged from 0.002 (ice) to 0.70
(foil). Each engine was then measured alone (a debug copy with an extra
slider to mute the others), 12 s impulse, expected energy 1:

| engine | measured | verdict |
|---|---|---|
| modes | 0.27–1.51, mostly 0.92–1.01 | correct; outliers are clustered or degenerate pairs |
| waveguides | 0.006–0.19 | wrong |
| FDN | 0.025–0.24 | wrong |

The loop estimate had used the loop gain at 1 kHz; a lossy loop's energy is
dominated by where it rings longest. Replaced by the exact closed form
E = b²/√((1+p²−b²)² − 4p²) (ADR 0007). Re-measured: waveguides 0.93–0.97
(tubes 0.33 and 1.60), FDN 0.48–0.77, so `FDN_E_CAL = 0.65`.

## 8. Loudness trims

`tools/test_signals.py` synthesises a program: one bar of drums (pitched-sweep
kick, noise snare, hats) twice at 120 bpm, a Karplus–Strong D-minor arpeggio,
then silence; −6 dBFS peak; −23.6 LUFS dry. `tools/check.py` measures
K-weighted loudness (BS.1770 filters, ungated).

First wet measurement: −27.0 (foil) to −11.4 LUFS (wine bottle). Leather,
wine bottle, toilet roll tube and barrel were ~12 dB hot and hitting the soft
ceiling on 1.5–3.9 % of samples. Trims to −24 LUFS were applied; a second
pass corrected the ones the ceiling had compressed (PVC −2.3, leather −4.4,
bottle −4.5, tube −2.2, barrel −0.5 dB). Result: all −24.0.

## 9. The stability sweep

19 materials × 11 extremes (Size 25/400, Decay 10/400, Brightness ±100,
Tuning ±12, Drive 0/100, and Size 400 + Decay 400 + Tuning −12) at 48 kHz,
plus defaults at 44.1 and 96 kHz, input 5 dB hotter than calibration.

- **No non-finite sample in any case.**
- Criterion "output pinned at the ceiling": 20 flags, all simply loud.
- Criterion "last 0.5 s still loud": 4 flags, all the Size 400 + Decay 400 +
  Tuning −12 combination on long-decay materials, where T60 reaches minutes.
- Criterion "energy grows after the input stops" (ADR 0013): **0 failures**.

## 10. Looking at the sound: the ice sheet

An impulse-response spectrogram grid of all 19 materials showed: the tension
wire's textbook train of descending chirps; harmonic lines for guitar and
violin; long dense decays for gong and piano; crackle bursts for foil. But
**no visible chirps for the ice sheet** (or the fence).

Zoomed on the ice's waveguides alone: chirps existed but were squashed into
the bottom ~1 kHz and gone within 0.3 s. Two causes:

1. the allpass coefficient had hit its −0.9 clamp, which concentrates the
   delay in the bass — the **dispersion budget** (ADR 0005);
2. η = 0.004 gave T60 = 0.13 s at 4 kHz.

Fix: stretched allpasses (K = round(fs/12 kHz), 4 at 48 kHz), coefficient
clamped at −0.72, 4th-order input lowpass at 4.5 kHz for the images, η 0.001
(T60 0.42 s at 4 kHz). The spectrogram then showed proper chirps, vertical at
the top and curving into the bass, repeating. Achieved dispersion per bounce:
41 of 96 ms (43 %). The fence's chirps were present, just dense.

The car panel's decay (0.63 s broadband) was judged too short to be useful;
η was halved from 0.006 to 0.003 (a bare painted panel), giving 1.06 s.

## 11. Calibrating Drive

The nonlinear share of the output was measured as (output at drive d −
output at drive 0), relative to the drive-0 output, on the test program.
First version, at Drive 100 %:

| | gong | barrel | fence | roof | handpan | foil | cling | car |
|---|---|---|---|---|---|---|---|---|
| dB | +4.9 | +2.7 | −14.1 | −12.0 | −16.7 | −3.0 | −1.0 | −∞ |

Shimmer too strong, rattles too weak, the car never rattled. Changes:
shimmer gain ∝ d² with factor 1.2; rattle gain = amount × `rat_ref` ×
(0.3 + 12d + 30d²) with output ÷ √(1 + 0.5 × gain); `rat_ref` found by
sweeping 1, 2, 4:

| material | rat_ref | 30 % | 60 % | 100 % |
|---|---|---|---|---|
| fence | 1.2 | −17.2 | −3.6 | +3.1 dB |
| car panel | 4 | −22.8 | −4.9 | +1.9 dB |
| cling film | 0.35 | −16.8 | −7.0 | −1.9 dB |
| tin roof | 1.4 | −15.5 | −8.5 | −3.4 dB |

(An intermediate car setting of 3.5/0.4 double-counted `rat_amt` and put the
rattle at −7.6 dB at 30 %; corrected to 4.)

Trims re-measured after these changes: ice +5.5 dB (its retune made it
quieter), fence −0.3, gong +0.3, barrel +0.7, then car +0.7 and roof −0.2.

## 12. Final state

Committed as `1a50a11` on `claude/material-reverb-plugin-b8ck1b`.

- 19 materials, all at −24.0 ± 0.1 LUFS on the test program.
- CPU 2.1 % (PVC pipe, toilet roll tube) to 16.9 % (piano) of one core, 48 kHz.
- Stability sweep: 0 failures.
- Derived values read back from the plugin matched hand calculations: bottle
  109.6 Hz, guitar air mode 97 Hz, handpan Gu 84 Hz, gong (2,0) 17.2 Hz,
  barrel cavity 201.6 Hz, roof bay 63 Hz.
- Measured T60s: 0.07 s (toilet roll tube) to 12.5 s (piano, gong).
- Converting `200000000000` literals back to `200*10^9` was verified
  bit-identical on four materials.
- `tools/build_host.sh` verified from a clean directory: 26 s.
- 20 demo WAVs (35 MB) rendered and sent to the user; not committed
  (ADR 0015).

## 13. Documentation pass

At the user's request, after the plugin was delivered:

- `docs/MATERIALS.md`: how the physics of each material was arrived at, with
  every number recomputed by a script mirroring the plugin's formulas, and the
  dispersion actually achieved against what the physics asks for (fence
  94 %, tension wire 62 %, ice 43 %, bass piano strings 43 %, treble piano
  100 %).
- `docs/adr/`: fifteen decision records and an index.
- This log.
- `CLAUDE.md` updated with the new documents and a checklist for changing a
  material.

Writing `MATERIALS.md` caught imprecisions in earlier text, corrected in the
docs: marble is *not* stiffer per unit mass than glass (its larger D comes
from thickness cubed); the handpan's 85 Hz Gu is a typical value, not derived;
`PHYSICS.md`'s T60 table had marble and car at 1.8–1.9 s at 200 Hz where the
code gives 1.5 s (fixed during the first session).

## 14. Dead ends and corrections

- **Loop energy from the 1 kHz gain**: wrong by up to 150×; replaced by the
  closed form.
- **Allpass coefficient clamped only at −0.9**: legal but useless for chirps;
  the budget needs a band (stretch) and a gentler clamp.
- **Linear-in-Drive shimmer**: overwhelmed the gong at full Drive.
- **Ceiling-based and tail-level stability criteria**: could not tell a
  minutes-long decay from a runaway.
- **`pkill -f`** on a pattern in its own command line.
- **Fitting loss filters at two non-zero frequencies** was considered and
  rejected before it was used: it can put DC gain above 1 (ADR 0006).

## 15. Open questions for the user

- Do the interpretations in ADR 0014 match what they imagined (tam-tam,
  stretched hide, pedal-down piano...)?
- Listening feedback per material: decay length, brightness, rattle amount.
- Recordings of any real object tapped, to compare with the model.
- Whether a CLAP version is wanted, for use outside REAPER.
- The plugin's custom interface has not yet been seen inside REAPER (§16).

## 16. First run in REAPER, and the interface

The user loaded the plugin in REAPER (macOS). It loaded and ran — REAPER's
performance readout showed **3.3 %** for the chain link fence — but showed
REAPER's default JSFX view, a list of sliders, which the user read as "no
GUI". That was accurate: no `@gfx` section had been written.

**Verification first.** ysfx was rebuilt with graphics (`-DYSFX_GFX=ON`,
linking freetype and fontconfig) and a third host, `tools/gui.cpp`, written:
it runs `@gfx` into a framebuffer at any size and Retina scale, replays
mouse events, steps audio in between, and prints sliders and chosen engine
variables. `tools/gui_png.py` turns the framebuffer into a PNG.

**Design** (ADR 0016): material tiles, the material's one-line description,
a "what's ringing" plot of every resonance (height = T60, glow = current
amplitude, recovered from each resonator's two state values as
√((y₁² + y₂² − 2y₁y₂ cos θ)/sin²θ)), wet meters, and eleven knobs. The
default sliders are hidden with a `-` prefix.

**Thread safety.** `@gfx` shares all variables with the audio code and EEL2
locals are static, so every GUI name is `ui_`-prefixed and the GUI calls only
`ui_` functions — the same lesson as §6, applied before it could bite.
Because `@slider` does not run for GUI changes, its body became
`apply_params()`, called from `@slider` and from `@block` when `ui_changed`
is set.

Engine changes to feed the display: modes store frequency and T60
(`p[10]`, `p[11]`); waveguides store fundamental and T60 (`p[18]`, `p[19]`)
and a peak-hold of their output (`p[20]`), so `WG_STRIDE` grew from 20 to 24;
the FDN publishes its density and T60; `@sample` keeps wet and dense-field
peak meters.

**Measured.**
- First render was usable as drawn; polish: the dense-field band was made
  translucent with an edge line, and knob labels moved to a smaller bold
  font after "PRE-DELAY" nearly touched its neighbours.
- Interactions, each checked against engine variables: clicking the Glass
  tile → `mat` = 5, 32 modes built; dragging Mix up 100 px → 85 %,
  `wet_t` = 1, `dry_t` = 0.3; shift-drag 100 px → +5 %; double-click on
  Decay at 200 % → 100 %, `tsc` = 1; Low cut dragged to the top → 1000 Hz,
  filter on; the same tile click at Retina scale 2 → correct material.
- The wheel first appeared to jump to the maximum: ysfx scales a wheel step
  to 512 units where REAPER uses 120. One ysfx step = 4.3 REAPER notches;
  the plugin follows REAPER.
- Rendered at 600 × 380 and 1100 × 500: scales and centres correctly.
- Full check and stability sweep re-run after the engine changes: loudness
  table unchanged (all −24.0 ± 0.1 LUFS), CPU unchanged (2.3–17.1 %),
  **0 failures**.

