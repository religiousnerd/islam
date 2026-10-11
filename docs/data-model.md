# Research data model

Current version: `1` at `site/data/research.json`.

`collections`: six Sunni hadith collections with stable id, scholarly title, author death date, and external link. Author death dates **do not date every hadith**.

`cases`: object with stable `id` (MUH-###), `theme`, `status`, `confidence`, verified source links `refs` (label+URL), an excerpt in Arabic `arabicExcerpt`, and `translations` for cs/en/ar/id. Each locale contains `title`, `summary`, `question`, `note`. The phrase `source reference checked` describes verification of link and wording only, not whether the reported event occurred.

`tensions`: object with stable `id` (CR-###), referenced `caseIds`, `status` and translated `title`, `summary`, `question`. A tension is not automatically a proven contradiction.

`bibliography`: `author`, `title`, `year`, `publisher`, `url`. References identify relevant academic texts; inclusion does not claim full-text access or complete analysis.

## Data policy

- Do not replace an Arabic text without updating its edition/citation in the associated research record.
- Never invent independent attestation or historical certainty.
- Each claim is a *report about* Muhammad unless historical reconstruction supports stronger wording.
- Preserve URLs; keep the source pointers accessible for all UI languages.
- Before historical assertions, add evidence notes, transmission analysis, contrary evidence and dated bibliography locations.
- Future version: external YAML/JSON records per case, full isnād and matn variant graph, page-level scholarly notes, editorial peer review and versioned status history.


## SQLite quantitative registry (schema v1)

The versioned canonical quantitative register is `database/research.sqlite`; its schema and safe field ranges are defined in `database/schema.sql`. It has tables for collections, passages, claims, attestations, dimensions, historicity and dimension reviews, claim relations, localized texts, bibliography, and bibliography-to-claim links.

`attestations` represent textual mentions, not necessarily independent support for historical truth. Narrative `dependence_group` remains NULL until actually investigated. `claims.event_cluster_id` prevents overcounting one event recounted in multiple narrations.

The public `site/data/quantitative.json` is a deterministic, data-only export; the downloadable copy of the DB is `site/data/research.sqlite`. See [`quantitative-model.md`](quantitative-model.md) for numeric rules and cautions.
