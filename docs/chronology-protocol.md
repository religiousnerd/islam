# Source tradition and chronological precedence protocol (v2)

## 1. Provenance rather than automatic acceptance

Every primary passage (not just the case as a whole) should carry a collection ID and a source tradition: Sunni, Twelver Shiʿi, or shared. This denotes **textual provenance**, not the degree to which that hadith is accepted as authoritative or historically authentic by adherents. A cross-tradition connection may be drawn only with an explicit variant report and source reference. The Qurʾan is shared but not evidence for accepting another collection. The Twelver Four Books are a defined **Twelver** selection, not a universal proxy for all Shiʿi traditions (e.g., Ismaili or Zaydi).

## 2. Three time axes must not be confused

- *Reported event*: purported date of a saying, action, or event during Muhammad's lifetime.
- *Textual emergence / transmission*: earliest demonstrable evidence of a report circulating, which may postdate the alleged event.
- *Compilation*: dates of collections such as Ṣaḥīḥ al-Bukhārī, which **do not date a reported event**.

For a Qurʾanic passage distinguish (a) chronological classifications for an entire surah, (b) independently argued date ranges for a specific verse or cluster, (c) editorial and manuscript witnesses. Even if a surah is labelled Medinan, an individual verse cannot be assigned a definite year without argument. Traditional revelation order is a historically relevant proposal, not ground truth.

## 3. Chronology entries

`chronology_entries` stores type, stable ID, period, optional interval, dating status, confidence label and source rationale. The current database deliberately has no example Quranic verses or hadith events. New entries require reviewed primary citations and justified dates; undated events must retain null intervals, and unsupported before/after claims are prohibited.

## 4. Defensible relative order

A relation may be labelled *Qurʾanic passage earlier* or *later* only if both endpoints have individually justified intervals, recorded as `independently_dated`, and those intervals do not overlap. Overlap, unknown timing, or mere surah-number ordering yields `undetermined`. These are necessary but not sufficient conditions: the evidence for each date, the textual relationship, and independence of sources must be reviewed. Revisions preserve citations and version history.

## 5. Abrogation is a separate historical hypothesis

A later surah cannot automatically be invoked to 'fix' an earlier tension. Nor does demonstrating a later date establish abrogation: one must also show that the texts address the same norm, that a supersession is claimed or demonstrable, and how that claim emerged. Abrogation as a theological or juristic position may be presented with attribution, never used as an automatic historical resolution.

## 6. Methodological reference and register status

- [Oxford Handbook of Qurʾanic Studies, Inner-Qurʾanic Chronology](https://academic.oup.com/edited-volume/34388/chapter-abstract/291610806) — scholarly work relevant to reconstruction of Qurʾanic relative chronology.
- [Twelver Shiʿi Four Books, introductory context](https://al-islam.org/shiite-anthology-sayyid-muhammad-husayn-tabatabai/translators-introduction) — context for the difference in hadith corpora.

The published chronological dataset is currently empty pending critical review. Neither a proven sequence nor a historical contradiction is asserted.
