// ════════════════════════════════════════════════════════════
// CATEGORIES
// ════════════════════════════════════════════════════════════
const CATS = [
  { id:'restaurant',  label:'Restaurants', icon:'🍽️', color:'#F05B5B', tags: {amenity:'restaurant'} },
  { id:'cafe',        label:'Cafés',       icon:'☕', color:'#C8844A', tags: {amenity:'cafe'} },
  { id:'hotel',       label:'Hotels',      icon:'🏨', color:'#5B6BF0', tags: {tourism:'hotel'} },
  { id:'bar',         label:'Bars',        icon:'🍻', color:'#9B5BF0', tags: {amenity:'bar'} },
  { id:'fast_food',   label:'Fast Food',   icon:'🍔', color:'#F0A55B', tags: {amenity:'fast_food'} },
  { id:'supermarket', label:'Groceries',   icon:'🛒', color:'#4CAF50', tags: {shop:'supermarket'} },
  { id:'park',        label:'Parks',       icon:'🌳', color:'#2E8B57', tags: {leisure:'park'} },
  { id:'museum',      label:'Museums',     icon:'🏛️', color:'#607D8B', tags: {tourism:'museum'} },
  { id:'pharmacy',    label:'Pharmacy',    icon:'💊', color:'#00ACC1', tags: {amenity:'pharmacy'} },
  { id:'hospital',    label:'Hospital',    icon:'🏥', color:'#E53935', tags: {amenity:'hospital'} },
  { id:'fuel',        label:'Gas',         icon:'⛽', color:'#FF7043', tags: {amenity:'fuel'} },
  { id:'gym',         label:'Gym',         icon:'🏋️', color:'#8D6E63', tags: {leisure:'fitness_centre'} },
];


// ════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════
let map, pinMarker, poiMarkers = [];
let activeCat = CATS[0];
let radiusM   = 1000;
let pinLat = null, pinLng = null;
let currentPlaces = [];
let currentDetail = null;
let sheetExpanded = false;

// Transport state
let transportDest       = null; // { lat, lng, name }
let transportOriginMode = 'gps';
let transportActiveMode = 'all';
let userLat = null, userLng = null; // live GPS
let ratingCache = {}; // osm_id → { score, count }

// Trip planner state (freetext city search)
let tripOrigin = null; // { lat, lng, name }
let tripDest   = null; // { lat, lng, name }
let geocodeTimer = { origin: null, dest: null };

// Flight search state
let flightDate  = null;      // 'YYYY-MM-DD', defaults to today on first render
let flightClass = 'economy'; // 'economy' | 'premium' | 'business' | 'first'

// Flight calendar picker state
let flightCalendarOpen      = false;
let flightCalendarViewYear  = null;
let flightCalendarViewMonth = null; // 0-11
