"""Simulated-mouse tests of the plugin's @gfx interface.

    python3 tools/gui_check.py

Each case replays mouse events through tools/build/gui and checks that the
change reached the *engine* (its variables), not just the slider. Run after
any change to @gfx. Coordinates are logical pixels on the 760 x 480 layout.
"""
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
GUI = os.environ.get("GUI", os.path.join(HERE, "build", "gui"))
PLUGIN = os.path.join(os.path.dirname(HERE), "Reverberator.jsfx")

# knob centres: x = 20 + (720/11) * (i + 0.5), y = 392
KX = [20 + 720 / 11 * (i + 0.5) for i in range(11)]
MIX, SIZE, DECAY, LOWCUT, HIGHCUT = KX[0], KX[1], KX[2], KX[8], KX[9]


def run(events, sliders=(), scale=1, vars_=()):
    with tempfile.TemporaryDirectory() as tmp:
        env = dict(os.environ, EVENTS=";".join(events), VARS=",".join(vars_))
        out = subprocess.run([GUI, PLUGIN, os.path.join(tmp, "o.bgra"), "760", "480", str(scale),
                              *[f"{k}={v}" for k, v in sliders]],
                             env=env, capture_output=True, text=True, check=True).stdout
    return {k: float(v) for k, v in (l.split("=") for l in out.split())}


def click(x, y):
    return [f"{x:.0f},{y:.0f},0", f"{x:.0f},{y:.0f},1", f"{x:.0f},{y:.0f},0"]


def drag(x, y0, y1, mods=0):
    steps = [f"{x:.0f},{y0:.0f},0,0,{mods}", f"{x:.0f},{y0:.0f},1,0,{mods}"]
    steps += [f"{x:.0f},{y0 + (y1 - y0) * k / 4:.0f},1,0,{mods}" for k in range(1, 5)]
    return steps + [f"{x:.0f},{y1:.0f},0,0,{mods}"]


CASES = [
    ("click Glass tile", click(89, 115), (), 1, ("mat", "n_modes"),
     lambda r: r["slider1"] == 5 and r["mat"] == 5 and r["n_modes"] == 32),
    ("click Marble tile at Retina scale", click(235, 115), (), 2, ("mat",),
     lambda r: r["slider1"] == 6 and r["mat"] == 6),
    ("drag Mix up 100 px", drag(MIX, 392, 292), (), 1, ("wet_t", "dry_t"),
     lambda r: abs(r["slider2"] - 85) < 0.05 and r["wet_t"] == 1 and abs(r["dry_t"] - 0.3) < 1e-6),
    ("shift-drag Mix up 100 px (fine)", drag(MIX, 392, 292, mods=1), (), 1, (),
     lambda r: abs(r["slider2"] - 40) < 0.05),
    ("double-click Decay resets to 100 %", click(DECAY, 392) + click(DECAY, 392), ((4, 200),), 1, ("tsc",),
     lambda r: r["slider4"] == 100 and abs(r["tsc"] - 1) < 1e-9),
    ("wheel up on Size", [f"{SIZE:.0f},392,0", f"{SIZE:.0f},392,0,1"], (), 1, ("size_",),
     lambda r: r["slider3"] > 100 and abs(r["size_"] - r["slider3"] / 100) < 1e-9),
    ("drag Low cut to the top", drag(LOWCUT, 392, 100), (), 1, ("lc_on",),
     lambda r: r["slider10"] == 1000 and r["lc_on"] == 1),
    ("drag High cut down", drag(HIGHCUT, 392, 450), (), 1, ("hc_on",),
     lambda r: r["slider11"] < 20000 and r["hc_on"] == 1),
    ("click Bone tile (the 20th)", click(670, 187), (), 1, ("mat", "n_modes", "n_wg"),
     lambda r: r["slider1"] == 19 and r["mat"] == 19 and r["n_modes"] == 16 and r["n_wg"] == 1),
    ("click in empty space changes nothing", click(400, 208), (), 1, (),
     lambda r: r["slider1"] == 0 and r["slider2"] == 35),
]

if __name__ == "__main__":
    failures = 0
    for name, ev, sl, scale, vars_, ok in CASES:
        r = run(ev, sl, scale, vars_)
        good = ok(r)
        failures += not good
        print(f"{'ok  ' if good else 'FAIL'} {name}" + ("" if good else f"   {r}"))
    print(f"\n{failures} failure(s)")
    sys.exit(1 if failures else 0)
