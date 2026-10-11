# Person and transmission networks — editorial protocol

## Purpose

An interactive, **event-scoped historical relationship graph** is available from chronology cards using **Explore network**. The **People & networks** page provides a global graph, with two independent modes: historical associations and isnād/transmission relationships. The graph is dependency-free SVG running on GitHub Pages; links and nodes are keyboard-selectable, details include references and editorial status, and zoom buttons are available.

**The current catalog contains no source-reviewed links.** Muhammad is represented by an identifying research-subject node only. That node is not an assertion of involvement in any unreviewed event. Do **not** add attractive but unverified sample networks to the public research dataset.

## Data source

`site/data/networks.json` is the *versioned, static presentation catalog* for the networks. It is separate from the canonical quantitative SQLite register. The graph-specific SQL migration is planned for a later phase; no claims are made that the existing SQLite database already contains reviewed network records. The JSON is validated at build time. Its fields are:

- `persons[]`: `id`, four `names`, four `notes`; `isResearchSubject` is optional.
- `eventRoles[]`: `id`, `eventId` referring to an existing research case or Qurʾanic passage, `personId`, `labels` in four languages, `reviewStatus`, `sourceIds[]`.
- `relationships[]`: `id`, `personAId`, `personBId`, `eventIds[]`, four `labels`, `reviewStatus`, `sourceIds[]`. For an event view **both persons must have independently recorded event roles**; the relationship is not inferred from chronological proximity.
- `transmissions[]`: `id`, `eventId`, `fromPersonId`, `toPersonId`, four `labels`, `reviewStatus`, `sourceIds[]`. Arrows indicate claimed direction of transmission, not eyewitness participation.
- `sources[]`: `id`, exact scholarly/primary reference `label`, `url` (HTTPS), `tradition` (`sunni`, `shia`, `shared`).

The front end displays links only when a source identifier resolves to an attestation permitted by the active tradition filter. It preserves reported relations with `candidate` and `disputed` status visually distinct from `reviewed`—neither implies historical fact. Editorial review should assess precise passage, Arabic wording, isnād, variant and manuscript/compilation dates, context, dependence, counterevidence, and alternative readings before setting a record to `reviewed`. Uncertain or missing chronology must remain uncertain.

## Adding a case to the graph

1. Verify and approve the historical **case** in `site/data/research.json`, using the existing critical protocol.
2. Create person IDs and localized labels. Do not infer identities from name similarity or honorifics.
3. Enter a source record with exact URL and tradition.
4. Add **roles** for reported event participants, identifying source(s) for each role.
5. Add **relationships** only when explicitly grounded in relevant passages. A familial relationship does not imply a person was present at every event.
6. Add **transmission links** independently; being a narrator is not evidence of attendance.
7. Run `python3 scripts/validate.py` and `node tests/network.test.mjs`, then verify the four locales and Arabic RTL. Test `Explore network` within the timeline and the People section.

Only genuine, reviewed data should be used to populate public graphs. Do not fill research gaps with diagram geometry, false certainty, or theological explanations.
