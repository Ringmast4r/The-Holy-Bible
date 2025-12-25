// INTELLIGENT PREFETCHING
// Loads data before user clicks based on behavior prediction

class IntelligentPrefetcher {
  constructor() {
    this.prefetchedData = new Map();
    this.tabHoverTimers = new Map();
    this.currentTab = 'arc';
    this.setupListeners();
  }

  setupListeners() {
    // Monitor tab hover - prefetch if user hovers for 500ms
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('mouseenter', (e) => {
        const vizType = btn.dataset.viz;
        const timer = setTimeout(() => {
          this.prefetchForTab(vizType);
        }, 500); // 500ms hover = likely to click

        this.tabHoverTimers.set(vizType, timer);
      });

      btn.addEventListener('mouseleave', (e) => {
        const vizType = btn.dataset.viz;
        const timer = this.tabHoverTimers.get(vizType);
        if (timer) {
          clearTimeout(timer);
          this.tabHoverTimers.delete(vizType);
        }
      });

      btn.addEventListener('click', (e) => {
        this.currentTab = btn.dataset.viz;
        // Prefetch adjacent tabs
        this.prefetchAdjacentTabs(btn.dataset.viz);
      });
    });

    // Prefetch next likely tab while user views current
    this.setupIdlePrefetching();
  }

  prefetchForTab(vizType) {
    console.log(`[Prefetch] Pre-loading data for ${vizType} tab`);

    // Determine what data this tab needs
    const dataNeeds = this.getDataNeedsForTab(vizType);

    dataNeeds.forEach(async (dataType) => {
      if (!this.prefetchedData.has(dataType)) {
        try {
          const data = await theographicLoader.load(dataType);
          this.prefetchedData.set(dataType, data);
          console.log(`[Prefetch] ✓ Cached ${dataType}`);
        } catch (error) {
          console.warn(`[Prefetch] Failed to load ${dataType}:`, error);
        }
      }
    });
  }

  getDataNeedsForTab(vizType) {
    const needs = {
      'geomap': ['places'],
      'timeline': ['events', 'periods'],
      'people': ['people'],
      'search': ['books', 'chapters', 'easton']
    };

    return needs[vizType] || [];
  }

  prefetchAdjacentTabs(currentViz) {
    const tabOrder = ['arc', 'radial', 'network', 'chord', 'heatmap', 'sunburst', 'geomap', 'timeline', 'people', 'stats', 'search'];
    const currentIndex = tabOrder.indexOf(currentViz);

    if (currentIndex >= 0) {
      // Prefetch next 2 tabs
      const nextIndex = (currentIndex + 1) % tabOrder.length;
      const nextNextIndex = (currentIndex + 2) % tabOrder.length;

      setTimeout(() => this.prefetchForTab(tabOrder[nextIndex]), 1000);
      setTimeout(() => this.prefetchForTab(tabOrder[nextNextIndex]), 3000);
    }
  }

  setupIdlePrefetching() {
    // Use requestIdleCallback to prefetch during browser idle time
    if ('requestIdleCallback' in window) {
      const prefetchAllData = () => {
        requestIdleCallback((deadline) => {
          const dataTypes = ['places', 'people', 'events', 'periods', 'easton'];

          for (const dataType of dataTypes) {
            if (deadline.timeRemaining() > 100 && !this.prefetchedData.has(dataType)) {
              theographicLoader.load(dataType)
                .then(data => {
                  this.prefetchedData.set(dataType, data);
                  console.log(`[Idle Prefetch] ✓ Cached ${dataType}`);
                })
                .catch(error => {
                  console.warn(`[Idle Prefetch] Failed ${dataType}:`, error);
                });
              break; // One at a time during idle
            }
          }

          // Continue prefetching if more data remains
          if (this.prefetchedData.size < dataTypes.length) {
            setTimeout(prefetchAllData, 2000);
          }
        });
      };

      // Start idle prefetching 5 seconds after page load
      setTimeout(prefetchAllData, 5000);
    }
  }

  // Preload resource hints
  addResourceHint(url, type = 'prefetch') {
    const link = document.createElement('link');
    link.rel = type; // 'prefetch', 'preload', or 'dns-prefetch'
    link.href = url;
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    console.log(`[Resource Hint] ${type}: ${url}`);
  }
}

// Initialize prefetcher
const prefetcher = new IntelligentPrefetcher();

// DNS prefetch for CDNs
prefetcher.addResourceHint('https://cdn.jsdelivr.net', 'dns-prefetch');
prefetcher.addResourceHint('https://d3js.org', 'dns-prefetch');

console.log('[Prefetch] Intelligent prefetching initialized');
