// MILITARY-GRADE SERVICE WORKER
// Cache-first strategy for instant repeat loads

const CACHE_VERSION = 'bible-viz-v1.13.7'; // Fixed main.js heatmap references after removal
const CACHE_NAME = `bible-visualizer-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/data-loader.js',
  '/js/color-schemes.js',
  '/js/arc-diagram-tableau-style.js',
  '/js/network-graph.js',
  '/js/chord-diagram.js',
  '/js/heatmap.js',
  '/js/sunburst.js',
  '/js/radial-arc.js',
  '/js/photo-gallery.js',
  '/js/cross-reference-grid.js',
  '/js/sankey-diagram.js',
  '/js/word-explorer.js',
  '/js/bible-verse-loader.js',
  '/js/bible-dictionary.js',
  '/js/preview-data.js',
  'https://d3js.org/d3.v7.min.js',
  'https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js',
  'https://cdn.jsdelivr.net/npm/topojson-client@3',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Large data files to cache on demand
const DATA_FILES = [
  '/shared-data/processed/graph_data.json',
  '/shared-data/processed/stats.json',
  '/data/bible-section-counts.txt',
  '/data/asv-bible.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Cache HIT:', url.pathname);

          // Return cached version immediately
          // But also fetch fresh version in background for next time
          if (shouldUpdateInBackground(url)) {
            fetchAndUpdateCache(request);
          }

          return cachedResponse;
        }

        // Cache MISS - fetch from network
        console.log('[SW] Cache MISS:', url.pathname);
        return fetchAndCache(request);
      })
  );
});

// Fetch from network and cache the result
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);

    // Only cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);

      // Clone response before caching (can only read once)
      cache.put(request, response.clone());
      console.log('[SW] Cached new resource:', request.url);
    }

    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);

    // Return offline page or error response
    return new Response('Offline - cached version not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Update cache in background without blocking response
function fetchAndUpdateCache(request) {
  fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, response);
            console.log('[SW] Background update cached:', request.url);
          });
      }
    })
    .catch((error) => {
      console.error('[SW] Background update failed:', error);
    });
}

// Determine if resource should be updated in background
function shouldUpdateInBackground(url) {
  // Update data files daily
  if (url.pathname.includes('.json')) {
    return true;
  }

  // Update JS/CSS files on page load
  if (url.pathname.includes('.js') || url.pathname.includes('.css')) {
    return true;
  }

  return false;
}

// Listen for skip waiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded');
