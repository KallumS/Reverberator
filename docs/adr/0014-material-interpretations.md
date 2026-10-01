# 0014. Which version of each object is modelled

- Status: Accepted
- Date: 2026-09-30

## Context

Several material names in the brief cover objects with very different
physics. A choice had to be made for each, and it is the choice most likely
to differ from what the user imagined.

## Decision

| Name | Modelled as | Rather than | Why |
|---|---|---|---|
| Gong | Orchestral tam-tam (flat, 80 cm bronze) | Bossed gamelan/nipple gong | The tam-tam is the sound people mean by "gong" in a reverb context; a bossed gong is a pitched modal instrument |
| Leather | Stretched hide, like a frame drum | Slack leather | Slack leather is only a short thud |
| Piano string | 24 strings C2–B3 with the sustain pedal down | One string | Sympathetic resonance is what "reverb through a piano" means |
| Guitar string, Violin string | All open strings of the instrument, heard through its body | One string | Same reason; the body gives the instrument its identity |
| Tension wire | Two long guy wires (25 m, 31 m) | A short wire | Length is what produces the sustained dispersive "pew" |
| Ice sheet | 5 cm lake ice with shore reflections | An ice block | The singing-ice chirp only exists in a large thin sheet |
| Car body panel | Curved 0.8 mm door skin, lightly damped | Flat sheet, or a heavily deadened panel | Curvature is what gives the "bonk"; heavy damping made it too short to use |
| Aluminium foil | Crumpled 16 µm sheet, statistical | Flat foil | Foil is always crumpled |
| Cling film | Stretched over a 30 cm bowl | Loose film | Stretched film is a membrane and can buzz |
| Corrugated tin roof | Screwed-down sheets between 0.9 m purlins, with loose fixings | A single free sheet | That is how roofs are built, and they rattle |
| PVC pipe | 1.5 m of 2" pipe, open both ends | A closed pipe | The common case; open both ends gives the full harmonic series |
| Toilet roll tube | Empty cardboard tube, open both ends | — | — |
| Steel handpan | D Kurd scale | Another scale | The most common handpan scale; Tuning transposes it |
| Bone *(added 2026-10-01)* | An intact dried human tibia, 36 cm | A bone flute, a pair of rhythm bones, an animal femur | It has published in-vitro resonance measurements (240–405 Hz, second peak 400–500 Hz) to calibrate against; its sealed marrow cavity gives the flute-like air resonance, and the rhythm-bones clack is kept as the Drive behaviour |

## Consequences

- Each alternative is a new material setup, not a code change; the user can
  ask for any of them.
