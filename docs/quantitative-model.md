# Quantitative historical evidence — version 1

## Scope and anti-pseudoscience safeguards

This model quantifies **properties of assessed source records**, not Muhammad's personality, moral status, mental state, or actual historical rates of behavior. Neither theological explanations nor reflexively skeptical conclusions are treated as axioms.

The research pipeline distinguishes (a) source passage and recension, (b) a testable claim, (c) attestation to that claim, (d) transmission dependence, (e) traditional classification of the report, (f) independent historical plausibility review, (g) interpretive dimension coding, (h) contested claim relations. This separation is mandatory.

An important warning: six citations are not six independent witnesses. Unknown dependence remains **unknown**. `attestations.dependence_group = NULL` is **not** interpreted as independent corroboration.

## Canonical repository assets

- `database/schema.sql` defines a SQLite 3.37+ STRICT schema, foreign keys and constraints.
- `database/research.sqlite` is the canonical, version-controlled research database.
- `site/data/research.json` is the four-language editorial catalog used by the initial web UI.
- `scripts/import_catalog.py` imports catalog case candidates, citations and translations into SQLite idempotently. It never creates quantitative judgments.
- `scripts/export_metrics.py` produces read-only derived `site/data/quantitative.json` and copies the SQLite file to `site/data/research.sqlite` for download on GitHub Pages.
- `scripts/analyze.py` implements a deliberately limited **exploratory, non-diagnostic** index for when reviewed data become available.

Both the catalog and DB are versioned, checked for matching cases, and manually reviewed when creating new entries; later migrations should make SQLite the only editorial canonical store and derive the catalog automatically.

## Exploratory evidence index

For each reviewed claim `i` and dimension `d`, a named reviewer may enter:

- an elicited historicity range `H_low ... H_high` in `[0,1]` with its methodological justification;
- an interpretation direction `S` from `-3` to `+3` according to a **dimension-specific published coding rubric**;
- interpretability `J` in `[0,1]` (not evidence strength);
- source provenance and a rationalized connection to a historical event cluster.

The midpoint weight for a claim is `w_i = (H_low + H_high)/2 × J`. The normalized direction is `s_i = S/3`.

Claims within the **same event cluster** are first aggregated so multiple reports of one episode cannot increase the event count. Within each cluster, claim direction is averaged using `w_i`, and the **average** (not the sum) of claim weights represents the cluster. A descriptive aggregate is then the weighted mean of cluster directions. Thus output is between -1 and +1, but its interpretation is **only the direction of the selected and coded evidence**.

No dimension index will be shown with fewer than **five** independently defined and reviewed event clusters. This is an editorial visibility safeguard, **not** a scientifically justified representativeness threshold. No score is shown at present: all four starter cases are unassessed and zero reviews exist.

For enough reviewed clusters, deterministic simulation may draw weights uniformly within each reviewer's selected historicity bounds and report the 10th–90th percentile **sensitivity scenarios**. These are **not** frequentist confidence intervals, Bayesian credible intervals, or calibrations of actual historicity probability. They do not quantify source-selection bias, dependence not yet documented, or systematic reviewer bias. The dashboard must disclose these omissions.

## Required before any published quantitative interpretation

1. An explicit systematic corpus selection and record of excluded cases.
2. Documented independent source-family clustering and passage variants.
3. Historical source dating and scholarly counterarguments with page citations.
4. At least two distinct review judgments per contested claim and adjudication notes before any `editorial-consensus` judgment.
5. A dimension-specific coding rubric and examples of competing interpretations.
6. Sensitivity analysis under alternative clusters, eligibility rules, review weights and chronology.
7. Full replication steps, including the precise database Git commit.

## Rebuilding assets

```bash
python3 scripts/import_catalog.py   # Idempotent initial catalog synchronization
python3 scripts/export_metrics.py   # Deterministic derived metrics and web database snapshot
python3 scripts/validate.py
python3 -m unittest discover -s tests -v
node tests/locale.test.mjs
```

The Pages deployment validates snapshots and publishes the `site/` directory. GitHub Pages cannot act as a persistent multi-user SQLite write server; the public snapshot is read-only. Editorial changes are committed through Git and deployed as new static assets.
