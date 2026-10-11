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
    verify(data['schemaVersion'] == 1, 'Unexpected schema version')
    verify(len(data['collections']) == 6, 'Expected six core hadith collections')
    ids = set()
    for case in data['cases']:
        ident = case['id']
        verify(re.fullmatch(r'MUH-\d{3}', ident), f'Bad case ID: {ident}')
        verify(ident not in ids, f'Duplicate case ID: {ident}')
        ids.add(ident)
        verify(case['confidence'] == 'unassessed', f'Premature confidence claim: {ident}')
        verify(case['refs'], f'Missing primary references: {ident}')
        verify(case['arabicExcerpt'], f'Missing Arabic excerpt: {ident}')
        for ref in case['refs']:
            verify(ref['url'].startswith('https://'), f'Insecure reference for {ident}')
            verify(ref['label'], f'Empty reference label for {ident}')
        verify(set(case['translations']) == set(LOCALES), f'Incomplete case locales: {ident}')
        for lc, tr in case['translations'].items():
            for key in ('title', 'summary', 'question', 'note'):
                verify(isinstance(tr.get(key), str) and tr[key].strip(), f'Missing {lc}.{key}: {ident}')
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
    print(f'OK: {len(data["collections"])} collections, {len(ids)} cases, '
          f'{len(tension_ids)} unresolved tensions, {len(data["bibliography"])} bibliography entries, '
          f'{len(LOCALES)} locales.')


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f'ERROR: {e}', file=sys.stderr)
        raise SystemExit(1)
