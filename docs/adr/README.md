# Architecture decision records

Each record states one decision: its context, what was decided, its
consequences, and the alternatives set aside. They are written in the order
the decisions were made; superseded records stay, marked as such.

| # | Decision |
|---|---|
| [0001](0001-jsfx-first.md) | Ship as JSFX first; CLAP later if wanted |
| [0002](0002-derive-from-physical-constants.md) | Derive every sound from physical constants |
| [0003](0003-three-engine-hybrid.md) | A hybrid of three engines: waveguides, modes and a dispersive FDN |
| [0004](0004-fdn-size-from-modal-density.md) | Size the FDN from the material's modal density, capped by modal overlap |
| [0005](0005-dispersion-budget.md) | Dispersion by distributed allpass chains, clamped and stretched to fit a budget |
| [0006](0006-phase-tuning-and-dc-loss-fit.md) | Tune loops by exact phase; fit loss filters at DC |
| [0007](0007-loudness-normalisation.md) | Loudness: exact energy normalisation per engine, then measured trims |
| [0008](0008-nonlinear-paths-feed-forward.md) | Level-dependent effects are feed-forward only, with calibrated Drive curves |
| [0009](0009-headless-ysfx-verification.md) | Verify with a headless ysfx host, by measurement |
| [0010](0010-eel2-naming-and-literals.md) | EEL2 conventions: unambiguous names, decimal literals |
| [0011](0011-two-pass-rebuild.md) | Two-pass rebuild; reallocate only when the geometry changes |
| [0012](0012-soft-ceiling.md) | A soft ceiling on the wet signal only |
| [0013](0013-stability-criterion.md) | Stability means "energy does not grow after the input stops" |
| [0014](0014-material-interpretations.md) | Which version of each object is modelled |
| [0015](0015-demos-not-committed.md) | Audio demos are generated, not committed |

## Adding a record

Copy the shape of an existing one (Status, Date, Context, Decision,
Consequences, Alternatives considered), number it next, and add it to the
table. To reverse a decision, write a new record and mark the old one
"Superseded by NNNN".
