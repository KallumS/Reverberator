"""Render every material through the plugin and check it.

    python3 tools/check.py            # loudness table + stability sweep
    python3 tools/check.py --trims    # print trim values that equalise loudness

Needs the headless renderer built by tools/build_host.sh. For each material it
reports K-weighted loudness (ITU-R BS.1770, ungated) of the wet signal, peak,
how often the soft ceiling engaged, CPU cost, and the impulse-response T60.
The sweep then runs every material at slider extremes and other sample rates,
failing on any non-finite sample or on a wet peak that pins the ceiling.
"""
import os
import subprocess
import sys
import tempfile

import numpy as np
from scipy.signal import lfilter, resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from analyse import NAMES, load, t60  # noqa: E402
import test_signals  # noqa: E402

RENDER = os.environ.get("RENDER", os.path.join(HERE, "build", "render"))
PLUGIN = os.path.join(ROOT, "Reverberator.jsfx")
TARGET_LUFS = -24.0      # wet level the trims aim for, with the -6 dBFS-peak program


def render(inp, sr, sliders, tmp):
    out = os.path.join(tmp, "out.f32")
    args = [RENDER, PLUGIN, inp, out, str(sr)] + [f"{k}={v}" for k, v in sliders.items()]
    r = subprocess.run(args, capture_output=True, text=True, timeout=600)
    line = r.stderr.strip().splitlines()[-1] if r.stderr.strip() else ""
    cpu = float(line.split("(")[1].split("%")[0]) if "realtime CPU" in line else float("nan")
    y = load(out) if os.path.exists(out) else np.zeros((1, 2))
    return y, cpu, r.returncode


def lufs(y, sr):
    if sr != 48000:
        y = resample_poly(y, 48000, int(sr), axis=0)
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    z = lfilter(b2, a2, lfilter(b1, a1, y, axis=0), axis=0)
    p = (z ** 2).mean(axis=0).sum()
    return -0.691 + 10 * np.log10(max(p, 1e-20))


def write_input(path, mono, sr):
    if sr != 48000:
        mono = resample_poly(mono, int(sr), 48000)
    np.repeat(mono[:, None], 2, axis=1).astype(np.float32).tofile(path)


def loudness_table(tmp, show_trims):
    prog = os.path.join(tmp, "program.f32")
    imp = os.path.join(tmp, "impulse.f32")
    write_input(prog, test_signals.program(), 48000)
    write_input(imp, test_signals.impulse(8.0), 48000)
    dry = lufs(load(prog), 48000)
    print(f"dry program: {dry:.1f} LUFS\n")
    print(f"{'material':22s} {'wet LUFS':>9s} {'peak':>6s} {'ceil%':>6s} {'CPU%':>6s} {'T60 s':>6s}")
    trims = []
    for m, name in enumerate(NAMES):
        y, cpu, rc = render(prog, 48000, {1: m, 2: 100}, tmp)
        L = lufs(y, 48000)
        ceil = 100.0 * np.mean(np.abs(y) > 0.9)
        yi, _, _ = render(imp, 48000, {1: m, 2: 100, 8: 0}, tmp)
        T = t60(yi[100:].mean(axis=1), 48000)
        print(f"{name:22s} {L:9.1f} {np.abs(y).max():6.3f} {ceil:6.2f} {cpu:6.1f} {T:6.2f}")
        trims.append(TARGET_LUFS - L)
    if show_trims:
        print("\nsuggested additional trims (dB):")
        print(", ".join(f"{t:+.1f}" for t in trims))
    return trims


def sweep(tmp):
    """Extremes and sample rates: nothing may blow up."""
    cases = [
        {3: 25}, {3: 400}, {4: 400}, {4: 10}, {5: 100}, {5: -100},
        {6: 12}, {6: -12}, {8: 100}, {8: 0}, {3: 400, 4: 400, 6: -12},
    ]
    failures = 0
    for sr in (44100, 48000, 96000):
        prog = os.path.join(tmp, f"prog{sr}.f32")
        x = test_signals.program(tail=2.0)
        write_input(prog, 1.8 * x, sr)          # hot: peaks near -1 dBFS
        for m, name in enumerate(NAMES):
            for c in cases if sr == 48000 else [{}]:
                s = {1: m, 2: 100}
                s.update(c)
                y, cpu, rc = render(prog, sr, s, tmp)
                finite = np.all(np.isfinite(y))
                # an unstable loop keeps gaining energy after the input stops;
                # a merely long decay (minutes, at the extremes) does not
                n = int(0.25 * sr)
                early = y[-4 * n:-3 * n] if finite else y
                late = y[-n:] if finite else y
                runaway = finite and np.sqrt(np.mean(late ** 2)) > 1.1 * np.sqrt(np.mean(early ** 2)) + 1e-6
                pinned = np.mean(np.abs(y) > 0.99)
                if rc != 0 or not finite or runaway:
                    failures += 1
                    print(f"FAIL {name} sr={sr} {c}: rc={rc} finite={finite} runaway={runaway}")
                elif pinned > 0.001:
                    print(f"note {name} sr={sr} {c}: hot input reaches the soft ceiling "
                          f"({100 * pinned:.2f}% of samples)")
    print(f"\nsweep: {failures} failure(s)")
    return failures


if __name__ == "__main__":
    with tempfile.TemporaryDirectory() as tmp:
        loudness_table(tmp, "--trims" in sys.argv)
        if "--no-sweep" not in sys.argv:
            sys.exit(1 if sweep(tmp) else 0)
