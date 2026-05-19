const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NWE3ZWI1ZTVmNjI0NjMwMTBkMDliZDQ4Njk1M2UxMCIsIm5iZiI6MTc3NjIwMjIxNS4xNzYsInN1YiI6IjY5ZGViMWU3NWIzNGIyNDZlMDFkYThiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EnC27PPu32GvornuKWLe2S6f2GGrmby8t7yzai5YVt4';
const API = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

const rows = [
  { title: 'Популярные мультфильмы', type: 'movie', endpoint: '/discover/movie', extra: { with_genres: '16', sort_by: 'popularity.desc' } },
  { title: 'Детские сериалы',        type: 'tv',    endpoint: '/discover/tv',    extra: { with_genres: '16,10762', sort_by: 'popularity.desc' } },
  { title: 'Лучшие мультфильмы',     type: 'movie', endpoint: '/discover/movie', extra: { with_genres: '16', sort_by: 'vote_average.desc', 'vote_count.gte': '500' } },
  { title: 'Аниме для детей',        type: 'tv',    endpoint: '/discover/tv',    extra: { with_genres: '16', with_original_language: 'ja', sort_by: 'popularity.desc' } },
  { title: 'Семейное кино',          type: 'movie', endpoint: '/discover/movie', extra: { with_genres: '10751', sort_by: 'popularity.desc' } },
  { title: 'Приключения',            type: 'movie', endpoint: '/discover/movie', extra: { with_genres: '16,12', sort_by: 'popularity.desc' } },
  { title: 'Весёлые мультсериалы',   type: 'tv',    endpoint: '/discover/tv',    extra: { with_genres: '16,35', sort_by: 'popularity.desc' } },
  { title: 'Новинки',                type: 'movie', endpoint: '/discover/movie', extra: { with_genres: '16', sort_by: 'release_date.desc', 'vote_count.gte': '50', 'primary_release_date.gte': '2022-01-01' } },
];

const reqHeaders = { 'Authorization': `Bearer ${TOKEN}` };

function imgUrl(path, size) {
  return path ? `${IMG}/${size}${path}` : 'https://via.placeholder.com/500x281/141414/444?text=?';
}

async function req(url, params = {}) {
  const u = new URL(`${API}${url}`);
  u.searchParams.set('language', 'ru-RU');
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: reqHeaders });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}


const icons = {
  play: '<path d="M8 5v14l11-7z"/>',
  plus: '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
  like: '<path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>',
  down: '<path d="M7 10l5 5 5-5z"/>',
};
const svg = (name, w = 14, h = 14) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="currentColor"><path d="${icons[name].match(/d="([^"]+)"/)[1]}"/></svg>`;

function makeCard(item, type) {
  const title = item.title || item.name || '';
  const thumb = imgUrl(item.backdrop_path || item.poster_path, 'w500');
  const big   = imgUrl(item.backdrop_path || item.poster_path, 'w780');
  const score = item.vote_average ? Math.round(item.vote_average * 10) : '—';

  return `<div class="card"
    data-id="${item.id}" data-type="${type}"
    data-bigimg="${big}" data-match="${score}"
    data-istv="${type === 'tv'}"
    data-title="${title.replace(/"/g, '&quot;')}">
    <div class="card-img-wrap">
      <img src="${thumb}" alt="${title}" loading="lazy">
    </div>
  </div>`;
}

function makeRow(cfg, items) {
  const el = document.createElement('div');
  el.className = 'row';
  el.innerHTML = `
    <div class="row-hdr">
      <span class="row-title">${cfg.title}</span>
      <span class="row-more">Смотреть все ›</span>
    </div>
    <div class="slider-wrap">
      <button class="s-arrow prev">❮</button>
      <div class="slider-clip">
        <div class="slider-track">${items.map(i => makeCard(i, cfg.type)).join('')}</div>
      </div>
      <button class="s-arrow next">❯</button>
    </div>`;

  let pos = 0;
  const track = el.querySelector('.slider-track');
  const btnPrev = el.querySelector('.prev');
  const btnNext = el.querySelector('.next');

  const cols = () => window.innerWidth < 600 ? 2 : window.innerWidth < 900 ? 3 : 6;
  const cardW = () => {
    const c = track.querySelector('.card');
    return c ? c.offsetWidth + parseFloat(getComputedStyle(track).gap) : 160;
  };

  const sync = () => {
    const max = items.length - cols();
    pos = Math.max(0, Math.min(pos, max));
    track.style.transform = `translateX(-${pos * cardW()}px)`;
    btnPrev.style.opacity = pos > 0 ? '1' : '0';
    btnPrev.style.pointerEvents = pos > 0 ? '' : 'none';
    btnNext.style.opacity = pos < max ? '1' : '0';
    btnNext.style.pointerEvents = pos < max ? '' : 'none';
  };

  btnPrev.onclick = () => { pos -= cols(); sync(); };
  btnNext.onclick = () => { pos += cols(); sync(); };
  window.addEventListener('resize', sync);
  setTimeout(sync, 80);

  el.querySelectorAll('.card').forEach(c => {
    c.onclick = () => openModal(+c.dataset.id, c.dataset.type);
    c.onmouseenter = () => showPopup(c);
    c.onmouseleave = () => scheduleHide();
  });

  return el;
}

async function init() {
  const container = document.getElementById('rows');

  container.innerHTML = Array(3).fill(`
    <div class="row">
      <div class="row-hdr"><span class="row-title" style="background:#1e1e1e;color:transparent;border-radius:3px;min-width:180px">...</span></div>
      <div style="display:flex;gap:4px;padding:0 4%;overflow:hidden">
        ${Array(6).fill(`<div style="flex-shrink:0;width:calc((100vw - 8%)/6 - 4px);aspect-ratio:16/9;background:#1a1a1a;border-radius:4px"></div>`).join('')}
      </div>
    </div>`).join('');

  const settled = await Promise.allSettled(
    rows.map(r => req(r.endpoint, { page: 1, ...r.extra }).then(d => ({ r, items: d.results.slice(0, 12) })))
  );

  container.innerHTML = '';
  settled.forEach(res => {
    if (res.status === 'fulfilled') container.appendChild(makeRow(res.value.r, res.value.items));
  });

  loadHero();
}

async function loadHero() {
  try {
    const data = await req('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' });
    const item = data.results.find(i => i.backdrop_path);
    if (!item) return;

    document.querySelector('.hero-bg').style.backgroundImage = `url('${imgUrl(item.backdrop_path, 'original')}')`;
    document.querySelector('.hero-title').textContent = item.title || '';
    document.querySelector('.hero-desc').textContent = item.overview || '';
    document.querySelector('.hero-meta').innerHTML = `
      <span style="color:#46d369;font-weight:700">${Math.round(item.vote_average * 10)}% совпадение</span>
      <span>${item.release_date?.slice(0, 4)}</span>
      <span class="hero-badge">0+</span>
      <span>Мультфильм</span>`;
    document.querySelector('.btn-info').onclick = () => openModal(item.id, 'movie');
  } catch(e) {
  
  }
}

// ------ модалка ------
let modalId = null, modalType = null, modalSeason = 1, modalData = null;

async function openModal(id, type) {
  modalId = id;
  modalType = type;
  modalSeason = 1;

  document.getElementById('modalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalContent').innerHTML =
    `<div style="height:320px;display:flex;align-items:center;justify-content:center;color:#555;font-size:14px">Загрузка...</div>`;

  try {
    const [info, similar] = await Promise.all([
      req(`/${type}/${id}`, { append_to_response: 'credits' }),
      req(`/${type}/${id}/similar`).then(d => d.results).catch(() => [])
    ]);
    modalData = info;

    let eps = [];
    if (type === 'tv' && info.number_of_seasons) {
      const s = await req(`/tv/${id}/season/1`).catch(() => ({}));
      eps = s.episodes || [];
    }

    drawModal(info, eps, similar, type);
  } catch {
    document.getElementById('modalContent').innerHTML =
      `<div style="padding:40px;text-align:center;color:#666">Не удалось загрузить</div>`;
  }
}

function closeModal() {
  document.getElementById('modalBg').classList.remove('open');
  document.body.style.overflow = '';
  modalData = null;
}

function handleModalBgClick(e) {
  if (e.target.id === 'modalBg') closeModal();
}

async function changeSeason(val) {
  modalSeason = +val;
  if (!modalData) return;
  const s = await req(`/tv/${modalId}/season/${modalSeason}`).catch(() => ({}));
  document.querySelector('.ep-list').innerHTML = drawEps(s.episodes || [], modalData);
  document.querySelector('.ep-season-label').textContent = `${modalSeason} сезон:`;
}

function drawEps(eps, show) {
  return eps.slice(0, 10).map((ep, i) => `
    <div class="ep-item">
      <div class="ep-num">${ep.episode_number}</div>
      <div class="ep-img-wrap">
        <img src="${ep.still_path ? imgUrl(ep.still_path, 'w300') : imgUrl(show.backdrop_path, 'w300')}" loading="lazy">
      </div>
      <div class="ep-info">
        <div class="ep-title-row">
          <span class="ep-title">${ep.name || `Эпизод ${ep.episode_number}`}</span>
          <span class="ep-dur">${ep.runtime ? ep.runtime + ' мин.' : ''}</span>
        </div>
        <div class="ep-desc">${ep.overview || ''}</div>
      </div>
    </div>
    ${i < 9 && i < eps.length - 1 ? '<div class="ep-divider"></div>' : ''}`
  ).join('');
}

function drawModal(show, eps, similar, type) {
  const title  = show.title || show.name || '';
  const year   = (show.release_date || show.first_air_date || '').slice(0, 4);
  const score  = show.vote_average ? Math.round(show.vote_average * 10) : '';
  const genres = (show.genres || []).map(g => g.name).join(', ');
  const cast   = (show.credits?.cast || []).slice(0, 5).map(a => a.name).join(', ');
  const dir    = (show.credits?.crew || []).find(c => c.job === 'Director')?.name
              || (show.created_by || []).map(c => c.name).join(', ') || '—';
  const isTV   = type === 'tv';
  const sns    = show.number_of_seasons;

  const seasonSelect = isTV && sns > 1
    ? `<div class="season-sel"><select onchange="changeSeason(this.value)">
        ${Array.from({length: sns}, (_, i) => `<option value="${i+1}" ${i+1 === modalSeason ? 'selected' : ''}>${i+1} сезон</option>`).join('')}
       </select></div>`
    : '';

  const epsSection = isTV ? `
    <div class="modal-episodes">
      <div class="ep-hdr"><h3>Эпизоды</h3>${seasonSelect}</div>
      <div style="font-size:12px;color:#888;margin-bottom:10px">
        <span class="ep-season-label">${modalSeason} сезон:</span>
        <span style="border:1px solid #555;padding:1px 5px;border-radius:2px;font-size:11px;margin-left:6px">0+</span>
      </div>
      <div class="ep-list">${drawEps(eps, show)}</div>
      <div class="load-more"><button class="load-more-btn"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></button></div>
    </div>` : '';

  const simCards = similar.slice(0, 6).map(s => `
    <div class="sim-card" onclick="openModal(${s.id},'${type}')">
      <div class="sim-img">
        <img src="${imgUrl(s.backdrop_path || s.poster_path, 'w500')}" loading="lazy">
        <span class="sim-badge">${isTV ? 'Сериал' : 'Фильм'}</span>
      </div>
      <div class="sim-body">
        <div class="sim-top">
          <span class="sim-age">0+</span>
          <span class="sim-hd">HD</span>
          <span class="sim-year">${(s.release_date || s.first_air_date || '').slice(0,4)}</span>
          <button class="sim-add" onclick="event.stopPropagation()">+</button>
        </div>
        <div style="font-size:12px;font-weight:700;color:#46d369;margin-bottom:4px">${s.vote_average ? Math.round(s.vote_average*10) : ''}%</div>
        <div class="sim-desc">${s.overview || ''}</div>
      </div>
    </div>`).join('');

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-hero">
      <img src="${imgUrl(show.backdrop_path || show.poster_path, 'w1280')}" alt="${title}">
      <div class="modal-hero-ov"></div>
      <div class="modal-title-logo">${title}</div>
      <div class="modal-hero-btns">
        <button class="m-btn-play"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Смотреть</button>
        <button class="m-icon-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="m-icon-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg></button>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-two-col">
        <div>
          <div class="modal-meta">
            <span class="m-match">${score}% совпадение</span>
            <span class="m-year">${year}</span>
            ${isTV && sns ? `<span class="m-seasons">${sns} сез.</span>` : ''}
            <span class="m-age-box">0+</span>
            <span class="m-hd">HD</span>
          </div>
          <p class="modal-desc">${show.overview || ''}</p>
        </div>
        <div class="modal-right">
          ${cast   ? `<div>В ролях: <span>${cast}</span></div>` : ''}
          ${genres ? `<div>Жанры: <span>${genres}</span></div>` : ''}
          ${dir    ? `<div>Режиссёр: <span>${dir}</span></div>` : ''}
        </div>
      </div>
      ${epsSection}
      <div class="similar-section">
        <div class="similar-title">Похожие</div>
        <div class="similar-grid">${simCards}</div>
      </div>
      <div class="about-section">
        <div class="about-title">${title}: сведения</div>
        <div class="about-rows">
          ${dir    ? `<div>Режиссёр: <span>${dir}</span></div>` : ''}
          ${cast   ? `<div>В ролях: <span>${cast}</span></div>` : ''}
          ${genres ? `<div>Жанры: <span>${genres}</span></div>` : ''}
          <div>Возраст: <span>0+</span></div>
          ${show.vote_average ? `<div>Рейтинг: <span>⭐ ${show.vote_average.toFixed(1)}</span></div>` : ''}
        </div>
      </div>
    </div>`;
}

// ------ попа превью ------
const popup = document.getElementById('card-popup');
let hideTimer = null;
let activeCard = null;

function showPopup(card) {
  clearTimeout(hideTimer);
  activeCard = card;

  document.getElementById('popup-img').src = card.dataset.bigimg;
  document.getElementById('popup-match').textContent = card.dataset.match + '% совпадение';
  document.getElementById('popup-type').textContent = card.dataset.istv === 'true' ? 'Сериал' : 'Фильм';
  document.getElementById('popup-genres').innerHTML = '';

  document.getElementById('popup-more').onclick = e => {
    e.stopPropagation();
    scheduleHide(true);
    openModal(+card.dataset.id, card.dataset.type);
  };

  positionPopup(card);
  popup.classList.add('visible');

  fetchGenres(card.dataset.id, card.dataset.type);
}

function positionPopup(card) {
  const r = card.getBoundingClientRect();
  const w = 300;

  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - w - 8));

  popup.style.cssText = `left:${left}px; top:-9999px; width:${w}px;`;

  requestAnimationFrame(() => {
    const h = popup.offsetHeight;
    const gap = 10;
    const top = r.top - h - gap < 0
      ? r.bottom + window.scrollY + gap
      : r.top + window.scrollY - h - gap;
    popup.style.top = top + 'px';
  });
}

function scheduleHide(now = false) {
  if (now) { popup.classList.remove('visible'); activeCard = null; return; }
  hideTimer = setTimeout(() => { popup.classList.remove('visible'); activeCard = null; }, 200);
}

popup.addEventListener('mouseenter', () => clearTimeout(hideTimer));
popup.addEventListener('mouseleave', () => scheduleHide());

async function fetchGenres(id, type) {
  try {
    const data = await req(`/${type}/${id}`);
    if (activeCard?.dataset.id != id) return; // карточка другая
    const el = document.getElementById('popup-genres');
    el.innerHTML = (data.genres || []).slice(0, 3).map((g, i) =>
      (i ? '<span class="cp-dot"></span>' : '') + `<span>${g.name}</span>`
    ).join('');
  } catch {}
}

// ------ старт ------
document.addEventListener('DOMContentLoaded', () => {
  init();

  window.addEventListener('scroll', () => {
    document.getElementById('hdr').classList.toggle('solid', window.scrollY > 50);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});

function loadHeroes() {
  const track = document.getElementById('heroes-track');
  if (!track) return;

  const heroes = [
    { name: 'Габби',           src: 'heroes/gabby.jpg',    id: 93405, type: 'tv' },
    { name: 'Chase',           src: 'heroes/chase.jpg',    id: 62126, type: 'tv' },
    { name: 'Леди Баг',        src: 'heroes/ladybug.jpg',  id: 65334, type: 'tv' },
    { name: 'Леди Баг и Кот',  src: 'heroes/ladycat.jpg',  id: 65334, type: 'tv' },
    { name: 'Элвин',           src: 'heroes/alvin.jpg',    id: 44906, type: 'tv' },
    { name: 'Маша и Медведь',  src: 'heroes/masha.jpg',    id: 41888, type: 'tv' },
  ];

  track.innerHTML = heroes.map(h => `
    <div class="hero-avatar" onclick="openModal(${h.id}, '${h.type}')">
      <div class="hero-avatar-circle">
        <img src="${h.src}" alt="${h.name}" loading="lazy">
      </div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadHeroes();
});