# Reverberator for Ableton Live

A Max for Live audio effect. Its sound is `Reverberator.jsfx` translated to gen~, held sample for sample to the JSFX; its window is the JSFX's own.

## Installing

Needs **Live 12.1 or later with Max for Live** (Live Suite, or Standard with
the add-on): the device runs on Max 9's JavaScript engine (`[v8ui]`).

1. Copy `Reverberator.amxd`, `Reverberator.js` and `Reverberator.maxpat` into one folder, for
   example `Music/Ableton/User Library/Presets/Audio Effects/Max Audio Effect/`. The `.amxd` finds
   `Reverberator.js` beside it.
2. Drag `Reverberator.amxd` onto an audio track, or a return track (fully wet there).
3. Optional: open it in the Max editor and click **Freeze Device**, then save.
   The device then carries the script inside it and can be moved on its own.

## Using it

![Reverberator's window, drawn by the device's own code on a stand-in for Max](window.png)

| | |
| --- | --- |
| **Show Window** | Opens Reverberator's own window: the twenty materials, what is ringing, and the knobs. Click and drag work as they do in REAPER. |
| The device | Audio in, the material's reverb out. Every material and knob is the JSFX's. |

The material and every knob are saved with the Live set.

## How it is built

`ableton/device.json` describes the device; `python3 ableton/kit/build.py
ableton/device.json` writes the `.amxd`, the `.maxpat` and the script bundle
`Reverberator.js`. The bundle is Middaw's EEL2 runtime and `Reverberator.jsfx` for the window; the gen~ code inside the device is `Reverberator.jsfx` translated by `ableton/kit/jsfx2gen.js` at build time. See `ableton/kit/VENDORED.md`.

`node --test ableton/tests/test_device.js` reads the gen~ code back out of the built device and runs it as JavaScript beside Middaw's runtime running `Reverberator.jsfx`: all twenty materials, sample for sample, within 10⁻⁶ (they agree to about 3 × 10⁻⁸). It also checks the window draws and answers clicks, every slider reaches gen~ once and again when it moves, and the state comes back. `node ableton/window.js` redraws the picture above from the device's own drawing code (it needs Playwright's Chromium).

## Limits

- **It has not been opened in Live yet.** It is tested in Node against a stand-in for Max and the Live Object Model; nothing has run in Max. If the `.amxd` will not open, open `Reverberator.maxpat` in Max and save it as a device.
- **gen~ has not compiled this code yet.** The tests run the very text in the device as JavaScript and match Middaw's runtime to within 10⁻⁷, but only Max can say gen~ accepts it. If it does not, the Max window names the line; `ableton/kit/jsfx2gen.js` is where to fix it.
- The window's controls are not Live parameters, so they cannot be automated or mapped; they are saved with the set.
- Anything the window draws from the sound itself (a meter, a scope) stays still: the window's copy of the plug-in does not hear the audio.
- The VST3/CLAP plug-in on the `plugin` branch also runs in Live, already compiled and tested; this device is the Max for Live alternative.
