"""Render the synthesised test program through every material, as WAV files.

    python3 tools/render_demos.py OUTDIR [mix%]

Writes "00 Dry.wav" plus one file per material. The program is one bar of
drums, a plucked D-minor arpeggio, then silence so the tail can be heard.
"""
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from analyse import NAMES, load  # noqa: E402
import test_signals  # noqa: E402

RENDER = os.environ.get("RENDER", os.path.join(HERE, "build", "render"))
PLUGIN = os.path.join(os.path.dirname(HERE), "Reverberator.jsfx")

if __name__ == "__main__":
    out = sys.argv[1]
    mix = sys.argv[2] if len(sys.argv) > 2 else "50"
    os.makedirs(out, exist_ok=True)
    x = test_signals.program(tail=3.5)
    with tempfile.TemporaryDirectory() as tmp:
        inp = os.path.join(tmp, "in.f32")
        test_signals.write_f32(inp, x)
        test_signals.write_wav(os.path.join(out, "00 Dry.wav"), load(inp))
        for m, name in enumerate(NAMES):
            o = os.path.join(tmp, "o.f32")
            subprocess.run([RENDER, PLUGIN, inp, o, "48000", f"1={m}", f"2={mix}"],
                           capture_output=True, check=True)
            test_signals.write_wav(os.path.join(out, f"{m + 1:02d} {name}.wav"), load(o))
            print("wrote", name)
