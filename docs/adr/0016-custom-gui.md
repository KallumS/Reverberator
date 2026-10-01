# 0016. A custom @gfx interface, with the default sliders hidden

- Status: Accepted
- Date: 2026-10-01

## Context

Loaded in REAPER, the plugin showed REAPER's default JSFX view: twelve
sliders in a list. The user asked for a GUI. A material reverb also has
something worth showing that sliders cannot: which resonances the chosen
object has, how long each rings, and which are ringing now.

JSFX draws interfaces in an `@gfx` section, which REAPER runs on its UI
thread. Two properties of that matter:

- **@gfx shares every variable with the audio code**, and EEL2 function
  `local()`s are static storage, not a stack. A GUI that used a variable
  named `s`, `p` or `i` — all used by the audio loops — or called an audio
  function concurrently would corrupt the audio engine, the same family of
  bug as ADR 0010.
- **Moving a slider from @gfx does not run @slider.**

## Decision

- An `@gfx 760 480` interface: a 5 × 4 grid of material tiles, the
  material's description, a "what's ringing" display, and eleven knobs
  (drag, shift-drag for fine, double-click for default, mouse wheel).
- The display plots every resonance on a log-frequency axis, height = its
  T60, brightness = how strongly it is ringing now (computed from each
  resonator's state); strings and air columns as teal partial series,
  dispersive paths and the dense field as bands; plus wet level meters.
- The default slider list is hidden (`-` prefix on every slider name). The
  sliders still exist, so automation, presets and **Param** all work.
- **Every @gfx variable and function is prefixed `ui_`**, and @gfx calls only
  `ui_` functions. Memory it reads (mode, waveguide and FDN tables) is
  written only by the audio thread.
- GUI changes set the slider, call `slider_automate` (for automation and
  undo) and raise `ui_changed`; `@block` then runs the same
  `apply_params()` that `@slider` runs, so rebuilds stay on the audio thread.
- Layout is in logical units scaled to the window (`ui_s`), with
  `gfx_ext_retina = 1`, so it is sharp on Retina and survives resizing.
- Mouse wheel uses REAPER's 120 units per notch.

## Consequences

- The interface was verified headlessly with `tools/build/gui` (ysfx with
  graphics): rendered at 1× and 2× and at 600 × 380 and 1100 × 500, and
  every interaction simulated — tile click, drag, shift-drag, double-click,
  wheel — checking that the *engine* variables changed, not just the slider.
- Not yet seen in REAPER itself, whose fonts (Arial) differ from the test
  host's fallback; the layout leaves room for that.
- Anyone editing @gfx must keep to the `ui_` rule; it is in CLAUDE.md.

## Alternatives considered

- **Keep REAPER's sliders**: works, but was what the user objected to, and
  shows nothing of the physics.
- **Leave the sliders visible under the GUI**: duplicates every control and
  makes the window much taller.
