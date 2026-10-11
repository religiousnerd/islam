-- Version 2: source tradition is provenance, not endorsement or authenticity.
-- 'other' in collections.tradition is used for the shared Qur'anic corpus.
CREATE TABLE IF NOT EXISTS chronology_entries (
    id TEXT PRIMARY KEY,
    subject_type TEXT NOT NULL CHECK(subject_type IN ('quran_passage','reported_event')),
    subject_id TEXT NOT NULL,
    reported_period TEXT NOT NULL CHECK(reported_period IN ('meccan','medinan','unplaced')),
    start_year INTEGER,
    end_year INTEGER,
    date_status TEXT NOT NULL CHECK(date_status IN ('broad_sura_classification','not_assessed','independently_dated')),
    confidence_label TEXT NOT NULL CHECK(confidence_label IN ('low','medium','high','undetermined')),
    date_basis TEXT NOT NULL,
    primary_url TEXT,
    CHECK(start_year IS NULL OR end_year IS NULL OR end_year >= start_year),
    CHECK((start_year IS NULL) = (end_year IS NULL)),
    CHECK(date_status != 'independently_dated' OR start_year IS NOT NULL)
) STRICT;
CREATE TABLE IF NOT EXISTS chronology_comparisons (
    id TEXT PRIMARY KEY,
    quran_entry_id TEXT NOT NULL REFERENCES chronology_entries(id),
    hadith_entry_id TEXT NOT NULL REFERENCES chronology_entries(id),
    link_type TEXT NOT NULL CHECK(link_type IN ('thematic','textual_conflict','contextual')),
    assessed_order TEXT NOT NULL CHECK(assessed_order IN ('undetermined','quran_before','quran_after')),
    rationale TEXT NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_chronology_period ON chronology_entries(reported_period,start_year,end_year);
CREATE INDEX IF NOT EXISTS idx_chronology_comparison_pair ON chronology_comparisons(quran_entry_id,hadith_entry_id);
