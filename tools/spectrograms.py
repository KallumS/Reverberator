"""Spectrogram grid of every material's impulse response (for eyeballing)."""
import os
import subprocess
import sys
import tempfile

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from scipy.signal import spectrogram

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from analyse import NAMES, load  # noqa: E402
import test_signals  # noqa: E402

RENDER = os.environ.get("RENDER", os.path.join(HERE, "build", "render"))
PLUGIN = os.environ.get("PLUGIN", os.path.join(os.path.dirname(HERE), "Reverberator.jsfx"))


def main(out_png, seconds=4.0, extra=()):
    fig, axes = plt.subplots(5, 4, figsize=(16, 17))
    with tempfile.TemporaryDirectory() as tmp:
        imp = os.path.join(tmp, "imp.f32")
        test_signals.write_f32(imp, test_signals.impulse(seconds))
        for m, ax in zip(range(len(NAMES)), axes.flat):
            out = os.path.join(tmp, "o.f32")
            subprocess.run([RENDER, PLUGIN, imp, out, "48000", f"1={m}", "2=100", *extra],
                           capture_output=True, check=True)
            y = load(out)[:, 0]
            f, t, S = spectrogram(y, 48000, nperseg=1024, noverlap=896)
            ax.pcolormesh(t, f / 1000, 10 * np.log10(S + 1e-14), vmin=-120, vmax=-50, shading="auto", cmap="magma")
            ax.set_ylim(0, 12)
            ax.set_title(NAMES[m], loc="left")
            ax.set_ylabel("kHz")
    for ax in list(axes.flat)[len(NAMES):]:
        ax.axis("off")
    fig.tight_layout()
    fig.savefig(out_png, dpi=60)


if __name__ == "__main__":
    main(sys.argv[1], extra=sys.argv[2:])
