/* The Max for Live device, run in Node on a pretend Max and a pretend Live.
 *   python3 ableton/kit/build.py ableton/device.json && node --test ableton/tests/ */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const suite = require('../kit/test/audio_suite.js');
const { compare } = require('../kit/test/gen_compare.js');

const ROOT = path.join(__dirname, '..', '..');
const JSFX = path.join(ROOT, 'Reverberator.jsfx');
suite({ bundle: path.join(__dirname, '..', 'Reverberator.js'), maxpat: path.join(__dirname, '..', 'Reverberator.maxpat'),
        jsfx: JSFX, name: 'Reverberator', window: [760, 480], memory: 524288 });

test('every material sounds in gen~ as it does in the runtime', () => {
  const text = fs.readFileSync(JSFX, 'utf8');
  const input = (i, c) => (i % 7000 < 3 ? 0.7 : 0) + 0.03 * Math.sin(i * 0.013 * (c + 1));
  for (let m = 0; m < 20; m++) {
    const r = compare(text, { seconds: 0.25, input, sliders: { 1: m, 2: 70 }, memory: 524288 });
    assert.ok(r.worst < 1e-6, 'material ' + m + ': worst ' + r.worst + ' at ' + r.at);
  }
});
