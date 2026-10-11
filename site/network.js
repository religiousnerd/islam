/* Event-centered historical networks. No external JS/CSS or server dependencies. */
(() => {
  "use strict";
  const translations = {
    en: {
      navPeople:"People & networks", peopleEyebrow:"PROSOPOGRAPHY / NETWORKS", peopleTitle:"People & relationships",
      peopleIntro:"Explore reported associations and transmission chains. Every published connection needs a traceable source and editorial status.",
      explore:"Explore network", historical:"Historical relationships", transmission:"Transmission chains", global:"People network",
      event:"Event network", people:"People", links:"Connections", sources:"Sources", candidates:"Unreviewed",
      select:"Select a person or connection", introSelect:"Choose a node or line to inspect its role, evidence and uncertainties.",
      scope:"Network scope", evidence:"Evidence", status:"Research status", source:"Source", relation:"Relationship",
      witness:"Narrator / transmitter", eventRole:"Event role", reviewed:"Reviewed", candidate:"Candidate",
      disputed:"Disputed", unknown:"Unassessed", all:"All statuses", statusFilter:"Filter status",
      note:"A diagram shows relationships reported in the sources, not proof that an event occurred.",
      noConnections:"No source-reviewed relationships have been published for this view.",
      noChains:"No source-reviewed transmission chains have been published for this view.",
      future:"Connections will appear here when an event, person and its attestations pass editorial review.",
      subject:"Central historical subject", subjectNote:"Research focus only. This node is not evidence of participation in any unreviewed event.",
      involved:"Associated with this event in a report", participation:"Reported involvement", evidencePending:"No verified attestations are currently attached.",
      connected:"Relationship reported between people", transmitted:"Reported transmission direction",
      openSource:"Open source", personProfile:"Person record", directed:"Transmitted from → to",
      noDate:"Date unassessed", eventContext:"Event context", networkHelp:"Solid: reviewed · Dashed: candidate/disputed · Arrows: transmission direction",
      zoomIn:"Zoom in", zoomOut:"Zoom out", reset:"Reset view", close:"Close graph",
      noMore:"No additional people or connections to display.", graphEmpty:"Awaiting source-reviewed connections",
      graphCount:"Visible people", edgeCount:"Visible connections", reviewMessage:"Narrators are never presumed eyewitnesses or event participants.",
      peopleIndex:"People in the research catalog", info:"Select a node to inspect the record", traditionNote:"The source-tradition filter applies to the attestation provenance, not the religion of a person.",
      emptyPage:"The people network begins with Muhammad as its research subject. No inferred associates have been added.",
      noSources:"No reviewed sources recorded", relationType:"Reported relation", caseLink:"Event record"
    },
    cs: {
      navPeople:"Osoby a vztahy", peopleEyebrow:"PROSOPOGRAFIE / SÍTĚ", peopleTitle:"Osoby a vztahové sítě",
      peopleIntro:"Prozkoumej uváděné vztahy a řetězce předávání. Každé zveřejněné spojení vyžaduje dohledatelný pramen a redakční stav.",
      explore:"Prozkoumat síť", historical:"Historické vztahy", transmission:"Řetězce předávání", global:"Síť osob",
      event:"Síť události", people:"Osoby", links:"Spojení", sources:"Prameny", candidates:"Neověřené",
      select:"Vyber osobu nebo spojení", introSelect:"Kliknutím na uzel nebo hranu zobrazíš roli, důkazy a nejistoty.",
      scope:"Rozsah sítě", evidence:"Důkazy", status:"Stav výzkumu", source:"Pramen", relation:"Vztah",
      witness:"Vypravěč / předavatel", eventRole:"Role v události", reviewed:"Posouzeno", candidate:"Kandidát",
      disputed:"Sporné", unknown:"Nehodnoceno", all:"Všechny stavy", statusFilter:"Filtrovat stav",
      note:"Graf zobrazuje vztahy uváděné v pramenech, nikoli důkaz, že se událost skutečně odehrála.",
      noConnections:"Pro tento pohled dosud nebyly zveřejněny žádné pramenně posouzené vztahy.",
      noChains:"Pro tento pohled dosud nebyly zveřejněny žádné pramenně posouzené řetězce předávání.",
      future:"Spojení se zobrazí po odborném posouzení událostí, osob a jejich dokladů.",
      subject:"Hlavní zkoumaná osoba", subjectNote:"Pouze označení předmětu výzkumu; uzel nedokládá účast na neposouzené události.",
      involved:"Podle podání spojeno s touto událostí", participation:"Uváděná účast", evidencePending:"K tomuto záznamu nejsou připojeny ověřené doklady.",
      connected:"Vztah uváděný mezi osobami", transmitted:"Uváděný směr předání",
      openSource:"Otevřít pramen", personProfile:"Záznam osoby", directed:"Předáno od → komu",
      noDate:"Datace neposouzena", eventContext:"Kontext události", networkHelp:"Plná čára: posouzeno · Přerušovaná: kandidát/sporné · Šipka: směr předání",
      zoomIn:"Přiblížit", zoomOut:"Oddálit", reset:"Obnovit pohled", close:"Zavřít graf",
      noMore:"Žádné další osoby ani spojení.", graphEmpty:"Čeká na pramenně ověřená spojení",
      graphCount:"Zobrazené osoby", edgeCount:"Zobrazená spojení", reviewMessage:"Vypravěče automaticky nepovažujeme za očité svědky ani účastníky události.",
      peopleIndex:"Osoby ve výzkumném katalogu", info:"Vyber uzel a zobraz jeho záznam", traditionNote:"Filtr tradice se vztahuje k původu pramene, nikoli k náboženství osoby.",
      emptyPage:"Síť zatím obsahuje Muhammada jako předmět výzkumu. Žádné odvozené vztahy nebyly přidány.",
      noSources:"Nejsou evidovány posouzené prameny", relationType:"Uváděný vztah", caseLink:"Záznam události"
    },
    ar: {
      navPeople:"الأشخاص والعلاقات", peopleEyebrow:"دراسة الأشخاص / الشبكات", peopleTitle:"الأشخاص وشبكات العلاقات",
      peopleIntro:"استكشف العلاقات المروية وسلاسل الإسناد. يتطلب كل اتصال منشور مصدراً قابلاً للتحقق وحالة مراجعة واضحة.",
      explore:"استكشف الشبكة", historical:"العلاقات التاريخية", transmission:"سلاسل الإسناد", global:"شبكة الأشخاص",
      event:"شبكة الحدث", people:"الأشخاص", links:"الروابط", sources:"المصادر", candidates:"غير مُراجع",
      select:"اختر شخصاً أو علاقة", introSelect:"اضغط على عقدة أو رابط لعرض الدور والأدلة وأوجه عدم اليقين.",
      scope:"نطاق الشبكة", evidence:"الأدلة", status:"حالة البحث", source:"المصدر", relation:"العلاقة",
      witness:"الراوي / الناقل", eventRole:"الدور في الحدث", reviewed:"تمت مراجعته", candidate:"قيد البحث",
      disputed:"محل خلاف", unknown:"غير مُقيّم", all:"جميع الحالات", statusFilter:"تصفية الحالة",
      note:"يمثل الرسم العلاقات كما وردت في المصادر، ولا يثبت وقوع الحدث تاريخياً.",
      noConnections:"لم تُنشر بعد علاقات خضعت للمراجعة النقدية في هذا العرض.",
      noChains:"لم تُنشر بعد سلاسل إسناد خضعت للمراجعة النقدية في هذا العرض.",
      future:"ستظهر الروابط بعد مراجعة الحدث والأشخاص والأسانيد المرتبطة بهم.",
      subject:"الشخصية التاريخية موضوع البحث", subjectNote:"هذه عقدة تعريفية لموضوع البحث، وليست دليلاً على المشاركة في حدث غير مُراجع.",
      involved:"مذكور في رواية مرتبطة بهذا الحدث", participation:"المشاركة المروية", evidencePending:"لا توجد أدلة موثقة مرفقة بهذا السجل حالياً.",
      connected:"علاقة مروية بين أشخاص", transmitted:"اتجاه النقل المروي",
      openSource:"افتح المصدر", personProfile:"سجل الشخص", directed:"النقل من ← إلى",
      noDate:"التاريخ غير مُقيّم", eventContext:"سياق الحدث", networkHelp:"خط متصل: مُراجع · متقطع: قيد البحث/خلاف · سهم: اتجاه الإسناد",
      zoomIn:"تكبير", zoomOut:"تصغير", reset:"إعادة العرض", close:"إغلاق الرسم",
      noMore:"لا يوجد أشخاص أو روابط إضافية.", graphEmpty:"بانتظار روابط مدعومة بمصادر",
      graphCount:"الأشخاص الظاهرون", edgeCount:"الروابط الظاهرة", reviewMessage:"لا نفترض أن الراوي شاهد عيان أو مشارك في الحدث.",
      peopleIndex:"الأشخاص في سجل البحث", info:"اختر عقدة لفحص سجلها", traditionNote:"تتعلق تصفية المذهب بمصدر الرواية، لا بانتماء الشخص الديني.",
      emptyPage:"تبدأ الشبكة بمحمد بوصفه موضوع البحث. لم تُضف أي صلات مستنتجة.",
      noSources:"لا توجد مصادر تمت مراجعتها", relationType:"العلاقة المروية", caseLink:"سجل الحدث"
    },
    id: {
      navPeople:"Tokoh & relasi", peopleEyebrow:"PROSOPOGRAFI / JARINGAN", peopleTitle:"Tokoh dan jaringan hubungan",
      peopleIntro:"Telusuri hubungan yang dilaporkan dan rantai transmisi. Setiap hubungan yang diterbitkan harus memiliki sumber terlacak dan status peninjauan.",
      explore:"Jelajahi jaringan", historical:"Hubungan historis", transmission:"Rantai periwayatan", global:"Jaringan tokoh",
      event:"Jaringan peristiwa", people:"Tokoh", links:"Hubungan", sources:"Sumber", candidates:"Belum ditinjau",
      select:"Pilih tokoh atau hubungan", introSelect:"Pilih simpul atau garis untuk memeriksa peran, bukti, dan ketidakpastiannya.",
      scope:"Cakupan jaringan", evidence:"Bukti", status:"Status penelitian", source:"Sumber", relation:"Hubungan",
      witness:"Perawi / penyampai", eventRole:"Peran dalam peristiwa", reviewed:"Telah ditinjau", candidate:"Kandidat",
      disputed:"Diperdebatkan", unknown:"Belum dinilai", all:"Semua status", statusFilter:"Saring status",
      note:"Grafik menampilkan hubungan yang dinyatakan dalam sumber, bukan bukti bahwa peristiwa benar-benar terjadi.",
      noConnections:"Belum ada hubungan yang ditinjau secara kritis untuk tampilan ini.",
      noChains:"Belum ada rantai periwayatan yang ditinjau secara kritis untuk tampilan ini.",
      future:"Hubungan akan muncul setelah peristiwa, tokoh, dan sumbernya ditinjau secara editorial.",
      subject:"Subjek sejarah utama", subjectNote:"Hanya penanda subjek penelitian; simpul ini tidak membuktikan keterlibatan dalam peristiwa yang belum ditinjau.",
      involved:"Disebut terkait peristiwa ini dalam riwayat", participation:"Keterlibatan yang dilaporkan", evidencePending:"Belum ada bukti terverifikasi yang dilampirkan.",
      connected:"Hubungan yang dilaporkan antar tokoh", transmitted:"Arah transmisi yang dilaporkan",
      openSource:"Buka sumber", personProfile:"Catatan tokoh", directed:"Diriwayatkan dari → kepada",
      noDate:"Tanggal belum dinilai", eventContext:"Konteks peristiwa", networkHelp:"Garis utuh: ditinjau · Putus-putus: kandidat/disengketakan · Panah: arah transmisi",
      zoomIn:"Perbesar", zoomOut:"Perkecil", reset:"Atur ulang", close:"Tutup grafik",
      noMore:"Tidak ada tokoh atau hubungan tambahan.", graphEmpty:"Menunggu hubungan bersumber yang ditinjau",
      graphCount:"Tokoh terlihat", edgeCount:"Hubungan terlihat", reviewMessage:"Perawi tidak otomatis dianggap saksi mata atau peserta peristiwa.",
      peopleIndex:"Tokoh dalam katalog penelitian", info:"Pilih simpul untuk memeriksa catatannya", traditionNote:"Filter tradisi berlaku untuk asal sumber, bukan agama seorang tokoh.",
      emptyPage:"Jaringan dimulai dengan Muhammad sebagai subjek penelitian. Tidak ada hubungan yang ditebak.",
      noSources:"Belum ada sumber yang ditinjau", relationType:"Hubungan yang dilaporkan", caseLink:"Catatan peristiwa"
    }
  };
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const t = (lang,key) => translations[lang]?.[key] ?? translations.en[key] ?? key;
  const loc = (value,lang) => typeof value === "string" ? value : value?.[lang] ?? value?.en ?? "";
  const safeHref = value => /^https:\/\/[^\s"'<>]+$/i.test(value||"") ? escapeHTML(value) : "#";
  const sourceAllowed = (source,tradition) => source && (tradition==="both" || source.tradition==="shared" || source.tradition===tradition);
  const citeable = (record,ctx) => Array.isArray(record.sourceIds) && record.sourceIds.some(id=>ctx.catalog.sources.some(s=>s.id===id && sourceAllowed(s,ctx.tradition)));
  const eligible = (record,ctx) => citeable(record,ctx) && (ctx.status==="all" || record.reviewStatus===ctx.status);
  const personName = (person,lang) => loc(person?.names,lang) || person?.id || "";
  const SUBJECT_ID = "PERSON-MUHAMMAD";

  function determineGraph(ctx) {
    const {catalog,lang,mode,eventId} = ctx;
    const byId = new Map(catalog.persons.map(x=>[x.id,x]));
    const roles = catalog.eventRoles.filter(x=>!eventId || x.eventId===eventId).filter(x=>eligible(x,ctx));
    const roleIds = new Set(roles.map(x=>x.personId));
    const records = mode==="historical" ? catalog.relationships.filter(x=>
      (!eventId || x.eventIds.includes(eventId)) && (!eventId || (roleIds.has(x.personAId) && roleIds.has(x.personBId))) && eligible(x,ctx)
    ) : catalog.transmissions.filter(x=>(!eventId || x.eventId===eventId) && eligible(x,ctx));
    const edges = records.filter(x=>byId.has(mode==="historical"?x.personAId:x.fromPersonId) && byId.has(mode==="historical"?x.personBId:x.toPersonId));
    const ids = new Set(!eventId && mode==="historical" ? catalog.persons.filter(x=>x.isResearchSubject).map(x=>x.id):[]);
    if(eventId && mode==="historical") roles.forEach(x=>ids.add(x.personId));
    edges.forEach(x=>{ids.add(mode==="historical"?x.personAId:x.fromPersonId);ids.add(mode==="historical"?x.personBId:x.toPersonId)});
    // The research subject is shown as an orientation anchor, never as an inferred participant.
    if(!eventId && byId.has(SUBJECT_ID)) ids.add(SUBJECT_ID);
    const nodes = [...ids].map(x=>byId.get(x)).filter(Boolean);
    nodes.sort((a,b)=>Number(!!b.isResearchSubject)-Number(!!a.isResearchSubject)||personName(a,lang).localeCompare(personName(b,lang)));
    return {nodes,edges,roles};
  }
  function layout(nodes) {
    const positions=new Map();
    const cx=470,cy=245;
    if(nodes.length===1){positions.set(nodes[0].id,{x:cx,y:cy});return positions}
    const subject=nodes.find(x=>x.id===SUBJECT_ID);
    const others=nodes.filter(x=>x!==subject);
    if(subject)positions.set(subject.id,{x:cx,y:cy});
    others.forEach((node,i)=>{
      const count=others.length;
      const ring = count>12 ? Math.floor(i/12) : 0;
      const within=ring ? count-12:Math.min(count,12);
      const localIndex=ring?i-12:i;
      const angle=-Math.PI/2+2*Math.PI*localIndex/Math.max(1,within);
      const rx=(subject?275:320)+ring*60,ry=(subject?158:180)+ring*55;
      positions.set(node.id,{x:cx+rx*Math.cos(angle),y:cy+ry*Math.sin(angle)});
    });
    return positions;
  }
  function svgGraph(ctx,graph,state){
    const pos=layout(graph.nodes);
    const personId=new Map(ctx.catalog.persons.map(x=>[x.id,x]));
    const edgeSvg=graph.edges.map(edge=>{
      const from=pos.get(ctx.mode==="historical"?edge.personAId:edge.fromPersonId);
      const to=pos.get(ctx.mode==="historical"?edge.personBId:edge.toPersonId);
      if(!from||!to)return "";
      const selected=state.selected?.type==="edge"&&state.selected.id===edge.id;
      const status=edge.reviewStatus;
      const color=selected?"#f5dca6":status==="reviewed"?"#95c9b2":status==="disputed"?"#dfa77d":"#90a7a1";
      return '<g tabindex="0" role="button" data-edge="'+escapeHTML(edge.id)+'" aria-label="'+escapeHTML(loc(edge.labels,ctx.lang)||t(ctx.lang,ctx.mode==="historical"?"relation":"transmitted"))+'">'+
        '<line x1="'+from.x+'" y1="'+from.y+'" x2="'+to.x+'" y2="'+to.y+'" stroke="transparent" stroke-width="23"/>'+
        '<line x1="'+from.x+'" y1="'+from.y+'" x2="'+to.x+'" y2="'+to.y+'" stroke="'+color+'" stroke-width="'+(selected?4:2.5)+'"'+(status==="reviewed"?'':' stroke-dasharray="7 5"')+
        (ctx.mode==="transmission"?' marker-end="url(#net-arrow)"':'')+' />'+'</g>';
    }).join("");
    const nodeSvg=graph.nodes.map(person=>{
      const point=pos.get(person.id);
      const name=personName(person,ctx.lang);
      const selected=state.selected?.type==="person"&&state.selected.id===person.id;
      const subject=!!person.isResearchSubject;
      const label=name.length>24?name.slice(0,22)+"…":name;
      return '<g tabindex="0" role="button" data-person="'+escapeHTML(person.id)+'" aria-label="'+escapeHTML(name)+'" transform="translate('+point.x+' '+point.y+')">'+
        '<title>'+escapeHTML(name)+'</title>'+
        '<circle r="'+(subject?57:42)+'" fill="'+(subject?"#28534b":"#233c40")+'" stroke="'+(selected?"#f3dcaa":subject?"#d9b87c":"#79a99c")+'" stroke-width="'+(selected?4:2)+'" />'+
        '<text text-anchor="middle" font-size="'+(subject?15:13)+'" font-weight="600" fill="#f6f2e6" dominant-baseline="central">'+escapeHTML(label)+'</text></g>';
    }).join("");
    const scale=state.zoom;
    return '<svg class="network-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 490" role="img" aria-label="'+escapeHTML(t(ctx.lang,"global"))+'">'+
      '<defs><marker id="net-arrow" viewBox="0 0 10 10" refX="30" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#b4ddc6"/></marker></defs>'+
      '<g class="network-zoom" transform="translate('+(470*(1-scale))+','+(245*(1-scale))+') scale('+scale+')">'+edgeSvg+nodeSvg+'</g></svg>';
  }
  function sourceLinks(record,ctx) {
    const sources=(record?.sourceIds||[]).map(id=>ctx.catalog.sources.find(s=>s.id===id)).filter(s=>sourceAllowed(s,ctx.tradition));
    return sources.length?sources.map(s=>'<a class="network-source" href="'+safeHref(s.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(s.label)+' ↗</a>').join("") : '<p class="network-muted">'+escapeHTML(t(ctx.lang,"noSources"))+'</p>';
  }
  function description(ctx,graph,selection) {
    if(!selection)return '<h3>'+escapeHTML(t(ctx.lang,"select"))+'</h3><p>'+escapeHTML(t(ctx.lang,"introSelect"))+'</p>';
    if(selection.type==="person"){
      const person=graph.nodes.find(x=>x.id===selection.id);
      if(!person)return "";
      const roles=graph.roles.filter(x=>x.personId===person.id);
      const related=graph.edges.filter(x=>[x.personAId,x.personBId,x.fromPersonId,x.toPersonId].includes(person.id));
      const roleHtml=roles.map(x=>'<div class="network-role"><b>'+escapeHTML(loc(x.labels,ctx.lang)||t(ctx.lang,"eventRole"))+'</b><small>'+escapeHTML(t(ctx.lang,x.reviewStatus))+'</small>'+sourceLinks(x,ctx)+'</div>').join("");
      return '<div class="network-detail-head">'+escapeHTML(t(ctx.lang,"personProfile"))+' · '+escapeHTML(person.id)+'</div><h3>'+escapeHTML(personName(person,ctx.lang))+'</h3>'+
      '<p>'+escapeHTML(person.isResearchSubject?t(ctx.lang,"subjectNote"):loc(person.notes,ctx.lang)||t(ctx.lang,"evidencePending"))+'</p>'+
      (roleHtml?'<h4>'+escapeHTML(t(ctx.lang,"participation"))+'</h4>'+roleHtml:"")+
      '<p class="network-muted">'+escapeHTML(related.length+' '+t(ctx.lang,"links"))+'</p>';
    }
    const edge=graph.edges.find(x=>x.id===selection.id);
    if(!edge)return "";
    const p=ctx.catalog.persons;
    const from=p.find(x=>x.id===(ctx.mode==="historical"?edge.personAId:edge.fromPersonId));
    const to=p.find(x=>x.id===(ctx.mode==="historical"?edge.personBId:edge.toPersonId));
    return '<div class="network-detail-head">'+escapeHTML(t(ctx.lang,ctx.mode==="historical"?"relation":"witness"))+' · '+escapeHTML(edge.id)+'</div>'+
    '<h3>'+escapeHTML(personName(from,ctx.lang))+' '+(ctx.mode==="historical"?"—":"→")+' '+escapeHTML(personName(to,ctx.lang))+'</h3>'+
    '<p>'+escapeHTML(loc(edge.labels,ctx.lang)||t(ctx.lang,ctx.mode==="historical"?"connected":"transmitted"))+'</p>'+
    '<p class="network-review">'+escapeHTML(t(ctx.lang,"status"))+': '+escapeHTML(t(ctx.lang,edge.reviewStatus))+'</p>'+
    '<h4>'+escapeHTML(t(ctx.lang,"evidence"))+'</h4>'+sourceLinks(edge,ctx);
  }
  function createView(root,init) {
    const state={mode:"historical",status:"all",selected:null,zoom:1};
    const ctx={...init,status:"all",mode:"historical"};
    const rerender=()=>{
      ctx.mode=state.mode;ctx.status=state.status;
      const graph=determineGraph(ctx);
      if(state.selected && !graph.nodes.some(p=>state.selected.type==="person"&&p.id===state.selected.id) && !graph.edges.some(x=>state.selected.type==="edge"&&x.id===state.selected.id))state.selected=null;
      root.innerHTML='<div class="network-toolbar" role="group" aria-label="'+escapeHTML(t(ctx.lang,"scope"))+'">'+
        '<div class="network-modes"><button type="button" data-mode="historical" aria-pressed="'+(state.mode==="historical")+'">'+escapeHTML(t(ctx.lang,"historical"))+'</button>'+
        '<button type="button" data-mode="transmission" aria-pressed="'+(state.mode==="transmission")+'">'+escapeHTML(t(ctx.lang,"transmission"))+'</button></div>'+
        '<label class="network-filter">'+escapeHTML(t(ctx.lang,"statusFilter"))+' <select data-filter>'+
        ["all","reviewed","candidate","disputed"].map(x=>'<option value="'+x+'" '+(x===state.status?'selected':'')+'>'+escapeHTML(t(ctx.lang,x))+'</option>').join("")+'</select></label></div>'+
        '<div class="network-meta"><span>'+escapeHTML(t(ctx.lang,"graphCount"))+': <b>'+graph.nodes.length+'</b></span>'+
        '<span>'+escapeHTML(t(ctx.lang,"edgeCount"))+': <b>'+graph.edges.length+'</b></span></div>'+
        '<div class="network-grid"><div class="network-canvas">'+svgGraph(ctx,graph,state)+
        '<div class="network-zoom-controls"><button type="button" data-zoom="in" aria-label="'+escapeHTML(t(ctx.lang,"zoomIn"))+'">+</button>'+
        '<button type="button" data-zoom="out" aria-label="'+escapeHTML(t(ctx.lang,"zoomOut"))+'">−</button>'+
        '<button type="button" data-zoom="reset" aria-label="'+escapeHTML(t(ctx.lang,"reset"))+'">↺</button></div>'+
        (graph.edges.length?'':'<p class="network-empty-overlay">'+escapeHTML(t(ctx.lang,state.mode==="historical"?"noConnections":"noChains"))+'</p>')+
        '</div><aside class="network-details" aria-live="polite">'+description(ctx,graph,state.selected)+'</aside></div>'+
        '<p class="network-footnote">'+escapeHTML(t(ctx.lang,"note"))+' '+escapeHTML(t(ctx.lang,"reviewMessage"))+'</p>'+
        '<p class="network-legend">'+escapeHTML(t(ctx.lang,"networkHelp"))+'</p>';
      root.querySelectorAll("[data-mode]").forEach(button=>button.addEventListener("click",()=>{state.mode=button.dataset.mode;state.selected=null;state.zoom=1;rerender()}));
      root.querySelector("[data-filter]").addEventListener("change",event=>{state.status=event.target.value;state.selected=null;rerender()});
      root.querySelectorAll("[data-person]").forEach(node=>{
        const choose=()=>{state.selected={type:"person",id:node.dataset.person};rerender()};
        node.addEventListener("click",choose);
        node.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();choose()}});
      });
      root.querySelectorAll("[data-edge]").forEach(node=>{
        const choose=()=>{state.selected={type:"edge",id:node.dataset.edge};rerender()};
        node.addEventListener("click",choose);
        node.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();choose()}});
      });
      root.querySelectorAll("[data-zoom]").forEach(button=>button.addEventListener("click",()=>{
        state.zoom=button.dataset.zoom==="reset"?1:Math.max(.65,Math.min(2.1,state.zoom*(button.dataset.zoom==="in"?1.2:1/1.2)));
        rerender();
      }));
    };
    rerender();
  }
  function pageMarkup(lang) {
    return '<div class="section-heading"><div class="eyebrow">'+escapeHTML(t(lang,"peopleEyebrow"))+'</div><h1>'+escapeHTML(t(lang,"peopleTitle"))+'</h1><p>'+escapeHTML(t(lang,"peopleIntro"))+'</p></div>'+
    '<section class="network-intro"><span class="network-intro-symbol" aria-hidden="true">◎</span><p>'+escapeHTML(t(lang,"emptyPage"))+'</p></section>'+
    '<div id="peopleNetworkApp" class="network-view"></div><p class="network-note">'+escapeHTML(t(lang,"traditionNote"))+'</p>';
  }
  function openEvent(eventId,ctx) {
    const dialog=document.getElementById("networkDialog");
    if(!dialog)return;
    const name=ctx.research.cases.find(x=>x.id===eventId) || ctx.research.chronology.quranPassages.find(x=>x.id===eventId);
    const milestoneKey=eventId.startsWith("milestone-")?eventId.slice(10):null;
    const eventTitle=name?.translations?.[ctx.lang]?.title || (milestoneKey ? window.I18N?.[ctx.lang]?.[milestoneKey] : null) || eventId;
    const body=document.getElementById("networkDialogBody");
    body.innerHTML='<div class="network-dialog-intro"><span>'+escapeHTML(t(ctx.lang,"eventContext"))+' · '+escapeHTML(eventId)+'</span>'+
      '<h2 id="networkDialogTitle">'+escapeHTML(eventTitle)+'</h2><p>'+escapeHTML(t(ctx.lang,"peopleIntro"))+'</p></div><div id="eventNetworkApp" class="network-view"></div>';
    createView(document.getElementById("eventNetworkApp"),{...ctx,eventId});
    if(!dialog.open)dialog.showModal();
  }
  window.NetworkExplorer={t,pageMarkup,mountPage:(root,ctx)=>createView(root,{...ctx,eventId:null}),openEvent,translations};
})();
