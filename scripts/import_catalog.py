#!/usr/bin/env python3
"""Import research catalog candidates into canonical SQLite register, idempotently.

This only imports *textual reports*. It does not claim events actually occurred,
and deliberately does NOT create expert numeric reviews or derived personality scores.
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'site/data/research.json'
DB = ROOT / 'database/research.sqlite'
SOURCES = {
    'bukhari': 'BUKHARI', 'muslim': 'MUSLIM', 'abudawud': 'ABU_DAWUD',
    'tirmidhi': 'TIRMIDHI', 'nasai': 'NASAI', 'ibnmajah': 'IBN_MAJAH',
}

def main() -> None:
    research = json.loads(CATALOG.read_text(encoding='utf-8'))
    with sqlite3.connect(DB) as con:
        con.execute('PRAGMA foreign_keys=ON')
        with con:
            for case in research['cases']:
                claim_id = case['id']
                english = case['translations']['en']
                con.execute('''INSERT INTO claims(id,event_cluster_id,proposition_en,claim_kind,period,research_status)
                    VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                    proposition_en=excluded.proposition_en''',
                    (claim_id, claim_id, english['summary'], case['claimKind'],
                     None, 'candidate'))
                for language, fields in case['translations'].items():
                    for field, body in fields.items():
                        con.execute('''INSERT INTO localized_texts(entity_type,entity_id,field,lang,body)
                            VALUES('claim',?,?,?,?) ON CONFLICT(entity_type,entity_id,field,lang)
                            DO UPDATE SET body=excluded.body''', (claim_id,field,language,body))
                for n, ref in enumerate(case['refs']):
                    link = urlparse(ref['url'])
                    if link.netloc != 'sunnah.com' or ':' not in link.path:
                        raise ValueError(f'Unexpected source format: {ref["url"]}')
                    collection, locator = link.path.strip('/').split(':', 1)
                    source_id = SOURCES[collection]
                    passage_id = f'{source_id}:{locator}'
                    # The Arabic excerpt belongs to the lead citation only; other
                    # versions must be checked against their own exact wording.
                    excerpt = case['arabicExcerpt'] if n == 0 else None
                    con.execute('''INSERT INTO passages(
                        id,collection_id,locator,edition,original_text,permalink,transcription_status)
                        VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                        permalink=excluded.permalink''',
                        (passage_id,source_id,locator,'sunnah.com',excerpt,ref['url'],'unverified'))
                    con.execute('''INSERT OR IGNORE INTO attestations(
                        claim_id,passage_id,stance,dependence_group,rationale)
                        VALUES(?,?, 'mentions', NULL, ?)''',
                        (claim_id,passage_id,'Textual attestation only; historical status unassessed.'))
            for item in research['tensions']:
                if len(item['caseIds']) != 2:
                    raise ValueError(f'Relation requires exactly two claims: {item["id"]}')
                con.execute('''INSERT INTO claim_relations(id,claim_a,claim_b,relation_type,adjudication,explanation)
                    VALUES(?,?,?,'possible_conflict','open',NULL) ON CONFLICT(id) DO NOTHING''',
                    (item['id'], *item['caseIds']))
                for language, fields in item['translations'].items():
                    for field, body in fields.items():
                        con.execute('''INSERT INTO localized_texts(entity_type,entity_id,field,lang,body)
                            VALUES('relation',?,?,?,?) ON CONFLICT(entity_type,entity_id,field,lang)
                            DO UPDATE SET body=excluded.body''', (item['id'],field,language,body))
            for i, book in enumerate(research['bibliography'], 1):
                con.execute('''INSERT INTO bibliography(id,title,authors,year,url,work_type,full_text_examined)
                    VALUES (?,?,?,?,?,'study',0) ON CONFLICT(id) DO UPDATE SET
                    title=excluded.title,authors=excluded.authors,year=excluded.year,url=excluded.url''',
                    (f'BIB-{i:03}',book['title'],book['author'],book['year'],book['url']))
        check=con.execute('PRAGMA integrity_check').fetchone()[0]
        if check != 'ok':
            raise ValueError(f'Database integrity check: {check}')
        print('Imported:',con.execute('SELECT COUNT(*) FROM claims').fetchone()[0],
              'claims,',con.execute('SELECT COUNT(*) FROM passages').fetchone()[0],
              'passages,',con.execute('SELECT COUNT(*) FROM claim_relations').fetchone()[0],
              'open relations.')


if __name__ == '__main__':
    main()
