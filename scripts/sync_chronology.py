#!/usr/bin/env python3
'''Idempotently sync bibliographic source scope and explicitly documented dates.

No chain is classified as authentic; unplaced reports are never assigned years.
The presence of a collection in a corpus is not evidence of sectarian endorsement.
'''
from pathlib import Path
import sqlite3
import json

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'site/data/research.json'
DB=ROOT/'database/research.sqlite'
SOURCE_IDS={'abudawud':'ABU_DAWUD','ibnmajah':'IBN_MAJAH'}
SQL=ROOT/'database/migrations/002_traditions_chronology.sql'

def main():
    catalog=json.loads(SOURCE.read_text(encoding='utf-8'))
    with sqlite3.connect(DB) as con:
        con.execute('PRAGMA foreign_keys=ON')
        con.executescript(SQL.read_text(encoding='utf-8'))
        with con:
            for c in catalog['collections']:
                genre='quran' if c['id']=='quran' else 'hadith'
                tradition='other' if c['tradition']=='shared' else c['tradition']
                con.execute('''INSERT INTO collections(id,title_en,tradition,genre,compilation_note)
                    VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                    title_en=excluded.title_en,tradition=excluded.tradition,genre=excluded.genre''',
                    (SOURCE_IDS.get(c['id'],c['id'].upper()),c['name'],tradition,genre,
                     'Catalog only; specific passages and acceptance not assessed.'))
            for q in catalog['chronology']['quranPassages']:
                locator=q['reference'].replace('Q ','')
                con.execute('''INSERT INTO passages(id,collection_id,locator,edition,original_text,
                    permalink,transcription_status) VALUES(?, 'QURAN', ?, 'quran.com', ?, ?, 'unverified')
                    ON CONFLICT(id) DO UPDATE SET permalink=excluded.permalink''',
                    (q['id'],locator,q['arabicExcerpt'],q['url']))
            for item in catalog['chronology']['quranPassages'] + catalog['cases']:
                quran=item['id'].startswith('Q-')
                dt=item['chronology']
                values=(item['id'],'quran_passage' if quran else 'reported_event',item['id'],
                        dt['period'],dt['startYear'],dt['endYear'],dt['status'],
                        dt['confidence'],dt['basis'],item['url'] if quran else item['refs'][0]['url'])
                con.execute('''INSERT INTO chronology_entries(id,subject_type,subject_id,reported_period,
                    start_year,end_year,date_status,confidence_label,date_basis,primary_url)
                    VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                    reported_period=excluded.reported_period,start_year=excluded.start_year,
                    end_year=excluded.end_year,date_status=excluded.date_status,
                    confidence_label=excluded.confidence_label,date_basis=excluded.date_basis,
                    primary_url=excluded.primary_url''',values)
            for pair in catalog['chronology']['comparisons']:
                con.execute('''INSERT INTO chronology_comparisons(id,quran_entry_id,hadith_entry_id,
                    link_type,assessed_order,rationale) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                    link_type=excluded.link_type,assessed_order=excluded.assessed_order,rationale=excluded.rationale''',
                    (pair['id'],pair['quranId'],pair['caseId'],pair['relation'],pair['order'],pair['basis']))
            con.execute('PRAGMA user_version = 2')
        if con.execute('PRAGMA integrity_check').fetchone()[0]!='ok':
            raise ValueError('SQLite integrity_check failed')
        print(f'OK: {con.execute("SELECT COUNT(*) FROM chronology_entries").fetchone()[0]} chronology entries; '
              f'{con.execute("SELECT COUNT(*) FROM chronology_comparisons").fetchone()[0]} unresolved precedence pairs.')
if __name__=='__main__':main()
