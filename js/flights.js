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

// Synthetic ticket price seeded on iata pair + current month (refreshes monthly)
function syntheticFlightPrice(depIata, arrIata) {
  const seed = depIata.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
             + arrIata.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
             + new Date().getMonth();
  let s = seed * 1664525 + 1013904223;
  const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  // Economy price band: $89–$899, weighted lower
  const price = Math.round(89 + rand() * 810);
  return price;
}

// Estimated flight duration from great-circle distance
function flightDurationMin(distM) {
  const km = distM / 1000;
  // ~850 km/h cruise + 30 min taxi/climb/descend
  return Math.round((km / 850) * 60) + 30;
}

function buildFlightCard(origin, dest) {
  const { airport: depAp, distM: depDistM } = nearestAirport(origin.lat, origin.lng);
  const { airport: arrAp, distM: arrDistM } = nearestAirport(dest.lat, dest.lng, depAp.iata);

  if (!depAp || !arrAp) return null;

  // If both airports are the same, flying makes no sense
  if (depAp.iata === arrAp.iata) return null;

  const flightDistM = haversine(depAp.lat, depAp.lng, arrAp.lat, arrAp.lng);
  const price       = syntheticFlightPrice(depAp.iata, arrAp.iata);
  const durMin      = flightDurationMin(flightDistM);
  const durStr      = durMin < 60 ? `${durMin}m` : `${Math.floor(durMin/60)}h ${durMin%60}m`;

  // Total door-to-door including airport transfers (2h check-in buffer)
  const totalMin = durMin + 120 + Math.round(depDistM / 1000 / 40 * 60) + Math.round(arrDistM / 1000 / 40 * 60);
  const totalStr = `${Math.floor(totalMin/60)}h ${totalMin%60}m`;

  // Booking deep links
  const googleFlightsUrl  = `https://www.google.com/travel/flights/search?tfs=CBwQARoXagcIARIDJHtkepIBB${depAp.iata}SAGSB${arrAp.iata}`;
  const skyscannerUrl     = `https://www.skyscanner.net/transport/flights/${depAp.iata.toLowerCase()}/${arrAp.iata.toLowerCase()}/`;

  const wrap = document.createElement('div');
  wrap.className = 'transport-card';

  wrap.innerHTML = `
    <div class="transport-card-header">
      <div class="transport-mode-icon" style="background:#00BCD422">✈️</div>
      <div class="transport-card-info">
        <div class="transport-card-title">
          Flight
          <span style="font-size:12px;font-weight:600;color:var(--muted);margin-left:4px">${depAp.iata} → ${arrAp.iata}</span>
        </div>
        <div class="transport-card-sub">Door-to-door ~${totalStr} · flight ${durStr}</div>
      </div>
      <div class="transport-card-time">
        <div class="transport-time-val" style="color:#4CAF50">$${price}</div>
        <div class="transport-time-unit">est. economy</div>
      </div>
    </div>
    <div class="dist-bar">
      <div class="dist-bar-fill" style="background:#00BCD4;width:0%" data-pct="72%"></div>
    </div>
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
    <div class="flight-book-btns">
      <button class="flight-book-btn btn-skyscanner" onclick="window.open('${skyscannerUrl}','_blank')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Skyscanner
      </button>
      <button class="flight-book-btn btn-google" onclick="window.open('${googleFlightsUrl}','_blank')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Google Flights
      </button>
    </div>
    <div style="padding: 0 16px 12px; font-size:11px; color:var(--muted); line-height:1.5;">
      ⚠️ Prices are estimated. Tap a button above to see live fares.
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
