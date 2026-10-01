# The physics

Every material in `Reverberator.jsfx` is specified by physical constants, and
the plugin derives its resonances, decay times and echo density from them when
the material is selected. This document gives the formulas, the numbers they
produce, and the places where the model is knowingly simplified.
`docs/MATERIALS.md` explains how each material's model was arrived at, and
`docs/adr/` records the design decisions.

SI units throughout. Air at 20 °C: c = 343.2 m/s, ρ = 1.204 kg/m³ (the same
constants as Trombolese's `constants.py`).

---

## 1. The three engines

### Waveguides — strings, wires, air columns

A delay loop one round trip long. In the loop: a Thiran allpass for the
fractional part of the delay, a one-pole lowpass for the losses, and a chain of
first-order allpasses for dispersion.

**Stiff strings.** A string with bending stiffness has partials

    f_n = n f0 sqrt(1 + B n²),   B = π³ E d⁴ / (64 T L²)

so its high partials run sharp, and a pulse travelling along it arrives
high-frequencies-first. The loop's group delay at partial n is the reciprocal
of the local partial spacing:

    T(n) = sqrt(1 + B n²) / ( f0 (1 + 2 B n²) )

The allpass coefficient is solved so the loop's group delay matches T at the
fundamental and at a partial near 4 kHz; then the integer delay and Thiran
fraction are solved so the loop's **total phase** at the fundamental is exactly
2π. Tuning against phase rather than a nominal length is the Trombolese lesson:
every filter in a loop adds phase, and ignoring it detunes the result.

**Air columns** (PVC pipe, toilet roll tube) use Trombolese's acoustics:

    α(f) = sqrt(π f) [ sqrt(ν) + (γ − 1) sqrt(ν / Pr) ] / (a c)     (boundary-layer loss)
    Re k = ω / c + α                                               (the same loss slows the wave)
    L_eff = L + 0.6133 a per open end                             (end correction)
    |R| ≈ exp(−(ka)² / 2) per open end                            (radiation)

The fundamental is solved from (ω/c + α)·2 L_eff = 2π, so it sits slightly
flat of c/2L_eff, as it does in a real tube. The loss per round trip at two
frequencies sets the loop's T60 curve. Cardboard multiplies the wall loss by 4.

**Dispersive paths** (ice sheet) are loops specified directly by group delay
at 250 Hz and 4 kHz.

**The dispersion budget.** A first-order allpass contributes π radians of phase
in total, so the area under its group-delay curve is fixed. A physically sized
ice chirp (≈100 ms spread between 250 Hz and 4 kHz over 70 m) would need about
a thousand stages. The plugin uses 96, *stretched* (z^−K) so their budget is
spent across 0–6 kHz rather than the whole band, and clamps the coefficient so
the delay spreads across the band instead of piling up in the bass. Each echo's
chirp is therefore shorter than nature's, but it has the right shape, and
because it recirculates, later echoes are progressively more smeared — which
is also what happens physically. The stretched allpass's images above 6 kHz are
kept out by a 4th-order lowpass on the loop input.

### Modes — the strong, individually audible resonances

Each mode is a two-pole resonator with its own frequency, decay, and gains to
the left and right outputs (from the mode shape at two pickup points). The
shapes used:

| Shape | Frequencies | Used for |
|---|---|---|
| Rectangular plate, simply supported, orthotropic | f = (π/2) sqrt( (Dx (m/Lx)⁴ + 2H (mn/LxLy)² + Dy (n/Ly)⁴) / ρh ) | glass, marble, car panel, tin roof |
| Circular membrane with air loading | f = j_mn / (2πa) · sqrt( T / (σ + 2ρ_air a / j_mn) ) | leather, cling film |
| Free circular plate | f = λ² / (2πa²) · sqrt(D / ρh), λ² from Leissa | gong |
| Clamped circular plate | as above, clamped λ² | barrel lids |
| Cylindrical shell ring modes | f_n = (h / (2π a² √12)) sqrt(E / ρ(1−ν²)) · n(n²−1)/sqrt(n²+1) | bottle wall, pipe wall, cardboard tube |
| Closed cylindrical cavity | f = (c/2) sqrt( (p/H)² + (α_mn / πa)² ) | barrel air |
| Helmholtz resonator | f = (c/2π) sqrt( A / (V L_eff) ) | wine bottle, handpan port |
| Clamped–clamped beam | 1 : 2.757 : 5.404 | chain-link mesh links |
| Free–free tube with heavy ends | finite-element table: 1 : 3.23 : 6.87 : 11.95 : 18.48 : 26.44 × 0.609 f₁(plain tube) | bone shaft (and rods for its twisting/stretching) |

with D = E h³ / 12(1 − ν²) for a plate.

**Air loading** is what makes cling film interesting. A membrane moving with
spatial wavenumber k drags roughly 2ρ_air/k of air per square metre with it.
For a drum skin (1.08 kg/m²) that lowers the fundamental by a few per cent; for
12-micron polyethylene (0.011 kg/m²) the air outweighs the film ~14 times, the
fundamental falls from ~94 Hz to ~25 Hz, and the modes radiate their energy
away almost at once. The same ratio sets each mode's radiation damping.

### Dispersive FDN — the dense field above the modes

Eight delay lines, mixed by an 8-point Hadamard matrix, each with a one-pole
loss filter and four allpass dispersion stages.

The **total delay of the network equals the material's modal density.** A
feedback network with total delay T seconds has T resonances per hertz; a thin
plate has

    n = (S / 2) sqrt(ρh / D)    resonances per hertz, at every frequency

(orthotropic: n = (S/2) sqrt(ρh) / (Dx Dy)^¼). So the plate's area, thickness
and material set how dense and how "metallic" versus how "smooth" the tail is.

Two limits apply. Once the damping is so high that neighbouring modes overlap
(foil, leather), extra density is inaudible, and long lines would sound like
discrete echoes; the total delay is capped at 0.3 × T60. And it is capped at
3 s for memory.

### Losses

Structural damping is a loss factor η: each mode loses energy at σ = π f η,
so

    T60(f) = 2.2 / (f η)

capped by a `tmax` that stands for the losses η does not describe (supports,
radiation, air). Higher modes therefore die faster, which is most of what makes
glass sound like glass and leather sound like leather.

| Material | η used | T60 at 200 Hz | T60 at 4 kHz |
|---|---|---|---|
| Bronze (gong) | 0.0004 | 16 s | 1.3 s |
| Glass | 0.0008 | 4.2 s | 0.6 s |
| Steel wire | 0.0004 | 10 s | 1.3 s |
| Marble | 0.003 | 1.5 s | 0.17 s |
| Car panel steel | 0.003 | 1.5 s | 0.17 s |
| Leather | 0.06 (+ radiation) | ~0.1 s | — |
| Cling film | 0.12 (+ air radiation) | ~0.05 s | — |
| Dry bone | 0.02 | 0.45 s | 0.03 s |

### Level-dependent behaviour (the Drive control)

- **Rattle** (fence, car panel, tin roof, cling film): once the vibration
  exceeds a gap, the excess becomes contact chatter — a dead-zone
  nonlinearity, high-passed. In the fence it excites the mesh-link modes. A
  rattle is never fed back into the engine it is driven by, which keeps the
  model unconditionally stable.
- **Crackle** (foil): random crinkle events whose rate rises with input level.
- **Shimmer** (gong, handpan, barrel): the square of the modal output feeds the
  dense field — geometric nonlinearity pumping energy upward, the tam-tam's
  delayed bloom.
- **Pitch glide** (gong, leather, cling film): mode frequencies rise with
  vibration amplitude (tension modulation) and relax as it decays.

---

## 2. The materials, in numbers

Values derived by the plugin at 48 kHz, Size 100 %, Tuning 0.

| Material | Physical specification | Derived |
|---|---|---|
| Chain link fence | line wires 4 mm steel, 3.0/3.4 m, 1.5 kN; links 2.5 mm, 55–85 mm | wire f0 ≈ 20 Hz, B ≈ 1.8e−3; link modes from 1.55 kHz; FDN 40 ms |
| Ice sheet | 5 cm ice, E = 9 GPa, ρ = 917; shore paths 70 and 96 m round trip | c_g = 2 (D/ρh)^¼ √ω: 548 m/s at 250 Hz, 2190 m/s at 4 kHz; loops 30–42 ms; FDN 250 ms |
| Tension wire | 2.5 mm steel, 25 and 31 m, 2 kN | f0 ≈ 4.6 / 3.7 Hz, B ≈ 3e−6; round trips 0.22 / 0.27 s at low frequency |
| Gong | bronze, a = 0.4 m, h = 3 mm, E = 110 GPa | (2,0) mode 17 Hz; 22 modes; modal density 0.076 /Hz → FDN 76 ms |
| PVC pipe | 1.5 / 1.62 m, 52 mm bore, open–open; wall 3.5 mm PVC | f1 ≈ 112 Hz; wall ring modes 766 Hz, 2.17 kHz… |
| Glass | 800 × 600 × 5 mm, E = 70 GPa | lowest mode 52 Hz; 32 modes; FDN 31 ms |
| Marble | 1000 × 600 × 20 mm, E = 55 GPa | lowest mode 161 Hz; FDN 11 ms (sparse) |
| Car body panel | 0.8 mm steel, 1.1 × 0.8 m, ring frequency 340 Hz | low modes bunched at 340 Hz; FDN 355 ms (dense) |
| Leather | a = 0.2 m, 1.08 kg/m², 1.5 kN/m | (0,1) 67 Hz, then 106, 146 Hz… (Bessel ratios) |
| Wine bottle | 750 ml, neck r = 9.5 mm, 80 mm; wall 4 mm glass | Helmholtz 109 Hz; body 858, 1716 Hz; wall 1.95 kHz… |
| Piano string | C2–B3, 800 N, L up to 1.9 m, d 1.0–1.2 mm | B = 7e−5 … 3e−4; soundboard FDN 66 ms |
| Guitar string | E2–E4, 648 mm, 110 N | body 97, 204, 225, 381 Hz… |
| Violin string | G3–E5, 328 mm | body 275 (A0), 405, 460, 550 Hz…, bridge hill 2.1–3.3 kHz |
| Steel handpan | D Kurd, 1 : 2 : 3 per note; 1.2 mm nitrided steel | Gu 84 Hz; notes 147–440 Hz; FDN 119 ms |
| Toilet roll tube | 100 / 104 mm long, 44 mm across, cardboard | f1 ≈ 1.3 kHz; wall 793 Hz, 2.24 kHz |
| Aluminium foil | 300 × 450 mm, 16 µm | modal density 2.7 /Hz, capped by overlap → FDN 105 ms |
| Cling film | a = 0.15 m, 12 µm LDPE, 15 N/m | (0,1) 25–29 Hz after air loading |
| Corrugated tin roof | 0.5 mm steel, 18 mm ribs, 0.9 m purlin bays | Dx/Dy ≈ 1800; lowest mode 64 Hz; FDN 393 ms |
| Metal barrel | 572 × 851 mm, 1.2 mm steel | cavity 201, 352, 403 Hz…; lids from 102 Hz; FDN 412 ms |
| Bone | dried tibia, 360 mm, radii 11.5 / 6.5 mm, E = 18 GPa, ρ = 1900, end masses 0.35 × shaft | bending 340 (twin 436), 1099, 2340 Hz…; twisting 849 Hz; stretching 2648 Hz; sealed cavity 654 Hz |

## 3. Measured behaviour

From `tools/check.py` (48 kHz, default controls). T60 from Schroeder
integration of the impulse response; long decays are extrapolated from the
first −35 dB and are approximate. CPU is one core of the build container, as a
percentage of real time.

| Material | T60 | CPU |
|---|---|---|
| Chain link fence | 2.5 s | 12 % |
| Ice sheet | 0.8 s | 14 % |
| Tension wire | 11 s | 14 % |
| Gong | 12 s | 7 % |
| PVC pipe | 0.08 s | 2 % |
| Glass | 3.8 s | 7 % |
| Marble | 1.6 s | 7 % |
| Car body panel | 1.1 s | 6 % |
| Leather | 0.25 s | 8 % |
| Wine bottle | 0.6 s | 6 % |
| Piano string | 12 s | 16 % |
| Guitar string | 5.0 s | 9 % |
| Violin string | 1.6 s | 7 % |
| Steel handpan | 3.1 s | 7 % |
| Toilet roll tube | 0.07 s | 2 % |
| Aluminium foil | 0.7 s | 6 % |
| Cling film | 0.15 s | 8 % |
| Corrugated tin roof | 1.6 s | 7 % |
| Metal barrel | 2.1 s | 8 % |
| Bone | 0.28 s | 7 % |

## 4. Loudness

Each engine is normalised to unit impulse-response energy — exactly, using the
closed form for a loop whose only non-allpass element is a one-pole,

    E = b² / sqrt( (1 + p² − b²)² − 4p² )

(the frequency average of |H|² / (1 − |H|²)), and for the FDN with a measured
factor of 0.65. The per-material weights between engines are therefore true
power proportions. A final per-material trim, measured with `tools/check.py`,
brings every material to the same loudness (−24 LUFS for the −6 dBFS-peak test
program). The normalisation is computed at the default Decay and Brightness, so
those controls still make the reverb louder or quieter the way a real one does.

## 5. Known simplifications

- **Chirps are shorter than nature's**, for the budget reason in §1.
- **Plates are simply supported**, not free: free-edge plates have slightly
  different mode ratios and there is no closed form. The difference is
  small beside the choice of dimensions.
- **Mode shapes for circular plates** use only their angular part.
- **The gong's lowest modes are sub-audio** (17–30 Hz); the audible gong is the
  dense field and the shimmer. A tuned nipple gong would be a different model.
- **Leather** is modelled as a stretched hide (a drum skin). Slack leather is
  simply a very short thud — less interesting and not much different.
- **Crumpled foil's** random facet geometry is represented statistically (a
  dense, heavily damped field plus random crackle), not simulated.
- **The rattle** is a dead-zone at the output, not a collision model; it
  captures the level threshold and the broadband chatter, not the timing of
  individual impacts.
