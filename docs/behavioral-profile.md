# Historical behavioural profile · protocol v1

This page is sometimes referred to as a **psychological profile**, but it cannot constitute a psychometric or clinical examination of a historical person. All statements are about **reported observable conduct**, their reliability, and scholarly hypotheses—never a remote diagnosis or access to private mental states.

## Claims of prophetic perfection

The meaning and scope of *ʿisma* (prophetic impeccability) and moral exemplariness differ among Muslim intellectual traditions. It is misleading to treat all Muslims as claiming universal perfection in every imaginable sphere, or to assume that exemplary status means deity. Each proposition must be defined before investigation (e.g., *never intentionally harmed protected noncombatants*). A theological explanation may be documented as a belief, not adopted as a historical cause or a proof that a conflict disappears.

## Six predefined dimensions

- Civilian protection: protections, exceptions, and treatment of noncombatants.
- Coercion: use of threats, restraints, and force.
- Equal treatment: comparable rules for comparable people and circumstances.
- Mercy: forgiveness, retaliation, and punishment as described in sources.
- Norm consistency: correspondence between attributed norms and conduct, with independently argued chronology.
- Power use: reported constraints and extensions of political authority.

The candidate links in `site/data/research.json` (`profile.dimensions`) **do not score** a claim. They are unreviewed study suggestions and must be presented as such. A dimension with no linked cases means no candidate has been selected—not the absence of evidence.

## How numerical indicators are introduced

`database/research.sqlite` is the canonical registry. Historians must record historicity assessments and dimension interpretations in *separate* `historicity_reviews` and `dimension_reviews` tables with citations and counterevidence. Only rows marked `reviewed` with `editorial-consensus` reviews enter the indicator view `v_evidence_weights`. Independent event clusters, not repeated texts, are the units of analysis; at least five clusters per dimension are required under the project's editorial policy before the exploratory index is shown. The threshold is not a mathematical proof of reliability.

`scopedIndicators` in `site/data/quantitative.json` are calculated separately for `both`, `sunni`, and `shia`. An included claim requires at least one attestation from the selected tradition (the Qurʾan may be shared); *this does not imply acceptance by every member of a tradition*. A sign from −1 to +1 reports only the direction of assessed **source evidence** under the declared coding rubric, with a sensitivity interval for reviewer weight variation. It is **not a probability of virtue, mental health, truth of prophecy, perfection, or even behavioral frequency**. Selection effects, unknown transmission dependence, translator ambiguity, and time-order uncertainty remain outside the formula and must be disclosed. If there are no completed reviews, show no number.

Case selection must systematically include counterexamples. Publication should distinguish Qurʾanic norm, transmitted reports, plausible historical action, and moral interpretation, making contested sources navigable to the primary text and bibliography. Dates for the alleged event must never be inferred from compilation dates. See `docs/chronology-protocol.md`.
