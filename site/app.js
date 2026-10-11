(() => {
  'use strict';
  const sections = [
    ['overview', 'navOverview', '▦'],
    ['cases', 'navCases', '◫'],
    ['tensions', 'navTensions', '⧉'],
    ['chronology', 'navChronology', '↔'],
    ['profile', 'navProfile', '◉'],
    ['quantitative', 'navQuant', '◉'],
    ['sources', 'navSources', '▤'],
    ['method', 'navMethod', '◎']
  ];
  const languages = ['cs','en','ar','id'];
  const traditions = ['both', 'sunni', 'shia'];
  const html = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const safeURL = value => /^https:\/\//i.test(value ?? '') ? html(value) : '#';
  const el = id => document.getElementById(id);
  const storedLanguage = (() => { try { return localStorage.getItem('islam-language'); } catch { return null; } })();
  let lang = languages.includes(storedLanguage) ? storedLanguage : 'en';
  const storedTradition = (() => { try { return localStorage.getItem('islam-tradition'); } catch { return null; } })();
  let tradition = traditions.includes(storedTradition) ? storedTradition : 'both';
  let timelineTopic = 'all';
  let db;
  let metrics;
  let section = 'overview';
  let query = '';
  let topic = 'all';
  const t = key => window.I18N[lang][key] ?? window.I18N.en[key] ?? key;
  const local = obj => obj.translations?.[lang] ?? obj.translations?.en ?? {};
  const visibleCase = item => tradition === 'both' || item.refs.some(ref => ref.tradition === tradition || ref.tradition === 'shared');
  const visibleRefs = item => tradition === 'both' ? item.refs : item.refs.filter(ref => ref.tradition === tradition || ref.tradition === 'shared');
  const visibleCases = () => db.cases.filter(visibleCase);
  const visibleTensions = () => db.tensions.filter(row => row.caseIds.every(id => visibleCases().some(item=>item.id===id)));
  const visibleCollections = () => db.collections.filter(item => tradition === 'both' || item.tradition === tradition || item.tradition === 'shared');
  const topicLabel = name => t({ethics:'topicEthics',warfare:'topicWarfare',leadership:'topicLeadership',mercy:'topicMercy'}[name] ?? name);
  const link = (url, label, cls = '') => `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer" class="${cls}">${html(label)} <span aria-hidden="true">↗</span></a>`;
  const refLinks = refs => refs.map(ref => link(ref.url, ref.label, 'ref-link')).join('');
  const caseCard = item => {
    const content = local(item);
    return `<article class="case-card">
      <div class="case-card-head"><span class="case-symbol" aria-hidden="true">${html(item.icon)}</span><span class="case-id">${html(item.id)}</span></div>
      <div class="case-tag">${html(topicLabel(item.theme))}</div>
      <h3>${html(content.title)}</h3><p>${html(content.summary)}</p>
      <div class="case-bottom"><span class="small-status"><span class="status-dot"></span>${html(t('underReview'))}</span><button type="button" class="inline-button" data-open-case="${html(item.id)}">${html(t('readCase'))} <span aria-hidden="true">→</span></button></div>
    </article>`;
  };
  const sectionHeading = (eyebrow, title, intro) => `<div class="section-heading"><div class="eyebrow">${html(t(eyebrow))}</div><h1>${html(t(title))}</h1><p>${html(t(intro))}</p></div>`;

  function overview() {
    const topCards = visibleCases().slice(0,3).map(caseCard).join('');
    const firstTension = visibleTensions()[0];
    return `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="line-accent"></span>${html(t('eyebrow'))}</div><h1>${html(t('heroTitle'))}</h1><p>${html(t('heroText'))}</p>
        <div class="hero-actions"><a class="primary-button" href="#cases">${html(t('browseBtn'))} <span aria-hidden="true">↗</span></a><a class="secondary-button" href="#method">${html(t('methodologyBtn'))} <span aria-hidden="true">→</span></a></div></div>
        <div class="hero-art" aria-hidden="true"><div class="art-ring art-ring-1"></div><div class="art-ring art-ring-2"></div><div class="art-ring art-ring-3"></div><div class="art-center">◈</div><div class="art-code">CRITICAL<br>HISTORIOGRAPHY<br>01 — 2026</div></div></section>
      <section class="stats" aria-label="Research statistics">
       <div class="stat"><strong>${visibleCollections().length}</strong><span>${html(t('primarySources'))}</span></div><div class="stat"><strong>${visibleCases().length}</strong><span>${html(t('caseCount'))}</span></div><div class="stat"><strong>${visibleTensions().length}</strong><span>${html(t('tensionCount'))}</span></div><div class="stat"><strong>4</strong><span>${html(t('languages'))}</span></div>
      </section>
      <div class="content-section"><div class="section-titleline"><div><div class="micro-label">01 / ${html(t('pilot'))}</div><h2>${html(t('studiesTitle'))}</h2><p>${html(t('studiesDesc'))}</p></div><a class="text-link" href="#cases">${html(t('viewAll'))} →</a></div><div class="case-grid">${topCards || `<p class="empty">${html(t('sectNoCases'))}</p>`}</div></div>
      <div class="lower-grid"><section class="panel timeline-panel"><div class="micro-label">570 — 632 CE</div><h2>${html(t('timelineTitle'))}</h2><p>${html(t('timelineSub'))}</p><div class="timeline">${[['c. 570','birth'],['c. 610','revelation'],['622','hijra'],['632','death']].map(([year,key])=>`<div class="timeline-row"><b dir="ltr">${html(year)}</b><span>${html(t(key))}</span></div>`).join('')}</div></section>
       <section class="panel tension-panel"><div class="micro-label">CR-001 / ${html(t('unresolved'))}</div><h2>${html(t('tensionTitle'))}</h2><p>${html(t('tensionDesc'))}</p><div class="tension-box"><span class="tension-symbol">≠ ?</span><h3>${html((firstTension ? local(firstTension).title : t('sectNoTensions')))}</h3><p>${html((firstTension ? local(firstTension).summary : t('sectNoCases')))}</p><a class="text-link" href="#tensions">${html(t('openRegister'))} →</a></div></section></div>
      <aside class="principle"><div class="principle-icon">“</div><div><h3>${html(t('guidelineTitle'))}</h3><p>${html(t('guidelineText'))}</p></div></aside>`;
  }
  function casesPage() {
    const filtered = visibleCases().filter(item => (topic==='all' || item.theme===topic) && (`${item.id} ${Object.values(local(item)).join(' ')} ${item.refs.map(x=>x.label).join(' ')}`).toLocaleLowerCase(lang).includes(query.toLocaleLowerCase(lang)));
    return `${sectionHeading('casesEyebrow','casesTitle','casesDesc')}
      <div class="filters"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="caseSearch" type="search" value="${html(query)}" placeholder="${html(t('searchPlaceholder'))}" aria-label="${html(t('searchPlaceholder'))}"></label>
      <select id="topicFilter" aria-label="${html(t('allTopics'))}">${[['all','allTopics'],['warfare','topicWarfare'],['mercy','topicMercy'],['leadership','topicLeadership']].map(([id,k])=>`<option value="${id}" ${topic===id?'selected':''}>${html(t(k))}</option>`).join('')}</select></div>
      <div class="case-grid case-list" id="caseList">${filtered.length ? filtered.map(caseCard).join('') : `<p class="empty">${html(t(tradition!=='both' && visibleCases().length===0?'sectNoCases':'noneFound'))}</p>`}</div><p class="footnote">${html(t('noScoring'))}</p>`;
  }
  function tensionsPage() {
    return `${sectionHeading('tensionsEyebrow','tensionsTitle','tensionsIntro')}
      <div class="tension-stack">${visibleTensions().map(row=>`<article class="register-card"><div class="register-head"><code>${html(row.id)}</code><span class="warning-pill">◌ ${html(t('unresolved'))}</span></div><h2>${html(local(row).title)}</h2><p>${html(local(row).summary)}</p><div class="research-question"><span>?</span><p>${html(local(row).question)}</p></div><div class="linked-row"><span>${html(t('linkedCases'))}</span>${row.caseIds.map(id=>`<button type="button" class="case-chip" data-open-case="${html(id)}">${html(id)} ↗</button>`).join('')}</div></article>`).join('') || `<p class="empty">${html(t('sectNoTensions'))}</p>`}</div><p class="footnote">${html(t('methodReminder'))}</p>`;
  }
  function sourcesPage() {
    return `${sectionHeading('sourcesEyebrow','sourcesTitle','sourcesIntro')}<div class="micro-label source-section-label">01 / ${html(t('collections'))}</div><div class="source-list">${visibleCollections().map((item,i)=>`<div class="source-row"><span class="source-index">${String(i+1).padStart(2,'0')}</span><div class="source-info"><h3 dir="auto">${html(item.name)}</h3><small>${html(item.date)}</small></div>${link(item.url,t('openSource'),'text-link')}</div>`).join('')}</div>
      <div class="micro-label source-section-label">02 / ${html(t('bibliography'))}</div><div class="source-list">${db.bibliography.map((item,i)=>`<div class="source-row"><span class="source-index">${String(i+1).padStart(2,'0')}</span><div class="source-info"><h3>${html(item.title)}</h3><small>${html(item.author)} · ${html(item.year)} · ${html(item.publisher)}</small></div>${link(item.url,t('openSource'),'text-link')}</div>`).join('')}</div>`;
  }
  function methodPage() {
    const stages = [['methodA','methodAD'],['methodB','methodBD'],['methodC','methodCD'],['methodD','methodDD']];
    return `${sectionHeading('methodEyebrow','methodTitle','methodIntro')}<div class="method-grid">${stages.map(([a,b],i)=>`<div class="method-card"><div class="method-step">${String(i+1).padStart(2,'0')}</div><h2>${html(t(a))}</h2><p>${html(t(b))}</p></div>`).join('')}</div><section class="rule-section"><div class="micro-label">PROTOCOL / 01</div><h2>${html(t('methodologyRules'))}</h2><div class="rules-list">${[1,2,3,4,5,6].map(i=>`<div><span>✓</span><p>${html(t('rule'+i))}</p></div>`).join('')}</div></section>`;
  }
  function quantitativePage() {
    const scopedClaims = metrics.claims.filter(row => visibleCases().some(c=>c.id===row.id));
    const scopedTensions = visibleTensions();
    const count = tradition==='both' ? metrics.counts : { ...metrics.counts, claims:scopedClaims.length, passages:scopedClaims.reduce((n,c)=>n+visibleRefs(db.cases.find(item=>item.id===c.id)).length,0)+db.chronology.quranPassages.length, claim_relations:scopedTensions.length, historicity_reviews:0 };
    const phases = [
      ['candidate','quantCandidate'],['in_review','quantInReview'],
      ['reviewed','quantReviewed'],['withdrawn','quantWithdrawn']
    ];
    const phaseBars = phases.map(([id,key]) => {
      const n = tradition==='both' ? (metrics.statusCounts[id] ?? 0) : scopedClaims.filter(c=>c.research_status===id).length;
      const width = count.claims ? Math.round(n / count.claims * 100) : 0;
      return `<div class="quant-phase"><div class="quant-phase-caption"><span>${html(t(key))}</span><b>${n}</b></div><div class="quant-track" role="meter" aria-label="${html(t(key))}" aria-valuemin="0" aria-valuemax="${count.claims}" aria-valuenow="${n}"><span style="width:${width}%"></span></div></div>`;
    }).join('');
    const dimensionNames = {
      civilian_protection:'quantDimCivilian',coercion:'quantDimCoercion',
      equal_treatment:'quantDimEquality',mercy:'quantDimMercy',
      norm_consistency:'quantDimNorms',power_use:'quantDimPower'
    };
    const dimensions = metrics.dimensions.map(d=>`<div class="quant-dimension"><span>${html(t(dimensionNames[d.id] ?? d.id))}</span><strong>${d.reviewed_clusters}</strong></div>`).join('');
    const candidates = scopedClaims.map(row=>`<tr><td><button type="button" class="case-chip" data-open-case="${html(row.id)}">${html(row.id)} ↗</button></td><td>${row.attestation_count}</td><td>${html(t(({candidate:'quantCandidate',in_review:'quantInReview',reviewed:'quantReviewed',withdrawn:'quantWithdrawn'})[row.research_status] ?? 'quantCandidate'))}</td><td>${row.recorded_dependence_groups ? row.recorded_dependence_groups : '—'}</td></tr>`).join('');
    return `${sectionHeading('quantEyebrow','quantTitle','quantIntro')}
      <section class="quant-stats" aria-label="${html(t('quantCoverage'))}">
        ${[['claims','quantClaims'],['passages','quantPassages'],['claim_relations','quantRelations'],['historicity_reviews','quantReviews']].map(([k,trans])=>`<div class="quant-stat"><strong>${count[k]}</strong><span>${html(t(trans))}</span></div>`).join('')}
      </section>
      <div class="quant-grid">
        <section class="panel"><div class="micro-label">DATA QUALITY / 01</div><h2>${html(t('quantCoverage'))}</h2><p>${html(t('quantCoverageDesc'))}</p><div class="quant-phases">${phaseBars}</div></section>
        <section class="panel"><div class="micro-label">EVIDENCE / 02</div><h2>${html(t('quantDimensions'))}</h2><p>${html(t('quantDimensionsDesc'))}</p><div class="quant-dimensions">${dimensions}</div></section>
      </div>
      <section class="quant-warning" role="note"><span class="quant-warning-symbol" aria-hidden="true">∅</span><div><h2>${html(t('quantNoScoreTitle'))}</h2><p>${html(t('quantNoScoreDesc'))}</p></div></section>
      <section class="panel quant-table-panel"><div class="micro-label">EVIDENCE / 03</div><h2>${html(t('quantRegisterTitle'))}</h2><p>${html(t('quantRegisterDesc'))}</p><div class="quant-table-wrap"><table class="quant-table"><thead><tr><th>${html(t('quantClaimId'))}</th><th>${html(t('quantAttestations'))}</th><th>${html(t('quantStatus'))}</th><th>${html(t('quantDependence'))}</th></tr></thead><tbody>${candidates || `<tr><td colspan="4">${html(t('sectNoCases'))}</td></tr>`}</tbody></table></div></section>
      <div class="quant-download"><div><h3>${html(t('quantDownloadTitle'))}</h3><p>${html(t('quantDownloadDesc'))}</p></div><a class="primary-button" href="./data/research.sqlite" download="research.sqlite">${html(t('quantDownload'))} ↓</a></div>
      <p class="footnote">${html(t('quantFootnote'))}</p>`;
  }
  // Timeline dates refer to reported event/revelation, not manuscript or compilation dates.
  // Precedence is asserted only for individually vetted, disjoint date ranges.
  function orderByEvidence(a,b) {
    const da=a.chronology, dbb=b.chronology;
    if (!da || !dbb || da.status!=='independently_dated' || dbb.status!=='independently_dated' ||
        !Number.isInteger(da.startYear) || !Number.isInteger(da.endYear) ||
        !Number.isInteger(dbb.startYear) || !Number.isInteger(dbb.endYear)) return 'undetermined';
    if (da.endYear<dbb.startYear) return 'before';
    if (dbb.endYear<da.startYear) return 'after';
    return 'undetermined';
  }
  function chronologyPage() {
    const quran = db.chronology.quranPassages.filter(x=>timelineTopic==='all'||x.theme===timelineTopic);
    const reports = visibleCases().filter(x=>timelineTopic==='all'||x.theme===timelineTopic);
    const dateLabel = node => node.chronology?.period==='medinan'?t('chronBroadMedinan'):t('chronUndatedLabel');
    const qCard = q => `<article class="chron-card chron-quran"><div class="chron-card-top"><span class="chron-reference">${html(q.reference)}</span><span class="chron-period">${html(dateLabel(q))}</span></div><h3>${html(local(q).title)}</h3><p>${html(local(q).summary)}</p><blockquote lang="ar" dir="rtl">${html(q.arabicExcerpt)}</blockquote><p class="chron-caveat">${html(t('chronVerseCaveat'))}</p>${link(q.url,t('openSource'),'text-link')}</article>`;
    const hCard = c => `<article class="chron-card chron-hadith"><div class="chron-card-top"><span class="chron-reference">${html(c.id)}</span><span class="chron-period">${html(dateLabel(c))}</span></div><h3>${html(local(c).title)}</h3><p>${html(local(c).summary)}</p><blockquote lang="ar" dir="rtl">${html(c.arabicExcerpt)}</blockquote><p class="chron-caveat">${html(t('chronHadithCaveat'))}</p><div class="chron-actions">${refLinks(visibleRefs(c))}<button type="button" class="inline-button" data-open-case="${html(c.id)}">${html(t('readCase'))} →</button></div></article>`;
    const qMedinan=quran.filter(q=>q.chronology.period==='medinan');
    const qUnknown=quran.filter(q=>q.chronology.period!=='medinan');
    const knownHadith=reports.filter(r=>r.chronology?.status==='independently_dated' && r.chronology?.period==='medinan');
    const unknownHadith=reports.filter(r=>!knownHadith.includes(r));
    const lane=(label,description,qs,hs)=>`<section class="chron-period-group"><div class="chron-period-heading"><strong>${html(label)}</strong><span>${html(description)}</span></div><div class="chron-period-grid"><div class="chron-lane">${qs.length?qs.map(qCard).join(''):`<p class="chron-empty">${html(t('chronNoQuran'))}</p>`}</div><div class="chron-rail" aria-hidden="true"><i></i></div><div class="chron-lane">${hs.length?hs.map(hCard).join(''):`<p class="chron-empty">${html(t('chronNoHadith'))}</p>`}</div></div></section>`;
    const relevantPairs = db.chronology.comparisons.filter(pair=>quran.some(q=>q.id===pair.quranId)&&reports.some(c=>c.id===pair.caseId));
    const comparisons = relevantPairs.map(pair=>{
      const q=quran.find(x=>x.id===pair.quranId),h=reports.find(x=>x.id===pair.caseId);
      const order=orderByEvidence(q,h);
      return `<div class="chron-comparison"><span><b>${html(q.reference)}</b> ↔ <b>${html(h.id)}</b></span><span class="chron-order">${html(t(order==='undetermined'?'chronOrderUnknown':order==='before'?'chronOrderBefore':'chronOrderAfter'))}</span></div>`;
    }).join('');
    return `${sectionHeading('chronEyebrow','chronTitle','chronIntro')}
      <div class="chron-notice" role="note"><strong>${html(t('chronMethodTitle'))}</strong><p>${html(t('chronMethodDesc'))}</p></div>
      <div class="filters"><label for="chronTopic">${html(t('chronFilter'))}</label><select id="chronTopic">${[['all','allTopics'],['warfare','topicWarfare'],['mercy','topicMercy'],['leadership','topicLeadership']].map(([value,key])=>`<option value="${value}" ${timelineTopic===value?'selected':''}>${html(t(key))}</option>`).join('')}</select></div>
      <div class="chron-timeline"><div class="chron-columns"><strong>${html(t('chronQuran'))}</strong><strong>${html(t('chronHadith'))}</strong></div>
      ${lane(t('chronMedinan'),t('chronMedinanDesc'),qMedinan,knownHadith)}
      ${lane(t('chronUndated'),t('chronUndatedDesc'),qUnknown,unknownHadith)}</div>
      <section class="panel chron-relationships"><div class="micro-label">CHRONOLOGY / 02</div><h2>${html(t('chronComparisons'))}</h2><p>${html(t('chronComparisonDesc'))}</p>${comparisons || `<p class="chron-empty">${html(t('chronNoPairs'))}</p>`}</section>
      <p class="footnote">${html(t('chronFootnote'))}</p>`;
  }
  // Historical-behaviour evidence map: transparent prompts, not clinical psychometrics.
  // Only editorial-consensus, reviewed independent event clusters may produce a descriptive index.
  function profilePage() {
    const profiles = db.profile.dimensions;
    const scoped = metrics.scopedIndicators?.[tradition] ?? metrics.exploratoryIndicators;
    const availableCaseIds = new Set(visibleCases().map(item=>item.id));
    const reviewedClusters = new Set(metrics.claims.filter(x=>x.research_status==='reviewed' && availableCaseIds.has(x.id)).map(x=>x.event_cluster_id)).size;
    const dimensions = profiles.map((profile,position)=>{
      const candidates=profile.caseIds.filter(id=>availableCaseIds.has(id));
      const metric=scoped?.[profile.id];
      const assessed=metric?.independent_event_clusters ?? 0;
      const canShow=metric?.status==='exploratory' && Number.isFinite(metric.estimate);
      const indicator=canShow?`<div class="profile-plot" role="img" aria-label="${html(t('profileIndicator'))}: ${html(metric.estimate.toFixed(2))}"><div class="profile-axis"><span>−1</span><span>0</span><span>+1</span></div><div class="profile-range"><i style="left:${(50+50*metric.estimate).toFixed(1)}%"></i></div><p>${html(t('profileIndicator'))}: <b>${metric.estimate.toFixed(2)}</b> · ${html(t('profileSensitivity'))}: ${metric.scenario_p10.toFixed(2)} … ${metric.scenario_p90.toFixed(2)}</p></div>`:`<div class="profile-empty"><span aria-hidden="true">◌</span> ${html(t('profileInsufficient'))}</div>`;
      const linked=candidates.map(id=>`<button type="button" class="case-chip" data-open-case="${html(id)}">${html(id)} ↗</button>`).join('');
      return `<article class="profile-dimension"><div class="profile-dim-top"><span class="profile-dim-index">0${position+1} / ${html(t('profileDimension'))}</span><span class="profile-count">${assessed} ${html(t('profileReviewed'))}</span></div><h2>${html(t(profile.titleKey))}</h2><p class="profile-question">${html(t(profile.questionKey))}</p>${indicator}<div class="profile-case-links"><strong>${html(t('profileCandidates'))}</strong><div>${linked||`<span class="profile-muted">${html(t('profileNoCandidates'))}</span>`}</div></div></article>`;
    }).join('');
    return `${sectionHeading('profileEyebrow','profileTitle','profileIntro')}
      <section class="profile-premise"><div class="profile-premise-icon">?</div><div><h2>${html(t('profileClaimTitle'))}</h2><p>${html(t('profileClaimText'))}</p></div></section>
      <section class="profile-summary" aria-label="${html(t('profileResearchStatus'))}"><div><strong>${visibleCases().length}</strong><span>${html(t('profileCandidateCases'))}</span></div><div><strong>${reviewedClusters}</strong><span>${html(t('profileReviewedClusters'))}</span></div><div><strong>${visibleTensions().length}</strong><span>${html(t('profileOpenTensions'))}</span></div></section>
      <div class="profile-legend"><span>${html(t('profileDimensionsIntro'))}</span><a href="#quantitative">${html(t('profileViewModel'))} ↗</a></div>
      <div class="profile-grid">${dimensions}</div>
      <section class="profile-method"><h2>${html(t('profileLimitsTitle'))}</h2><p>${html(t('profileLimits'))}</p><p>${html(t('profileInterpretation'))}</p><a href="#chronology">${html(t('profileReviewTimeline'))} ↗</a></section>`;
  }
  function openCase(id) {
    const item = db.cases.find(x=>x.id===id);
    if (!item) return;
    const content = local(item);
    el('dialogBody').innerHTML = `<div class="dialog-eyebrow">${html(item.id)} · ${html(topicLabel(item.theme))}</div><h2 id="dialogTitle">${html(content.title)}</h2><p class="dialog-summary">${html(content.summary)}</p>
      <div class="dialog-detail"><small>${html(t('caseStatus'))}</small><strong>◌ ${html(t('underReview'))}</strong></div>
      <div class="dialog-detail"><small>${html(t('historicalStatus'))}</small><strong>${html(t('notAssessed'))}</strong></div>
      <div class="dialog-detail"><small>${html(t('researchQuestion'))}</small><p>${html(content.question)}</p></div>
      <div class="dialog-detail"><small>${html(t('interpretation'))}</small><p>${html(content.note)}</p></div>
      <div class="original-text"><small>العربية / Arabic original (excerpt)</small><p lang="ar" dir="rtl">${html(item.arabicExcerpt)}</p></div>
      <div class="dialog-detail"><small>${html(t('references'))}</small><div class="ref-links">${refLinks(visibleRefs(item))}</div></div>`;
    const dialog = el('caseDialog');
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
  }
  function nav() {
    el('navigation').innerHTML = sections.map(([name,label,symbol])=>`<a href="#${name}" class="nav-item ${section===name?'active':''}" ${section===name?'aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${symbol}</span><span>${html(t(label))}</span>${section===name?'<span class="active-marker"></span>':''}</a>`).join('');
    el('breadcrumbCurrent').textContent = t(sections.find(x=>x[0]===section)[1]);
  }
  function render() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang==='ar'?'rtl':'ltr';
    document.title = `${t(sections.find(x=>x[0]===section)[1])} · Islam Research`;
    el('language').value = lang;
    el('tradition').value = tradition;
    for (const [value,key] of [['both','sectBoth'],['sunni','sectSunni'],['shia','sectShia']]) el('tradition').querySelector(`option[value="${value}"]`).textContent=t(key);
    document.querySelectorAll('[data-i18n]').forEach(node=>{node.textContent=t(node.dataset.i18n);});
    el('footerNote').textContent = t('footer');
    nav();
    const markup = {overview,cases:casesPage,tensions:tensionsPage,chronology:chronologyPage,profile:profilePage,quantitative:quantitativePage,sources:sourcesPage,method:methodPage}[section]();
    el('content').innerHTML = markup;
    document.querySelectorAll('[data-open-case]').forEach(button=>button.addEventListener('click',()=>openCase(button.dataset.openCase)));
    el('caseSearch')?.addEventListener('input',event=>{const pos=event.target.selectionStart;query=event.target.value;render();const input=el('caseSearch');input.focus();try{input.setSelectionRange(pos,pos)}catch{}});
    el('topicFilter')?.addEventListener('change',event=>{topic=event.target.value;render()});
    el('chronTopic')?.addEventListener('change',event=>{timelineTopic=event.target.value;render()});
  }
  function route() {
    const path = location.hash.slice(1);
    section = sections.some(x=>x[0]===path)?path:'overview';
    render();
    document.body.classList.remove('menu-open');
    window.scrollTo(0,0);
  }
  el('language').addEventListener('change',event=>{
    lang = event.target.value;
    try{localStorage.setItem('islam-language',lang)}catch{}
    render();
  });
  el('tradition').addEventListener('change',event=>{
    if (!traditions.includes(event.target.value)) return;
    tradition=event.target.value;
    try{localStorage.setItem('islam-tradition',tradition)}catch{}
    render();
  });
  el('mobileMenu').addEventListener('click',()=>document.body.classList.toggle('menu-open'));
  window.addEventListener('hashchange',route);
  document.addEventListener('keydown',event=>{ if(event.key==='Escape'){const d=el('caseDialog');if(d.open)d.close()} });
  Promise.all(['./data/research.json','./data/quantitative.json'].map(url=>
    fetch(url).then(r=>{if(!r.ok)throw Error(`${url}: HTTP ${r.status}`);return r.json()})
  )).then(([research,quantitative])=>{
    if (!Array.isArray(research.cases) || !Array.isArray(research.tensions) || !quantitative.counts) throw Error('Invalid data schema');
    db=research;
    metrics=quantitative;
    route();
  }).catch(error=>{
    console.error(error);
    el('content').innerHTML='<div class="load-error"><h1>Data could not be loaded / Data se nepodařilo načíst</h1><p>Serve this project over HTTP (for example: python3 -m http.server -d site 8000), or use GitHub Pages.</p></div>';
  });
})();
