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



def validate_networks(research):
    """Reject network links lacking identifiable sources or an explicit event."""
    net = json.loads((ROOT/'site'/'data'/'networks.json').read_text(encoding='utf8'))
    verify(net.get('schemaVersion') == 1, 'Invalid graph schema')
    for kind in ('persons','eventRoles','relationships','transmissions','sources'):
        verify(isinstance(net.get(kind),list), f'Expected list: {kind}')
        ids = [rec.get('id') for rec in net[kind]]
        verify(all(isinstance(i,str) and i.strip() for i in ids)
               and len(set(ids)) == len(ids), f'Duplicate or empty IDs: {kind}')
    persons = {p['id'] for p in net['persons']}
    verify('PERSON-MUHAMMAD' in persons
           and sum(p.get('isResearchSubject') is True for p in net['persons']) == 1,
           'Missing or duplicate research subject')
    for person in net['persons']:
        for field in ('names','notes'):
            verify(set(person.get(field,{})) == set(LOCALES), f'Incomplete person {field}: {person["id"]}')
            verify(all(isinstance(person[field][lc],str) and person[field][lc].strip() for lc in LOCALES),
                   f'Blank person {field}: {person["id"]}')
    sources = {s['id']:s for s in net['sources']}
    for source in sources.values():
        verify(source.get('tradition') in ('sunni','shia','shared'), f'Invalid tradition: {source["id"]}')
        verify(isinstance(source.get('url'),str) and source['url'].startswith('https://')
               and bool(source.get('label')), f'Uncited source: {source["id"]}')
    events = {x['id'] for x in research['cases']} | {x['id'] for x in research['chronology']['quranPassages']}
    for kind in ('eventRoles','relationships','transmissions'):
        for link in net[kind]:
            lid=link['id']
            verify(link.get('reviewStatus') in ('candidate','reviewed','disputed'), f'Invalid status: {lid}')
            refs=link.get('sourceIds')
            verify(isinstance(refs,list) and len(refs)>0 and len(refs)==len(set(refs))
                   and all(ref in sources for ref in refs), f'Missing exact citations: {lid}')
            verify(set(link.get('labels',{})) == set(LOCALES)
                   and all(isinstance(link['labels'][lc],str) and link['labels'][lc].strip() for lc in LOCALES),
                   f'Missing localized link labels: {lid}')
            if link['reviewStatus']=='reviewed':
                verify(all(link.get(k) for k in ('reviewedBy','reviewedAt','reviewRationale')),
                       f'Reviewed link missing review metadata: {lid}')
            if kind=='eventRoles':
                verify(link.get('personId') in persons and link.get('eventId') in events,
                       f'Invalid event role: {lid}')
            elif kind=='relationships':
                verify(link.get('personAId') in persons and link.get('personBId') in persons
                       and link['personAId']!=link['personBId'], f'Invalid relationship: {lid}')
                verify(isinstance(link.get('eventIds'),list) and
                       all(e in events for e in link['eventIds']), f'Invalid relationship event IDs: {lid}')
            else:
                verify(link.get('fromPersonId') in persons and link.get('toPersonId') in persons
                       and link['fromPersonId']!=link['toPersonId'] and link.get('eventId') in events,
                       f'Invalid isnad edge: {lid}')
    print(f'OK: {len(persons)} persons, {len(net["relationships"])} ties, '
          f'{len(net["transmissions"])} transmission edges.')

def main():
    data = json.loads(RESEARCH.read_text(encoding='utf8'))
    verify(data['schemaVersion'] == 2, 'Unexpected schema version')
    validate_networks(data)
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
        verify(case.get('claimKind') in ('instruction','statement','event','action'), f'Invalid claim kind for {ident}')
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
    verify(len({q['id'] for q in data['chronology']['quranPassages']}) == len(data['chronology']['quranPassages']), 'Duplicate Qurʾanic passage IDs')
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
