# 0018. VST3 and CLAP by wrapping the JSFX, not rewriting it

- Status: Accepted
- Date: 2026-10-24
- Number: made as 0017 alongside the writing decision of the same number;
  renumbered 0018 on 2026-11-01.

## Context

The user asked for Reverberator as a VST3 and CLAP plugin for the Mac, built
by GitHub Actions. Everything measured about it (loudness trims, T60s, the
stability sweep, the interface checks) was measured on the JSFX running in
ysfx, which embeds REAPER's own EEL2 engine.

## Decision

`plugin/` is a small JUCE plugin that compiles `Reverberator.jsfx` in as data
and runs it with ysfx (JoepVanlier/ysfx, pinned in `plugin/build.sh`, with
the same two key fixes `tools/` makes). Its window is ysfx's `@gfx` view and
nothing else. Every slider, hidden ones included, is a host parameter that
holds the slider's own value (snapped to its step), so automation, presets
and saved projects round-trip exactly; the project also keeps `@serialize`
data, as REAPER does. Sliders the window moves are reported to the host.

The same wrapper serves Instrument Creator; each repository keeps a copy
(`plugin/source/`, `plugin/wrapper.cmake`), configured in
`plugin/CMakeLists.txt`.

## Consequences

- The plugin sounds as the JSFX does and needs no re-measuring. A change to
  the JSFX reaches the plugin at the next build.
- JUCE 8 is under the AGPL v3 (or a commercial licence); the plugin binaries
  are therefore AGPL-3.0 as well as GPL-3.0. Fine while the source is public.
- Not signed or notarised (no Apple developer account): the user clears the
  quarantine flag once (INSTALL.txt). Signing needs the account's
  certificate as repository secrets.
- Mac only, as asked. Windows and Linux would be the same build on other
  runners.
- Audio Unit (Logic) is one word in `FORMATS` away, plus `auval` in the
  workflow; not asked for.
- clap-validator's `state-invalid` test is skipped: JUCE's
  `setStateInformation` cannot report a failed load.

## Alternatives considered

- Rewriting in C++: every measurement redone, two programs to keep in step.
- ysfx's own plugin: a general JSFX host with its own editor, file browser
  and preset UI around the window; too much to strip, and it loads the file
  from disk rather than from inside the plugin.
- CLAP with clap-wrapper and a hand-made window instead of JUCE (no AGPL):
  more code and risk; the user chose JUCE.
