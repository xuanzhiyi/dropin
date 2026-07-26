// ════════════════════════════════════════════════════════════
// VIEW SWITCHING
// ════════════════════════════════════════════════════════════
function showMapView() {
  document.getElementById('map-view').classList.add('active');
  document.getElementById('transport-view').classList.remove('active');
  closeTripSuggestions();
  setTimeout(() => map.invalidateSize(), 50);
}

function showTransportView() {
  document.getElementById('map-view').classList.remove('active');
  document.getElementById('transport-view').classList.add('active');
}

function openTripPlanner() {
  // Pre-fill origin with GPS if available
  if (userLat !== null && !tripOrigin) {
    tripOrigin = { lat: userLat, lng: userLng, name: 'My Location' };
    const inp = document.getElementById('trip-origin-input');
    inp.value = 'My Location';
    document.getElementById('trip-origin-clear').classList.add('show');
  }
  // Pre-fill dest from dropped pin if any
  if (pinLat !== null && !tripDest) {
    tripDest = { lat: pinLat, lng: pinLng, name: 'Dropped Pin' };
    const inp = document.getElementById('trip-dest-input');
    inp.value = 'Dropped Pin';
    document.getElementById('trip-dest-clear').classList.add('show');
  }
  renderTransport();
  showTransportView();
}


// ════════════════════════════════════════════════════════════
// TRIP SEARCH — Nominatim geocoding
// ════════════════════════════════════════════════════════════
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

async function geocodeQuery(q) {
  const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
  const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error('Nominatim error');
  return res.json();
}

function buildSuggestionLabel(item) {
  const a = item.address || {};
  // Build a concise "City, Country" or "Place, City, Country" label
  const place   = a.tourism || a.amenity || a.building || a.suburb || '';
  const city    = a.city || a.town || a.village || a.county || '';
  const country = a.country || '';
  const parts   = [place, city, country].filter(Boolean);
  return { main: parts[0] || item.display_name.split(',')[0], sub: parts.slice(1).join(', ') };
}

function onTripInput(field) {
  const inp  = document.getElementById(`trip-${field}-input`);
  const val  = inp.value.trim();
  const clr  = document.getElementById(`trip-${field}-clear`);
  clr.classList.toggle('show', val.length > 0);

  // Clear resolved coord if user edits
  if (field === 'origin') tripOrigin = null;
  else                     tripDest   = null;

  clearTimeout(geocodeTimer[field]);
  if (val.length < 2) { closeSuggestions(field); return; }

  geocodeTimer[field] = setTimeout(async () => {
    try {
      const results = await geocodeQuery(val);
      showSuggestions(field, results);
    } catch(e) { /* silent */ }
  }, 320);
}

function onTripFocus(field) {
  const val = document.getElementById(`trip-${field}-input`).value.trim();
  if (val.length >= 2) onTripInput(field);
}

function showSuggestions(field, results) {
  const box = document.getElementById(`trip-${field}-suggestions`);
  if (!results.length) { closeSuggestions(field); return; }

  box.innerHTML = '';
  // Always prepend GPS option for origin
  if (field === 'origin') {
    const gpsItem = document.createElement('div');
    gpsItem.className = 'trip-suggestion';
    gpsItem.innerHTML = `<div class="trip-suggestion-icon">📍</div><div><div class="trip-suggestion-main">My Location</div><div class="trip-suggestion-sub">Use GPS position</div></div>`;
    gpsItem.addEventListener('click', () => selectGPSOrigin());
    box.appendChild(gpsItem);
  }

  results.slice(0, 4).forEach(item => {
    const { main, sub } = buildSuggestionLabel(item);
    const el = document.createElement('div');
    el.className = 'trip-suggestion';
    el.innerHTML = `
      <div class="trip-suggestion-icon">${item.type === 'aeroway' ? '✈️' : item.class === 'place' ? '🏙️' : '📌'}</div>
      <div>
        <div class="trip-suggestion-main">${esc(main)}</div>
        ${sub ? `<div class="trip-suggestion-sub">${esc(sub)}</div>` : ''}
      </div>`;
    el.addEventListener('click', () => selectSuggestion(field, item, main));
    box.appendChild(el);
  });

  box.classList.add('open');
}

function selectSuggestion(field, item, name) {
  const lat  = parseFloat(item.lat);
  const lng  = parseFloat(item.lon);
  const data = { lat, lng, name };
  const inp  = document.getElementById(`trip-${field}-input`);
  inp.value  = name;
  document.getElementById(`trip-${field}-clear`).classList.add('show');
  closeSuggestions(field);

  if (field === 'origin') tripOrigin = data;
  else                     tripDest   = data;

  renderTransport();
  // Auto-focus next field if not set
  if (field === 'origin' && !tripDest) {
    setTimeout(() => document.getElementById('trip-dest-input').focus(), 100);
  }
}

function selectGPSOrigin() {
  closeSuggestions('origin');
  const inp = document.getElementById('trip-origin-input');
  inp.value = 'Getting location…';
  navigator.geolocation?.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      tripOrigin = { lat: userLat, lng: userLng, name: 'My Location' };
      inp.value = 'My Location';
      document.getElementById('trip-origin-clear').classList.add('show');
      renderTransport();
    },
    () => {
      inp.value = '';
      alert('Could not get your location.');
    },
    { timeout: 8000 }
  );
}

function clearTripField(field) {
  document.getElementById(`trip-${field}-input`).value = '';
  document.getElementById(`trip-${field}-clear`).classList.remove('show');
  closeSuggestions(field);
  if (field === 'origin') tripOrigin = null;
  else                     tripDest   = null;
  renderTransport();
}

function swapTrip() {
  const oName = document.getElementById('trip-origin-input').value;
  const dName = document.getElementById('trip-dest-input').value;
  document.getElementById('trip-origin-input').value = dName;
  document.getElementById('trip-dest-input').value   = oName;
  document.getElementById('trip-origin-clear').classList.toggle('show', dName.length > 0);
  document.getElementById('trip-dest-clear').classList.toggle('show', oName.length > 0);
  const tmp  = tripOrigin; tripOrigin = tripDest; tripDest = tmp;
  renderTransport();
}

function closeSuggestions(field) {
  document.getElementById(`trip-${field}-suggestions`).classList.remove('open');
}
function closeTripSuggestions() {
  closeSuggestions('origin');
  closeSuggestions('dest');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#transport-header')) closeTripSuggestions();
});


// ════════════════════════════════════════════════════════════
// TRANSPORT VIEW RENDERING
// ════════════════════════════════════════════════════════════
function selectOrigin(mode) {
  transportOriginMode = mode;
  document.querySelectorAll('.origin-chip').forEach(c =>
    c.classList.toggle('active', c.dataset.origin === mode)
  );
  renderTransport();
}


// ════════════════════════════════════════════════════════════
// TRANSPORT VIEW
// ════════════════════════════════════════════════════════════
function selectMode(mode) {
  transportActiveMode = mode;
  document.querySelectorAll('.mode-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.mode === mode)
  );
  renderTransport();
}

function renderTransport() {
  const origin = tripOrigin;
  const dest   = tripDest;
  const cards  = document.getElementById('transport-cards');

  if (!origin && !dest) {
    cards.innerHTML = `<div class="transport-state"><div class="icon">🗺️</div><div>Enter a starting point and destination above to plan your trip.</div></div>`;
    return;
  }
  if (!origin) {
    cards.innerHTML = `<div class="transport-state"><div class="icon">🟢</div><div>Enter where you're travelling from.</div></div>`;
    return;
  }
  if (!dest) {
    cards.innerHTML = `<div class="transport-state"><div class="icon">🔴</div><div>Enter your destination.</div></div>`;
    return;
  }

  const distM    = haversine(origin.lat, origin.lng, dest.lat, dest.lng);
  const allModes = buildTransportModes(distM, origin, dest);
  const flight   = buildFlightCard(origin, dest);

  const showFly  = transportActiveMode === 'all' || transportActiveMode === 'fly';
  const filtered = transportActiveMode === 'all'
    ? allModes
    : transportActiveMode === 'fly' ? [] : allModes.filter(m => m.id === transportActiveMode);

  const bestId = allModes.reduce((a, b) => a.minutes < b.minutes ? a : b).id;

  cards.innerHTML = '';

  // Route summary pill
  const summaryEl = document.createElement('div');
  summaryEl.style.cssText = 'padding:4px 0 8px;font-size:12px;color:var(--muted);text-align:center;font-weight:600';
  summaryEl.textContent = `${origin.name} → ${dest.name}  ·  ${formatDist(distM)}`;
  cards.appendChild(summaryEl);

  filtered.forEach(mode => {
    cards.appendChild(buildTransportCard(mode, mode.id === bestId && transportActiveMode === 'all'));
  });

  if (showFly) {
    if (flight) {
      cards.appendChild(flight.card);
    } else if (transportActiveMode === 'fly') {
      const msg = document.createElement('div');
      msg.className = 'transport-state';
      msg.innerHTML = `<div class="icon">✈️</div><div>These locations share the same nearest airport or are too close to fly.</div>`;
      cards.appendChild(msg);
    }
  }
}

function buildTransportModes(distM, origin, dest) {
  const km = distM / 1000;

  // Walking: 5 km/h
  const walkMin = Math.round((km / 5) * 60);
  // Cycling: 15 km/h
  const cycleMin = Math.round((km / 15) * 60);
  // Driving: base speed depends on distance (urban/highway blend)
  const driveSpeedKmh = km < 2 ? 25 : km < 10 ? 40 : 65;
  const driveMin = Math.round((km / driveSpeedKmh) * 60) + (km < 5 ? 3 : 5); // + parking
  // Transit: 25 km/h avg + wait
  const transitMin = Math.round((km / 25) * 60) + 8;

  const modes = [
    {
      id: 'walk',
      icon: '🚶',
      label: 'Walking',
      minutes: walkMin,
      color: '#4CAF50',
      sub: `${formatDist(distM)} on foot`,
      steps: buildWalkSteps(distM, origin, dest),
      appUrl: buildMapsUrl(origin, dest, 'walk'),
      appLabel: isIOS() ? 'Open in Maps' : 'Open in Google Maps',
    },
    {
      id: 'cycle',
      icon: '🚲',
      label: 'Cycling',
      minutes: cycleMin,
      color: '#FF9800',
      sub: `${formatDist(distM)} by bike`,
      steps: buildCycleSteps(distM, origin, dest),
      appUrl: buildMapsUrl(origin, dest, 'cycle'),
      appLabel: isIOS() ? 'Open in Maps' : 'Open in Google Maps',
    },
    {
      id: 'drive',
      icon: '🚗',
      label: 'Driving',
      minutes: driveMin,
      color: '#2196F3',
      sub: `${formatDist(distM)} · includes parking`,
      steps: buildDriveSteps(distM, origin, dest),
      appUrl: buildMapsUrl(origin, dest, 'drive'),
      appLabel: isIOS() ? 'Open in Maps' : 'Open in Google Maps',
    },
    {
      id: 'transit',
      icon: '🚌',
      label: 'Public Transit',
      minutes: transitMin,
      color: '#9C27B0',
      sub: `~${Math.round(km)} km · includes 8 min wait`,
      steps: buildTransitSteps(distM, origin, dest),
      appUrl: buildMapsUrl(origin, dest, 'transit'),
      appLabel: isIOS() ? 'Open in Transit / Maps' : 'Open in Google Maps',
    },
  ];

  return modes;
}

function buildTransportCard(mode, isBest) {
  const wrap = document.createElement('div');
  wrap.className = 'transport-card' + (isBest ? ' best' : '');

  const timeStr = mode.minutes < 60
    ? `${mode.minutes}`
    : `${Math.floor(mode.minutes / 60)}h ${mode.minutes % 60}`;
  const unit = mode.minutes < 60 ? 'min' : '';

  wrap.innerHTML = `
    <div class="transport-card-header">
      <div class="transport-mode-icon" style="background:${mode.color}22">${mode.icon}</div>
      <div class="transport-card-info">
        <div class="transport-card-title">
          ${esc(mode.label)}
          ${isBest ? '<span class="best-badge">Best</span>' : ''}
        </div>
        <div class="transport-card-sub">${esc(mode.sub)}</div>
      </div>
      <div class="transport-card-time">
        <div class="transport-time-val" style="color:${mode.color}">${timeStr}</div>
        <div class="transport-time-unit">${unit}</div>
      </div>
    </div>
    <div class="dist-bar">
      <div class="dist-bar-fill" style="background:${mode.color};width:0%" data-pct="${Math.min(100, Math.round(100 - (mode.minutes / 120) * 100))}%"></div>
    </div>
    <div class="transport-steps">
      ${mode.steps.map(s => `
        <div class="transport-step">
          <div class="step-icon">${s.icon}</div>
          <div class="step-text">${s.text}</div>
          ${s.dist ? `<div class="step-dist">${s.dist}</div>` : ''}
        </div>
      `).join('')}
    </div>
    <button class="transport-open-btn" onclick="window.open('${mode.appUrl}','_blank')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      ${esc(mode.appLabel)}
    </button>
  `;

  // Animate the bar fill
  requestAnimationFrame(() => {
    const fill = wrap.querySelector('.dist-bar-fill');
    if (fill) fill.style.width = fill.dataset.pct;
  });

  return wrap;
}

// ── Step generators ─────────────────────────────────────────
function buildWalkSteps(distM, origin, dest) {
  const steps = [];
  steps.push({ icon: '🚶', text: `Head towards <strong>${esc(dest.name)}</strong>`, dist: formatDist(distM * 0.4) });
  if (distM > 400) steps.push({ icon: '↗️', text: 'Continue on main street', dist: formatDist(distM * 0.4) });
  if (distM > 800) steps.push({ icon: '↪️', text: 'Turn and follow the path', dist: formatDist(distM * 0.2) });
  steps.push({ icon: '📍', text: `Arrive at <strong>${esc(dest.name)}</strong>`, dist: '' });
  return steps;
}

function buildCycleSteps(distM, origin, dest) {
  const steps = [];
  steps.push({ icon: '🚲', text: `Cycle towards <strong>${esc(dest.name)}</strong>`, dist: formatDist(distM * 0.5) });
  if (distM > 500) steps.push({ icon: '↗️', text: 'Follow the bike lane or road', dist: formatDist(distM * 0.4) });
  steps.push({ icon: '🅿️', text: 'Lock your bike nearby', dist: '' });
  steps.push({ icon: '📍', text: `Arrive at <strong>${esc(dest.name)}</strong>`, dist: '' });
  return steps;
}

function buildDriveSteps(distM, origin, dest) {
  const steps = [];
  steps.push({ icon: '🚗', text: 'Head out on the main road', dist: formatDist(distM * 0.3) });
  if (distM > 1000) steps.push({ icon: '🛣️', text: 'Merge onto a larger road', dist: formatDist(distM * 0.5) });
  steps.push({ icon: '↪️', text: `Turn towards <strong>${esc(dest.name)}</strong>`, dist: formatDist(distM * 0.15) });
  steps.push({ icon: '🅿️', text: 'Find parking nearby', dist: '' });
  steps.push({ icon: '📍', text: `Arrive at <strong>${esc(dest.name)}</strong>`, dist: '' });
  return steps;
}

function buildTransitSteps(distM, origin, dest) {
  const steps = [];
  steps.push({ icon: '🚶', text: 'Walk to the nearest stop', dist: formatDist(Math.min(400, distM * 0.15)) });
  steps.push({ icon: '⏱️', text: 'Wait ~8 min for the next service', dist: '' });
  steps.push({ icon: '🚌', text: `Ride towards <strong>${esc(dest.name)}</strong>`, dist: formatDist(distM * 0.7) });
  if (distM > 2000) steps.push({ icon: '🔄', text: 'Transfer at interchange if needed', dist: '' });
  steps.push({ icon: '🚶', text: `Walk to <strong>${esc(dest.name)}</strong>`, dist: formatDist(Math.min(350, distM * 0.15)) });
  steps.push({ icon: '📍', text: 'Arrive at destination', dist: '' });
  return steps;
}


// ════════════════════════════════════════════════════════════
// SHEET HELPERS
// ════════════════════════════════════════════════════════════
function expandSheet()  { sheetExpanded = true;  sheet.classList.add('expanded'); }
function collapseSheet(){ sheetExpanded = false; sheet.classList.remove('expanded'); }
