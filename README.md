# Islam · Historical-Critical Research

An open, evidence-led research dashboard for assessing reports about Muhammad's life and conduct. The interface and research summaries support **Czech, English, Arabic and Indonesian**, with **right-to-left Arabic layout**.

**Research status:** starter release. Four primary-source case records and one **unresolved textual tension** are *not* claims of established historical fact. They are research questions awaiting a full critical comparison of transmission histories, wording, dating, independent testimony, and scholarship.

## Dashboard

On successful GitHub Pages deployment: **https://religiousnerd.github.io/islam/**

The project uses ordinary static HTML, CSS, and JavaScript. **SQLite is the version-controlled evidence registry**, while reproducibly generated JSON supplies read-only descriptive statistics to GitHub Pages. No framework installation, persistent server, API keys, or tracking are needed. All interactions (language switching, navigation, case lookup, topic filters, database coverage, record details, source links and SQLite download) work client-side on GitHub Pages.

## Local development

```bash
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000 in a browser. Do **not** open `site/index.html` via `file://`: browsers normally block JSON fetches from local files.

## Validation

```bash
python3 scripts/validate.py
python3 -m unittest discover -s tests -v
node tests/locale.test.mjs
node --check site/app.js
node --check site/i18n.js
```

## Publishing on GitHub Pages

1. Push the starter repository to `main`.
2. On GitHub, open **Settings → Pages → Build and deployment → Source: GitHub Actions**. This requires repository admin/maintainer permissions.
3. Open **Actions → Validate and deploy dashboard to GitHub Pages** and check the run. The workflow runs on every push to `main` and can be run manually.
4. When the deployment succeeds, the dashboard should be available at **https://religiousnerd.github.io/islam/**. This URL is expected for the repository name, **not verified as currently deployed**.

The workflow validates JSON, SQLite consistency, all four locales and JavaScript syntax, then deploys the `site/` directory via the official GitHub Pages artifact workflow. GitHub Pages must be enabled, and repository policies must permit the listed actions.

## Repository layout

```text
.github/workflows/pages.yml     GitHub Pages validation and deployment
site/index.html                 HTML app shell
site/styles.css                 Responsive styling, including RTL
site/app.js                     Client-side routing, filtering, case details
site/i18n.js                    Four complete interface dictionaries
site/data/research.json         Curated multilingual source catalog
site/data/quantitative.json     Generated, descriptive SQLite snapshot
site/data/research.sqlite       Public read-only SQLite snapshot
site/.nojekyll                  Preserve all deployed static paths
docs/methodology.md             Historical-critical protocol
docs/data-model.md              Research data model
docs/quantitative-model.md      Quantitative interpretation and limits
database/schema.sql             SQLite schema and constraints
database/research.sqlite        Canonical versioned quantitative registry
scripts/import_catalog.py       Initial, idempotent candidate import
scripts/export_metrics.py       Reproducible SQLite to static web export
scripts/analyze.py              Exploratory, cluster-aware sensitivity model
scripts/validate.py             Research catalog validation
tests/                         SQLite and language tests
```

## Scholarly standards

- No assumption of infallibility or supernatural causation as historical explanation.
- The traditional hadith grade is **not** equivalent to historical certainty.
- A tension between texts is **not** automatically a proven contradiction in Muhammad's historical behaviour.
- Track counterevidence, alternative explanations, narrative dependence and translation disagreements.
- Separate direct evidence, modern interpretation and moral evaluation.
- Do not assign pseudo-quantitative personality scores or psychological diagnoses.
- Mark unevaluated events as `unassessed` and tensions as `unresolved`.

Read [the research methodology](docs/methodology.md) and [the data model](docs/data-model.md).

## Contributing cases

Initial editorial records are in `site/data/research.json` and mirrored as claim candidates in `database/research.sqlite`. Synchronize them with `python3 scripts/import_catalog.py && python3 scripts/export_metrics.py`. Every new case needs a unique stable ID, a tag, a set of source links, an authentic Arabic excerpt where appropriate (checked against a specified edition), a historical assessment state, and all four translated title/summary/question/note fields. Run `python3 scripts/validate.py` before committing. A source citation alone does not justify marking a historical claim as verified.

## Languages

- `cs` — Czech
- `en` — English (default)
- `ar` — Arabic (RTL layout)
- `id` — Bahasa Indonesia

English is the default for first-time visitors; the selected language persists in browser local storage when available. Original Arabic quotations remain visible regardless of UI language. Original passage numbering and URLs remain invariant across languages.

## Editorial notice

Short summaries are original *working translations*, not scholarly critical editions. Hadith excerpts are provided to identify sources for analysis; full text should be consulted at the linked source. The four cases have not yet undergone isnād-cum-matn analysis, and no historical confidence score has been assigned. Academic bibliography entries are not claims that the books were read in full.

## Quantitative evidence register (SQLite)

The dashboard includes a quantitative evidence tab: **four unassessed claim candidates, six textual attestations, one open textual tension, zero scholarly historicity reviews**. Consequently, no character score is computed. The original SQLite file can be downloaded from the public website and inspected with any SQLite tool. Counts and prospective analyses deliberately group multiple narrations of the same episode into one event cluster.

The optional experimental index in `scripts/analyze.py` is conditional on reviewed evidence with at least five event clusters, and describes only the direction of **coded sources**, not Muhammad's personality. Its simulated uncertainty range is a sensitivity scenario, not a statistical confidence interval. See [the quantitative research protocol](docs/quantitative-model.md).

To regenerate database exports after a reviewed editorial change:

```bash
python3 scripts/import_catalog.py    # for changes to initial editorial case catalog
python3 scripts/export_metrics.py
python3 scripts/validate.py
python3 -m unittest discover -s tests -v
```

## GitHub access requirement

Publishing to `religiousnerd/islam` requires a GitHub credential with **Contents: read/write** for this repository. Reading a repository through a connected GitHub integration alone does not prove write authorization. GitHub Pages must be enabled with **GitHub Actions** as the build source at least once.

## Sunni / Twelver Shiʿi source filter

Use **Both / Sunni / Shiʿi (Twelver)** in the top bar. The filter operates on **where a passage is attested**, not on whether every member of a tradition accepts it as authentic. The six Sunni and four Twelver collections are cataloged separately. The Qurʾan is shared across both selections. The current case records cite Sunni material only, so the Shiʿi-only case list is initially empty, **not** proof of absence of comparable historical reports. Four Twelver collections are listed as research leads; no cross-sect equivalence or acceptance has been assigned without comparing actual passages.

## Parallel Qurʾan / Hadith chronology

Open the **Qurʾan × Hadith timeline**. On the left appear relevant Qurʾanic passages, on the right reported hadith sayings/actions. The initial Qurʾanic examples are Q 2:190 and Q 60:8. Broad Medinan placement (622–632 CE) does **not** establish the year of revelation of either verse. The original four hadith cases remain in the explicitly **undated** group, because compilation date cannot replace the date of a purported event. The comparison panel reports **sequence unproven** whenever independent dating is absent. A claim of later abrogation requires positive documentary justification and cannot be assumed from canonical surah numbering.

Chronology is versioned both in the editorial catalog (`site/data/research.json`) and SQLite (`chronology_entries`, `chronology_comparisons`). Following editorial changes, run:

```bash
python3 scripts/sync_chronology.py
python3 scripts/export_metrics.py
python3 scripts/validate.py
```

For research-grade dating standards, see `docs/chronology-protocol.md`.

## Behavioural profile (historical, not clinical)

Navigate to `#profile` for a six-dimension, source-linked historical behaviour evidence map. Sunni, Twelver Shiʿi and combined views use the selected tradition. Source links are **preliminary research leads**; no psychological, moral or perfection score is asserted. See [behavioural profile protocol](docs/behavioral-profile.md) for explicit limits and rules for future numerical indicators.
