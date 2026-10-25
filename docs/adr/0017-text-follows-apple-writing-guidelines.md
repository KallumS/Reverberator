# 0017. The window's text follows Apple's writing guidelines

- Status: Accepted
- Date: 2026-10-14

## Context

The user asked for the text in every one of their apps and plugins to follow
Apple's Human Interface Guidelines on writing
(developer.apple.com/design/human-interface-guidelines/writing), as was done
for Noterator and Miderator (Noterator's decision 0053). Reverberator's
window mixed styles: material tiles in sentence case ("Chain link fence"),
a subtitle and a hint line in lower case, straight quotes and apostrophes
("WHAT'S RINGING", 'pew'), and "off" as a value.

## Decision

One style for each kind of text:

- **Names and labels** — the material tiles and names, slider names
  (REAPER shows them in automation and parameter lists even though they are
  hidden), the plugin's description line — in title-style capitalization:
  "Corrugated Tin Roof", "Pre-Delay (ms)", "Low Cut (Hz)". Units in
  brackets stay as written (ms, Hz, %).
- **Descriptions, the subtitle, the status line and the hint line** in
  sentence case; fragments take no full stop: "Physically modelled material
  reverb", "Drag a knob up or down · Shift-drag for fine control ·
  Double-click to reset · Scroll to adjust".
- **Values** that are words start with a capital ("Off").
- **Typography**: curly quotes and apostrophes (“pew”, WHAT’S RINGING), an em
  dash between phrases. In running text modifier keys are spelled out
  ("Shift-drag"), since the plugin runs on Windows as well as the Mac.
- The knob captions stay in capitals, a deliberate look, and keep their
  short forms (BRIGHT, TUNE): the full words do not fit an eleventh of the
  width.

## Consequences

- No slider is renumbered, reordered or re-ranged, and the Material slider
  keeps its twenty values in the same order: saved projects and automation
  are untouched. Only the words REAPER shows change.
- `tools/analyse.py`'s `NAMES` follows the plugin's names, so rendered demos
  are named the same way.
- New text follows the same rules. Check it fits by rendering the window
  (`tools/build/gui` then `tools/gui_png.py`), since `gfx_drawstr` clips.

## Alternatives considered

- Lower-case knob captions to match the slider names — rejected: the
  capitals are the window's look, and the HIG asks for consistency within an
  app, which the captions already have.
