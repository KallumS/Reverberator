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
17. [Checking against the official JSFX reference](#17-checking-against-the-official-jsfx-reference)
18. [A twentieth material: bone](#18-a-twentieth-material-bone)
19. [State at the end of the session](#19-state-at-the-end-of-the-session)

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

(Kept current; see §19 for the latest state.)

- Do the interpretations in ADR 0014 match what they imagined (tam-tam,
  stretched hide, pedal-down piano, intact tibia...)?
- Listening feedback per material: decay length, brightness, rattle amount.
- Recordings of any real object tapped, to compare with the model.
- Whether a CLAP version is wanted, for use outside REAPER.
- The interface fixes (§17) and Bone (§18) have not yet been tried in
  REAPER; the first interface was loaded once (§16).

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

**Thread safety.** `@gfx` shares all global variables with the audio code,
so every GUI name is `ui_`-prefixed and the GUI calls only `ui_` functions —
the same lesson as §6, applied before it could bite. (This section first
said EEL2 locals are shared static storage; the official reference, read in
§17, says they are kept per code section. The `ui_` rule stands, for the
globals.)
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

## 17. Checking against the official JSFX reference

Before testing the interface in REAPER, the user supplied REAPER's JSFX
Programming Reference (10 pages) and its API function list. The plugin was
read against all of it. Confirmed correct: slider syntax (`:log=X`, `-`
hiding, enums), the ~8.4 M-slot memory limit (the pool ends at 8.3 M), string
slots 0–1023, `slider(i)` as an lvalue, the `slider_automate` mask
(bit n−1 for slider n), `mouse_cap` 8 = Shift, `mouse_wheel` 120 per notch,
`gfx_ext_retina` doubling `gfx_w` on macOS, `gfx_drawstr` flags, `gfx_arc`
and `gfx_circle` signatures, function declaration order, and every mixed
`&&`/`||` in the code (all parenthesised — the reference warns they have
equal precedence).

Found and fixed:

1. **Touch automation was never ended.** `slider_automate(mask, 1)` (6.74+)
   ends a touch pass; GUI gestures now call it when they finish.
2. **Font sizes below 8.** The reference allows 8–100; at small window sizes
   the knob labels went to 5. Now clamped.
3. **Text could clip.** `gfx_drawstr` clips to its box; several boxes were
   only a few pixels taller than the nominal font size, and REAPER's macOS
   fonts are taller than the test host's. Non-centred text now gets
   `gfx_texth` of extra room below.
4. **`gfx_rect`'s fifth argument** is in the API list but not the JSFX page;
   it was always 1 (filled), which is the default, so it is now omitted.
5. **A wrong statement in the docs**: §16, ADR 0016 and CLAUDE.md said EEL2
   locals are shared static storage. The reference says they are kept per
   code section. The `ui_` rule stands — it protects the shared *globals*.

Added, prompted by the reference: a compact view when embedded in REAPER's
track or mixer panel (`gfx_ext_flags & 1`); and `tools/gui_check.py`, nine
simulated-mouse tests checking engine variables (0 failures). Loudness is
unchanged (all materials −24.0/−24.1 LUFS); the audio code was not touched.

Noted, not changed: `@init` (and so a rebuild) runs on every transport
start, which clears the reverb tail when playback starts — normal for a
reverb; `ext_tail_size` could later tell REAPER how long the tail is.

## 18. A twentieth material: bone

The interface's 5 × 4 grid had one empty tile; the user asked for bone and
pointed to their Wind-Instrument-Creator repository, also allowing a web
search.

**Sources.** Wind-Instrument-Creator defines bone as E = 18 GPa,
ρ = 1900 kg/m³, η = 0.012 rising with frequency, `t_max` 2.5 s, and a rough
bore (factor 1.6) for air columns. A web search gave cortical bone's
longitudinal modulus as 15–24 GPa, wet bovine bone's loss factor under slow
loading as 0.035–0.1, the in-vitro first bending resonance of a human tibia
as 240–405 Hz with a second peak at 400–500 Hz, the Hohle Fels flute's
dimensions, and rhythm bones' sizes. Two papers could not be fetched (the
network proxy blocks their hosts); their figures are as summarised by search.

**Design** (docs/MATERIALS.md §6.4, ADR 0014): an intact dried tibia,
36 cm, because it has measurements to calibrate against.

**Measured / computed.**
- Plain free–free tube: f₁ = 559 Hz, above the measured range.
- Finite-element beam (160 elements), first checked against the plain-tube
  ratios 1 : 2.757 : 5.404 (exact), then with end masses: 0.1 → 431 Hz,
  0.2 → 379, 0.3 → 351, 0.4 → 332, 0.5 → 319, 0.7 → 303 Hz. Chosen 0.35 ×
  the 0.193 kg shaft per end (0.33 kg bone): **340 Hz**; ratios
  3.23, 6.87, 11.95, 18.48, 26.44.
- Non-round section: twin modes × 1.28 → 436 Hz, inside the measured
  400–500 Hz second peak.
- Rod models with the same ends: stretching 2648, 5868 Hz; twisting 849,
  2919 Hz (ends' polar inertia 1.81 × the shaft's).
- Sealed marrow cavity: air-column model extended to closed–closed
  (`ends = 0`); 26 cm × 6.5 mm → 653.6 Hz (−17 cents from c/2L by the
  boundary layer), T60 0.11 s.
- Read back from the plugin: all 16 mode frequencies matched the
  finite-element values to 0.1 Hz.
- η = 0.02 (between Wind-Instrument-Creator's dry value and the wet DMA
  range): T60 0.29 s at 340 Hz; broadband measured T60 0.28 s.
- CPU 6.4–6.7 %. Loudness −25.0 LUFS untrimmed → trim +1.0, then −24.5
  with the rattle active → +1.5 dB total.
- Rattle sensitivity swept: `rat_ref` 1 → −9.5 / +1.2 / +6.9 dB at Drive
  30/60/100 %; 2.5 → +0.4/…; 0.5 → −26.5/−5.3/+2.3; 0.35 → none/−10/−0.5;
  **0.7 → −15.8 / −1.9 / +4.7 dB**, chosen (the fence is −17/−4/+3).
- Interface: the tile loop now runs to 20; the "dense field" caption
  switched from `%.2f` to `%.2g` because bone's 0.002 modes/Hz printed as
  "0.00". `tools/gui_check.py` gained a test clicking the Bone tile (and the
  "empty space" test moved, since its old spot is now the Bone tile):
  10 tests, 0 failures.

## 19. State at the end of the session

All work is on branch `claude/material-reverb-plugin-b8ck1b`; no pull
request has been opened. Commits, oldest first: the plugin (`1a50a11`),
documentation (`30b6bc9`), the interface (`10c45ba`), fixes from the
official reference (`0213ebf`), bone (`274f158`), and this documentation
refresh.

**Verified (headlessly, with ysfx):**
- 20 materials, all −24.0 ± 0.1 LUFS on the test program; CPU 2–17 % of
  one core at 48 kHz (piano highest).
- Stability sweep: 0 failures (20 materials × 11 extremes at 48 kHz, plus
  44.1 and 96 kHz).
- Interface: drawn at 1× and 2× and at several window sizes; 10 simulated-
  mouse tests pass, each checking engine variables.

**Seen in REAPER by the user:** the first version only (§16, before the
interface) — it loaded and ran at 3.3 % CPU on the fence.

**Not yet tried in REAPER:** the interface (§16–17) and Bone (§18). The
likeliest differences are font metrics (REAPER on macOS uses real Arial).

**Open:** listening feedback per material; whether the ADR 0014
interpretations match what the user imagined; bone's damping (Decay can
lengthen it); a CLAP port if the plugin is wanted outside REAPER; the
5 × 4 tile grid is full, so a 21st material needs a layout change.

**Rebuilding the test rig in a new session:** `tools/build_host.sh`
(needs cmake, g++, freetype and fontconfig development libraries;
`pip install numpy scipy matplotlib`). The scratch harness used early in
this session lived outside the repository and is superseded by `tools/`.

