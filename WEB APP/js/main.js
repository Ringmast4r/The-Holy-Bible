// Main Application Controller

class BibleVisualizer {
    constructor() {
        // Initialize from URL path (e.g., /radial -> 'radial')
        this.currentViz = this.getVizFromURL();
        this.filters = {
            testament: 'all',
            book: '',
            minConnections: 1
        };

        this.visualizations = {
            arc: null,
            network: null,
            chord: null,
            sunburst: null,
            geomap: null,
            timeline: null,
            people: null
        };

        // Theme system
        this.themes = ['blackgold', 'light', 'professional', 'vibrant', 'matrix', 'sunset', 'royal', 'ocean'];
        this.currentTheme = 'blackgold'; // Default to black & gold theme

        // Flags for smart loading
        this.fullDataLoaded = false;
        this.fullDataLoading = false;

        // Render cache: Track which visualizations have been rendered
        // Prevents unnecessary re-rendering when switching tabs
        this.renderedCache = {
            arc: false,
            network: false,
            chord: false,
            sunburst: false,
            radial: false,
            geomap: false,
            timeline: false,
            people: false,
            search: false
        };

        // Setup URL routing (browser back/forward buttons)
        window.addEventListener('popstate', (e) => {
            const vizName = this.getVizFromURL();
            if (vizName !== this.currentViz) {
                this.switchTab(vizName, false); // Don't push state again
            }
        });
    }

    /**
     * Get visualization name from URL path
     * Examples: / -> arc, /radial -> radial, /network -> network
     * Also handles GitHub Pages 404 redirect: /?path=/radial
     */
    getVizFromURL() {
        const validViz = ['arc', 'radial', 'network', 'chord', 'sunburst', 'geomap', 'timeline', 'people', 'search'];

        // Check for GitHub Pages 404 redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const pathParam = urlParams.get('path');
        if (pathParam) {
            const vizName = pathParam.replace(/^\//, '');
            if (validViz.includes(vizName)) {
                // Replace URL to clean it up (remove ?path= parameter)
                window.history.replaceState({ viz: vizName }, '', `/${vizName}`);
                return vizName;
            }
        }

        // Normal path parsing
        const path = window.location.pathname.replace('/bible-visualizer-web/', '/').replace(/^\//, '');

        // If path matches a visualization name, use it
        if (validViz.includes(path)) {
            return path;
        }

        // Default to 'arc' for root path
        return 'arc';
    }

    /**
     * Update URL to match current visualization
     */
    updateURL(vizName) {
        const newPath = vizName === 'arc' ? '/' : `/${vizName}`;

        // Don't push duplicate states
        if (window.location.pathname !== newPath) {
            window.history.pushState({ viz: vizName }, '', newPath);
        }
    }

    async init() {
        try {
            // Debug logging
            console.log('🔍 Initializing Bible Visualizer...');
            console.log('📄 DOM ready state:', document.readyState);
            console.log('🎯 .viz-container exists?', !!document.querySelector('.viz-container'));
            console.log('🌐 Current URL:', window.location.href);

            // Show loading state with progress
            this.showLoading();

            // Setup progress callback
            dataLoader.onProgress((percent, message) => {
                this.updateLoadingProgress(percent, message);
            });

            // Setup theographic progress callback
            theographicLoader.onProgress((percent, message) => {
                console.log(`📍 Theographic: ${percent}% - ${message}`);
            });

            // Try loading preview first for instant results
            const previewLoaded = dataLoader.loadPreview();

            if (previewLoaded) {
                console.log('⚡ Preview loaded instantly!');

                // Hide loading
                this.hideLoading();

                // Initialize UI with preview data
                console.log('🎨 Initializing UI with preview...');
                this.initializeUI();

                // Apply default theme on page load
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                console.log(`🎨 Applied default theme: ${this.currentTheme}`);

                // Initialize Bible verse loader (do this BEFORE visualizations)
                console.log('📖 Loading Bible verse data...');
                window.bibleVerseLoader.load().catch(error => {
                    console.warn('⚠️ Bible verse data failed to load (non-critical):', error);
                });

                // Initialize Bible dictionary (lazy load - only when first used)
                console.log('📚 Bible Dictionary ready (will load on first use)');
                // Dictionary loads automatically when someone clicks a dictionary link

                // Initialize visualizations
                console.log('📊 Initializing visualizations...');
                this.initializeVisualizations();

                // Render initial visualization
                console.log('🖼️ Rendering preview visualization...');
                this.renderCurrentVisualization();

                // SMART LOADING: Only load full data when needed
                // This makes initial page load INSTANT instead of 2-5 seconds
                console.log('⚡ Smart loading enabled - full data will load on demand');

                // Set flag to load full data later
                this.fullDataLoaded = false;
                this.fullDataLoading = false;

                // Load full data in these scenarios:
                // 1. User stays on page for 5 seconds (probably interested)
                setTimeout(() => {
                    if (!this.fullDataLoaded && !this.fullDataLoading) {
                        console.log('📥 User still here after 5s - loading full dataset...');
                        this.loadFullData();
                    }
                }, 5000);

                // 2. User switches tabs (handled in switchTab())
                // 3. User changes filters (handled in filter change events)

                // DEFER theographic data - only load when user clicks those tabs
                // This keeps initial page load super fast!

            } else {
                // No preview available, load full data normally
                console.log('📥 Loading full dataset...');
                await dataLoader.load();
                console.log('✅ Data loaded successfully!');

                // Hide loading
                this.hideLoading();

                // Initialize UI
                console.log('🎨 Initializing UI...');
                this.initializeUI();

                // Apply default theme on page load
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                console.log(`🎨 Applied default theme: ${this.currentTheme}`);

                // Initialize visualizations
                console.log('📊 Initializing visualizations...');
                this.initializeVisualizations();

                // Render initial visualization
                console.log('🖼️ Rendering initial visualization...');
                this.renderCurrentVisualization();

                // Load theographic data in background
                console.log('📍 Loading theographic data (people, places, events)...');
                theographicLoader.load().then(() => {
                    console.log('✅ Theographic data loaded!');
                    // Re-render if user is on a theographic visualization
                    if (['geomap', 'timeline', 'people'].includes(this.currentViz)) {
                        console.log('🔄 Re-rendering theographic visualization...');
                        this.renderCurrentVisualization();
                    }
                }).catch(err => {
                    console.warn('Theographic data load failed:', err);
                });
            }

            console.log('✅ Bible Visualizer initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            console.error('📋 Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            this.showError(error.message || 'Failed to load data. Please refresh the page.');
        }
    }

    initializeUI() {
        // Set initial URL based on current viz
        this.updateURL(this.currentViz);

        // Update UI to show the current tab as active (from URL)
        if (this.currentViz !== 'arc') {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-viz="${this.currentViz}"]`)?.classList.add('active');

            document.querySelectorAll('.viz-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${this.currentViz}-viz`)?.classList.add('active');
        }

        // Tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.viz);
            });
        });

        // Book selector
        const bookSelect = document.getElementById('book-select');
        if (!bookSelect) {
            console.error('❌ book-select element not found');
            return;
        }
        const books = dataLoader.getBooks();
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.name;
            option.textContent = book.name;
            bookSelect.appendChild(option);
        });

        // Testament filter
        const testamentFilter = document.getElementById('testament-filter');
        if (!testamentFilter) {
            console.error('❌ testament-filter element not found');
            return;
        }
        testamentFilter.addEventListener('change', (e) => {
            this.filters.testament = e.target.value;

            // Track filter usage
            if (window.BIBLE_TRACKER) {
                window.BIBLE_TRACKER.trackFilter('testament', e.target.value);
            }

            // Clear render cache - filters changed, need to re-render
            this.clearRenderCache();

            // Load full data if user is filtering (they need the complete dataset)
            if (!this.fullDataLoaded && !this.fullDataLoading) {
                console.log('📥 User changed filter - loading full dataset...');
                this.loadFullData();
                return; // loadFullData() will call renderCurrentVisualization()
            }

            this.renderCurrentVisualization(true); // Force re-render with new filters
        });

        // Book filter
        bookSelect.addEventListener('change', (e) => {
            this.filters.book = e.target.value;

            // Track filter usage
            if (window.BIBLE_TRACKER) {
                window.BIBLE_TRACKER.trackFilter('book', e.target.value);
            }

            // Clear render cache - filters changed, need to re-render
            this.clearRenderCache();

            // Load full data if user is filtering (they need the complete dataset)
            if (!this.fullDataLoaded && !this.fullDataLoading) {
                console.log('📥 User changed filter - loading full dataset...');
                this.loadFullData();
                return; // loadFullData() will call renderCurrentVisualization()
            }

            this.renderCurrentVisualization(true); // Force re-render with new filters
        });

        // Min connections slider with debouncing for smooth performance
        const minSlider = document.getElementById('min-connections');
        const minValue = document.getElementById('min-value');
        if (!minSlider || !minValue) {
            console.error('❌ min-connections or min-value element not found');
            return;
        }
        let sliderDebounceTimer = null;

        minSlider.addEventListener('input', (e) => {
            // Update value immediately (instant feedback)
            this.filters.minConnections = parseInt(e.target.value);
            minValue.textContent = e.target.value;

            // Debounce the re-render (wait for user to stop moving slider)
            clearTimeout(sliderDebounceTimer);
            sliderDebounceTimer = setTimeout(() => {
                // Clear render cache - filters changed, need to re-render
                this.clearRenderCache();
                this.renderCurrentVisualization(true); // Force re-render with new filters
            }, 300); // 300ms delay after user stops moving
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetFilters();
        });

        // Floating theme toggle (moon icon)
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.cycleTheme();
        });

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportCurrentVisualization();
        });

        // Sankey book selector
        const sankeyBookSelect = document.getElementById('sankey-book-select');
        if (sankeyBookSelect) {
            sankeyBookSelect.addEventListener('change', (e) => {
                const selectedBook = e.target.value;
                if (this.visualizations.sankey) {
                    this.visualizations.sankey.setBook(selectedBook);
                }
            });
        }
    }

    initializeVisualizations() {
        try {
            // Create visualization instances
            console.log('Creating visualization instances...');

            this.visualizations.arc = new ArcDiagramTableauStyle('arc-svg', 'arc-tooltip');
            console.log('✅ ArcDiagramTableauStyle created (true circular arcs)');
            console.log(`🔍 Arc viz class: ${this.visualizations.arc.constructor.name}`);
            console.log(`📐 Arc viz height: ${this.visualizations.arc.height}px`);

            this.visualizations.network = new NetworkGraph('network-svg', 'network-tooltip');
            console.log('✅ NetworkGraph created');

            this.visualizations.chord = new ChordDiagram('chord-svg', 'chord-tooltip');
            console.log('✅ ChordDiagram created');

            this.visualizations.sunburst = new Sunburst('sunburst-svg', 'sunburst-tooltip');
            console.log('✅ Sunburst created');

            this.visualizations.sankey = new SankeyDiagram('sankey-svg', 'sankey-tooltip');
            console.log('✅ SankeyDiagram created');

            this.visualizations.geomap = new GeographicMap('geomap-container', 'geomap-tooltip');
            console.log('✅ GeographicMap created');

            this.visualizations.photos = new PhotoGallery('photo-gallery-container');
            window.photoGalleryInstance = this.visualizations.photos; // Make globally accessible
            console.log('✅ PhotoGallery created');

            this.visualizations.refgrid = new CrossReferenceGrid('refgrid-svg', 'refgrid-tooltip');
            console.log('✅ CrossReferenceGrid created');

            this.visualizations.timeline = new Timeline('timeline-svg', 'timeline-tooltip');
            console.log('✅ Timeline created');

            this.visualizations.people = new PeopleNetwork('people-svg', 'people-tooltip');
            console.log('✅ PeopleNetwork created');

            this.visualizations.radial = new RadialArc('radial-svg', 'radial-tooltip');
            console.log('✅ RadialArc created');

            this.visualizations.search = new BibleSearch('search-viz');
            console.log('✅ BibleSearch created');

            this.visualizations.words = new WordExplorer('word-explorer-container');
            console.log('✅ WordExplorer created');

            console.log('✅ All visualizations initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize visualizations:', error);
            throw error;  // Re-throw to be caught by init()
        }
    }

    switchTab(vizName, pushState = true) {
        const switchStart = performance.now();
        console.log(`🔀 Switching to ${vizName} tab...`);

        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-viz="${vizName}"]`).classList.add('active');

        // Update active panel
        document.querySelectorAll('.viz-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${vizName}-viz`).classList.add('active');

        this.currentViz = vizName;
        const domUpdateTime = performance.now();
        console.log(`  ⚡ DOM updated in ${(domUpdateTime - switchStart).toFixed(0)}ms`);

        // Update URL (unless we're navigating via back/forward buttons)
        if (pushState) {
            this.updateURL(vizName);
        }

        // Track visualization usage
        if (window.BIBLE_TRACKER) {
            window.BIBLE_TRACKER.trackVisualization(vizName);
        }

        // Load theographic data ONLY if user clicks geomap/timeline/people tabs
        const needsTheographic = ['geomap', 'timeline', 'people'].includes(vizName);
        if (needsTheographic && !theographicLoader.isLoaded) {
            console.log('📍 Loading theographic data for', vizName, '...');
            // Clear cache for this viz - it's showing loading screen, not actual render
            this.renderedCache[vizName] = false;
            theographicLoader.load().then(() => {
                console.log('✅ Theographic loaded! Rendering', vizName);
                this.renderCurrentVisualization(true); // FORCE render with data
            }).catch(err => {
                console.warn('Theographic load failed:', err);
            });
            return; // Don't render yet, wait for data
        }

        // Load full data if user switches away from default tab (they're exploring)
        if (!this.fullDataLoaded && !this.fullDataLoading) {
            console.log('📥 User switched tabs - loading full dataset...');
            this.loadFullData();
        }

        this.renderCurrentVisualization();
    }

    loadFullData() {
        if (this.fullDataLoaded || this.fullDataLoading) return;

        this.fullDataLoading = true;
        console.log('📥 Loading full dataset (15MB)...');

        dataLoader.load().then(() => {
            console.log('✅ Full data loaded! Updating visualization...');
            this.fullDataLoaded = true;
            this.fullDataLoading = false;

            // Clear render cache - data upgraded from preview to full, need to re-render
            this.clearRenderCache();
            this.renderCurrentVisualization(true); // Force re-render with full data
        }).catch(err => {
            console.warn('Full data load failed, continuing with preview:', err);
            this.fullDataLoading = false;
            this.showPreviewOnlyBanner();
        });
    }

    async renderCurrentVisualization(forceRender = false) {
        const viz = this.visualizations[this.currentViz];

        // INSTANT TAB SWITCHING: Check render cache
        // If visualization already rendered and filters haven't changed, skip re-render
        if (!forceRender && this.renderedCache[this.currentViz]) {
            console.log(`⚡ INSTANT: ${this.currentViz} already rendered (using cache)`);
            return; // Don't re-render, visualization is already there!
        }

        if (viz && typeof viz.render === 'function') {
            console.log(`🔄 Rendering ${this.currentViz} visualization`);
            console.log(`📊 Visualization class: ${viz.constructor.name}`);
            console.log(`📐 Filters:`, this.filters);

            const renderStart = performance.now();
            await viz.render(this.filters); // AWAIT for async renders (timeline)
            const renderEnd = performance.now();
            console.log(`⚡ ${viz.constructor.name} rendered in ${(renderEnd - renderStart).toFixed(0)}ms`);

            // Mark as rendered in cache
            this.renderedCache[this.currentViz] = true;
        } else if (this.currentViz === 'stats') {
            const renderStart = performance.now();
            this.renderStats(this.filters);
            const renderEnd = performance.now();
            console.log(`⚡ Stats rendered in ${(renderEnd - renderStart).toFixed(0)}ms`);
            this.renderedCache[this.currentViz] = true;
        }
    }

    renderStats(filters = {}) {
        const stats = dataLoader.getComprehensiveStats();
        const statsContent = document.getElementById('stats-content');

        // Calculate connection breakdown
        const chapters = dataLoader.getChapters();
        let connections = dataLoader.getConnections();

        // Apply filters (testament, book, minConnections)
        const minConnections = filters.minConnections || 1;
        if (filters.testament && filters.testament !== 'all') {
            connections = dataLoader.filterConnectionsByTestament(filters.testament);
        }
        if (filters.book) {
            connections = dataLoader.filterConnectionsByBook(filters.book);
        }
        if (minConnections > 1) {
            connections = connections.filter(c => c.weight >= minConnections);
            console.log(`🔥 Stats: Filtering connections with weight >= ${minConnections}`);
        }

        let otToOt = 0, ntToNt = 0, crossTestament = 0;
        connections.forEach(conn => {
            const sourceTestament = chapters[conn.source].testament;
            const targetTestament = chapters[conn.target].testament;
            if (sourceTestament === 'OT' && targetTestament === 'OT') otToOt++;
            else if (sourceTestament === 'NT' && targetTestament === 'NT') ntToNt++;
            else crossTestament++;
        });

        // Top 5 books
        const bookConnections = {};
        connections.forEach(conn => {
            const sourceBook = chapters[conn.source].book;
            const targetBook = chapters[conn.target].book;
            if (!bookConnections[sourceBook]) bookConnections[sourceBook] = 0;
            if (!bookConnections[targetBook]) bookConnections[targetBook] = 0;
            bookConnections[sourceBook] += conn.weight;
            bookConnections[targetBook] += conn.weight;
        });

        const topBooks = Object.entries(bookConnections)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Filter indicator
        const filterActive = minConnections > 1 || (filters.testament && filters.testament !== 'all') || filters.book;
        const filterNote = filterActive ? `
            <div class="filter-indicator" style="background: rgba(255, 215, 0, 0.1); border: 1px solid #FFD700; padding: 10px; margin-bottom: 20px; border-radius: 8px; text-align: center;">
                <strong style="color: #FFD700;">Filters Active:</strong>
                ${minConnections > 1 ? `Min Connections ≥ ${minConnections}` : ''}
                ${filters.testament && filters.testament !== 'all' ? ` | Testament: ${filters.testament}` : ''}
                ${filters.book ? ` | Book: ${filters.book}` : ''}
                <br><span style="color: #888; font-size: 0.9em;">Showing ${connections.length.toLocaleString()} of ${dataLoader.getConnections().length.toLocaleString()} connections</span>
            </div>
        ` : '';

        statsContent.innerHTML = `
            <div class="stats-compact">
                ${filterNote}
                <!-- Key Numbers -->
                <div class="stats-summary">
                    <div class="summary-item">
                        <span class="summary-label">Cross-References</span>
                        <span class="summary-value">${stats.total_verse_references?.toLocaleString() || '344,799'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Chapter Connections</span>
                        <span class="summary-value">${connections.length.toLocaleString()}</span>
                        ${filterActive ? `<span class="summary-note" style="color: #FFD700; font-size: 0.8em;">(filtered)</span>` : `<span class="summary-note" style="color: #888; font-size: 0.8em;">(total)</span>`}
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Books</span>
                        <span class="summary-value">${stats.otBooks + stats.ntBooks || '66'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Chapters</span>
                        <span class="summary-value">${stats.totalChapters?.toLocaleString() || '1,189'}</span>
                    </div>
                </div>

                <!-- Testament Breakdown -->
                <div class="stats-row">
                    <h3>Testament Distribution</h3>
                    <div class="testament-bars">
                        <div class="bar-item">
                            <span class="bar-label">OT ↔ OT</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${(otToOt / connections.length * 100).toFixed(1)}%; background: #2ecc71;"></div>
                            </div>
                            <span class="bar-value">${((otToOt / connections.length) * 100).toFixed(1)}%</span>
                        </div>
                        <div class="bar-item">
                            <span class="bar-label">NT ↔ NT</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${(ntToNt / connections.length * 100).toFixed(1)}%; background: #00CED1;"></div>
                            </div>
                            <span class="bar-value">${((ntToNt / connections.length) * 100).toFixed(1)}%</span>
                        </div>
                        <div class="bar-item">
                            <span class="bar-label">OT ↔ NT</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${(crossTestament / connections.length * 100).toFixed(1)}%; background: #FFD700;"></div>
                            </div>
                            <span class="bar-value">${((crossTestament / connections.length) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <!-- Top Books -->
                <div class="stats-row">
                    <h3>Top 5 Connected Books</h3>
                    <div class="top-books-compact">
                        ${topBooks.map(([book, weight], i) => `
                            <div class="book-item">
                                <span class="book-rank">${i + 1}</span>
                                <span class="book-title">${book}</span>
                                <span class="book-count">${weight.toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Key Insights -->
                <div class="stats-row">
                    <h3>Key Insights</h3>
                    <div class="insights-grid">
                        <div class="insight-card">
                            <div class="insight-label">Most Connected</div>
                            <div class="insight-value">${stats.mostConnectedChapter?.chapter?.book || 'N/A'} ${stats.mostConnectedChapter?.chapter?.chapter || ''}</div>
                            <div class="insight-sub">${stats.mostConnectedChapter?.degree?.toLocaleString() || '0'} connections</div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-label">Strongest Link</div>
                            <div class="insight-value">${stats.strongestConnection?.weight || '0'} refs</div>
                            <div class="insight-sub">${stats.strongestConnection?.source?.book || ''} ↔ ${stats.strongestConnection?.target?.book || ''}</div>
                        </div>
                    </div>
                </div>

                <div class="stats-credit">
                    Data: Treasury of Scripture Knowledge • Created by Ringmast4r
                </div>
            </div>
        `;
    }

    resetFilters() {
        this.filters = {
            testament: 'all',
            book: '',
            minConnections: 1
        };

        document.getElementById('testament-filter').value = 'all';
        document.getElementById('book-select').value = '';
        document.getElementById('min-connections').value = '1';
        document.getElementById('min-value').textContent = '1';

        // Clear render cache - filters reset, need to re-render
        this.clearRenderCache();
        this.renderCurrentVisualization(true); // Force re-render with reset filters
    }

    /**
     * Clear render cache - forces all visualizations to re-render on next view
     * Call this when filters change or data updates
     */
    clearRenderCache() {
        Object.keys(this.renderedCache).forEach(key => {
            this.renderedCache[key] = false;
        });
        console.log('🗑️ Render cache cleared');
    }

    cycleTheme() {
        // Get current theme index and cycle to next
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        // Force re-render of current visualization to apply new colors
        this.clearRenderCache();
        this.renderCurrentVisualization(true);

        // Show notification
        const themeName = this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1);
        console.log(`🎨 Theme changed to: ${themeName}`);
    }

    exportCurrentVisualization() {
        const svgElement = document.querySelector(`#${this.currentViz}-svg`);
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `bible-${this.currentViz}-visualization.svg`;
        link.click();

        URL.revokeObjectURL(url);

        // Track export action
        if (window.BIBLE_TRACKER) {
            window.BIBLE_TRACKER.trackExport(this.currentViz, 'SVG');
        }
    }

    showPreviewOnlyBanner() {
        const banner = document.getElementById('preview-banner');
        if (!banner) return;

        banner.style.background = 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)';
        banner.innerHTML = `
            ℹ️ PREVIEW ONLY: Full dataset failed to load. Using top 200 connections.
            <button onclick="location.reload()" style="margin-left: 10px; padding: 4px 12px; border: none; border-radius: 4px; background: white; color: #1a1a2e; cursor: pointer; font-weight: bold;">Retry</button>
        `;
    }

    updateLoadingProgress(percent, message) {
        const progressBar = document.getElementById('loading-progress-bar');
        const progressText = document.getElementById('loading-progress-text');

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        if (progressText) {
            progressText.textContent = message;
        }
    }

    showLoading() {
        const container = document.querySelector('.viz-container');
        if (!container) {
            console.error('❌ FATAL: .viz-container element not found! Cannot show loading state.');
            console.error('📋 Available elements:', document.querySelectorAll('[class*="viz"]'));
            return;
        }

        console.log('⏳ Showing loading indicator...');

        // Create loading overlay (don't destroy existing content!)
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-medium);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        loadingOverlay.innerHTML = `
            <div class="loading" style="text-align: center; padding: 100px; color: #FFD700; font-size: 1.5rem;">
                <div style="font-size: 3rem; margin-bottom: 20px;">⏳</div>
                <div>Loading Bible Cross-Reference Data...</div>
                <div id="loading-progress-text" style="font-size: 1rem; color: #00CED1; margin-top: 10px;">
                    Initializing...
                </div>
                <div style="width: 80%; max-width: 400px; height: 20px; background: #333; border-radius: 10px; margin: 20px auto; overflow: hidden;">
                    <div id="loading-progress-bar" style="height: 100%; background: linear-gradient(90deg, #FFD700, #00CED1); width: 0%; transition: width 0.3s ease;"></div>
                </div>
                <div style="margin-top: 20px; color: #888; font-size: 0.9rem;">
                    <div style="animation: pulse 1.5s ease-in-out infinite;">Loading 340,000+ verse connections...</div>
                </div>
                <div style="margin-top: 15px; color: #666; font-size: 0.8rem;">
                    Using jsDelivr CDN for faster global delivery
                </div>
            </div>
        `;

        // Make container position relative so overlay works
        container.style.position = 'relative';
        container.appendChild(loadingOverlay);
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            console.log('✅ Removing loading overlay...');
            overlay.remove();
        }
    }

    showError(message) {
        const container = document.querySelector('.viz-container');
        if (!container) {
            console.error('❌ FATAL: .viz-container element not found! Cannot show error.');
            console.error('📋 Error message was:', message);
            alert(`ERROR: ${message}\n\nThe page structure is broken. Please check the browser console (F12) for details.`);
            return;
        }

        console.log('⚠️ Showing error message:', message);
        container.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; padding: 60px; max-width: 600px; margin: 0 auto;">
                <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
                <div style="font-size: 1.5rem; color: #FFD700; margin-bottom: 20px;">${message}</div>
                <div style="color: #b8b8d1; font-size: 1rem; line-height: 1.6;">
                    <p><strong>Possible issues:</strong></p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>Data files still deploying to GitHub Pages (wait 1-2 minutes)</li>
                        <li>Large file size (15MB) - may take time to load</li>
                        <li>Check browser console (F12) for detailed errors</li>
                        <li>JavaScript file missing or failed to load</li>
                    </ul>
                    <p style="margin-top: 20px;">
                        <button onclick="location.reload()" style="background: #FFD700; color: #1a1a2e; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1rem;">
                            Retry Loading
                        </button>
                    </p>
                    <p style="margin-top: 15px; font-size: 0.85rem;">
                        <a href="https://github.com/Ringmast4r/PROJECT-BIBLE-A-Proselytize-Project/issues" target="_blank" style="color: #00CED1;">Report this issue on GitHub</a>
                    </p>
                </div>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BibleVisualizer(); // Expose globally for color scheme changes
    window.app.init();

    // Add responsive window resize handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize events to avoid excessive re-rendering
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('🔄 Window resized - re-rendering visualization...');
            window.app.renderCurrentVisualization();
        }, 250); // Wait 250ms after user stops resizing
    });
});
