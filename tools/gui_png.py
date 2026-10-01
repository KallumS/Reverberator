"""Convert tools/build/gui's raw BGRA output to PNG: gui_png.py in.bgra w h out.png"""
import sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

raw, w, h, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
px = np.fromfile(raw, np.uint8).reshape(h, w, 4)
plt.imsave(out, px[:, :, [2, 1, 0]])
