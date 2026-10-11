#!/usr/bin/env python3
"""Dependency-free validation for GitHub Pages research data and locale completeness."""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
RESEARCH = ROOT / 'site' / 'data' / 'research.json'
LOCALES = ['cs', 'en', 'ar', 'id']


def verify(condition, msg):
    if not condition:
        raise ValueError(msg)


def main():
    data = json.loads(RESEARCH.read_text(encoding='utf8'))
    verify(data['schemaVersion'] == 2, 'Unexpected schema version')
    verify(sum(c['tradition']=='sunni' for c in data['collections']) == 6, 'Expected six Sunni hadith collections')
    verify(sum(c['tradition']=='shia' for c in data['collections']) == 4, 'Expected four Twelver Shiʿi collections')
    verify(sum(c['tradition']=='shared' for c in data['collections']) == 1, 'Expected shared Qurʾan source')
    ids = set()
    for case in data['cases']:
        ident = case['id']
        verify(re.fullmatch(r'MUH-\d{3}', ident), f'Bad case ID: {ident}')
        verify(ident not in ids, f'Duplicate case ID: {ident}')
        ids.add(ident)
        verify(case['sourceTradition'] in ('sunni','shia','shared'), f'Missing tradition for {ident}')
        verify(case['chronology']['period'] in ('meccan','medinan','unplaced'), f'Bad period for {ident}')
        verify(case['confidence'] == 'unassessed', f'Premature confidence claim: {ident}')
        verify(case['refs'], f'Missing primary references: {ident}')
        verify(case['arabicExcerpt'], f'Missing Arabic excerpt: {ident}')
        for ref in case['refs']:
            verify(ref['url'].startswith('https://'), f'Insecure reference for {ident}')
            verify(ref['label'], f'Empty reference label for {ident}')
            verify(ref.get('tradition') == case['sourceTradition'] and ref.get('collectionId'), f'Missing attestation tradition for {ident}')
        verify(set(case['translations']) == set(LOCALES), f'Incomplete case locales: {ident}')
        for lc, tr in case['translations'].items():
            for key in ('title', 'summary', 'question', 'note'):
                verify(isinstance(tr.get(key), str) and tr[key].strip(), f'Missing {lc}.{key}: {ident}')
    verify(set(q['id'] for q in data['chronology']['quranPassages']) == {'Q-002-190','Q-060-008'}, 'Unexpected pilot Qurʾanic passages')
    for q in data['chronology']['quranPassages']:
        verify(q['tradition']=='shared' and q['url'].startswith('https://'), f'Invalid shared passage: {q["id"]}')
        verify(q['chronology']['status']=='broad_sura_classification', 'Verse dates cannot be overstated')
        verify(set(q['translations'])==set(LOCALES), f'Missing Quran translations: {q["id"]}')
        for lc in LOCALES:
            verify(all(q['translations'][lc].get(k) for k in ('title','summary')), f'Missing Qurʾanic translation in {lc}')
    for p in data['chronology']['comparisons']:
        verify(p['order']=='undetermined', 'Unjustified chronology conclusion')
        verify(p['caseId'] in ids and p['quranId'] in {q['id'] for q in data['chronology']['quranPassages']}, 'Invalid chronology links')
    profile=data['profile']
    verify(profile['status']=='candidate_research_map', 'Candidate profile map must not imply verified behavioral traits')
    dimension_ids={r[0] for r in __import__('sqlite3').connect(ROOT/'database/research.sqlite').execute('SELECT id FROM dimensions')}
    verify({x['id'] for x in profile['dimensions']}==dimension_ids, 'Behavioral profile must cover the SQLite research dimensions')
    for item in profile['dimensions']:
        verify(len(item['caseIds'])==len(set(item['caseIds'])) and set(item['caseIds']).issubset(ids), 'Invalid candidate case references')
        tension_ids = set()
    for tension in data['tensions']:
        ident = tension['id']
        verify(re.fullmatch(r'CR-\d{3}', ident), f'Bad tension ID: {ident}')
        verify(ident not in tension_ids, f'Duplicate tension ID: {ident}')
        tension_ids.add(ident)
        verify(tension['status'] == 'unresolved', f'Premature adjudication: {ident}')
        verify(len(tension['caseIds']) > 1 and all(x in ids for x in tension['caseIds']), f'Broken links in tension {ident}')
        verify(set(tension['translations']) == set(LOCALES), f'Incomplete tension locales: {ident}')
        for lc, tr in tension['translations'].items():
            for key in ('title', 'summary', 'question'):
                verify(isinstance(tr.get(key), str) and tr[key].strip(), f'Missing {lc}.{key}: {ident}')
    for collection in data['collections']:
        verify(collection['url'].startswith('https://'), f'Bad collection URL: {collection}')
    for book in data['bibliography']:
        verify(book['url'].startswith('https://'), f'Bad bibliography URL: {book}')
    locale_script = (ROOT/'site'/'i18n.js').read_text(encoding='utf8')
    verify(all(f' {lc}: {{' in locale_script for lc in LOCALES), 'Missing interface locale(s)')
    verify((ROOT/'site'/'.nojekyll').exists(), 'Missing .nojekyll')
    verify((ROOT/'database'/'research.sqlite').exists(), 'Missing canonical SQLite database')
    verify((ROOT/'site'/'data'/'quantitative.json').exists(), 'Missing published quantitative data')
    verify((ROOT/'site'/'data'/'research.sqlite').exists(), 'Missing published SQLite snapshot')
    import sqlite3
    with sqlite3.connect(ROOT/'database/research.sqlite') as con:
        verify(con.execute('PRAGMA user_version').fetchone()[0] == 2, 'Expected SQLite schema version 2')
        verify(con.execute('SELECT COUNT(*) FROM chronology_entries').fetchone()[0] == len(data['chronology']['quranPassages'])+len(ids), 'Missing chronology DB records')
        verify(con.execute('SELECT COUNT(*) FROM chronology_comparisons').fetchone()[0] == len(data['chronology']['comparisons']), 'Missing chronology comparisons')
    print(f'OK: {len(data["collections"])} collections, {len(ids)} cases, '
          f'{len(tension_ids)} unresolved tensions, {len(data["bibliography"])} bibliography entries, '
          f'{len(LOCALES)} locales.')


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f'ERROR: {e}', file=sys.stderr)
        raise SystemExit(1)
