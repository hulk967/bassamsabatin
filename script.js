import { supabase } from './supabase.js';

const fallbackServices=[['مطابخ حسب الطلب','تصميم عملي هادئ، توزيع ذكي، وخامات تتحمل الاستخدام اليومي بأناقة.'],['خزائن وغرف ملابس','حلول تخزين مصممة على القياس بتفاصيل داخلية مدروسة وتشطيبات راقية.'],['أبواب خشبية','أبواب داخلية وخارجية بتناسق بين الصلابة، الصوت، والملمس.'],['أثاث تفصيل','قطع مفصلة للمساحة، تعكس شخصية المكان بدون مبالغة.'],['ديكورات خشبية','جدران، فواصل، أسقف، وملامح دافئة تضيف عمقًا بصريًا للمكان.'],['مكاتب ومحلات تجارية','تنفيذ واجهات ومساحات عمل تحمل هوية المكان وتخدم الحركة اليومية.']];
const fallbackProjects=[{id:'base-1',name:'مطبخ Walnut House',cat:'مطابخ',wood:'Walnut Veneer',finish:'Matte PU',duration:'28 يوم',image:'assets/projects/project-1.png',description:'مطبخ دافئ بخطوط نظيفة، تخزين مخفي، وإضاءة مدمجة.',details:'مطبخ دافئ بخطوط نظيفة، تخزين مخفي، وإضاءة مدمجة.',gallery:['assets/projects/project-1.png'],videos:[]},{id:'base-2',name:'غرفة ملابس Alia Suite',cat:'خزائن',wood:'Oak Veneer',finish:'Natural Oil',duration:'18 يوم',image:'assets/projects/project-2.png',description:'غرفة ملابس مفتوحة بتقسيمات دقيقة وإحساس فندقي هادئ.',details:'غرفة ملابس مفتوحة بتقسيمات دقيقة وإحساس فندقي هادئ.',gallery:['assets/projects/project-2.png'],videos:[]},{id:'base-3',name:'واجهة متجر Atelier',cat:'تجاري',wood:'Ash Wood',finish:'Warm Stain',duration:'21 يوم',image:'assets/projects/project-3.png',description:'واجهة وتجهيز داخلي يعكسان جودة البراند من أول نظرة.',details:'واجهة وتجهيز داخلي يعكسان جودة البراند من أول نظرة.',gallery:['assets/projects/project-3.png'],videos:[]},{id:'base-4',name:'مكتب Executive',cat:'أثاث',wood:'Solid Beech',finish:'Satin Lacquer',duration:'12 يوم',image:'assets/projects/project-4.png',description:'مكتب تفصيل بسطح واسع وتفاصيل نحاسية خفيفة.',details:'مكتب تفصيل بسطح واسع وتفاصيل نحاسية خفيفة.',gallery:['assets/projects/project-4.png'],videos:[]}];
const fallbackMaterials=[['خشب Walnut','لون عميق وحضور فاخر للمطابخ والأثاث الراقي.'],['قشرة Oak','ملمس طبيعي ونبرة هادئة للمساحات الحديثة.'],['مفصلات Soft Close','إغلاق ناعم وصامت لعمر استخدام أطول.'],['مقابض مخفية','خطوط نظيفة وتجربة استخدام مريحة.'],['تشطيب Matte PU','حماية عالية ولمسة غير لامعة أنيقة.'],['ألوان مخصصة','درجات مدروسة حسب الإضاءة والفراغ.']];
const testimonials=[['أحمد الخطيب','مالك فيلا','التصميم كان واضحًا قبل التنفيذ، والنتيجة طلعت أهدأ وأفخم مما توقعنا.'],['ليان مراد','تصميم داخلي','أكثر ما أعجبني هو الالتزام بالتفاصيل، خصوصًا التشطيب والقياسات.'],['شركة محلية','مشروع تجاري','تسليم مرتب، تواصل محترف، وتنفيذ يحترم هوية المكان.']];

let services=[...fallbackServices];
let projects=[...fallbackProjects];
let materials=[...fallbackMaterials];
let active='الكل';
let dbReady=false;

const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
function el(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function linesToArray(v){return String(v||'').split('\n').map(x=>x.trim()).filter(Boolean)}
function normalizeProject(p,i=0){return {id:p.id||`db-${i}`,name:p.name||'',cat:p.cat||'',wood:p.wood||'',finish:p.finish||'',duration:p.duration||'',image:p.image||'',description:p.description||p.desc||'',details:p.details||p.description||p.desc||'',gallery:Array.isArray(p.gallery)?p.gallery:(p.gallery?[p.gallery]:[]),videos:Array.isArray(p.videos)?p.videos:(p.videos?[p.videos]:[])};}
function normalizePair(item){if(Array.isArray(item))return item;return [item.title||item.name||'',item.description||item.desc||''];}

async function fetchTable(table,fallback){
  const {data,error}=await supabase.from(table).select('*').order('id',{ascending:true});
  if(error){console.warn(`${table} fallback:`,error.message);return {data:fallback,ready:false};}
  return {data:(data&&data.length?data:fallback),ready:true};
}
async function loadData(){
  const pr=await fetchTable('projects',fallbackProjects);
  projects=pr.data.map(normalizeProject); dbReady=pr.ready;
  const sr=await fetchTable('services',fallbackServices);
  services=sr.data.map(normalizePair);
  const mr=await fetchTable('materials',fallbackMaterials);
  materials=mr.data.map(normalizePair);
  renderAll();
}

function renderServices(){
  const grid=$('#servicesGrid'); if(!grid)return;
  grid.innerHTML='';
  grid.append(...services.map((s,i)=>el(`<article class="card reveal visible lift" style="transition-delay:${i*45}ms"><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></article>`)));
}
function renderFilters(){
  const filters=$('#filters'); if(!filters)return;
  const cats=['الكل',...new Set(projects.map(p=>p.cat).filter(Boolean))];
  if(!cats.includes(active)) active='الكل';
  filters.innerHTML='';
  cats.forEach(c=>{const b=el(`<button class="filter lift ${c===active?'active':''}">${esc(c)}</button>`);b.onclick=()=>{active=c;renderFilters();renderProjects();};filters.append(b)});
}
function renderProjects(){
  const grid=$('#projectGrid'); if(!grid)return;
  grid.innerHTML='';
  projects.filter(p=>active==='الكل'||p.cat===active).forEach((p,i)=>{
    const article=el(`<article class="project reveal visible lift" style="transition-delay:${i*55}ms"><img src="${esc(p.image||'assets/projects/project-1.png')}" alt="${esc(p.name)}"><div class="project-content"><p class="eyebrow">${esc(p.cat)}</p><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="meta"><span><b>الخشب</b>${esc(p.wood)}</span><span><b>التشطيب</b>${esc(p.finish)}</span><span><b>المدة</b>${esc(p.duration)}</span></div></div></article>`);
    article.onclick=()=>openProjectPopup(p.id);
    grid.append(article);
  });
}
function renderMaterials(){
  const grid=$('#materialGrid'); if(!grid)return;
  grid.innerHTML='';
  grid.append(...materials.map((m,i)=>el(`<article class="material reveal visible lift" style="transition-delay:${i*45}ms"><h3>${esc(m[0])}</h3><p>${esc(m[1])}</p></article>`)));
}
function renderTestimonials(){
  const grid=$('#testimonials'); if(!grid)return;
  grid.innerHTML='';
  grid.append(...testimonials.map((t,i)=>el(`<article class="test reveal visible lift" style="transition-delay:${i*55}ms"><p>“${esc(t[2])}”</p><h3>${esc(t[0])}</h3><p class="eyebrow">${esc(t[1])}</p></article>`)));
}
function renderAll(){renderServices();renderFilters();renderProjects();renderMaterials();renderTestimonials();observeReveals();}

function openProjectPopup(id){
  const p=projects.find(x=>String(x.id)===String(id)); if(!p)return;
  let modal=$('.project-modal');
  if(!modal){
    modal=el(`<div class="project-modal"><div class="project-box"><div class="project-modal-head"><h2></h2><button class="close-modal">إغلاق</button></div><div class="project-modal-body"><div class="project-gallery"></div><p class="project-modal-desc"></p><div class="project-info-grid"></div></div></div></div>`);
    document.body.appendChild(modal);
    $('.close-modal',modal).onclick=()=>modal.classList.remove('open');
    modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
  }
  $('h2',modal).textContent=p.name||'تفاصيل المشروع';
  $('.project-modal-desc',modal).textContent=p.details||p.description||'';
  const gallery=$('.project-gallery',modal); gallery.innerHTML='';
  const media=[...(p.gallery&&p.gallery.length?p.gallery:[p.image].filter(Boolean)),...(p.videos||[])].filter(Boolean);
  media.forEach(src=>{const isVideo=/\.(mp4|webm|ogg)$/i.test(src)||String(src).startsWith('data:video');const node=document.createElement(isVideo?'video':'img');node.src=src;if(isVideo)node.controls=true;node.alt=p.name||'project media';gallery.appendChild(node)});
  $('.project-info-grid',modal).innerHTML=`<div><b>التصنيف</b>${esc(p.cat)}</div><div><b>الخشب</b>${esc(p.wood)}</div><div><b>التشطيب</b>${esc(p.finish)}</div><div><b>المدة</b>${esc(p.duration)}</div>`;
  modal.classList.add('open');
}

function uid(){return crypto.randomUUID ? crypto.randomUUID() : 'p-'+Date.now()+'-'+Math.random().toString(16).slice(2)}
function openAdminDashboard(){
  let modal=$('.admin-modal');
  if(!modal){
    modal=el(`<div class="admin-modal"><div class="admin-dashboard"><div class="admin-top"><div><h2>لوحة تعديل الموقع</h2><p>تعديل المشاريع وربطها مع Supabase. تفتح بالضغط 5 مرات على الشعار أو Ctrl+Shift+A.</p></div><button class="admin-close">إغلاق</button></div><div class="admin-layout"><aside class="admin-list-panel"><button class="admin-new">+ مشروع جديد</button><div class="admin-project-list"></div></aside><section class="admin-form-panel"><input type="hidden" id="adId"><div class="admin-form-grid"><div class="admin-field"><label>اسم المشروع</label><input id="adName"></div><div class="admin-field"><label>التصنيف</label><input id="adCat" placeholder="مطابخ / خزائن / أثاث / تجاري"></div><div class="admin-field"><label>الخشب</label><input id="adWood"></div><div class="admin-field"><label>التشطيب</label><input id="adFinish"></div><div class="admin-field"><label>المدة</label><input id="adDuration"></div><div class="admin-field"><label>الصورة الرئيسية - رابط</label><input id="adImage" placeholder="assets/projects/project-1.png"></div><div class="admin-field full"><label>وصف مختصر يظهر في الكرت</label><textarea id="adDesc"></textarea></div><div class="admin-field full"><label>تفاصيل المشروع داخل النافذة</label><textarea id="adDetails"></textarea></div><div class="admin-field full"><label>صور المشروع - كل رابط بسطر</label><textarea id="adGallery"></textarea></div><div class="admin-field full"><label>فيديوهات المشروع - كل رابط بسطر</label><textarea id="adVideos"></textarea></div><div class="admin-field full admin-upload"><label>رفع صور إلى Supabase Storage</label><input id="adFiles" type="file" accept="image/*,video/mp4,video/webm" multiple><div class="admin-preview"></div></div></div><div class="admin-actions"><button class="admin-save">حفظ في Supabase</button><button class="admin-delete">حذف المشروع</button><button class="admin-export">إعادة تحميل البيانات</button></div><p class="admin-note">مهم: حتى يعمل الحفظ والرفع، طبق ملف supabase-setup.sql في Supabase وأنشئ Bucket باسم projects.</p></section></div></div></div>`);
    document.body.appendChild(modal);
    $('.admin-close',modal).onclick=()=>modal.classList.remove('open');
    $('.admin-new',modal).onclick=()=>fillForm({id:'',name:'',cat:'',wood:'',finish:'',duration:'',image:'',description:'',details:'',gallery:[],videos:[]});
    $('.admin-save',modal).onclick=saveForm;
    $('.admin-delete',modal).onclick=deleteCurrent;
    $('.admin-export',modal).onclick=loadData;
    $('#adFiles',modal).onchange=handleUploads;
  }
  modal.classList.add('open'); renderAdminList(); fillForm(projects[0]||{id:''});
}
function renderAdminList(activeId){
  const list=$('.admin-project-list'); if(!list)return; list.innerHTML='';
  projects.forEach(p=>{const item=el(`<div class="admin-list-item ${String(p.id)===String(activeId)?'active':''}"><b>${esc(p.name||'مشروع بدون اسم')}</b><span>${esc(p.cat||'بدون تصنيف')}</span></div>`);item.onclick=()=>fillForm(p);list.appendChild(item)});
}
function fillForm(p){
  if(!p)return;
  $('#adId').value=p.id||''; $('#adName').value=p.name||''; $('#adCat').value=p.cat||''; $('#adWood').value=p.wood||''; $('#adFinish').value=p.finish||''; $('#adDuration').value=p.duration||''; $('#adImage').value=p.image||''; $('#adDesc').value=p.description||''; $('#adDetails').value=p.details||''; $('#adGallery').value=(p.gallery||[]).join('\n'); $('#adVideos').value=(p.videos||[]).join('\n');
  const preview=$('.admin-preview'); if(preview)preview.innerHTML=''; renderAdminList(p.id);
}
async function uploadFile(file){
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'-');
  const path=`${Date.now()}-${safe}`;
  const {error}=await supabase.storage.from('projects').upload(path,file,{cacheControl:'3600',upsert:false});
  if(error){alert('فشل رفع الملف: '+error.message);return null;}
  const {data}=supabase.storage.from('projects').getPublicUrl(path);
  return data.publicUrl;
}
async function handleUploads(e){
  const files=[...e.target.files]; if(!files.length)return;
  const urls=[]; const preview=$('.admin-preview'); if(preview)preview.innerHTML='جار الرفع...';
  for(const f of files){const url=await uploadFile(f); if(url)urls.push(url);}
  const imgs=urls.filter(u=>!u.match(/\.(mp4|webm|ogg)$/i));
  const vids=urls.filter(u=>u.match(/\.(mp4|webm|ogg)$/i));
  $('#adGallery').value=[$('#adGallery').value.trim(),...imgs].filter(Boolean).join('\n');
  $('#adVideos').value=[$('#adVideos').value.trim(),...vids].filter(Boolean).join('\n');
  if(!$('#adImage').value && imgs[0]) $('#adImage').value=imgs[0];
  if(preview){preview.innerHTML='';imgs.forEach(u=>{const img=document.createElement('img');img.src=u;preview.appendChild(img)});}
}
async function saveForm(){
  const id=$('#adId').value.trim();
  const project={name:$('#adName').value.trim(),cat:$('#adCat').value.trim(),wood:$('#adWood').value.trim(),finish:$('#adFinish').value.trim(),duration:$('#adDuration').value.trim(),image:$('#adImage').value.trim(),description:$('#adDesc').value.trim(),details:$('#adDetails').value.trim(),gallery:linesToArray($('#adGallery').value),videos:linesToArray($('#adVideos').value)};
  if(!project.name){alert('اكتب اسم المشروع');return;} if(!project.image&&project.gallery[0])project.image=project.gallery[0]; if(!project.gallery.length&&project.image)project.gallery=[project.image];
  let error;
  if(id && !String(id).startsWith('base-')) ({error}=await supabase.from('projects').update(project).eq('id',id));
  else ({error}=await supabase.from('projects').insert(project));
  if(error){alert('لم يتم الحفظ. تأكد من إنشاء الجداول والسياسات.\n'+error.message);return;}
  await loadData(); alert('تم الحفظ في Supabase');
}
async function deleteCurrent(){
  const id=$('#adId').value.trim(); if(!id)return; if(!confirm('حذف هذا المشروع؟'))return;
  if(String(id).startsWith('base-')){alert('هذا مشروع احتياطي محلي. احفظ مشاريعك في Supabase أولًا.');return;}
  const {error}=await supabase.from('projects').delete().eq('id',id);
  if(error){alert('فشل الحذف: '+error.message);return;}
  await loadData(); fillForm(projects[0]||{}); alert('تم الحذف');
}

function observeReveals(){
  if(!('IntersectionObserver' in window)){ $$('.reveal').forEach(x=>x.classList.add('visible')); return; }
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -60px 0px'});
  $$('.reveal:not(.visible)').forEach(x=>io.observe(x));
}
window.addEventListener('load',()=>setTimeout(()=>$('#loader')?.classList.add('hide'),850));
const range=$('#baRange'),before=$('#beforeLayer'),handle=$('.ba-handle');function updateBa(){if(!range||!before||!handle)return;before.style.width=range.value+'%';handle.style.right=range.value+'%'}range?.addEventListener('input',updateBa);updateBa();
(function(){const isDesktop=matchMedia('(pointer:fine)').matches,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!isDesktop||reduce||innerWidth<981)return;let c=$('#sawdust');if(!c){c=document.createElement('canvas');c.id='sawdust';document.body.prepend(c)}const ctx=c.getContext('2d');let parts=[],last=0;function size(){const dpr=Math.min(devicePixelRatio||1,2);c.width=innerWidth*dpr;c.height=innerHeight*dpr;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}size();addEventListener('resize',size,{passive:true});addEventListener('mousemove',e=>{const now=performance.now();if(now-last<14)return;last=now;for(let i=0;i<3;i++)parts.push({x:e.clientX+Math.random()*18-9,y:e.clientY+Math.random()*18-9,vx:(Math.random()-.5)*.65,vy:(Math.random()-.5)*.65-.08,life:42,max:42,r:Math.random()*2.2+.9,rot:Math.random()*Math.PI});if(parts.length>120)parts.splice(0,parts.length-120)},{passive:true});function tick(){ctx.clearRect(0,0,innerWidth,innerHeight);parts=parts.filter(p=>p.life-->0);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.006;ctx.save();ctx.globalAlpha=(p.life/p.max)*.34;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle='#4c2b11';ctx.beginPath();ctx.ellipse(0,0,p.r*1.75,p.r*.72,0,0,Math.PI*2);ctx.fill();ctx.restore()});requestAnimationFrame(tick)}tick()})();
let ticking=false;function parallax(){ticking=false;const y=scrollY;const hero=$('.hero-art');if(hero)hero.style.transform=`translateY(${y*.08}px) scale(1.04)`}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}},{passive:true});
document.addEventListener('DOMContentLoaded',()=>{const v=$('.hero-video');if(v){v.muted=true;v.playsInline=true;v.play()?.catch(()=>{});}let logoClicks=0;$('.brand-logo')?.addEventListener('click',e=>{logoClicks++; if(logoClicks>=5){e.preventDefault();openAdminDashboard();logoClicks=0} setTimeout(()=>logoClicks=0,1800)});const hit=document.createElement('button');hit.className='admin-secret-hit';hit.setAttribute('aria-label','admin');document.body.appendChild(hit);hit.onclick=()=>{const pass=prompt('كلمة سر لوحة التعديل'); if(pass==='bsw-admin')openAdminDashboard();};document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='a')openAdminDashboard();});});

loadData();
