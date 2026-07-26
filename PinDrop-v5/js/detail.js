// ════════════════════════════════════════════════════════════
// DETAIL PANEL
// ════════════════════════════════════════════════════════════
function openDetail(place, cat) {
  currentDetail = { place, cat };
  const name    = place.tags?.name || cat.label.slice(0, -1);
  const phone   = place.tags?.phone || place.tags?.['contact:phone'];
  const website = place.tags?.website || place.tags?.['contact:website'];
  const hours   = place.tags?.opening_hours;
  const addr    = buildAddress(place.tags);
  const rating  = syntheticRating(place.id);

  document.getElementById('detail-icon-wrap').style.background = cat.color + '22';
  document.getElementById('detail-icon-wrap').textContent = cat.icon;
  document.getElementById('detail-icon-wrap').style.fontSize = '24px';
  document.getElementById('detail-name').textContent = name;
  document.getElementById('detail-cat').textContent  = cat.label;
  document.getElementById('detail-cat').style.color  = cat.color;

  // Rating block
  document.getElementById('detail-rating-block').innerHTML = `
    <div class="detail-rating-score">${rating.score}</div>
    <div class="detail-rating-right">
      <div class="detail-stars-row" style="color:#f5c842">${renderStars(rating.score, 'large')}</div>
      <div class="detail-rating-count">${rating.count} ratings</div>
    </div>
  `;

  let rows = '';
  if (addr)    rows += detailRow('📍', esc(addr));
  if (hours)   rows += detailRow('🕐', esc(hours));
  if (phone)   rows += detailRow('📞', `<a href="tel:${esc(phone)}">${esc(phone)}</a>`);
  // Bug #7 fix: validate website URL scheme before rendering as link
  if (website) {
    const safeUrl = /^https?:\/\//i.test(website) ? website : null;
    if (safeUrl) {
      rows += detailRow('🌐', `<a href="${esc(safeUrl)}" target="_blank" rel="noopener noreferrer">${esc(safeUrl.replace(/^https?:\/\//i, ''))}</a>`);
    } else {
      rows += detailRow('🌐', esc(website));
    }
  }
  if (!rows) rows = detailRow('ℹ️', 'No additional details available.');

  document.getElementById('detail-rows').innerHTML = rows;
  document.getElementById('detail').classList.add('open');
}

function detailRow(icon, content) {
  return `<div class="detail-row"><span class="row-icon">${icon}</span><span>${content}</span></div>`;
}

function closeDetail(e) {
  if (e.target === document.getElementById('detail')) {
    document.getElementById('detail').classList.remove('open');
  }
}

function openInMaps() {
  if (!currentDetail) return;
  const { place } = currentDetail;
  const name = encodeURIComponent(place.tags?.name || '');
  const ll   = `${place.lat},${place.lng}`;
  // Bug #6 fix: detect platform and use appropriate maps
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    window.open(`https://maps.apple.com/?q=${name}&ll=${ll}`, '_blank');
  } else {
    window.open(`https://www.google.com/maps/search/?api=1&query=${ll}`, '_blank');
  }
}

function openTransportForDetail() {
  if (!currentDetail) return;
  const { place, cat } = currentDetail;
  document.getElementById('detail').classList.remove('open');
  openTransportFor(place.id);
}

function openTransportFor(osmId) {
  const place = currentPlaces.find(p => p.id === osmId);
  if (!place) return;
  const name = place.tags?.name || activeCat.label.slice(0, -1);
  tripDest = { lat: place.lat, lng: place.lng, name };
  if (!tripOrigin) {
    if (userLat !== null) tripOrigin = { lat: userLat, lng: userLng, name: 'My Location' };
    else if (pinLat !== null) tripOrigin = { lat: pinLat, lng: pinLng, name: 'Dropped Pin' };
  }
  const destInp = document.getElementById('trip-dest-input');
  destInp.value = name;
  document.getElementById('trip-dest-clear').classList.add('show');
  if (tripOrigin) {
    document.getElementById('trip-origin-input').value = tripOrigin.name;
    document.getElementById('trip-origin-clear').classList.add('show');
  }
  renderTransport();
  showTransportView();
}
