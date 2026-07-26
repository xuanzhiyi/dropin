// ════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════
function haversine(lat1, lng1, lat2, lng2) {
  const R    = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a    = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDist(m) {
  return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(1) + ' km';
}

function radiusLabel() {
  return radiusM >= 1000 ? (radiusM / 1000) + ' km' : radiusM + ' m';
}

function buildAddress(tags) {
  if (!tags) return '';
  const parts = [
    tags['addr:housenumber'] && tags['addr:street'] ? tags['addr:housenumber'] + ' ' + tags['addr:street'] : tags['addr:street'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.join(', ');
}

// Bug #7 fix: HTML-entity escape only (no href injection possible)
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// ════════════════════════════════════════════════════════════
// INIT — auto-locate on load
// ════════════════════════════════════════════════════════════
navigator.geolocation?.getCurrentPosition(pos => {
  userLat = pos.coords.latitude;
  userLng = pos.coords.longitude;
  map.setView([userLat, userLng], 15);
}, null, { timeout: 10000, maximumAge: 60000 });
