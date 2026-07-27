// ════════════════════════════════════════════════════════════
// FLIGHT / AIRPORT SYSTEM
// ════════════════════════════════════════════════════════════

// Curated list of major world airports with coords and IATA codes.
// Used to find nearest departure and arrival airports to origin/dest.
const AIRPORTS = [
  // North America
  { iata:'JFK', name:'John F. Kennedy Intl',        city:'New York',       lat:40.6413, lng:-73.7781 },
  { iata:'LGA', name:'LaGuardia',                   city:'New York',       lat:40.7772, lng:-73.8726 },
  { iata:'EWR', name:'Newark Liberty Intl',          city:'Newark',         lat:40.6895, lng:-74.1745 },
  { iata:'LAX', name:'Los Angeles Intl',             city:'Los Angeles',    lat:33.9425, lng:-118.408 },
  { iata:'ORD', name:"O'Hare Intl",                  city:'Chicago',        lat:41.9742, lng:-87.9073 },
  { iata:'ATL', name:'Hartsfield–Jackson',           city:'Atlanta',        lat:33.6407, lng:-84.4277 },
  { iata:'DFW', name:'Dallas/Fort Worth Intl',       city:'Dallas',         lat:32.8998, lng:-97.0403 },
  { iata:'DEN', name:'Denver Intl',                  city:'Denver',         lat:39.8561, lng:-104.6737},
  { iata:'SFO', name:'San Francisco Intl',           city:'San Francisco',  lat:37.6213, lng:-122.379 },
  { iata:'SEA', name:'Seattle–Tacoma Intl',          city:'Seattle',        lat:47.4502, lng:-122.3088},
  { iata:'MIA', name:'Miami Intl',                   city:'Miami',          lat:25.7959, lng:-80.287  },
  { iata:'BOS', name:'Boston Logan Intl',            city:'Boston',         lat:42.3656, lng:-71.0096 },
  { iata:'LAS', name:'Harry Reid Intl',              city:'Las Vegas',      lat:36.0840, lng:-115.1537},
  { iata:'PHX', name:'Phoenix Sky Harbor Intl',      city:'Phoenix',        lat:33.4373, lng:-112.0078},
  { iata:'IAH', name:'George Bush Intercontinental', city:'Houston',        lat:29.9902, lng:-95.3368 },
  { iata:'MSP', name:'Minneapolis–Saint Paul Intl',  city:'Minneapolis',    lat:44.8848, lng:-93.2223 },
  { iata:'DTW', name:'Detroit Metropolitan',         city:'Detroit',        lat:42.2125, lng:-83.3534 },
  { iata:'PHL', name:'Philadelphia Intl',            city:'Philadelphia',   lat:39.8729, lng:-75.2437 },
  { iata:'CLT', name:'Charlotte Douglas Intl',       city:'Charlotte',      lat:35.2140, lng:-80.9431 },
  { iata:'YYZ', name:'Toronto Pearson Intl',         city:'Toronto',        lat:43.6777, lng:-79.6248 },
  { iata:'YVR', name:'Vancouver Intl',               city:'Vancouver',      lat:49.1967, lng:-123.1815},
  { iata:'YUL', name:'Montréal–Trudeau Intl',        city:'Montreal',       lat:45.4706, lng:-73.7408 },
  { iata:'MEX', name:'Benito Juárez Intl',           city:'Mexico City',    lat:19.4363, lng:-99.0721 },
  { iata:'GRU', name:'São Paulo Guarulhos Intl',     city:'São Paulo',      lat:-23.4356, lng:-46.4731},
  { iata:'EZE', name:'Ezeiza Intl',                  city:'Buenos Aires',   lat:-34.8222, lng:-58.5358},
  { iata:'BOG', name:'El Dorado Intl',               city:'Bogotá',         lat:4.7016,  lng:-74.1469 },
  { iata:'LIM', name:'Jorge Chávez Intl',            city:'Lima',           lat:-12.0219, lng:-77.1143},
  { iata:'SCL', name:'Arturo Merino Benitez Intl',   city:'Santiago',       lat:-33.3930, lng:-70.7858},
  // Europe
  { iata:'LHR', name:'London Heathrow',              city:'London',         lat:51.4700, lng:-0.4543  },
  { iata:'LGW', name:'London Gatwick',               city:'London',         lat:51.1537, lng:-0.1821  },
  { iata:'CDG', name:'Charles de Gaulle Intl',       city:'Paris',          lat:49.0097, lng:2.5479   },
  { iata:'AMS', name:'Amsterdam Schiphol',           city:'Amsterdam',      lat:52.3105, lng:4.7683   },
  { iata:'FRA', name:'Frankfurt Airport',            city:'Frankfurt',      lat:50.0379, lng:8.5622   },
  { iata:'MAD', name:'Adolfo Suárez Madrid–Barajas', city:'Madrid',         lat:40.4936, lng:-3.5668  },
  { iata:'BCN', name:'Barcelona El Prat',            city:'Barcelona',      lat:41.2971, lng:2.0785   },
  { iata:'FCO', name:'Leonardo da Vinci Intl',       city:'Rome',           lat:41.8003, lng:12.2389  },
  { iata:'MUC', name:'Munich Airport',               city:'Munich',         lat:48.3537, lng:11.7750  },
  { iata:'ZRH', name:'Zurich Airport',               city:'Zurich',         lat:47.4647, lng:8.5492   },
  { iata:'VIE', name:'Vienna Intl Airport',          city:'Vienna',         lat:48.1103, lng:16.5697  },
  { iata:'BRU', name:'Brussels Airport',             city:'Brussels',       lat:50.9010, lng:4.4844   },
  { iata:'CPH', name:'Copenhagen Airport',           city:'Copenhagen',     lat:55.6180, lng:12.6560  },
  { iata:'ARN', name:'Stockholm Arlanda',            city:'Stockholm',      lat:59.6519, lng:17.9186  },
  { iata:'OSL', name:'Oslo Gardermoen',              city:'Oslo',           lat:60.1939, lng:11.1004  },
  { iata:'HEL', name:'Helsinki Vantaa',              city:'Helsinki',       lat:60.3172, lng:24.9633  },
  { iata:'IST', name:'Istanbul Airport',             city:'Istanbul',       lat:41.2753, lng:28.7519  },
  { iata:'ATH', name:'Athens Intl',                  city:'Athens',         lat:37.9364, lng:23.9445  },
  { iata:'WAW', name:'Warsaw Chopin Airport',        city:'Warsaw',         lat:52.1657, lng:20.9671  },
  { iata:'PRG', name:'Václav Havel Airport',         city:'Prague',         lat:50.1008, lng:14.2600  },
  { iata:'BUD', name:'Budapest Ferenc Liszt Intl',   city:'Budapest',       lat:47.4298, lng:19.2611  },
  // Middle East & Africa
  { iata:'DXB', name:'Dubai Intl',                   city:'Dubai',          lat:25.2532, lng:55.3657  },
  { iata:'AUH', name:'Abu Dhabi Intl',               city:'Abu Dhabi',      lat:24.4330, lng:54.6511  },
  { iata:'DOH', name:'Hamad Intl',                   city:'Doha',           lat:25.2731, lng:51.6080  },
  { iata:'RUH', name:'King Khalid Intl',             city:'Riyadh',         lat:24.9578, lng:46.6989  },
  { iata:'CAI', name:'Cairo Intl',                   city:'Cairo',          lat:30.1219, lng:31.4056  },
  { iata:'JNB', name:'O.R. Tambo Intl',              city:'Johannesburg',   lat:-26.1392, lng:28.246  },
  { iata:'NBO', name:'Jomo Kenyatta Intl',           city:'Nairobi',        lat:-1.3192, lng:36.9275  },
  { iata:'CPT', name:'Cape Town Intl',               city:'Cape Town',      lat:-33.9715, lng:18.6021 },
  { iata:'ADD', name:'Addis Ababa Bole Intl',        city:'Addis Ababa',    lat:8.9779,  lng:38.7993  },
  { iata:'LOS', name:'Murtala Muhammed Intl',        city:'Lagos',          lat:6.5774,  lng:3.3212   },
  // Asia & Pacific
  { iata:'HND', name:'Tokyo Haneda',                 city:'Tokyo',          lat:35.5494, lng:139.7798 },
  { iata:'NRT', name:'Narita Intl',                  city:'Tokyo',          lat:35.7720, lng:140.3929 },
  { iata:'PEK', name:'Beijing Capital Intl',         city:'Beijing',        lat:40.0799, lng:116.6031 },
  { iata:'PVG', name:'Shanghai Pudong Intl',         city:'Shanghai',       lat:31.1443, lng:121.8083 },
  { iata:'HKG', name:'Hong Kong Intl',               city:'Hong Kong',      lat:22.3080, lng:113.9185 },
  { iata:'SIN', name:'Singapore Changi',             city:'Singapore',      lat:1.3644,  lng:103.9915 },
  { iata:'BKK', name:'Suvarnabhumi Airport',         city:'Bangkok',        lat:13.6900, lng:100.7501 },
  { iata:'KUL', name:'Kuala Lumpur Intl',            city:'Kuala Lumpur',   lat:2.7456,  lng:101.7099 },
  { iata:'ICN', name:'Incheon Intl',                 city:'Seoul',          lat:37.4602, lng:126.4407 },
  { iata:'SYD', name:'Sydney Kingsford Smith',       city:'Sydney',         lat:-33.9399, lng:151.1753},
  { iata:'MEL', name:'Melbourne Airport',            city:'Melbourne',      lat:-37.6690, lng:144.8410},
  { iata:'DEL', name:'Indira Gandhi Intl',           city:'New Delhi',      lat:28.5562, lng:77.1000  },
  { iata:'BOM', name:'Chhatrapati Shivaji Intl',     city:'Mumbai',         lat:19.0896, lng:72.8656  },
  { iata:'CGK', name:'Soekarno–Hatta Intl',          city:'Jakarta',        lat:-6.1256, lng:106.6559 },
  { iata:'MNL', name:'Ninoy Aquino Intl',            city:'Manila',         lat:14.5086, lng:121.0194 },
  { iata:'AKL', name:'Auckland Airport',             city:'Auckland',       lat:-37.0082, lng:174.7850},
];

function nearestAirport(lat, lng, excludeIata = null) {
  let best = null, bestDist = Infinity;
  for (const ap of AIRPORTS) {
    if (excludeIata && ap.iata === excludeIata) continue;
    const d = haversine(lat, lng, ap.lat, ap.lng);
    if (d < bestDist) { bestDist = d; best = ap; }
  }
  return { airport: best, distM: bestDist };
}

// Estimated flight duration from great-circle distance
function flightDurationMin(distM) {
  const km = distM / 1000;
  // ~850 km/h cruise + 30 min taxi/climb/descend
  return Math.round((km / 850) * 60) + 30;
}

// ════════════════════════════════════════════════════════════
// AIRLINES / CABIN CLASS
// No live fare API is wired up (would require a server-side key —
// see chat). Instead we generate a plausible-looking, per-airline,
// per-date, per-class price so the UI reads like a real results
// list. Deterministic so the same route+date+class always shows
// the same numbers within a session.
// ════════════════════════════════════════════════════════════
const AIRLINES = [
  { code:'DL', name:'Delta Air Lines' },
  { code:'UA', name:'United Airlines' },
  { code:'AA', name:'American Airlines' },
  { code:'BA', name:'British Airways' },
  { code:'LH', name:'Lufthansa' },
  { code:'AF', name:'Air France' },
  { code:'KL', name:'KLM' },
  { code:'EK', name:'Emirates' },
  { code:'QR', name:'Qatar Airways' },
  { code:'SQ', name:'Singapore Airlines' },
  { code:'TK', name:'Turkish Airlines' },
  { code:'AC', name:'Air Canada' },
];

const FLIGHT_CLASSES = [
  { id:'economy', label:'Economy',  mult:1.0 },
  { id:'premium',  label:'Premium', mult:1.7 },
  { id:'business', label:'Business', mult:3.2 },
  { id:'first',    label:'First',    mult:5.5 },
];

function classInfo(id) {
  return FLIGHT_CLASSES.find(c => c.id === id) || FLIGHT_CLASSES[0];
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function makeRand(seed) {
  let s = seed || 1;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

/**
 * Pick 4–6 airlines for this route+date and price each one for the
 * given cabin class. Nonstop flights skew pricier; price also drifts
 * a little with how far out the date is (further out = cheaper, like
 * real fares tend to behave close-in vs. advance purchase).
 */
function buildAirlineOptions(depAp, arrAp, flightDistM, baseDurMin, dateStr, classId) {
  const routeSeed = hashStr(`${depAp.iata}${arrAp.iata}${dateStr}`);
  const rand = makeRand(routeSeed);

  const pool = [...AIRLINES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const count = 4 + Math.floor(rand() * 3); // 4–6 airlines

  const km        = flightDistM / 1000;
  const daysOut    = Math.max(0, Math.round((new Date(dateStr) - new Date()) / 86400000));
  const advanceDiscount = Math.max(0.82, 1 - daysOut * 0.004); // cheaper further out, floors at 18% off
  const cls = classInfo(classId);

  return pool.slice(0, count).map(al => {
    const airlineRand = makeRand(hashStr(`${al.code}${depAp.iata}${arrAp.iata}${dateStr}`));
    const stopsRoll = airlineRand();
    const stops = stopsRoll < 0.5 ? 0 : stopsRoll < 0.85 ? 1 : 2;
    const stopDelayMin = stops * (45 + Math.floor(airlineRand() * 60));

    const airlineFactor = 0.82 + airlineRand() * 0.5; // 0.82x–1.32x
    const nonstopPremium = stops === 0 ? 1.12 : 1 - stops * 0.05;

    const economyBase = (km * 0.11 + 45) * airlineFactor * nonstopPremium * advanceDiscount;
    const price = Math.max(39, Math.round(economyBase * cls.mult));

    return {
      code: al.code,
      name: al.name,
      stops,
      durationMin: baseDurMin + stopDelayMin,
      price,
    };
  }).sort((a, b) => a.price - b.price);
}

function stopsLabel(stops) {
  return stops === 0 ? 'Nonstop' : stops === 1 ? '1 stop' : `${stops} stops`;
}

function selectFlightClass(id) {
  flightClass = id;
  renderTransport();
}

// ════════════════════════════════════════════════════════════
// CALENDAR PICKER
// A small custom month-grid calendar (replaces the native
// <input type="date">) so date selection matches the app's look.
// ════════════════════════════════════════════════════════════
const CAL_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CAL_DOW = ['S','M','T','W','T','F','S'];

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function pad2(n) { return String(n).padStart(2, '0'); }

// ── Full-page date picker (opens over everything, like the detail sheet) ──
function openDatePickerPage(e) {
  e.stopPropagation();
  const anchor = flightDate || new Date().toISOString().slice(0, 10);
  const d = new Date(anchor + 'T00:00:00');
  flightCalendarViewYear  = d.getFullYear();
  flightCalendarViewMonth = d.getMonth();
  renderDatePickerPage();
  document.getElementById('date-picker-overlay').classList.add('open');
}

function closeDatePickerPage(e) {
  if (!e || e.target === document.getElementById('date-picker-overlay') || e.target.id === 'date-picker-close') {
    document.getElementById('date-picker-overlay').classList.remove('open');
  }
}

function calendarPrevMonth(e) {
  e.stopPropagation();
  flightCalendarViewMonth--;
  if (flightCalendarViewMonth < 0) { flightCalendarViewMonth = 11; flightCalendarViewYear--; }
  renderDatePickerPage();
}

function calendarNextMonth(e) {
  e.stopPropagation();
  flightCalendarViewMonth++;
  if (flightCalendarViewMonth > 11) { flightCalendarViewMonth = 0; flightCalendarViewYear++; }
  renderDatePickerPage();
}

function selectFlightDateFromCalendar(dateStr) {
  flightDate = dateStr;
  document.getElementById('date-picker-overlay').classList.remove('open');
  renderTransport();
}

function quickPickDate(dateStr) {
  flightDate = dateStr;
  document.getElementById('date-picker-overlay').classList.remove('open');
  renderTransport();
}

/** Upcoming Saturday (today counts as "this weekend" only before Saturday). */
function nextWeekendDate() {
  const d = new Date();
  const day = d.getDay(); // 0 Sun .. 6 Sat
  let addDays = (6 - day + 7) % 7;
  if (addDays === 0) addDays = 7;
  d.setDate(d.getDate() + addDays);
  return d.toISOString().slice(0, 10);
}

function addDaysStr(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function buildQuickPicksHTML() {
  const picks = [
    { label: 'Today',         date: addDaysStr(0) },
    { label: 'Tomorrow',      date: addDaysStr(1) },
    { label: 'This weekend',  date: nextWeekendDate() },
    { label: 'Next week',     date: addDaysStr(7) },
    { label: 'Next month',    date: addDaysStr(30) },
  ];
  return picks.map(p => `
    <div class="date-quick-chip${p.date === flightDate ? ' active' : ''}" onclick="quickPickDate('${p.date}')">${esc(p.label)}</div>
  `).join('');
}

/** Repaint just the date-picker page contents (calendar + quick picks). */
function renderDatePickerPage() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('date-picker-quick').innerHTML = buildQuickPicksHTML();
  document.getElementById('date-picker-cal').innerHTML   = buildCalendarHTML(flightCalendarViewYear, flightCalendarViewMonth, flightDate, today);
}

function buildCalendarHTML(viewYear, viewMonth, selectedStr, minStr) {
  const first      = new Date(viewYear, viewMonth, 1);
  const startDow   = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr   = new Date().toISOString().slice(0, 10);

  let cells = '';
  for (let i = 0; i < startDow; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr    = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(day)}`;
    const isDisabled = dateStr < minStr;
    const isSelected = dateStr === selectedStr;
    const isToday    = dateStr === todayStr;
    cells += `<div class="cal-cell${isDisabled ? ' disabled' : ''}${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}"
      ${isDisabled ? '' : `onclick="selectFlightDateFromCalendar('${dateStr}')"`}>${day}</div>`;
  }

  return `
    <div class="cal-header">
      <div class="cal-nav" onclick="calendarPrevMonth(event)">‹</div>
      <div class="cal-title">${CAL_MONTH_NAMES[viewMonth]} ${viewYear}</div>
      <div class="cal-nav" onclick="calendarNextMonth(event)">›</div>
    </div>
    <div class="cal-dow-row">${CAL_DOW.map(d => `<div class="cal-dow">${d}</div>`).join('')}</div>
    <div class="cal-grid">${cells}</div>
  `;
}

function buildFlightCard(origin, dest) {
  const { airport: depAp, distM: depDistM } = nearestAirport(origin.lat, origin.lng);
  const { airport: arrAp, distM: arrDistM } = nearestAirport(dest.lat, dest.lng, depAp.iata);

  if (!depAp || !arrAp) return null;

  // If both airports are the same, flying makes no sense
  if (depAp.iata === arrAp.iata) return null;

  const today = new Date().toISOString().slice(0, 10);
  // NOTE: flightDate is intentionally left unset here — the calendar
  // is shown up front and fares/airlines only render once the user
  // has actually picked a date (see the `!flightDate` branch below).
  if (flightCalendarViewYear == null) {
    const d = new Date((flightDate || today) + 'T00:00:00');
    flightCalendarViewYear  = d.getFullYear();
    flightCalendarViewMonth = d.getMonth();
  }

  const flightDistM = haversine(depAp.lat, depAp.lng, arrAp.lat, arrAp.lng);
  const baseDurMin  = flightDurationMin(flightDistM);
  const durStr      = baseDurMin < 60 ? `${baseDurMin}m` : `${Math.floor(baseDurMin/60)}h ${baseDurMin%60}m`;

  const dateFieldHTML = `
    <div class="flight-controls">
      <div class="flight-date-field" onclick="openDatePickerPage(event)">
        <span class="flight-field-icon">📅</span>
        <span class="flight-date-label${flightDate ? '' : ' placeholder'}">${flightDate ? esc(formatDateLabel(flightDate)) : 'Select a travel date'}</span>
        <span class="flight-date-caret">›</span>
      </div>
    </div>
  `;

  const airportsHTML = `
    <div class="flight-airports">
      <div class="flight-airport-row">
        <div class="airport-role dep">DEP</div>
        <div class="airport-iata">${depAp.iata}</div>
        <div class="airport-info">
          <div class="airport-name">${esc(depAp.name)}</div>
          <div class="airport-dist">${esc(depAp.city)} · ${formatDist(depDistM)} from you</div>
        </div>
        <div class="flight-price-col">
          <div class="flight-price-label">transfer</div>
          <div style="font-size:13px;font-weight:600;color:var(--muted)">${Math.round(depDistM/1000/40*60)}m drive</div>
        </div>
      </div>
      <div class="flight-route-divider">
        <div class="flight-route-line"></div>
        <div class="flight-route-icon">✈️</div>
        <div class="flight-route-dur">${durStr} · ${formatDist(flightDistM)}</div>
        <div class="flight-route-line"></div>
      </div>
      <div class="flight-airport-row">
        <div class="airport-role arr">ARR</div>
        <div class="airport-iata">${arrAp.iata}</div>
        <div class="airport-info">
          <div class="airport-name">${esc(arrAp.name)}</div>
          <div class="airport-dist">${esc(arrAp.city)} · ${formatDist(arrDistM)} to destination</div>
        </div>
        <div class="flight-price-col">
          <div class="flight-price-label">transfer</div>
          <div style="font-size:13px;font-weight:600;color:var(--muted)">${Math.round(arrDistM/1000/40*60)}m drive</div>
        </div>
      </div>
    </div>
  `;

  const wrap = document.createElement('div');
  wrap.className = 'transport-card';

  // ── Gate: no date picked yet — show route + calendar only, no prices ──
  if (!flightDate) {
    wrap.innerHTML = `
      <div class="transport-card-header">
        <div class="transport-mode-icon" style="background:#00BCD422">✈️</div>
        <div class="transport-card-info">
          <div class="transport-card-title">
            Flight
            <span style="font-size:12px;font-weight:600;color:var(--muted);margin-left:4px">${depAp.iata} → ${arrAp.iata}</span>
          </div>
          <div class="transport-card-sub">Pick a date to see airline fares</div>
        </div>
      </div>

      ${dateFieldHTML}

      <div class="dist-bar">
        <div class="dist-bar-fill" style="background:#00BCD4;width:0%" data-pct="72%"></div>
      </div>

      ${airportsHTML}

      <div class="flight-date-prompt">
        <div class="icon">📅</div>
        <div>Choose a travel date above to see fares from every airline on this route.</div>
      </div>
    `;
    requestAnimationFrame(() => {
      const fill = wrap.querySelector('.dist-bar-fill');
      if (fill) fill.style.width = fill.dataset.pct;
    });
    return { card: wrap, minutes: null };
  }

  // ── Date picked — compute and show airline fares ──
  const options   = buildAirlineOptions(depAp, arrAp, flightDistM, baseDurMin, flightDate, flightClass);
  const cheapest  = options[0];
  const fastest   = options.reduce((a, b) => a.durationMin < b.durationMin ? a : b);

  // Total door-to-door for the cheapest option, including airport transfers (2h check-in buffer)
  const totalMin = cheapest.durationMin + 120 + Math.round(depDistM / 1000 / 40 * 60) + Math.round(arrDistM / 1000 / 40 * 60);
  const totalStr = `${Math.floor(totalMin/60)}h ${totalMin%60}m`;

  const [y, m, d] = flightDate.split('-');
  const skyDate   = y.slice(2) + m + d;

  wrap.innerHTML = `
    <div class="transport-card-header">
      <div class="transport-mode-icon" style="background:#00BCD422">✈️</div>
      <div class="transport-card-info">
        <div class="transport-card-title">
          Flight
          <span style="font-size:12px;font-weight:600;color:var(--muted);margin-left:4px">${depAp.iata} → ${arrAp.iata}</span>
        </div>
        <div class="transport-card-sub">Door-to-door ~${totalStr} from $${cheapest.price} · flight ${durStr}</div>
      </div>
      <div class="transport-card-time">
        <div class="transport-time-val" style="color:#4CAF50">$${cheapest.price}</div>
        <div class="transport-time-unit">from</div>
      </div>
    </div>

    ${dateFieldHTML}

    <div class="flight-class-tabs-wrap">
      <div class="flight-class-tabs">
        ${FLIGHT_CLASSES.map(c => `
          <div class="flight-class-tab${c.id === flightClass ? ' active' : ''}" onclick="selectFlightClass('${c.id}')">${esc(c.label)}</div>
        `).join('')}
      </div>
    </div>

    <div class="dist-bar">
      <div class="dist-bar-fill" style="background:#00BCD4;width:0%" data-pct="72%"></div>
    </div>

    ${airportsHTML}

    <div class="airline-list-heading">${options.length} airlines · ${esc(classInfo(flightClass).label)} · ${esc(flightDate)}</div>
    <div class="airline-list">
      ${options.map(o => {
        const isCheapest = o === cheapest;
        const isFastest  = o === fastest && !isCheapest;
        const durStrO = o.durationMin < 60 ? `${o.durationMin}m` : `${Math.floor(o.durationMin/60)}h ${o.durationMin%60}m`;
        const skyUrl = `https://www.skyscanner.net/transport/flights/${depAp.iata.toLowerCase()}/${arrAp.iata.toLowerCase()}/${skyDate}/`;
        return `
          <div class="airline-row">
            <div class="airline-logo">${esc(o.code)}</div>
            <div class="airline-info">
              <div class="airline-name">${esc(o.name)}
                ${isCheapest ? '<span class="airline-badge cheapest">Cheapest</span>' : ''}
                ${isFastest ? '<span class="airline-badge fastest">Fastest</span>' : ''}
              </div>
              <div class="airline-meta">${stopsLabel(o.stops)} · ${durStrO}</div>
            </div>
            <div class="airline-price-col">
              <div class="airline-price">$${o.price}</div>
              <button class="airline-book-btn" onclick="window.open('${skyUrl}','_blank')">View</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="flight-book-btns">
      <button class="flight-book-btn btn-skyscanner" onclick="window.open('https://www.skyscanner.net/transport/flights/${depAp.iata.toLowerCase()}/${arrAp.iata.toLowerCase()}/${skyDate}/','_blank')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Skyscanner
      </button>
      <button class="flight-book-btn btn-google" onclick="window.open('https://www.google.com/travel/flights?q=${encodeURIComponent('Flights from ' + depAp.iata + ' to ' + arrAp.iata + ' on ' + flightDate)}','_blank')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Google Flights
      </button>
    </div>
    <div style="padding: 0 16px 12px; font-size:11px; color:var(--muted); line-height:1.5;">
      ⚠️ Prices are estimated, not live fares. Tap "View" or the buttons above to check real prices.
    </div>
  `;

  requestAnimationFrame(() => {
    const fill = wrap.querySelector('.dist-bar-fill');
    if (fill) fill.style.width = fill.dataset.pct;
  });

  return { card: wrap, minutes: totalMin };
}

// ── Deep links ──────────────────────────────────────────────
function buildMapsUrl(origin, dest, mode) {
  if (isIOS()) {
    const modeMap = { walk: 'w', cycle: 'b', drive: 'd', transit: 'r' };
    const dir = modeMap[mode] || 'd';
    return `https://maps.apple.com/?saddr=${origin.lat},${origin.lng}&daddr=${dest.lat},${dest.lng}&dirflg=${dir}`;
  } else {
    const modeMap = { walk: 'walking', cycle: 'bicycling', drive: 'driving', transit: 'transit' };
    const travelMode = modeMap[mode] || 'driving';
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}&travelmode=${travelMode}`;
  }
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
