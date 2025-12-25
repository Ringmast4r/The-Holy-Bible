/**
 * Bible Dictionary Modal System
 * Uses Easton's Bible Dictionary for place names, people, and terms
 * Provides clickable lookups across all visualizations
 */

class BibleDictionary {
    constructor() {
        this.dictionaryData = null;
        this.loading = false;
        this.loaded = false;
        this.modal = null;
        console.log('📚 BibleDictionary initialized');

        // Create modal on initialization
        this.createModal();
    }

    /**
     * Load Easton's Bible Dictionary data
     */
    async load() {
        if (this.loaded) {
            console.log('📚 Dictionary data already loaded');
            return this.dictionaryData;
        }

        if (this.loading) {
            console.log('📚 Dictionary data already loading, waiting...');
            while (this.loading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.dictionaryData;
        }

        try {
            this.loading = true;
            console.log('📚 Loading Easton\'s Bible Dictionary...');
            const startTime = performance.now();

            const response = await fetch('data/easton.json');
            const data = await response.json();

            this.dictionaryData = data;

            // Build search index for fuzzy matching
            this.buildSearchIndex();

            const loadTime = (performance.now() - startTime).toFixed(2);
            console.log(`✅ Loaded ${Object.keys(this.dictionaryData).length} dictionary entries in ${loadTime}ms`);

            this.loaded = true;
            this.loading = false;
            return this.dictionaryData;

        } catch (error) {
            console.error('❌ Failed to load dictionary data:', error);
            this.loading = false;
            throw error;
        }
    }

    /**
     * Build search index for fuzzy matching
     */
    buildSearchIndex() {
        console.log('🔨 Building dictionary search index...');
        const startTime = performance.now();

        this.searchIndex = new Map();

        for (const [term, definition] of Object.entries(this.dictionaryData)) {
            // Store by exact term
            this.searchIndex.set(term.toLowerCase(), { term, definition });

            // Also store common variations
            const normalized = this.normalizeTerm(term);
            if (normalized !== term.toLowerCase()) {
                this.searchIndex.set(normalized, { term, definition });
            }
        }

        const indexTime = (performance.now() - startTime).toFixed(2);
        console.log(`✅ Indexed ${this.searchIndex.size} searchable terms in ${indexTime}ms`);
    }

    /**
     * Normalize term for fuzzy matching
     */
    normalizeTerm(term) {
        return term
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ')    // Normalize spaces
            .trim();
    }

    /**
     * Lookup dictionary entry (fuzzy matching)
     */
    lookup(searchTerm) {
        if (!this.loaded) {
            console.warn('⚠️ Dictionary not loaded yet');
            return null;
        }

        const normalized = this.normalizeTerm(searchTerm);

        // Try exact match first
        let result = this.searchIndex.get(normalized);
        if (result) return result;

        // Try partial matches
        for (const [key, value] of this.searchIndex.entries()) {
            if (key.includes(normalized) || normalized.includes(key)) {
                return value;
            }
        }

        return null;
    }

    /**
     * Create modal overlay
     */
    createModal() {
        // Remove existing modal if any
        const existing = document.getElementById('bible-dictionary-modal');
        if (existing) {
            existing.remove();
        }

        // Create modal HTML
        const modalHTML = `
            <div id="bible-dictionary-modal" class="dictionary-modal">
                <div class="dictionary-modal-overlay"></div>
                <div class="dictionary-modal-content">
                    <div class="dictionary-modal-header">
                        <h2 id="dictionary-modal-title">📚 Bible Dictionary</h2>
                        <button class="dictionary-modal-close">&times;</button>
                    </div>
                    <div class="dictionary-modal-body" id="dictionary-modal-body">
                        <p>Loading...</p>
                    </div>
                    <div class="dictionary-modal-footer">
                        <small>Source: Easton's Bible Dictionary (1897)</small>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get modal elements
        this.modal = document.getElementById('bible-dictionary-modal');
        this.modalTitle = document.getElementById('dictionary-modal-title');
        this.modalBody = document.getElementById('dictionary-modal-body');

        // Set up event listeners
        this.setupModalEvents();

        console.log('✅ Dictionary modal created');
    }

    /**
     * Set up modal event listeners
     */
    setupModalEvents() {
        // Close button
        const closeBtn = this.modal.querySelector('.dictionary-modal-close');
        closeBtn.addEventListener('click', () => this.hide());

        // Click overlay to close
        const overlay = this.modal.querySelector('.dictionary-modal-overlay');
        overlay.addEventListener('click', () => this.hide());

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hide();
            }
        });
    }

    /**
     * Show dictionary entry in modal
     */
    async show(searchTerm) {
        console.log(`📚 Looking up: "${searchTerm}"`);

        // Load dictionary if not loaded
        if (!this.loaded) {
            this.modalTitle.textContent = 'Loading dictionary...';
            this.modalBody.innerHTML = '<div class="dictionary-loading">Loading Easton\'s Bible Dictionary...</div>';
            this.modal.classList.add('active');

            try {
                await this.load();
            } catch (error) {
                this.modalBody.innerHTML = `
                    <div class="dictionary-error">
                        <h3>❌ Failed to load dictionary</h3>
                        <p>${error.message}</p>
                    </div>
                `;
                return;
            }
        }

        // Lookup entry
        const result = this.lookup(searchTerm);

        if (result) {
            this.modalTitle.textContent = `📚 ${result.term}`;
            this.modalBody.innerHTML = `
                <div class="dictionary-entry">
                    ${result.definition}
                </div>
            `;
        } else {
            this.modalTitle.textContent = '📚 Not Found';
            this.modalBody.innerHTML = `
                <div class="dictionary-not-found">
                    <h3>No dictionary entry found for "${searchTerm}"</h3>
                    <p>This term may not be in Easton's Bible Dictionary, or it may be spelled differently.</p>
                    <p>Try searching for related terms or check the spelling.</p>
                </div>
            `;
        }

        // Show modal
        this.modal.classList.add('active');

        // Focus on modal for keyboard navigation
        this.modal.focus();
    }

    /**
     * Hide modal
     */
    hide() {
        this.modal.classList.remove('active');
    }

    /**
     * Search dictionary (returns multiple results)
     */
    searchAll(searchTerm, maxResults = 10) {
        if (!this.loaded) {
            console.warn('⚠️ Dictionary not loaded yet');
            return [];
        }

        const normalized = this.normalizeTerm(searchTerm);
        const results = [];

        for (const [key, value] of this.searchIndex.entries()) {
            if (key.includes(normalized)) {
                results.push(value);
                if (results.length >= maxResults) break;
            }
        }

        return results;
    }

    /**
     * Get random entry (for "Random" feature)
     */
    getRandomEntry() {
        if (!this.loaded) {
            console.warn('⚠️ Dictionary not loaded yet');
            return null;
        }

        const entries = Array.from(this.searchIndex.values());
        const randomIndex = Math.floor(Math.random() * entries.length);
        return entries[randomIndex];
    }
}

// Create global singleton instance
window.bibleDictionary = new BibleDictionary();

// Helper function for easy lookups from anywhere
window.showDictionaryEntry = function(term) {
    window.bibleDictionary.show(term);
};

// Global function to show photos for a specific location
window.showLocationPhotos = function(locationId, locationName) {
    console.log('📷 Opening photos for location:', locationId, locationName);

    // Load photo metadata if not already loaded
    if (!window.photoGalleryInstance) {
        console.error('❌ Photo gallery not initialized');
        alert('Photo gallery is not loaded. Please visit the Photos tab first.');
        return;
    }

    // Filter photos for this location
    const locationPhotos = window.photoGalleryInstance.photos.filter(photo =>
        photo.locationId === locationId
    );

    if (locationPhotos.length === 0) {
        alert(`No photos available for ${locationName}`);
        return;
    }

    // Open lightbox with first photo from this location
    const firstPhotoIndex = window.photoGalleryInstance.photos.findIndex(p =>
        p.locationId === locationId
    );

    if (firstPhotoIndex >= 0) {
        window.photoGalleryInstance.openLightbox(firstPhotoIndex);
    }
};
