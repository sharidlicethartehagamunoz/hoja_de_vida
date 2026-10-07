'use strict';
/* CVForge · script.js — JavaScript vanilla, sin dependencias */
const KEY = 'cvforge.sharid.v1';
const $ = (q) => document.querySelector(q);
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);
const bul = (t) => (lines(t).length ? `<ul class="b">${lines(t).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');

/* Perfiles: [nombre, palabras clave sugeridas]. Son SUGERENCIAS, no conocimientos del usuario. */
const ROLES = {
  frontend: ['Desarrollador Frontend', 'HTML5,CSS3,JavaScript,TypeScript,React,Accesibilidad,Responsive design,Git,Testing'],
  backend: ['Desarrollador Backend', 'Node.js,Express,API REST,SQL,PostgreSQL,Docker,Autenticación,Testing,Git'],
  fullstack: ['Desarrollador Full Stack', 'JavaScript,React,Node.js,API REST,SQL,MongoDB,Git,Docker,Testing'],
  software: ['Ingeniero de software', 'Estructuras de datos,Algoritmos,Patrones de diseño,Testing,CI/CD,Git,Arquitectura,API REST'],
  data: ['Analista de datos', 'SQL,Python,Pandas,Power BI,Tableau,Estadística,ETL,Excel,Visualización de datos'],
  qa: ['QA / Tester de software', 'Pruebas manuales,Pruebas automatizadas,Selenium,Cypress,Jira,Casos de prueba,API testing,Regresión'],
  devops: ['DevOps', 'Linux,Docker,Kubernetes,CI/CD,Terraform,AWS,Monitoreo,Git,Bash'],
  security: ['Especialista en ciberseguridad', 'OWASP,Pentesting,Redes,Linux,SIEM,Criptografía,Análisis de vulnerabilidades,Hardening,Python']
};

/* Esquema de secciones repetibles */
const LISTS = {
  skills: { t: 'Habilidades técnicas', n: 'categoría', f: [['cat', 'Categoría (ej. Lenguajes)'], ['items', 'Tecnologías, separadas por coma']] },
  exp: { t: 'Experiencia laboral', n: 'experiencia', f: [['role', 'Cargo'], ['org', 'Empresa'], ['period', 'Periodo (ej. 2022 – Actual)'], ['text', 'Responsabilidades y logros (una por línea)', 5]] },
  proj: { t: 'Proyectos', n: 'proyecto', f: [['name', 'Nombre del proyecto'], ['link', 'Enlace (GitHub, demo)', 'url'], ['text', 'Descripción y resultados (una por línea)', 4]] },
  edu: { t: 'Educación', n: 'estudio', f: [['title', 'Título o programa'], ['org', 'Institución'], ['period', 'Periodo']] },
  cert: { t: 'Certificaciones', n: 'certificación', f: [['name', 'Certificación'], ['org', 'Entidad emisora'], ['year', 'Año']] },
  lang: { t: 'Idiomas', n: 'idioma', f: [['name', 'Idioma'], ['level', 'Nivel (ej. B2, Nativo)']] }
};
const PERSONAL = [['name', 'Nombre completo'], ['title', 'Cargo profesional'], ['city', 'Ciudad y país'], ['phone', 'Teléfono', 'tel'], ['email', 'Correo electrónico', 'email'], ['linkedin', 'LinkedIn', 'url'], ['github', 'GitHub', 'url'], ['web', 'Portafolio / sitio web', 'url']];

/* Datos de demostración (ficticios y editables) */
const demo = () => ({
  tpl: 'visual', role: 'software', photo: '', demo: false, hidden: {},
  p: {
    name: 'Sharid Liceth Artehaga', title: 'Estudiante de Ingeniería Informática · Desarrolladora', city: 'Manizales, Colombia',
    phone: '', email: 'sharidartehaga577@gmail.com', linkedin: '',
    github: 'github.com/sharidlicethartehagamunoz', web: 'sharidlicethartehagamunoz.github.io',
    summary: 'Estudiante de Ingeniería Informática en la Universidad de Caldas. Programo en Python y busco una oportunidad para desarrollar código dentro de un equipo, aprender de proyectos reales y seguir creciendo como desarrolladora. Me gusta investigar y escribir poemas y mitologías propias. Estoy fortaleciendo mi inglés y quiero aprender francés e italiano.',
    extra: 'Disponible para trabajar en Manizales, en Medellín o en el exterior. Objetivos de formación: inglés avanzado, francés e italiano.'
  },
  skills: [{ cat: 'Lenguajes', items: 'Python' }],
  exp: [{ role: '', org: '', period: '', text: '' }],
  proj: [{ name: '', link: '', text: '' }],
  edu: [{ title: 'Ingeniería Informática', org: 'Universidad de Caldas', period: 'En curso' }],
  cert: [{ name: '', org: '', year: '' }],
  lang: [{ name: 'Español', level: 'Nativo' }, { name: 'Inglés', level: 'En progreso' }]
});
const blank = () => ({
  tpl: 'ats', role: 'fullstack', photo: '', demo: false, hidden: {},
  p: { name: '', title: '', city: '', phone: '', email: '', linkedin: '', github: '', web: '', summary: '', extra: '' },
  skills: [{ cat: '', items: '' }], exp: [{ role: '', org: '', period: '', text: '' }], proj: [{ name: '', link: '', text: '' }],
  edu: [{ title: '', org: '', period: '' }], cert: [{ name: '', org: '', year: '' }], lang: [{ name: '', level: '' }]
});

let s;
try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
if (!s || !s.p) s = demo();

const show = (k) => !s.hidden[k];
const L = (k) => s[k].filter((o) => Object.values(o).some((v) => String(v).trim()));
const has = (k) => show(k) && L(k).length > 0;

/* ---------- Formulario ---------- */
function build() {
  let n = 0;
  const F = (attr, label, v, type = 'text', rows) => {
    const id = 'f' + n++;
    const ctl = rows
      ? `<textarea id="${id}" rows="${rows}" ${attr}>${esc(v)}</textarea>`
      : `<input id="${id}" type="${type === 'url' || type === 'tel' ? 'text' : type}" data-v="${type}" value="${esc(v)}" ${attr} ${type === 'email' ? 'autocomplete="email" inputmode="email"' : ''}>`;
    return `<div class="fld"><label for="${id}">${label}</label>${ctl}<small class="err"></small></div>`;
  };
  const head = (k, t) => `<div class="sh"><h2>${t}</h2><label class="sw"><input type="checkbox" data-h="${k}" ${show(k) ? 'checked' : ''}> Mostrar</label></div>`;
  let h = `<div class="blk-f"><div class="sh"><h2>Datos personales</h2></div>${PERSONAL.map(([k, l, t]) => F(`data-p="${k}"`, l, s.p[k], t)).join('')}
    <div class="photo"><label class="ghost" style="padding:.6rem 1rem;border-radius:8px;border:1px solid var(--line);cursor:pointer">Subir fotografía (opcional)<input type="file" id="photo" accept="image/*" class="sr"></label>
    <button type="button" class="ghost" data-act="rmphoto" ${s.photo ? '' : 'disabled'}>Quitar foto</button><small>Solo se usa en la plantilla visual.</small></div></div>`;
  h += `<div class="blk-f">${head('summary', 'Perfil profesional')}${F('data-p="summary"', 'Resumen (3–5 líneas, claro y concreto)', s.p.summary, 'text', 5)}</div>`;
  Object.entries(LISTS).forEach(([k, d]) => {
    h += `<div class="blk-f">${head(k, d.t)}`;
    s[k].forEach((o, i) => {
      h += `<fieldset class="rep"><legend class="sr">${d.t} ${i + 1}</legend>${d.f.map(([f, l, t]) => F(`data-l="${k}" data-i="${i}" data-k="${f}"`, l, o[f], typeof t === 'number' ? 'text' : t, typeof t === 'number' ? t : 0)).join('')}
        <button type="button" class="ghost del" data-act="del" data-l="${k}" data-i="${i}">Eliminar ${d.n}</button></fieldset>`;
    });
    h += `<button type="button" class="ghost" data-act="add" data-l="${k}">+ Agregar ${d.n}</button></div>`;
  });
  h += `<div class="blk-f">${head('extra', 'Información adicional')}${F('data-p="extra"', 'Disponibilidad, publicaciones, voluntariado…', s.p.extra, 'text', 3)}</div>`;
  $('#form').innerHTML = h;
}

function validate(el) {
  const v = el.value.trim(), t = el.dataset.v; let m = '';
  if (v) {
    if (t === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
    if (t === 'url' && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v)) m = 'Escribe un enlace válido, por ejemplo github.com/usuario.';
    if (t === 'tel' && !/^[+\d\s().-]{7,}$/.test(v)) m = 'Usa solo números, espacios y el signo +.';
  }
  el.classList.toggle('bad', !!m);
  el.setAttribute('aria-invalid', !!m);
  el.parentNode.querySelector('.err').textContent = m;
  return !m;
}

/* ---------- Vista previa ---------- */
const sec = (t, ok, h) => (ok ? `<section><h2>${t}</h2>${h}</section>` : '');
const blocks = {
  summary: () => sec('Perfil profesional', show('summary') && s.p.summary, `<p>${esc(s.p.summary)}</p>`),
  exp: () => sec('Experiencia laboral', has('exp'), L('exp').map((o) => `<div class="item"><p class="ih"><b>${esc(o.role)}${o.org ? ' · ' + esc(o.org) : ''}</b><span>${esc(o.period)}</span></p>${bul(o.text)}</div>`).join('')),
  proj: () => sec('Proyectos', has('proj'), L('proj').map((o) => `<div class="item"><p class="ih"><b>${esc(o.name)}</b><span>${esc(o.link)}</span></p>${bul(o.text)}</div>`).join('')),
  edu: () => sec('Educación', has('edu'), L('edu').map((o) => `<div class="item"><p class="ih"><b>${esc(o.title)}</b><span>${esc(o.period)}</span></p><p>${esc(o.org)}</p></div>`).join('')),
  cert: () => sec('Certificaciones', has('cert'), L('cert').map((o) => `<p>${esc(o.name)}${o.org ? ' — ' + esc(o.org) : ''}${o.year ? ' (' + esc(o.year) + ')' : ''}</p>`).join('')),
  extra: () => sec('Información adicional', show('extra') && s.p.extra, `<p>${esc(s.p.extra)}</p>`)
};

function renderATS() {
  const p = s.p;
  return `<article class="ats"><header class="h"><h1>${esc(p.name)}</h1><p class="role">${esc(p.title)}</p>
    <p>${[p.city, p.phone, p.email, p.linkedin, p.github, p.web].filter(Boolean).map(esc).join(' | ')}</p></header>
    ${blocks.summary()}
    ${sec('Habilidades técnicas', has('skills'), L('skills').map((o) => `<p><b>${esc(o.cat)}:</b> ${esc(o.items)}</p>`).join(''))}
    ${blocks.exp()}${blocks.proj()}${blocks.edu()}${blocks.cert()}
    ${sec('Idiomas', has('lang'), `<p>${L('lang').map((o) => esc(o.name) + (o.level ? ' (' + esc(o.level) + ')' : '')).join(', ')}</p>`)}
    ${blocks.extra()}</article>`;
}

function renderVisual() {
  const p = s.p, ini = (p.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const ct = [['⌂', p.city], ['☎', p.phone], ['✉', p.email], ['in', p.linkedin], ['gh', p.github], ['↗', p.web]].filter((c) => c[1]);
  const side = `<aside class="side">${s.photo ? `<img class="ph" src="${s.photo}" alt="Fotografía">` : `<div class="ph ini" aria-hidden="true">${esc(ini)}</div>`}
    <h3>Contacto</h3><ul class="ct">${ct.map((c) => `<li><em>${c[0]}</em><span>${esc(c[1])}</span></li>`).join('')}</ul>
    ${has('skills') ? `<h3>Habilidades</h3>${L('skills').map((o) => `<p class="cat">${esc(o.cat)}</p><div class="chips">${o.items.split(',').map((x) => x.trim()).filter(Boolean).map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>`).join('')}` : ''}
    ${has('lang') ? `<h3>Idiomas</h3><ul>${L('lang').map((o) => `<li>${esc(o.name)}${o.level ? ' · ' + esc(o.level) : ''}</li>`).join('')}</ul>` : ''}</aside>`;
  return `<article class="v">${side}<div class="main"><header><h1>${esc(p.name)}</h1><p class="role">${esc(p.title)}</p></header>
    ${blocks.summary()}${blocks.exp()}${blocks.proj()}${blocks.edu()}${blocks.cert()}${blocks.extra()}</div></article>`;
}

function progress() {
  const p = s.p, d = [p.name, p.title, p.city, p.email, p.phone, p.summary, L('skills').length, L('exp').length || L('proj').length, L('edu').length, L('lang').length];
  const pc = Math.round((d.filter(Boolean).length / d.length) * 100);
  $('#pct').textContent = pc + '%'; $('#fill').style.width = pc + '%';
  $('.track').setAttribute('aria-valuenow', pc);
}

function update() {
  $('#sheet').innerHTML = s.tpl === 'ats' ? renderATS() : renderVisual();
  document.querySelector(`input[name=tpl][value=${s.tpl}]`).checked = true;
  $('#demoNote').hidden = !s.demo;
  progress();
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* almacenamiento no disponible */ }
}

/* ---------- Sugerencias por perfil ---------- */
function suggestions() {
  const kws = ROLES[s.role][1].split(',');
  $('#sugg').innerHTML = `Palabras clave sugeridas para ${ROLES[s.role][0]} (solo agrégalas si realmente las dominas):<br>` +
    kws.map((k) => `<button type="button" data-sg="${esc(k)}">+ ${esc(k)}</button>`).join('');
}

/* ---------- Analizador ---------- */
function analyze() {
  const p = s.p, txt = JSON.stringify([p, s.skills, s.exp, s.proj, s.edu, s.cert]).toLowerCase();
  const kw = ROLES[s.role][1].split(','), hit = kw.filter((k) => txt.includes(k.toLowerCase())), miss = kw.filter((k) => !hit.includes(k));
  const nSk = L('skills').reduce((a, o) => a + o.items.split(',').filter((x) => x.trim()).length, 0);
  const badLinks = document.querySelectorAll('#form input.bad').length;
  const vis = Object.keys(LISTS).concat(['summary', 'extra']).filter((k) => show(k)).length;
  const bullets = L('exp').reduce((a, o) => a + lines(o.text).length, 0);
  const partial = Object.keys(LISTS).some((k) => L(k).some((o) => Object.values(o).some((v) => !String(v).trim())));
  const C = [
    [15, p.name && p.email && p.phone && p.city ? 1 : p.name && p.email ? 0.5 : 0, 'Datos de contacto', 'Completa nombre, ciudad, teléfono y correo.'],
    [10, p.summary.length >= 200 ? 1 : p.summary ? 0.5 : 0, 'Perfil profesional', 'Escribe 3–5 líneas (200+ caracteres) con tu enfoque, tecnologías y tipo de proyectos.'],
    [15, nSk >= 8 ? 1 : nSk >= 4 ? 0.6 : nSk ? 0.3 : 0, 'Habilidades técnicas', 'Incluye al menos 8 tecnologías agrupadas por categoría.'],
    [20, bullets >= 2 ? 1 : L('exp').length || L('proj').length ? 0.5 : 0, 'Experiencia o proyectos', 'Describe responsabilidades concretas y logros medibles; si no tienes experiencia, agrega proyectos o prácticas.'],
    [10, has('edu') ? 1 : 0, 'Educación', 'Agrega tu formación (títulos, bootcamps o cursos).'],
    [15, Math.min(1, hit.length / kw.length * 2), 'Palabras clave del perfil ' + ROLES[s.role][0], miss.length ? `Revisa si aplican a tu experiencia real: ${miss.slice(0, 5).join(', ')}.` : ''],
    [10, (vis >= 5 ? 0.5 : 0) + (badLinks ? 0 : 0.5), 'Estructura y legibilidad', 'Mantén al menos 5 secciones visibles y corrige los enlaces o correos con error.'],
    [5, partial ? 0 : 1, 'Campos incompletos', 'Hay elementos a medio llenar: complétalos o elimínalos.']
  ];
  const score = Math.round(C.reduce((a, c) => a + c[0] * c[1], 0));
  $('#report').innerHTML = `<p class="score">${score}/100</p>` + C.map((c) => `<div class="chk"><b>${c[1] === 1 ? '✓' : c[1] > 0 ? '◐' : '✗'}</b>${c[2]}${c[1] < 1 && c[3] ? `<small>${esc(c[3])}</small>` : ''}</div>`).join('') +
    '<p class="note">Estimación orientativa basada en criterios simples (contacto, perfil, habilidades, experiencia, educación, palabras clave, estructura y campos completos). No garantiza superar un ATS ni conseguir una entrevista.</p>';
}

/* ---------- PDF (impresión del navegador) ---------- */
const baseTitle = document.title;
function pdf(t) {
  if (t) { s.tpl = t; update(); }
  const nm = (s.p.name || 'Hoja_de_vida').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
  document.title = `CV_${nm}_${s.tpl === 'ats' ? 'ATS' : 'Visual'}`; /* el navegador lo propone como nombre del archivo */
  window.print();
}
window.addEventListener('afterprint', () => { document.title = baseTitle; });

/* ---------- Eventos ---------- */
const form = $('#form');
form.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.p) s.p[el.dataset.p] = el.value;
  else if (el.dataset.l) s[el.dataset.l][el.dataset.i][el.dataset.k] = el.value;
  else return;
  if (el.dataset.v) validate(el);
  update();
});
form.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.h) { s.hidden[el.dataset.h] = !el.checked; update(); }
  if (el.id === 'photo' && el.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const m = Math.min(1, 400 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = im.width * m; c.height = im.height * m;
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        s.photo = c.toDataURL('image/jpeg', 0.85); build(); update();
      };
      im.src = r.result;
    };
    r.readAsDataURL(el.files[0]);
  }
});
form.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const k = b.dataset.l;
  if (b.dataset.act === 'add') s[k].push(Object.fromEntries(LISTS[k].f.map((f) => [f[0], ''])));
  if (b.dataset.act === 'del') { s[k].splice(b.dataset.i, 1); if (!s[k].length) s[k].push(Object.fromEntries(LISTS[k].f.map((f) => [f[0], '']))); }
  if (b.dataset.act === 'rmphoto') s.photo = '';
  build(); update();
  if (b.dataset.act === 'add') { const r = form.querySelectorAll(`[data-l="${k}"][data-i="${s[k].length - 1}"]`)[0]; if (r) r.focus(); }
});
$('#sugg').addEventListener('click', (e) => {
  const k = e.target.dataset.sg; if (!k) return;
  let g = s.skills.find((o) => o.cat === 'Por revisar');
  if (!g) { g = { cat: 'Por revisar', items: '' }; const empty = s.skills.findIndex((o) => !o.cat && !o.items); empty > -1 ? (s.skills[empty] = g) : s.skills.push(g); }
  if (!g.items.toLowerCase().includes(k.toLowerCase())) g.items += (g.items ? ', ' : '') + k;
  build(); update();
});
document.querySelectorAll('input[name=tpl]').forEach((r) => r.addEventListener('change', () => { s.tpl = r.value; update(); }));
$('#role').innerHTML = Object.entries(ROLES).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('');
$('#role').addEventListener('change', (e) => { s.role = e.target.value; suggestions(); update(); });
$('#btnDemo').addEventListener('click', () => { s = demo(); init(); });
$('#btnClear').addEventListener('click', () => { if (confirm('¿Borrar todo el contenido del formulario? Esta acción no se puede deshacer.')) { s = blank(); init(); } });
$('#btnAnalyze').addEventListener('click', analyze);
$('#pdfAts').addEventListener('click', () => pdf('ats'));
$('#pdfVis').addEventListener('click', () => pdf('visual'));
$('#btnPrint').addEventListener('click', () => pdf());

function init() { $('#role').value = s.role; $('#report').innerHTML = ''; build(); suggestions(); update(); }
init();
