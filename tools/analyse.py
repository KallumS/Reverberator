"""Impulse-response metrics for rendered raw float32 stereo files."""
import sys
import numpy as np

NAMES = ["Chain link fence", "Ice sheet", "Tension wire", "Gong", "PVC pipe", "Glass",
         "Marble", "Car body panel", "Leather", "Wine bottle", "Piano string",
         "Guitar string", "Violin string", "Steel handpan", "Toilet roll tube",
         "Aluminium foil", "Cling film", "Corrugated tin roof", "Metal barrel"]


def load(path):
    return np.fromfile(path, np.float32).reshape(-1, 2).astype(float)


def t60(x, sr):
    """Schroeder backward integration; T30 extrapolated to T60."""
    e = np.cumsum((x ** 2)[::-1])[::-1]
    if e[0] <= 0:
        return float("nan")
    db = 10 * np.log10(np.maximum(e / e[0], 1e-30))
    i5 = np.argmax(db < -5)
    i35 = np.argmax(db < -35)
    if i35 <= i5:
        return float("nan")
    return 2.0 * (i35 - i5) / sr


def centroid(x, sr):
    X = np.abs(np.fft.rfft(x)) ** 2
    f = np.fft.rfftfreq(len(x), 1 / sr)
    return float((X * f).sum() / max(X.sum(), 1e-30))


def metrics(y, sr):
    m = y.mean(axis=1)
    return dict(
        peak=float(np.abs(y).max()),
        energy=float((y ** 2).sum(axis=0).mean()),
        t60=t60(m, sr),
        centroid=centroid(m, sr),
        corr=float(np.corrcoef(y[:, 0], y[:, 1])[0, 1]) if y.std() > 0 else float("nan"),
    )


if __name__ == "__main__":
    sr = float(sys.argv[1])
    for path in sys.argv[2:]:
        print(path, metrics(load(path), sr))
