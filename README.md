# Islam · Historical-Critical Research Dashboard

An open-source, historically critical investigation of reports about Muhammad’s life and conduct. The dashboard is multilingual (**English by default**, plus Czech, Arabic with RTL layout, and Indonesian), supports Sunni/Twelver Shiʿi source filters, a parallel Qurʾan–Hadith chronology, an evidence register, a quantitative SQLite model and a guarded psychological/behavioural profile.

**Live:** https://religiousnerd.github.io/islam/

## Current editorial status

**No historical case studies have yet passed critical review.** The four illustrative hadith cases, associated textual tension and two provisional Qurʾanic timeline items used in early UI development have been removed from the public catalog and the canonical SQLite observation tables. These were *demonstration data*, not established historical findings. The 11 source collection entries (six Sunni, four Twelver Shiʿi and Qurʾan), four scholarly bibliography entries, empty evidence tables and six analytical research dimensions remain.

The app intentionally displays honest empty states until primary-source data have been examined and approved. It makes no numerical verdict about personality, perfection or morality.

## Scholarly methodology

The interactive [Methodology page](https://religiousnerd.github.io/islam/#method) explains a seven-stage workflow: testable claim; exact source verification; isnād/matn transmission criticism; search for counterevidence; independent chronology; separated authenticity/historicity/behavioural assessments; and publication with review metadata. It also documents contradiction and abrogation rules, dependency clustering, quantification limits and publication criteria in four languages. Read the complete [methodology protocol](docs/methodology.md).

Religious authority, infallibility or divine will are not historical explanations, and neither are inconsistencies presumed before source criticism. Traditional hadith grading and historical plausibility are evaluated independently. A mismatch between two texts is not automatically proof of contradictory historical actions.

- [Chronology and abrogation](docs/chronology-protocol.md)
- [Data model](docs/data-model.md)
- [Quantitative model](docs/quantitative-model.md)
- [Behavioural and psychological-profile safeguards](docs/behavioral-profile.md)

## Interactive relationship networks

Each source-based chronology record can open an **Explore network** dialog. The **People & networks** section includes historical associations and a distinct isnād/transmission view, with source-provenance filters, confidence/review state, clickable persons and links, detail cards, and zoom. The implementation is a self-contained SVG visualization on GitHub Pages. **No unreviewed associates, event participants or isnād chains are fabricated**: initially only the research subject is shown, with empty verified-link states. See [relationship network protocol](docs/relationship-network.md); graph publication records live in `site/data/networks.json` and are validated on deployment.

## Source and language filters

The tradition filter is **Both / Sunni / Twelver Shiʿi**. It identifies the provenance of sources, **not** the universal acceptance of reports by all adherents. The Qurʾan is shared; different hadith corpora are not conflated. The profile, cases and references follow this filter. The relative-time display labels sequence **undetermined** whenever chronology is not independently justified; conventional surah or compilation order cannot establish precedence.

All translated summaries maintain common IDs and citations in `en`, `cs`, `ar`, and `id`. Original Arabic quotations, when new reviewed cases are approved, remain accessible in every UI locale.

## Technical design

A static HTML/CSS/JavaScript interface is deployed from `site/` via GitHub Actions to GitHub Pages. The authoritative, versioned evidence registry is `database/research.sqlite`, with a reproducible read-only snapshot at `site/data/research.sqlite` and derived descriptive data in `site/data/quantitative.json`. No hosted database server, tracking service or credential is required to view the public site.

```text
.github/workflows/pages.yml     Validation and automatic Pages deployment
site/index.html                 Browser application
site/network.js                  Event relationships and isnād SVG graph
site/network.css                 Graph controls, dark theme and RTL
site/data/networks.json          Source-aware people and graph publication records
site/styles.css                 Core responsive UI, including Arabic RTL
site/design-refresh.css         Editorial layout and responsive refinements
site/dark-mode.css              Default full dark visual theme, including RTL
site/app.js                     Navigation, methodology, timeline and filters
site/i18n.js                    Four complete translation dictionaries
site/data/research.json         Curated multilingual editorial catalog (no pilot cases)
site/data/quantitative.json     Generated descriptive database report
site/data/research.sqlite       Public read-only SQLite snapshot
site/.nojekyll                  GitHub Pages static assets
docs/methodology.md             Scholarly protocol v2.0
docs/chronology-protocol.md     Date and precedence requirements
docs/behavioral-profile.md     Psychological inference safeguards
docs/quantitative-model.md     Quantitative calculation and limitations
database/research.sqlite       Canonical schema, catalog metadata and empty observations
scripts/                        SQLite synchronization, export and validation
tests/                          Data and localization tests
```

## Working locally

```bash
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000 (direct `file://` loading of JSON is not supported by most browsers).

## Validation and publication

```bash
python3 scripts/validate.py
python3 -m unittest discover -s tests -v
node tests/locale.test.mjs
node --check site/app.js
node --check site/i18n.js
python3 scripts/export_metrics.py
```

The repository CI checks canonical SQLite against published snapshots and validates all locales. To add new research, enter each primary source and independently assess authenticity, dependence, chronological uncertainty and counterevidence before marking a case as reviewed. Draft or unsupported claims must not be represented as validated findings. Do not recreate the retired demonstration data.

Changes pushed to `main` are published automatically through `.github/workflows/pages.yml`.
