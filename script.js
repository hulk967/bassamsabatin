import { supabase } from './supabase.js';
async function loadSiteSettings(){
  const { data, error } = await supabase
    .from('site_settings')
    .select('content')
    .eq('key', 'main')
    .maybeSingle();

  if(error || !data?.content) return;

  const s = data.content;

  const logo = document.querySelector('.brand-logo');
  if(logo && s.logo) logo.src = s.logo;

  const heroVideo = document.querySelector('.hero-video');
  if(heroVideo && s.heroVideo){
    heroVideo.src = s.heroVideo;
    heroVideo.load();
    heroVideo.play().catch(()=>{});
  }

  const heroEyebrow = document.querySelector('.hero .eyebrow');
  if(heroEyebrow && s.heroEyebrow) heroEyebrow.textContent = s.heroEyebrow;

  const heroTitle = document.querySelector('.hero h1');
  if(heroTitle && s.heroTitle) heroTitle.innerHTML = s.heroTitle;

  const heroLead = document.querySelector('.hero .lead');
  if(heroLead && s.heroLead) heroLead.textContent = s.heroLead;

  const aboutTitle = document.querySelector('#about h2');
  if(aboutTitle && s.aboutTitle) aboutTitle.textContent = s.aboutTitle;

  const aboutLead = document.querySelector('#about .lead');
  if(aboutLead && s.aboutLead) aboutLead.textContent = s.aboutLead;

  const aboutTexts = document.querySelectorAll('#about .copy p');
  if(aboutTexts[0] && s.aboutText1) aboutTexts[0].textContent = s.aboutText1;
  if(aboutTexts[1] && s.aboutText2) aboutTexts[1].textContent = s.aboutText2;

  const servicesTitle = document.querySelector('#services h2');
  if(servicesTitle && s.servicesTitle) servicesTitle.textContent = s.servicesTitle;

  const portfolioTitle = document.querySelector('#portfolio h2');
  if(portfolioTitle && s.portfolioTitle) portfolioTitle.textContent = s.portfolioTitle;

  const contactTitle = document.querySelector('#contact h2');
  if(contactTitle && s.contactTitle) contactTitle.textContent = s.contactTitle;

  const contactLead = document.querySelector('#contact .lead');
  if(contactLead && s.contactLead) contactLead.textContent = s.contactLead;

  document.querySelectorAll('a[href*="wa.me"]').forEach(a=>{
    if(s.whatsapp) a.href = `https://wa.me/${s.whatsapp}`;
  });
}

loadSiteSettings();
const fallbackSettings = {
  logo: 'assets/logo.png',
  heroVideo: 'assets/media/hero-wood.mp4',
  heroPoster: 'assets/projects/project-1.png',
  heroEyebrow: 'Luxury Woodworks / Interior Craftsmanship',
  heroTitle: 'النجارة مش بس شغل إيدين<br><span>تصميم بعقل قبل التنفيذ</span><br>تنفيذ لآخر مسمار',
  heroLead: 'نجارة داخلية تُبنى على القياس، الخامة، والإحساس الهادئ بالفخامة.',
  aboutTitle: 'ورشة راقية تبدأ بالفكرة قبل المنشار.',
  aboutLead: 'نصمم الخشب كجزء من هوية المكان، لا كقطعة منفصلة عنه.',
  aboutText1: 'Bassam Sabatin Woodworks براند نجارة وتصميم داخلي يوازن بين الذوق، الدقة، والخبرة العملية. قبل التنفيذ نقرأ المساحة، الإضاءة، الحركة اليومية، وشخصية العميل.',
  aboutText2: 'الفخامة عندنا ليست زحمة تفاصيل؛ هي قياس صحيح، خامة محترمة، حواف نظيفة، وتركيب لا يترك صدفة.',
  servicesTitle: 'تفصيل فاخر للمساحات التي تستحق.',
  portfolioTitle: 'مشاريع مصممة لتبدو هادئة وغالية.',
  contactTitle: 'احكِ لنا عن المساحة، ونحوّلها لخطة تنفيذ واضحة.',
  contactLead: 'أرسل صورًا أو مراجع أو وصفًا بسيطًا، وسنرتب التفاصيل خطوة بخطوة.',
  whatsapp: '962798234541'
};

const fallbackServices=[
  {id:'s1',title:'مطابخ حسب الطلب',description:'تصميم عملي هادئ، توزيع ذكي، وخامات تتحمل الاستخدام اليومي بأناقة.'},
  {id:'s2',title:'خزائن وغرف ملابس',description:'حلول تخزين مصممة على القياس بتفاصيل داخلية مدروسة وتشطيبات راقية.'},
  {id:'s3',title:'أبواب خشبية',description:'أبواب داخلية وخارجية بتناسق بين الصلابة، الصوت، والملمس.'},
  {id:'s4',title:'أثاث تفصيل',description:'قطع مفصلة للمساحة، تعكس شخصية المكان بدون مبالغة.'},
  {id:'s5',title:'ديكورات خشبية',description:'جدران، فواصل، أسقف، وملامح دافئة تضيف عمقًا بصريًا للمكان.'},
  {id:'s6',title:'مكاتب ومحلات تجارية',description:'تنفيذ واجهات ومساحات عمل تحمل هوية المكان وتخدم الحركة اليومية.'}
];
const fallbackProjects=[
  {id:'p1',name:'مطبخ Walnut House',cat:'مطابخ',wood:'Walnut Veneer',finish:'Matte PU',duration:'28 يوم',image:'assets/projects/project-1.png',description:'مطبخ دافئ بخطوط نظيفة، تخزين مخفي، وإضاءة مدمجة.',details:'مطبخ دافئ بخطوط نظيفة، تخزين مخفي، وإضاءة مدمجة.',gallery:['assets/projects/project-1.png'],videos:[]},
  {id:'p2',name:'غرفة ملابس Alia Suite',cat:'خزائن',wood:'Oak Veneer',finish:'Natural Oil',duration:'18 يوم',image:'assets/projects/project-2.png',description:'غرفة ملابس مفتوحة بتقسيمات دقيقة وإحساس فندقي هادئ.',details:'غرفة ملابس مفتوحة بتقسيمات دقيقة وإحساس فندقي هادئ.',gallery:['assets/projects/project-2.png'],videos:[]},
  {id:'p3',name:'واجهة متجر Atelier',cat:'تجاري',wood:'Ash Wood',finish:'Warm Stain',duration:'21 يوم',image:'assets/projects/project-3.png',description:'واجهة وتجهيز داخلي يعكسان جودة البراند من أول نظرة.',details:'واجهة وتجهيز داخلي يعكسان جودة البراند من أول نظرة.',gallery:['assets/projects/project-3.png'],videos:[]},
  {id:'p4',name:'مكتب Executive',cat:'أثاث',wood:'Solid Beech',finish:'Satin Lacquer',duration:'12 يوم',image:'assets/projects/project-4.png',description:'مكتب تفصيل بسطح واسع وتفاصيل نحاسية خفيفة.',details:'مكتب تفصيل بسطح واسع وتفاصيل نحاسية خفيفة.',gallery:['assets/projects/project-4.png'],videos:[]}
];
const fallbackMaterials=[
  {id:'m1',title:'خشب Walnut',description:'لون عميق وحضور فاخر للمطابخ والأثاث الراقي.'},
  {id:'m2',title:'قشرة Oak',description:'ملمس طبيعي ونبرة هادئة للمساحات الحديثة.'},
  {id:'m3',title:'مفصلات Soft Close',description:'إغلاق ناعم وصامت لعمر استخدام أطول.'},
  {id:'m4',title:'مقابض مخفية',description:'خطوط نظيفة وتجربة استخدام مريحة.'},
  {id:'m5',title:'تشطيب Matte PU',description:'حماية عالية ولمسة غير لامعة أنيقة.'},
  {id:'m6',title:'ألوان مخصصة',description:'درجات مدروسة حسب الإضاءة والفراغ.'}
];
const testimonials=[['أحمد الخطيب','مالك فيلا','التصميم كان واضحًا قبل التنفيذ، والنتيجة طلعت أهدأ وأفخم مما توقعنا.'],['ليان مراد','تصميم داخلي','أكثر ما أعجبني هو الالتزام بالتفاصيل، خصوصًا التشطيب والقياسات.'],['شركة محلية','مشروع تجاري','تسليم مرتب، تواصل محترف، وتنفيذ يحترم هوية المكان.']];

let settings={...fallbackSettings};
let services=[...fallbackServices];
let projects=[...fallbackProjects];
let materials=[...fallbackMaterials];
let active='الكل';

const $=(s,root=document)=>root.querySelector(s);
function el(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function arr(v){return Array.isArray(v)?v:[];}
function normalizeProject(p,i=0){return {id:p.id||`p${i}`,name:p.name||'',cat:p.cat||'',wood:p.wood||'',finish:p.finish||'',duration:p.duration||'',image:p.image||'assets/projects/project-1.png',description:p.description||p.desc||'',details:p.details||p.description||p.desc||'',gallery:arr(p.gallery),videos:arr(p.videos)};}

async function tableData(table,fallback){
  const {data,error}=await supabase.from(table).select('*').order('id',{ascending:true});
  if(error || !data || !data.length) return fallback;
  return data;
}
async function loadSettings(){
  const {data,error}=await supabase.from('site_settings').select('content').eq('id',1).maybeSingle();
  if(!error && data?.content) settings={...fallbackSettings,...data.content};
}
async function loadData(){
  try{
    await loadSettings();
    projects=(await tableData('projects',fallbackProjects)).map(normalizeProject);
    services=await tableData('services',fallbackServices);
    materials=await tableData('materials',fallbackMaterials);
  }catch(e){console.warn('Using local fallback data',e);}
  renderAll();
  hideLoader();
}

function applySettings(){
  const logo=$('.brand-logo'); if(logo) logo.src=settings.logo || fallbackSettings.logo;
  const video=$('.hero-video');
  if(video){
    video.poster=settings.heroPoster || fallbackSettings.heroPoster;
    const source=video.querySelector('source');
    if(source && source.getAttribute('src') !== settings.heroVideo){ source.src=settings.heroVideo || fallbackSettings.heroVideo; video.load(); }
    video.muted=true; video.playsInline=true; video.play?.().catch(()=>{});
  }
  const heroEyebrow=$('.hero-content .eyebrow'); if(heroEyebrow) heroEyebrow.textContent=settings.heroEyebrow;
  const heroTitle=$('.hero-content h1'); if(heroTitle) heroTitle.innerHTML=settings.heroTitle;
  const heroLead=$('.hero-content .lead'); if(heroLead) heroLead.textContent=settings.heroLead;
  const aboutPanel=$('#about .panel'); if(aboutPanel){ aboutPanel.querySelector('h2').textContent=settings.aboutTitle; aboutPanel.querySelector('.lead').textContent=settings.aboutLead; }
  const copy=$('#about .copy'); if(copy){ const ps=copy.querySelectorAll('p'); if(ps[0])ps[0].textContent=settings.aboutText1; if(ps[1])ps[1].textContent=settings.aboutText2; }
  const serviceTitle=$('#services .section-head h2'); if(serviceTitle) serviceTitle.textContent=settings.servicesTitle;
  const portfolioTitle=$('#portfolio .section-head h2'); if(portfolioTitle) portfolioTitle.textContent=settings.portfolioTitle;
  const contact=$('#contact'); if(contact){ const h=contact.querySelector('h2'); const p=contact.querySelector('.lead'); if(h)h.textContent=settings.contactTitle; if(p)p.textContent=settings.contactLead; }
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>a.href=`https://wa.me/${settings.whatsapp || fallbackSettings.whatsapp}`);
}
function renderServices(){ const grid=$('#servicesGrid'); if(!grid)return; grid.innerHTML=''; grid.append(...services.map((s,i)=>el(`<article class="card reveal visible lift" style="transition-delay:${i*45}ms"><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></article>`))); }
function renderFilters(){ const filters=$('#filters'); if(!filters)return; const cats=['الكل',...new Set(projects.map(p=>p.cat).filter(Boolean))]; if(!cats.includes(active)) active='الكل'; filters.innerHTML=''; cats.forEach(c=>{const b=el(`<button class="filter lift ${c===active?'active':''}">${esc(c)}</button>`); b.onclick=()=>{active=c;renderFilters();renderProjects();}; filters.append(b);}); }
function renderProjects(){ const grid=$('#projectGrid'); if(!grid)return; grid.innerHTML=''; projects.filter(p=>active==='الكل'||p.cat===active).forEach((p,i)=>{ const a=el(`<article class="project reveal visible lift" style="transition-delay:${i*55}ms"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div class="project-content"><p class="eyebrow">${esc(p.cat)}</p><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="meta"><span><b>الخشب</b>${esc(p.wood)}</span><span><b>التشطيب</b>${esc(p.finish)}</span><span><b>المدة</b>${esc(p.duration)}</span></div></div></article>`); a.onclick=()=>openProjectPopup(p.id); grid.append(a);}); }
function renderMaterials(){ const grid=$('#materialGrid'); if(!grid)return; grid.innerHTML=''; grid.append(...materials.map((m,i)=>el(`<article class="material reveal visible lift" style="transition-delay:${i*45}ms"><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p></article>`))); }
function renderTestimonials(){ const grid=$('#testimonials'); if(!grid)return; grid.innerHTML=''; grid.append(...testimonials.map((t,i)=>el(`<article class="test reveal visible lift" style="transition-delay:${i*55}ms"><p>“${esc(t[2])}”</p><h3>${esc(t[0])}</h3><p class="eyebrow">${esc(t[1])}</p></article>`))); }
function renderAll(){ applySettings(); renderServices(); renderFilters(); renderProjects(); renderMaterials(); renderTestimonials(); initUI(); }

function openProjectPopup(id){ const p=projects.find(x=>String(x.id)===String(id)); if(!p)return; let modal=$('.project-modal'); if(!modal){ modal=el(`<div class="project-modal"><div class="project-box"><div class="project-modal-head"><h2></h2><button class="close-modal">إغلاق</button></div><div class="project-modal-body"><div class="project-gallery"></div><p class="project-modal-desc"></p><div class="project-info-grid"></div></div></div></div>`); document.body.appendChild(modal); $('.close-modal',modal).onclick=()=>modal.classList.remove('open'); modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')}; } $('h2',modal).textContent=p.name||'تفاصيل المشروع'; $('.project-modal-desc',modal).textContent=p.details||p.description||''; const gallery=$('.project-gallery',modal); gallery.innerHTML=''; const media=[...(p.gallery?.length?p.gallery:[p.image].filter(Boolean)),...(p.videos||[])].filter(Boolean); media.forEach(src=>{const isVideo=/\.(mp4|webm|ogg)$/i.test(src)||String(src).startsWith('data:video'); const node=document.createElement(isVideo?'video':'img'); node.src=src; if(isVideo)node.controls=true; node.alt=p.name||'project media'; gallery.appendChild(node)}); $('.project-info-grid',modal).innerHTML=`<div><b>التصنيف</b>${esc(p.cat)}</div><div><b>الخشب</b>${esc(p.wood)}</div><div><b>التشطيب</b>${esc(p.finish)}</div><div><b>المدة</b>${esc(p.duration)}</div>`; modal.classList.add('open'); }

function initUI(){
  if(window.__uiReady)return; window.__uiReady=true;
  const range=$('#baRange'),before=$('#beforeLayer'),handle=$('.ba-handle');
  function updateBa(){if(!range||!before||!handle)return; before.style.width=range.value+'%'; handle.style.right=range.value+'%'}
  range?.addEventListener('input',updateBa); updateBa();
  window.addEventListener('load',()=>setTimeout(hideLoader,500));
  initSawdust(); observeReveals();
}
function hideLoader(){ const loader=$('#loader'); if(loader) loader.classList.add('hide'); }
function observeReveals(){ if(!('IntersectionObserver' in window)){document.querySelectorAll('.reveal').forEach(x=>x.classList.add('visible'));return;} const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -60px 0px'}); document.querySelectorAll('.reveal:not(.visible)').forEach(x=>io.observe(x)); }
function initSawdust(){ const isDesktopPointer=window.matchMedia('(pointer:fine)').matches; const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(!isDesktopPointer||reduceMotion||window.innerWidth<981)return; const c=$('#sawdust'); if(!c)return; const ctx=c.getContext('2d'); let parts=[],lastMove=0; function size(){const dpr=Math.min(window.devicePixelRatio||1,2); c.width=Math.floor(innerWidth*dpr); c.height=Math.floor(innerHeight*dpr); c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px'; ctx.setTransform(dpr,0,0,dpr,0,0);} size(); addEventListener('resize',size,{passive:true}); addEventListener('mousemove',e=>{const now=performance.now(); if(now-lastMove<14)return; lastMove=now; for(let i=0;i<3;i++)parts.push({x:e.clientX+Math.random()*18-9,y:e.clientY+Math.random()*18-9,vx:(Math.random()-.5)*.65,vy:(Math.random()-.5)*.65-.08,life:42,max:42,r:Math.random()*2.2+.9,rot:Math.random()*Math.PI}); if(parts.length>120)parts.splice(0,parts.length-120);},{passive:true}); function tick(){ctx.clearRect(0,0,innerWidth,innerHeight); parts=parts.filter(p=>p.life-->0); parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.006;ctx.save();ctx.globalAlpha=(p.life/p.max)*.34;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle='#4c2b11';ctx.beginPath();ctx.ellipse(0,0,p.r*1.75,p.r*.72,0,0,Math.PI*2);ctx.fill();ctx.restore();}); requestAnimationFrame(tick);} tick(); }

loadData();
setTimeout(hideLoader,3500);
