#!/usr/bin/env python3
"""Reproducibly export *descriptive* statistics from canonical SQLite for Pages.

Never manufacture historicity percentages or personality/moral scores.
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from analyze import calculate, MODEL_VERSION

ROOT = Path(__file__).resolve().parents[1]
DATABASE = ROOT/'database/research.sqlite'
SNAPSHOT = ROOT/'site/data/quantitative.json'
PUBLISHED_DB = ROOT/'site/data/research.sqlite'


def export() -> dict:
    con = sqlite3.connect(f'{DATABASE.as_uri()}?mode=ro', uri=True)
    con.row_factory = sqlite3.Row
    def count(table):
        return con.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
    statuses = {row['research_status']:row['n'] for row in con.execute(
        'SELECT research_status,COUNT(*) n FROM claims GROUP BY research_status')}
    for s in ('candidate','in_review','reviewed','withdrawn'):
        statuses.setdefault(s,0)
    dimensions = []
    exploratory = {}
    for row in con.execute('''SELECT d.id, d.name_en, count(dr.id) as coded_reviews,
        count(DISTINCT CASE WHEN c.research_status='reviewed' THEN c.event_cluster_id END) AS reviewed_clusters
        FROM dimensions d LEFT JOIN dimension_reviews dr
          ON dr.dimension_id=d.id AND dr.is_current=1
        LEFT JOIN claims c ON c.id=dr.claim_id
        GROUP BY d.id,d.name_en ORDER BY d.id'''):
        dimension=dict(row)
        scored=[dict(x) for x in con.execute('''SELECT event_cluster_id,direction,plausibility_low,plausibility_high,interpretability
                  FROM v_evidence_weights WHERE dimension_id=? ORDER BY event_cluster_id,claim_id''', (row['id'],))]
        exploratory[row['id']]=calculate(scored)
        dimensions.append(dimension)
    reports=[]
    for row in con.execute('''SELECT c.id,c.research_status,c.event_cluster_id,
       count(DISTINCT a.passage_id) as attestation_count,
       count(DISTINCT CASE WHEN a.dependence_group IS NOT NULL THEN a.dependence_group END) AS recorded_dependence_groups
       FROM claims c LEFT JOIN attestations a ON a.claim_id=c.id
       GROUP BY c.id ORDER BY c.id'''):
        reports.append(dict(row))
    relations=[dict(r) for r in con.execute('''SELECT id,claim_a,claim_b,relation_type,adjudication
                              FROM claim_relations ORDER BY id''')]
    result = {
        'schemaVersion':1,
        'databaseVersion':con.execute('PRAGMA user_version').fetchone()[0],
        'counts':{k:count(k) for k in ('collections','passages','claims','attestations',
            'claim_relations','historicity_reviews','dimension_reviews','bibliography')},
        'statusCounts':statuses,
        'dimensions':dimensions,
        'claims':reports,
        'relations':relations,
        'quantitativeProfile': None,
        'exploratoryIndicators': exploratory,
        'modelVersion': MODEL_VERSION,
        'quantitativeProfileReason':'No research claim has reviewed historical plausibility and consensus dimension assessment. The dashboard deliberately displays no personality score.',
        'unitOfAnalysis':'Independent historical event clusters, not number of parallel narrations',
    }
    con.close()
    return result


def main() -> None:
    payload=export()
    SNAPSHOT.write_text(json.dumps(payload,ensure_ascii=False,indent=2,sort_keys=True)+'\n',encoding='utf-8')
    PUBLISHED_DB.write_bytes(DATABASE.read_bytes())
    print(f'Exported {payload["counts"]["claims"]} claims; {payload["counts"]["historicity_reviews"]} historicity reviews, {payload["counts"]["dimension_reviews"]} dimension reviews. No personality score.')


if __name__=='__main__':
    main()
