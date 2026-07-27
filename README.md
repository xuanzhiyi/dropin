# PinDrop

A PWA for dropping pins and exploring nearby places, with a full trip planner.

## File structure

```
PinDrop/
├── index.html          # App shell & HTML views
├── css/
│   └── main.css        # All styles & design tokens
├── js/
│   ├── config.js       # Categories & app state
│   ├── utils.js        # Helpers (haversine, formatDist, esc) + init
│   ├── map.js          # Map, pin, search, results, POI markers
│   ├── detail.js       # Place detail panel
│   ├── transport.js    # Trip planner, geocoding, transport cards
│   └── flights.js      # Airport database & flight card
└── assets/             # Icons / images (add as needed)
```

## Stack
- Leaflet 1.9.4 (CDN)
- OpenStreetMap / Overpass API (place search)
- Nominatim (trip planner geocoding)
- Vanilla HTML / CSS / JS — no build step

## Running
Open `index.html` directly in Safari or any modern browser.
For full GPS support, serve over HTTPS or localhost.
