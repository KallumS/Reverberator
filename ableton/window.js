// The picture in the README: `node ableton/window.js` redraws ableton/window.png.
// The sixth material chosen.
require('./kit/test/picture.js')(__dirname, { bundle: 'Reverberator.js', w: 760, h: 480,
  go(d) { d.ctx.fx.setSliderByIndex(1, 5); d.ctx.fx.runSection('slider'); } });
