// SERVICE WORKER REGISTRATION
// Enables instant caching and offline mode

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('✨ New version available! Refresh to update.');

              // Optionally show update notification
              if (confirm('New version available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });

    // Handle service worker controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker controller changed - reloading');
      window.location.reload();
    });
  });

  // Log cache status
  window.addEventListener('load', async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('📦 Active caches:', cacheNames);

      cacheNames.forEach(async (cacheName) => {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        console.log(`  ${cacheName}: ${keys.length} items cached`);
      });
    }
  });
}
