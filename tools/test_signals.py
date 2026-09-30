"""Synthesised dry test material: a drum groove, a plucked melody, then silence.

Everything is generated, so the demos need no audio files. Writes raw float32
stereo (for the render harness) and optionally 16-bit WAV.
"""
import sys
import wave
import numpy as np

SR = 48000


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1.0, t / max(attack, 1e-6)) * np.exp(-t / decay)


def kick(n=int(0.35 * SR)):
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.12)


def snare(rng, n=int(0.25 * SR)):
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 185 * t) * env(n, 0.001, 0.05)
    noise = rng.standard_normal(n) * env(n, 0.001, 0.07)
    noise = np.diff(noise, prepend=0)          # brighten
    return 0.6 * tone + 0.5 * noise


def hat(rng, n=int(0.06 * SR)):
    x = np.diff(np.diff(rng.standard_normal(n), prepend=0), prepend=0)
    return 0.12 * x * env(n, 0.0005, 0.015)


def pluck(freq, dur=0.9, rng=None):
    """Karplus-Strong string."""
    n = int(dur * SR)
    p = int(SR / freq)
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.498 * (buf[i % p] + buf[(i + 1) % p])
    return out * env(n, 0.002, 0.5)


def add(dst, src, at, gain=1.0):
    i = int(at * SR)
    j = min(len(dst), i + len(src))
    dst[i:j] += gain * src[: j - i]


def program(tail=2.5):
    rng = np.random.default_rng(7)
    beat = 0.5                                     # 120 bpm
    total = 8 * beat + 8 * 0.25 + tail
    x = np.zeros(int(total * SR))
    k, s = kick(), snare(rng)
    for b in range(8):                             # one bar of drums, two times
        t = b * beat
        if b % 2 == 0:
            add(x, k, t)
        else:
            add(x, s, t, 0.8)
        add(x, hat(rng), t + 0.25)
    notes = [62, 65, 69, 72, 69, 65, 62, 57]       # D minor arpeggio
    for i, m in enumerate(notes):
        add(x, pluck(440 * 2 ** ((m - 69) / 12), rng=rng), 8 * beat + i * 0.25, 0.6)
    x *= 0.5 / np.abs(x).max()                     # -6 dBFS peak
    return x


def impulse(seconds=6.0):
    x = np.zeros(int(seconds * SR))
    x[100] = 0.5
    return x


def write_f32(path, mono):
    np.repeat(mono[:, None], 2, axis=1).astype(np.float32).tofile(path)


def write_wav(path, stereo):
    y = np.clip(stereo, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((y * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    write_f32(f"{out}/program.f32", program())
    write_f32(f"{out}/impulse.f32", impulse())
