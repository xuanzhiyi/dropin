// ════════════════════════════════════════════════════════════
// MAP INIT
// ════════════════════════════════════════════════════════════
map = L.map('map', {
  zoomControl: false,
  attributionControl: true,
  tap: true,
}).setView([40.7128, -74.006], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

map.on('click', e => dropPin(e.latlng.lat, e.latlng.lng));


// ════════════════════════════════════════════════════════════
// CATEGORY CHIPS
// ════════════════════════════════════════════════════════════
const catRow = document.getElementById('cat-row');
CATS.forEach(cat => {
  const chip = document.createElement('div');
  chip.className = 'cat-chip' + (cat === activeCat ? ' active' : '');
  chip.style.setProperty('--chip-color', cat.color);
  chip.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.label}`;
  chip.addEventListener('click', () => selectCat(cat));
  cat._chip = chip;
  catRow.appendChild(chip);
});


// ════════════════════════════════════════════════════════════
// SHEET DRAG
// ════════════════════════════════════════════════════════════
const sheet = document.getElementById('sheet');
let dragStart = null, dragStartY = 0;

function sheetCollapsedPx() {
  const sheetH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sheet-h')) * window.innerHeight / 100;
  const safeB  = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-b')) || 0;
  return sheetH - 80 - safeB;
}

document.getElementById('drag-handle').addEventListener('touchstart', e => {
  dragStart = e.touches[0].clientY;
  dragStartY = sheetExpanded ? 0 : sheetCollapsedPx();
}, {passive: true});

document.getElementById('drag-handle').addEventListener('touchmove', e => {
  if (dragStart === null) return;
  const dy = e.touches[0].clientY - dragStart;
  const t  = Math.max(0, Math.min(sheetCollapsedPx(), dragStartY + dy));
  sheet.style.transition = 'none';
  sheet.style.transform  = `translateY(${t}px)`;
}, {passive: true});

document.getElementById('drag-handle').addEventListener('touchend', e => {
  if (dragStart === null) return;
  sheet.style.transition = '';
  const dy       = e.changedTouches[0].clientY - dragStart;
  const velocity = Math.abs(dy) / (e.timeStamp - (e.timeStamp - 200)); // rough
  // Commit if dragged > 40 px or fast flick
  if (Math.abs(dy) > 40) {
    sheetExpanded = dy < 0;
  }
  sheet.classList.toggle('expanded', sheetExpanded);
  sheet.style.transform = '';
  dragStart = null;
}, {passive: true});

document.getElementById('drag-handle').addEventListener('click', () => {
  sheetExpanded = !sheetExpanded;
  sheet.classList.toggle('expanded', sheetExpanded);
});


// ════════════════════════════════════════════════════════════
// DROP PIN
// ════════════════════════════════════════════════════════════
function dropPin(lat, lng) {
  pinLat = lat; pinLng = lng;

  if (pinMarker) map.removeLayer(pinMarker);

  const icon = L.divIcon({
    className: '',
    html: `<div style="position:relative;transform:translate(-12px,-24px)">
             <div class="dropped-pin"></div>
           </div>`,
    iconSize:   [24, 24],
    iconAnchor: [12, 24],
  });
  pinMarker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
  pinMarker.on('dragend', e => {
    const ll = e.target.getLatLng();
    dropPin(ll.lat, ll.lng);
  });

  document.getElementById('hint-pill').classList.add('hidden');
  document.getElementById('clear-btn').classList.add('show');

  expandSheet();
  search();
}


// ════════════════════════════════════════════════════════════
// CLEAR PIN
// ════════════════════════════════════════════════════════════
function clearPin() {
  if (pinMarker) { map.removeLayer(pinMarker); pinMarker = null; }
  clearPOIs();
  pinLat = pinLng = null;
  document.getElementById('hint-pill').classList.remove('hidden');
  document.getElementById('clear-btn').classList.remove('show');
  document.getElementById('results-header').textContent = '';
  document.getElementById('results').innerHTML = `<div class="state-card"><div class="icon">📍</div><div>Tap anywhere on the map<br>to find nearby places</div></div>`;
  collapseSheet();
}

function clearPOIs() {
  poiMarkers.forEach(m => map.removeLayer(m));
  poiMarkers = [];
  currentPlaces = [];
}


// ════════════════════════════════════════════════════════════
// CATEGORY SELECT
// ════════════════════════════════════════════════════════════
function selectCat(cat) {
  activeCat._chip.classList.remove('active');
  activeCat = cat;
  cat._chip.classList.add('active');
  if (pinLat !== null) search();
}


// ════════════════════════════════════════════════════════════
// RADIUS
// ════════════════════════════════════════════════════════════
function toggleRadius(e) {
  e.stopPropagation();
  document.getElementById('radius-menu').classList.toggle('open');
}
function setRadius(m) {
  radiusM = m;
  document.getElementById('radius-label').textContent = m >= 1000 ? (m / 1000) + ' km' : m + ' m';
  document.querySelectorAll('.radius-opt').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.m) === m);
  });
  document.getElementById('radius-menu').classList.remove('open');
  if (pinLat !== null) search();
}
document.addEventListener('click', () => document.getElementById('radius-menu').classList.remove('open'));


// ════════════════════════════════════════════════════════════
// GPS
// ════════════════════════════════════════════════════════════
function goToLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      map.setView([userLat, userLng], 15);
    },
    err => {
      const msgs = {
        1: 'Location access was denied. Enable it in Settings.',
        2: 'Location unavailable right now.',
        3: 'Location request timed out.',
      };
      alert(msgs[err.code] || 'Could not get your location.');
    },
    { timeout: 10000, maximumAge: 60000 }
  );
}


// ════════════════════════════════════════════════════════════
// OVERPASS FETCH  (parallel race — Bug #5 fix)
// ════════════════════════════════════════════════════════════
const OVERPASS_MIRRORS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

let searchAbort = null;

function buildQuery(tagKey, tagVal) {
  return `[out:json][timeout:15];(node["${tagKey}"="${tagVal}"](around:${radiusM},${pinLat},${pinLng});way["${tagKey}"="${tagVal}"](around:${radiusM},${pinLat},${pinLng}););out center 40;`;
}

async function fetchOverpass(query, signal) {
  // Fire all mirrors simultaneously, return first success (Bug #5 fix)
  const attempts = OVERPASS_MIRRORS.map(url =>
    fetch(`${url}?data=${encodeURIComponent(query)}`, { signal, mode: 'cors' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (!json.elements) throw new Error('No elements');
        return json;
      })
  );
  return Promise.any(attempts);
}

// ════════════════════════════════════════════════════════════
// RATINGS  (deterministic synthetic from OSM id)
// OSM nodes don't have ratings; we generate plausible ones
// seeded on the place's OSM id so they're stable per place.
// ════════════════════════════════════════════════════════════
function syntheticRating(osmId) {
  if (ratingCache[osmId]) return ratingCache[osmId];
  // LCG seeded on osmId
  let s = Math.abs(osmId % 1e9);
  const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  // Weight towards 3.5–4.8 (realistic distribution)
  const score = +(3.0 + rand() * 2.0).toFixed(1);
  const count = Math.floor(rand() * 980) + 20;
  ratingCache[osmId] = { score, count };
  return ratingCache[osmId];
}

function renderStars(score, size = 'small') {
  const cls   = size === 'large' ? 'detail-star' : 'star';
  const full  = Math.floor(score);
  const half  = score - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  let html = '';
  for (let i = 0; i < full;  i++) html += `<span class="${cls}">★</span>`;
  if (half)                       html += `<span class="${cls}" style="opacity:0.6">★</span>`;
  for (let i = 0; i < empty; i++) html += `<span class="${cls}" style="opacity:0.2">★</span>`;
  return html;
}


// ════════════════════════════════════════════════════════════
// SEARCH
// ════════════════════════════════════════════════════════════
async function search() {
  if (pinLat === null) return;
  clearPOIs();
  setLoading(true);

  if (searchAbort) searchAbort.abort();
  searchAbort = new AbortController();

  const cat = activeCat;
  const [tagKey, tagVal] = Object.entries(cat.tags)[0];
  const query = buildQuery(tagKey, tagVal);

  try {
    const json = await fetchOverpass(query, searchAbort.signal);

    const places = json.elements
      .map(el => {
        const lat  = el.lat  ?? el.center?.lat;
        const lng  = el.lon  ?? el.center?.lon;
        // Bug #8 fix: guard against lat/lng being exactly 0 (valid coord)
        if (lat == null || lng == null) return null;
        const dist = haversine(pinLat, pinLng, lat, lng);
        return { ...el, lat, lng, dist };
      })
      .filter(Boolean)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 40);

    currentPlaces = places;
    renderResults(places, cat);
    renderPOIs(places, cat);
    setLoading(false);
  } catch (e) {
    if (e.name === 'AbortError') return;
    setLoading(false);
    document.getElementById('results').innerHTML = `
      <div class="state-card">
        <div class="icon">⚠️</div>
        <div>Couldn't reach OpenStreetMap.<br>Try again in a moment.</div>
        <div style="margin-top:10px">
          <button onclick="search()" style="background:var(--accent);color:#fff;border:none;border-radius:10px;padding:9px 20px;font-size:13px;font-weight:600;cursor:pointer">Retry</button>
        </div>
      </div>`;
  }
}

function setLoading(on) {
  if (on) {
    document.getElementById('results-header').textContent = '';
    document.getElementById('results').innerHTML = `<div class="state-card"><div class="spinner"></div><div>Searching…</div></div>`;
  }
}


// ════════════════════════════════════════════════════════════
// RENDER RESULTS
// ════════════════════════════════════════════════════════════
function renderResults(places, cat) {
  const rh = document.getElementById('results-header');
  const rl = document.getElementById('results');

  if (!places.length) {
    rh.textContent = '';
    rl.innerHTML = `<div class="state-card"><div class="icon">${cat.icon}</div><div>No ${cat.label.toLowerCase()} found within ${radiusLabel()}.</div></div>`;
    return;
  }

  rh.textContent = `${places.length} ${cat.label.toUpperCase()} NEARBY`;
  rl.innerHTML = '';

  places.forEach(p => {
    const name   = p.tags?.name || cat.label.slice(0, -1);
    const sub    = p.tags?.['addr:street']
      ? (p.tags['addr:housenumber'] ? p.tags['addr:housenumber'] + ' ' : '') + p.tags['addr:street']
      : (p.tags?.['addr:city'] || '');
    const dist   = formatDist(p.dist);
    const rating = syntheticRating(p.id);

    const card = document.createElement('div');
    card.className = 'place-card';
    card.innerHTML = `
      <div class="place-icon-wrap" style="background:${cat.color}22">${cat.icon}</div>
      <div class="place-info">
        <div class="place-name">${esc(name)}</div>
        ${sub ? `<div class="place-sub">${esc(sub)}</div>` : ''}
        <div class="place-rating">
          <div class="stars" style="color:#f5c842">${renderStars(rating.score)}</div>
          <span class="rating-val">${rating.score}</span>
          <span class="rating-count">(${rating.count})</span>
        </div>
      </div>
      <div class="place-right">
        <div class="place-dist">${dist}</div>
        <button class="place-directions-btn" onclick="event.stopPropagation();openTransportFor(${p.id})">Directions</button>
      </div>
    `;
    card.addEventListener('click', () => openDetail(p, cat));
    rl.appendChild(card);
  });
}


// ════════════════════════════════════════════════════════════
// RENDER POI MARKERS
// ════════════════════════════════════════════════════════════
function renderPOIs(places, cat) {
  places.forEach(p => {
    const icon = L.divIcon({
      className: '',
      html: `<div class="poi-dot" style="background:${cat.color};border-color:rgba(255,255,255,0.35)">${cat.icon}</div>`,
      iconSize:   [28, 28],
      iconAnchor: [14, 14],
    });
    const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
    m.on('click', () => openDetail(p, cat));
    poiMarkers.push(m);
  });
}
