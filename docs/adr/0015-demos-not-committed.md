# 0015. Audio demos are generated, not committed

- Status: Accepted
- Date: 2026-09-30

## Context

The demo WAVs (the synthesised test program through all 19 materials, plus
dry) total about 35 MB at 48 kHz / 16-bit, and change whenever any material
is retuned. Trombolese committed its audio, but it had six files.

## Decision

`demos/` is git-ignored. `tools/render_demos.py` regenerates it from the
plugin and the synthesised test program (`tools/test_signals.py`), which
needs no input audio.

## Consequences

- The repository stays small and diffable.
- Hearing the plugin without REAPER requires building the host
  (`tools/build_host.sh`, ~30 s) and running the script.
