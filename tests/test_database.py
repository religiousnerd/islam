"""Database and numeric model tests: standard library only."""
import json
import sqlite3
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from analyze import calculate  # noqa: E402
from export_metrics import export  # noqa: E402


class DatabaseTests(unittest.TestCase):
    def test_integrity_and_fk(self):
        with sqlite3.connect(ROOT/'database/research.sqlite') as con:
            con.execute('PRAGMA foreign_keys=ON')
            self.assertEqual(con.execute('PRAGMA integrity_check').fetchone()[0], 'ok')
            self.assertEqual(con.execute('PRAGMA foreign_key_check').fetchall(), [])
            self.assertEqual(con.execute('PRAGMA user_version').fetchone()[0], 2)

    def test_provenance_and_translation_coverage(self):
        catalog=json.loads((ROOT/'site/data/research.json').read_text())
        with sqlite3.connect(ROOT/'database/research.sqlite') as con:
            case_ids={row[0] for row in con.execute('SELECT id FROM claims')}
            self.assertEqual(case_ids, {c['id'] for c in catalog['cases']})
            for case in catalog['cases']:
                count=con.execute('SELECT COUNT(*) FROM attestations WHERE claim_id=?',(case['id'],)).fetchone()[0]
                self.assertEqual(count,len(case['refs']))
                for lang in ('cs','en','ar','id'):
                    for field,text in case['translations'][lang].items():
                        actual=con.execute('''SELECT body FROM localized_texts WHERE
                            entity_type='claim' AND entity_id=? AND field=? AND lang=?''',
                            (case['id'],field,lang)).fetchone()
                        self.assertEqual(actual, (text,))
            self.assertEqual(con.execute('SELECT COUNT(*) FROM claim_relations').fetchone()[0],len(catalog['tensions']))

    def test_snapshot_matches_sqlite(self):
        snapshot=json.loads((ROOT/'site/data/quantitative.json').read_text())
        self.assertEqual(snapshot, export())
        self.assertEqual((ROOT/'site/data/research.sqlite').read_bytes(),
                         (ROOT/'database/research.sqlite').read_bytes())
        self.assertIsNone(snapshot['quantitativeProfile'])
        for scope in ('both','sunni','shia'):
            self.assertEqual(set(snapshot['scopedIndicators'][scope]),
                             {d['id'] for d in snapshot['dimensions']})
            self.assertTrue(all(ind['status']=='insufficient_data' for ind in snapshot['scopedIndicators'][scope].values()))
        self.assertEqual(snapshot['counts']['historicity_reviews'],0)
        self.assertEqual(snapshot['counts']['dimension_reviews'],0)

    def test_tradition_and_chronology(self):
        catalog=json.loads((ROOT/'site/data/research.json').read_text(encoding='utf8'))
        counts={tradition:sum(c['tradition']==tradition for c in catalog['collections']) for tradition in ('sunni','shia','shared')}
        self.assertEqual(counts, {'sunni':6,'shia':4,'shared':1})
        self.assertTrue(all(c['sourceTradition']=='sunni' for c in catalog['cases']))
        self.assertTrue(all(q['tradition']=='shared' for q in catalog['chronology']['quranPassages']))
        with sqlite3.connect(ROOT/'database/research.sqlite') as con:
            c=dict(con.execute('SELECT tradition, COUNT(*) FROM collections GROUP BY tradition'))
            self.assertEqual(c, {'sunni':6,'shia':4,'other':1})
            self.assertEqual(con.execute('SELECT COUNT(*) FROM chronology_entries').fetchone()[0],6)
            self.assertEqual(con.execute('SELECT COUNT(*) FROM chronology_comparisons').fetchone()[0],3)
            self.assertEqual(con.execute("SELECT COUNT(*) FROM chronology_comparisons WHERE assessed_order!='undetermined'").fetchone()[0],0)
            self.assertEqual(con.execute("SELECT COUNT(*) FROM chronology_entries WHERE subject_type='reported_event' AND start_year IS NOT NULL").fetchone()[0],0)

    def test_numeric_input_validation_and_data_threshold(self):
        self.assertEqual(calculate([])['status'],'insufficient_data')
        with self.assertRaises(ValueError):
            calculate([dict(event_cluster_id='e1',direction=4,plausibility_low=0,
                          plausibility_high=1,interpretability=1)])

    def test_cluster_deduplication(self):
        rows=[dict(event_cluster_id=f'event_{i}',direction=1,plausibility_low=0.6,
                   plausibility_high=0.8,interpretability=1.0) for i in range(5)]
        index=calculate(rows)
        self.assertEqual(index['status'],'exploratory')
        self.assertEqual(index['independent_event_clusters'],5)
        self.assertAlmostEqual(index['estimate'],1/3,places=3)
        twice=calculate(rows + [rows[0]])
        self.assertEqual(twice['independent_event_clusters'],5)
        self.assertAlmostEqual(twice['estimate'],index['estimate'],places=4)


if __name__=='__main__':
    unittest.main()
