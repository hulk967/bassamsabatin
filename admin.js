import { supabase } from './supabase.js';

const fallbackSettings = {
  logo: 'assets/logo.png',
  heroVideo: 'assets/media/hero-wood.mp4',
  heroPoster: 'assets/projects/project-1.png',
  heroEyebrow: 'Luxury Woodworks / Interior Craftsmanship',
  heroTitle: 'النجارة مش بس شغل إيدين<br><span>تصميم بعقل قبل التنفيذ</span><br>تنفيذ لآخر مسمار',
  heroLead: 'نجارة داخلية تُبنى على القياس، الخامة، والإحساس الهادئ بالفخامة.',
  aboutTitle: 'ورشة راقية تبدأ بالفكرة قبل المنشار.',
  aboutLead: 'نصمم الخشب كجزء من هوية المكان، لا كقطعة منفصلة عنه.',
  aboutText1: 'Bassam Sabatin Woodworks براند نجارة وتصميم داخلي يوازن بين الذوق، الدقة، والخبرة العملية.',
  aboutText2: 'الفخامة عندنا ليست زحمة تفاصيل؛ هي قياس صحيح، خامة محترمة، حواف نظيفة، وتركيب لا يترك صدفة.',
  servicesTitle: 'تفصيل فاخر للمساحات التي تستحق.',
  portfolioTitle: 'مشاريع مصممة لتبدو هادئة وغالية.',
  contactTitle: 'احكِ لنا عن المساحة، ونحوّلها لخطة تنفيذ واضحة.',
  contactLead: 'أرسل صورًا أو مراجع أو وصفًا بسيطًا، وسنرتب التفاصيل خطوة بخطوة.',
  whatsapp: '962798234541'
};

let settings = { ...fallbackSettings };
let projects = [];
let services = [];
let materials = [];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const status = (msg, err = false) => {
  const n = $('#adminStatus');
  if (!n) return;
  n.textContent = msg;
  n.className = 'admin-status ' + (err ? 'error' : 'ok');
  setTimeout(() => n.textContent = '', 3500);
};

const lines = v => String(v || '').split('\n').map(x => x.trim()).filter(Boolean);
const join = a => Array.isArray(a) ? a.join('\n') : '';

async function requireLogin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    showDashboard();
  } else {
    $('#loginBox')?.classList.remove('hidden');
  }
}

$('#loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();

  $('#loginError').textContent = '';

  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    $('#loginError').textContent = 'بيانات الدخول غير صحيحة أو لم يتم إنشاء المستخدم في Supabase Auth.';
    return;
  }

  showDashboard();
});

if ($('#logoutBtn')) {
  $('#logoutBtn').onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
}

async function showDashboard() {
  $('#loginBox')?.classList.add('hidden');
  $('#dashboard')?.classList.remove('hidden');
  await loadAll();
  bindTabs();
}

function bindTabs() {
  $$('.admin-tabs button').forEach(b => {
    b.onclick = () => {
      $$('.admin-tabs button').forEach(x => x.classList.remove('active'));
      $$('.admin-tab-panel').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      $('#tab-' + b.dataset.tab)?.classList.add('active');
    };
  });
}

async function loadAll() {
  await loadSettings();

  projects = await getTable('projects');
  services = await getTable('services');
  materials = await getTable('materials');

  fillSettings();
  renderProjects();
  renderServices();
  renderMaterials();
}

async function getTable(t) {
  const { data, error } = await supabase
    .from(t)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    status(error.message, true);
    return [];
  }

  return data || [];
}

async function loadSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('content')
    .eq('key', 'main')
    .maybeSingle();

  if (error) {
    console.error(error);
    settings = { ...fallbackSettings };
    return;
  }

  settings = {
    ...fallbackSettings,
    ...(data?.content || {})
  };
}

async function saveSettingsObj() {
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      {
        key: 'main',
        content: settings,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'key'
      }
    );

  if (error) throw error;
}

function fillSettings() {
  Object.entries({
    setLogo: 'logo',
    setHeroVideo: 'heroVideo',
    setHeroPoster: 'heroPoster',
    setWhatsapp: 'whatsapp',
    setHeroEyebrow: 'heroEyebrow',
    setHeroTitle: 'heroTitle',
    setHeroLead: 'heroLead',
    setAboutTitle: 'aboutTitle',
    setAboutLead: 'aboutLead',
    setAboutText1: 'aboutText1',
    setAboutText2: 'aboutText2',
    setServicesTitle: 'servicesTitle',
    setPortfolioTitle: 'portfolioTitle',
    setContactTitle: 'contactTitle',
    setContactLead: 'contactLead'
  }).forEach(([id, key]) => {
    const input = $('#' + id);
    if (input) input.value = settings[key] || '';
  });
}

if ($('#saveSettings')) {
  $('#saveSettings').onclick = async () => {
    try {
      Object.entries({
        setLogo: 'logo',
        setHeroVideo: 'heroVideo',
        setHeroPoster: 'heroPoster',
        setWhatsapp: 'whatsapp',
        setHeroEyebrow: 'heroEyebrow',
        setHeroTitle: 'heroTitle',
        setHeroLead: 'heroLead',
        setAboutTitle: 'aboutTitle',
        setAboutLead: 'aboutLead',
        setAboutText1: 'aboutText1',
        setAboutText2: 'aboutText2',
        setServicesTitle: 'servicesTitle',
        setPortfolioTitle: 'portfolioTitle',
        setContactTitle: 'contactTitle',
        setContactLead: 'contactLead'
      }).forEach(([id, key]) => {
        const input = $('#' + id);
        if (input) settings[key] = input.value;
      });

      await saveSettingsObj();
      status('تم حفظ إعدادات الموقع');
    } catch (e) {
      status(e.message, true);
    }
  };
}

if ($('#uploadLogo')) {
  $('#uploadLogo').onchange = async e => {
    const url = await upload(e.target.files[0]);
    if (url) {
      $('#setLogo').value = url;
      settings.logo = url;
      status('تم رفع اللوجو، اضغط حفظ الإعدادات');
    }
  };
}

if ($('#uploadHeroVideo')) {
  $('#uploadHeroVideo').onchange = async e => {
    const url = await upload(e.target.files[0]);
    if (url) {
      $('#setHeroVideo').value = url;
      settings.heroVideo = url;
      status('تم رفع الفيديو، اضغط حفظ الإعدادات');
    }
  };
}

async function upload(file) {
  if (!file) return null;

  const path = `uploads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  const { error } = await supabase.storage
    .from('site-assets')
    .upload(path, file, { upsert: false });

  if (error) {
    status('خطأ رفع الملف: ' + error.message, true);
    return null;
  }

  return supabase.storage
    .from('site-assets')
    .getPublicUrl(path).data.publicUrl;
}

function itemBtn(item, txt, cb) {
  const b = document.createElement('button');
  b.type = 'button';
  b.innerHTML = `<b>${txt}</b><span>#${item.id || ''}</span>`;
  b.onclick = () => cb(item);
  return b;
}

function renderProjects() {
  const list = $('#projectList');
  if (!list) return;

  list.innerHTML = '';

  projects.forEach(p => {
    list.append(itemBtn(p, p.name || 'مشروع بدون اسم', fillProject));
  });

  if (projects[0]) fillProject(projects[0]);
}

if ($('#newProject')) {
  $('#newProject').onclick = () => fillProject({
    id: '',
    name: '',
    cat: '',
    wood: '',
    finish: '',
    duration: '',
    image: 'assets/projects/project-1.png',
    description: '',
    details: '',
    gallery: [],
    videos: []
  });
}

function fillProject(p) {
  $('#projectId').value = p.id || '';
  $('#projectName').value = p.name || '';
  $('#projectCat').value = p.cat || '';
  $('#projectWood').value = p.wood || '';
  $('#projectFinish').value = p.finish || '';
  $('#projectDuration').value = p.duration || '';
  $('#projectImage').value = p.image || '';
  $('#projectDescription').value = p.description || '';
  $('#projectDetails').value = p.details || '';
  $('#projectGallery').value = join(p.gallery);
  $('#projectVideos').value = join(p.videos);
  $('#projectUploadPreview').innerHTML = '';
}

if ($('#projectFiles')) {
  $('#projectFiles').onchange = async e => {
    const urls = [];

    for (const f of e.target.files) {
      const u = await upload(f);
      if (u) urls.push(u);
    }

    if (urls.length) {
      $('#projectGallery').value = [
        $('#projectGallery').value.trim(),
        ...urls
      ].filter(Boolean).join('\n');

      $('#projectUploadPreview').innerHTML = urls.map(u => `<img src="${u}">`).join('');
    }
  };
}

if ($('#projectForm')) {
  $('#projectForm').onsubmit = async e => {
    e.preventDefault();

    const row = {
      name: $('#projectName').value,
      cat: $('#projectCat').value,
      wood: $('#projectWood').value,
      finish: $('#projectFinish').value,
      duration: $('#projectDuration').value,
      image: $('#projectImage').value,
      description: $('#projectDescription').value,
      details: $('#projectDetails').value,
      gallery: lines($('#projectGallery').value),
      videos: lines($('#projectVideos').value)
    };

    const id = $('#projectId').value;

    const q = id
      ? supabase.from('projects').update(row).eq('id', id)
      : supabase.from('projects').insert(row);

    const { error } = await q;

    if (error) return status(error.message, true);

    projects = await getTable('projects');
    renderProjects();
    status('تم حفظ المشروع');
  };
}

if ($('#deleteProject')) {
  $('#deleteProject').onclick = async () => {
    const id = $('#projectId').value;

    if (!id || !confirm('حذف المشروع؟')) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) return status(error.message, true);

    projects = await getTable('projects');
    renderProjects();
    status('تم الحذف');
  };
}

function renderServices() {
  const list = $('#serviceList');
  if (!list) return;

  list.innerHTML = '';

  services.forEach(s => {
    list.append(itemBtn(s, s.title || 'خدمة', fillService));
  });

  if (services[0]) fillService(services[0]);
}

if ($('#newService')) {
  $('#newService').onclick = () => fillService({
    id: '',
    title: '',
    description: ''
  });
}

function fillService(s) {
  $('#serviceId').value = s.id || '';
  $('#serviceTitle').value = s.title || '';
  $('#serviceDescription').value = s.description || '';
}

if ($('#serviceForm')) {
  $('#serviceForm').onsubmit = async e => {
    e.preventDefault();

    await saveSmall('services', $('#serviceId').value, {
      title: $('#serviceTitle').value,
      description: $('#serviceDescription').value
    });

    services = await getTable('services');
    renderServices();
  };
}

if ($('#deleteService')) {
  $('#deleteService').onclick = async () => {
    await delSmall('services', $('#serviceId').value);
    services = await getTable('services');
    renderServices();
  };
}

function renderMaterials() {
  const list = $('#materialList');
  if (!list) return;

  list.innerHTML = '';

  materials.forEach(m => {
    list.append(itemBtn(m, m.title || 'خامة', fillMaterial));
  });

  if (materials[0]) fillMaterial(materials[0]);
}

if ($('#newMaterial')) {
  $('#newMaterial').onclick = () => fillMaterial({
    id: '',
    title: '',
    description: ''
  });
}

function fillMaterial(m) {
  $('#materialId').value = m.id || '';
  $('#materialTitle').value = m.title || '';
  $('#materialDescription').value = m.description || '';
}

if ($('#materialForm')) {
  $('#materialForm').onsubmit = async e => {
    e.preventDefault();

    await saveSmall('materials', $('#materialId').value, {
      title: $('#materialTitle').value,
      description: $('#materialDescription').value
    });

    materials = await getTable('materials');
    renderMaterials();
  };
}

if ($('#deleteMaterial')) {
  $('#deleteMaterial').onclick = async () => {
    await delSmall('materials', $('#materialId').value);
    materials = await getTable('materials');
    renderMaterials();
  };
}

async function saveSmall(table, id, row) {
  const q = id
    ? supabase.from(table).update(row).eq('id', id)
    : supabase.from(table).insert(row);

  const { error } = await q;

  if (error) return status(error.message, true);

  status('تم الحفظ');
}

async function delSmall(table, id) {
  if (!id || !confirm('حذف العنصر؟')) return;

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) return status(error.message, true);

  status('تم الحذف');
}

requireLogin();
