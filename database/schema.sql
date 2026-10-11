-- Islam Historical-Critical Research: reproducible evidence model
-- SQLite 3.37+; the database is a research register, not an automated moral verdict.
PRAGMA foreign_keys = ON;
PRAGMA user_version = 1;

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  title_ar TEXT,
  title_en TEXT NOT NULL,
  tradition TEXT NOT NULL CHECK(tradition IN ('sunni','shia','other')),
  genre TEXT NOT NULL CHECK(genre IN ('hadith','quran','sira','historical','academic','other')),
  compilation_note TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS passages (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL REFERENCES collections(id),
  locator TEXT NOT NULL,
  edition TEXT,
  original_language TEXT NOT NULL DEFAULT 'ar',
  original_text TEXT,
  permalink TEXT,
  transcription_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK(transcription_status IN ('unverified','checked','disputed')),
  UNIQUE(collection_id,locator,edition)
) STRICT;

-- A claim is a historically testable proposition. Multiple quotations may attest one claim.
-- event_cluster_id prevents treating parallel reports of the same episode as separate events.
CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  event_cluster_id TEXT NOT NULL,
  proposition_en TEXT NOT NULL,
  claim_kind TEXT NOT NULL CHECK(claim_kind IN ('action','instruction','statement','event','textual')), 
  period TEXT CHECK(period IN ('meccan','medinan','uncertain')),
  year_from INTEGER,
  year_to INTEGER,
  research_status TEXT NOT NULL DEFAULT 'candidate'
    CHECK(research_status IN ('candidate','in_review','reviewed','withdrawn')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK(year_from IS NULL OR year_to IS NULL OR year_to >= year_from)
) STRICT;

-- Attestations can support, challenge, or merely mention a claim.
-- dependence_group is a documented transmission family (not a numerical score).
CREATE TABLE IF NOT EXISTS attestations (
  id INTEGER PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES claims(id),
  passage_id TEXT NOT NULL REFERENCES passages(id),
  stance TEXT NOT NULL CHECK(stance IN ('supports','challenges','mentions')),
  dependence_group TEXT,
  rationale TEXT,
  UNIQUE(claim_id,passage_id,stance)
) STRICT;

CREATE TABLE IF NOT EXISTS dimensions (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  positive_pole_en TEXT NOT NULL,
  negative_pole_en TEXT NOT NULL,
  coding_instructions TEXT NOT NULL
) STRICT;

-- Numbers in [0,1] are *elicited expert plausibility ranges*, not measured frequencies.
-- Authenticity in classical hadith criticism is tracked separately in the source analysis.
-- Public summaries use only explicit editorial-consensus assessments.
CREATE TABLE IF NOT EXISTS historicity_reviews (
  id INTEGER PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES claims(id),
  reviewer TEXT NOT NULL,
  plausibility_low REAL NOT NULL CHECK(plausibility_low BETWEEN 0 AND 1),
  plausibility_high REAL NOT NULL CHECK(plausibility_high BETWEEN 0 AND 1),
  rationale TEXT NOT NULL,
  method_version TEXT NOT NULL,
  is_current INTEGER NOT NULL DEFAULT 1 CHECK(is_current IN (0,1)),
  assessed_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK(plausibility_low <= plausibility_high)
) STRICT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_current_historicity_per_reviewer
  ON historicity_reviews(claim_id,reviewer) WHERE is_current = 1;

-- direction: -3 strongly toward negative pole, 0 uninformative, +3 toward positive pole.
-- interpretability: how unambiguous the coding is; *not* a measure of historicity.
CREATE TABLE IF NOT EXISTS dimension_reviews (
  id INTEGER PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES claims(id),
  dimension_id TEXT NOT NULL REFERENCES dimensions(id),
  reviewer TEXT NOT NULL,
  direction INTEGER NOT NULL CHECK(direction BETWEEN -3 AND 3),
  interpretability REAL NOT NULL CHECK(interpretability BETWEEN 0 AND 1),
  rationale TEXT NOT NULL,
  method_version TEXT NOT NULL,
  is_current INTEGER NOT NULL DEFAULT 1 CHECK(is_current IN (0,1)),
  assessed_at TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_current_dimension_per_reviewer
  ON dimension_reviews(claim_id,dimension_id,reviewer) WHERE is_current = 1;

-- A contradiction is an analytical hypothesis, not an automatic conclusion.
CREATE TABLE IF NOT EXISTS claim_relations (
  id TEXT PRIMARY KEY,
  claim_a TEXT NOT NULL REFERENCES claims(id),
  claim_b TEXT NOT NULL REFERENCES claims(id),
  relation_type TEXT NOT NULL CHECK(relation_type IN ('possible_conflict','supports','qualifies','same_event')),
  adjudication TEXT NOT NULL DEFAULT 'open'
    CHECK(adjudication IN ('open','textual_conflict','historical_conflict','contextually_resolved','insufficient_evidence')),
  explanation TEXT,
  CHECK(claim_a <> claim_b)
) STRICT;

-- UI translations and scholarly translations should be distinguished in metadata.
CREATE TABLE IF NOT EXISTS localized_texts (
  entity_type TEXT NOT NULL CHECK(entity_type IN ('claim','dimension','collection','relation')),
  entity_id TEXT NOT NULL,
  field TEXT NOT NULL,
  lang TEXT NOT NULL CHECK(lang IN ('cs','en','ar','id')),
  body TEXT NOT NULL,
  translation_kind TEXT NOT NULL DEFAULT 'editorial'
    CHECK(translation_kind IN ('editorial','published','original')),
  attribution TEXT,
  PRIMARY KEY(entity_type,entity_id,field,lang)
) STRICT;

CREATE TABLE IF NOT EXISTS bibliography (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT,
  year INTEGER,
  doi TEXT,
  url TEXT,
  work_type TEXT NOT NULL DEFAULT 'study',
  full_text_examined INTEGER NOT NULL DEFAULT 0 CHECK(full_text_examined IN (0,1))
) STRICT;
CREATE TABLE IF NOT EXISTS bibliography_claims (
  bibliography_id TEXT NOT NULL REFERENCES bibliography(id),
  claim_id TEXT NOT NULL REFERENCES claims(id),
  locator TEXT,
  role TEXT NOT NULL CHECK(role IN ('supports','challenges','discusses')),
  notes TEXT,
  PRIMARY KEY (bibliography_id,claim_id,role)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_attestations_claim ON attestations(claim_id);
CREATE INDEX IF NOT EXISTS idx_attestations_dependence ON attestations(dependence_group);
CREATE INDEX IF NOT EXISTS idx_claims_cluster ON claims(event_cluster_id);
CREATE INDEX IF NOT EXISTS idx_claims_period ON claims(period);
CREATE INDEX IF NOT EXISTS idx_dim_review_dimension ON dimension_reviews(dimension_id);

-- Only reviews explicitly marked editorial-consensus enter this view.
-- This is an evidence index ingredient, NEVER a direct moral or personality score.
CREATE VIEW IF NOT EXISTS v_evidence_weights AS
SELECT c.id AS claim_id,
       c.event_cluster_id,
       d.dimension_id,
       d.direction,
       h.plausibility_low,
       h.plausibility_high,
       d.interpretability,
       ((h.plausibility_low + h.plausibility_high)/2.0)*d.interpretability AS illustrative_weight
FROM claims c
JOIN historicity_reviews h ON h.claim_id = c.id AND h.reviewer = 'editorial-consensus' AND h.is_current=1
JOIN dimension_reviews d ON d.claim_id = c.id AND d.reviewer = 'editorial-consensus' AND d.is_current=1
WHERE c.research_status='reviewed';

INSERT OR IGNORE INTO collections (id,title_ar,title_en,tradition,genre,compilation_note) VALUES
('BUKHARI','صحيح البخاري','Sahih al-Bukhari','sunni','hadith','Canonical Sunni collection; source-level grading is not equivalent to independent historical verification.'),
('MUSLIM','صحيح مسلم','Sahih Muslim','sunni','hadith','Canonical Sunni collection.'),
('ABU_DAWUD','سنن أبي داود','Sunan Abi Dawud','sunni','hadith','Canonical Sunni collection.'),
('TIRMIDHI','جامع الترمذي','Jami at-Tirmidhi','sunni','hadith','Canonical Sunni collection.'),
('NASAI','سنن النسائي','Sunan an-Nasai','sunni','hadith','Canonical Sunni collection.'),
('IBN_MAJAH','سنن ابن ماجه','Sunan Ibn Majah','sunni','hadith','Canonical Sunni collection.');

INSERT OR IGNORE INTO dimensions (id,name_en,positive_pole_en,negative_pole_en,coding_instructions) VALUES
('mercy','Merciful treatment','Evidence of compassionate treatment','Evidence of punitive or harsh treatment','Code observable treatment, not inferred inner emotion. Always record context and counterevidence.'),
('civilian_protection','Protection of noncombatants','Documented protection or restraint','Documented harm or permissive instructions','Differentiate intentional harm from incidental harm and distinguish command from event.'),
('coercion','Use of coercion','Non-coercive or restrained approach','Coercion or threat of force','This is a descriptive dimension, not an automatic moral judgment.'),
('norm_consistency','Consistency of stated norms and actions','Alignment across comparable contexts','Contradiction across comparable contexts','Only code after chronology and contextual differences are examined.'),
('equal_treatment','Equal treatment','Similar standards across comparable people','Different standards in comparable situations','Comparability must be explicitly defended.'),
('power_use','Exercise of political power','Limits on own authority','Expansion or self-serving exercise of authority','Do not infer motivation from personal advantage alone.');
