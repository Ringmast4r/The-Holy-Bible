// Photo Gallery Visualization
// Displays 1,650+ biblical location photos with filtering and lightbox

class PhotoGallery {
    constructor(containerId) {
        this.containerId = containerId;
        this.photos = [];
        this.filteredPhotos = [];
        this.currentFilter = {
            search: '',
            testament: 'all'
        };
        this.lightboxOpen = false;
        this.currentPhotoIndex = 0;
    }

    async loadPhotoMetadata() {
        try {
            console.log('📷 Loading photo metadata from image.jsonl...');
            const startTime = performance.now();

            const response = await fetch('data/geocoding/image.jsonl');
            const text = await response.text();

            // Parse JSON Lines format (one JSON object per line)
            const lines = text.trim().split('\n');
            const photoData = lines.map(line => JSON.parse(line));

            console.log(`✅ Loaded ${photoData.length} photo entries in ${(performance.now() - startTime).toFixed(0)}ms`);

            // Flatten thumbnails into individual photo objects
            this.photos = [];
            photoData.forEach(photoEntry => {
                if (photoEntry.thumbnails) {
                    Object.entries(photoEntry.thumbnails).forEach(([locationId, thumbData]) => {
                        this.photos.push({
                            id: photoEntry.id,
                            locationId: locationId,
                            filename: thumbData.file,
                            description: thumbData.description || photoEntry.descriptions?.[locationId] || 'Biblical location',
                            author: photoEntry.author,
                            credit: photoEntry.credit,
                            creditUrl: photoEntry.credit_url,
                            license: photoEntry.license,
                            fileUrl: photoEntry.file_url,
                            url: photoEntry.url,
                            width: photoEntry.width,
                            height: photoEntry.height,
                            placeholder: thumbData.placeholder,
                            edits: thumbData.edits || []
                        });
                    });
                }
            });

            console.log(`📸 Processed ${this.photos.length} individual photo thumbnails`);
            this.filteredPhotos = [...this.photos];

            return true;
        } catch (error) {
            console.error('Error loading photo metadata:', error);
            throw error;
        }
    }

    async render(filters = {}) {
        const container = document.getElementById(this.containerId);
        container.innerHTML = '';

        // Load metadata if not already loaded
        if (this.photos.length === 0) {
            await this.loadPhotoMetadata();
        }

        // Apply filters
        if (filters.search !== undefined) this.currentFilter.search = filters.search;
        if (filters.testament !== undefined) this.currentFilter.testament = filters.testament;

        this.applyFilters();

        // Create UI
        this.createHeader(container);
        this.createSearchBar(container);
        this.createPhotoGrid(container);
        this.createLightbox(container);

        console.log(`📷 Rendered ${this.filteredPhotos.length} photos`);
    }

    createHeader(container) {
        const header = document.createElement('div');
        header.className = 'photo-gallery-header';
        header.style.cssText = `
            padding: 20px;
            text-align: center;
            color: #FFD700;
        `;

        header.innerHTML = `
            <h2 style="margin: 0; font-size: 24px; color: #FFD700;">Biblical Location Photos</h2>
            <p style="margin: 10px 0; color: #00CED1; font-size: 14px;">
                ${this.photos.length} photos of biblical places from Wikimedia Commons
            </p>
        `;

        container.appendChild(header);
    }

    createSearchBar(container) {
        const searchBar = document.createElement('div');
        searchBar.className = 'photo-search-bar';
        searchBar.style.cssText = `
            padding: 0 20px 20px 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        `;

        searchBar.innerHTML = `
            <input
                type="text"
                id="photo-search-input"
                placeholder="Search locations..."
                value="${this.currentFilter.search}"
                style="
                    padding: 10px;
                    border: 1px solid #00CED1;
                    background: #16213e;
                    color: #00CED1;
                    border-radius: 5px;
                    min-width: 300px;
                    font-size: 14px;
                "
            />
            <div style="display: flex; gap: 5px;">
                <button class="filter-btn" data-filter="all"
                    style="padding: 10px 15px; background: ${this.currentFilter.testament === 'all' ? '#FFD700' : '#16213e'};
                    color: ${this.currentFilter.testament === 'all' ? '#1a1a2e' : '#00CED1'}; border: 1px solid #00CED1;
                    border-radius: 5px; cursor: pointer; font-weight: bold;">
                    All (${this.photos.length})
                </button>
            </div>
            <div style="color: #00CED1; padding: 10px;">
                Showing ${this.filteredPhotos.length} photos
            </div>
        `;

        container.appendChild(searchBar);

        // Add event listeners
        const searchInput = searchBar.querySelector('#photo-search-input');
        searchInput.addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.applyFilters();
            this.refreshGrid();
        });

        searchBar.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter.testament = e.target.dataset.filter;
                this.applyFilters();
                this.refreshGrid();
                // Update active button styling
                searchBar.querySelectorAll('.filter-btn').forEach(b => {
                    b.style.background = '#16213e';
                    b.style.color = '#00CED1';
                });
                e.target.style.background = '#FFD700';
                e.target.style.color = '#1a1a2e';
            });
        });
    }

    createPhotoGrid(container) {
        const grid = document.createElement('div');
        grid.className = 'photo-grid';
        grid.id = 'photo-grid-container';
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            padding: 0 20px 20px 20px;
            max-height: 600px;
            overflow-y: auto;
        `;

        this.filteredPhotos.forEach((photo, index) => {
            const photoCard = this.createPhotoCard(photo, index);
            grid.appendChild(photoCard);
        });

        if (this.filteredPhotos.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #00CED1;">
                    No photos found matching your search.
                </div>
            `;
        }

        container.appendChild(grid);
    }

    createPhotoCard(photo, index) {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.style.cssText = `
            background: #16213e;
            border: 1px solid #00CED1;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        `;

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 4px 20px rgba(0, 206, 209, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = 'none';
        });

        card.addEventListener('click', () => {
            this.openLightbox(index);
        });

        // Extract location name from description (strip ALL HTML tags)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = photo.description || '';
        const locationName = tempDiv.textContent.trim() || 'Biblical Location';

        // Create image container
        const imageDiv = document.createElement('div');
        imageDiv.style.position = 'relative';
        imageDiv.style.paddingBottom = '100%';
        imageDiv.style.background = '#16213e';
        imageDiv.style.overflow = 'hidden';

        // Create and append image element
        const img = document.createElement('img');
        img.src = `data/photos/locations/${photo.filename}`;
        img.alt = locationName;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        img.onerror = function() {
            this.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.style.position = 'absolute';
            fallback.style.top = '50%';
            fallback.style.left = '50%';
            fallback.style.transform = 'translate(-50%, -50%)';
            fallback.style.color = '#00CED1';
            fallback.style.textAlign = 'center';
            fallback.innerHTML = '<div style="font-size: 40px;">📷</div><div style="font-size: 12px; margin-top: 10px;">Image Not Found</div>';
            this.parentElement.appendChild(fallback);
        };

        imageDiv.appendChild(img);
        card.appendChild(imageDiv);

        // Add text info below
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'padding: 10px;';
        infoDiv.innerHTML = `
            <div style="color: #FFD700; font-weight: bold; font-size: 12px; margin-bottom: 5px;">
                ${locationName}
            </div>
            <div style="color: #00CED1; font-size: 11px; line-height: 1.3;">
                📷 ${photo.author || 'Unknown'}
            </div>
        `;
        card.appendChild(infoDiv);

        return card;
    }

    createLightbox(container) {
        const lightbox = document.createElement('div');
        lightbox.id = 'photo-lightbox';
        lightbox.className = 'photo-lightbox';
        lightbox.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            padding: 20px;
            overflow-y: auto;
        `;

        lightbox.innerHTML = `
            <div style="
                position: relative;
                max-width: 1200px;
                margin: 0 auto;
                padding-bottom: 40px;
            ">
                <button id="lightbox-close" style="
                    position: fixed;
                    top: 30px;
                    right: 30px;
                    background: #FFD700;
                    color: #1a1a2e;
                    border: none;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 10001;
                ">&times;</button>

                <button id="lightbox-prev" style="
                    position: fixed;
                    left: 30px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #00CED1;
                    color: #1a1a2e;
                    border: none;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                ">‹</button>

                <button id="lightbox-next" style="
                    position: fixed;
                    right: 30px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #00CED1;
                    color: #1a1a2e;
                    border: none;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                ">›</button>

                <div id="lightbox-image-container" style="
                    width: 100%;
                    margin-bottom: 20px;
                    text-align: center;
                ">
                    <img id="lightbox-image" style="
                        width: 100%;
                        height: auto;
                        border-radius: 8px;
                    " />
                </div>

                <div id="lightbox-info" style="
                    background: #16213e;
                    padding: 20px;
                    border-radius: 8px;
                    color: #00CED1;
                ">
                    <!-- Info populated dynamically -->
                </div>
            </div>
        `;

        container.appendChild(lightbox);

        // Add event listeners
        lightbox.querySelector('#lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.querySelector('#lightbox-prev').addEventListener('click', () => this.navigateLightbox(-1));
        lightbox.querySelector('#lightbox-next').addEventListener('click', () => this.navigateLightbox(1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightboxOpen) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
                if (e.key === 'ArrowRight') this.navigateLightbox(1);
            }
        });
    }

    openLightbox(photoIndex) {
        this.currentPhotoIndex = photoIndex;
        this.lightboxOpen = true;

        const lightbox = document.getElementById('photo-lightbox');
        const photo = this.filteredPhotos[photoIndex];

        // Load full-resolution image from Wikimedia (or local thumbnail for satellite images)
        const img = lightbox.querySelector('#lightbox-image');
        img.src = photo.fileUrl || `data/photos/locations/${photo.filename}`;

        // Update info
        const locationMatch = photo.description.match(/>([^<]+)</);
        const locationName = locationMatch ? locationMatch[1] : 'Biblical Location';

        const info = lightbox.querySelector('#lightbox-info');

        // Build metadata rows (some fields missing for satellite images)
        let metadataRows = '';
        if (photo.author) {
            metadataRows += `<strong>Photographer:</strong> <span>${photo.author}</span>`;
        }
        if (photo.license) {
            metadataRows += `<strong>License:</strong> <span>${photo.license}</span>`;
        }
        if (photo.credit) {
            metadataRows += `<strong>Credit:</strong> <span>${photo.credit}</span>`;
        }
        if (photo.width && photo.height) {
            metadataRows += `<strong>Dimensions:</strong> <span>${photo.width} × ${photo.height} pixels</span>`;
        }
        if (photo.url) {
            metadataRows += `<strong>Source:</strong> <a href="${photo.url}" target="_blank" style="color: #00CED1;">Wikimedia Commons</a>`;
        }

        info.innerHTML = `
            <h3 style="color: #FFD700; margin-top: 0;">${locationName}</h3>
            <p style="margin: 10px 0;">${photo.description || 'Biblical location'}</p>
            ${metadataRows ? `<div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 13px; margin-top: 15px;">${metadataRows}</div>` : ''}
            <div style="margin-top: 15px; font-size: 12px; color: #888;">
                Photo ${photoIndex + 1} of ${this.filteredPhotos.length}
            </div>
        `;

        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('photo-lightbox');
        lightbox.style.display = 'none';
        this.lightboxOpen = false;
        document.body.style.overflow = '';
    }

    navigateLightbox(direction) {
        this.currentPhotoIndex += direction;

        // Wrap around
        if (this.currentPhotoIndex < 0) {
            this.currentPhotoIndex = this.filteredPhotos.length - 1;
        } else if (this.currentPhotoIndex >= this.filteredPhotos.length) {
            this.currentPhotoIndex = 0;
        }

        this.openLightbox(this.currentPhotoIndex);
    }

    applyFilters() {
        this.filteredPhotos = this.photos.filter(photo => {
            // Search filter
            if (this.currentFilter.search) {
                const searchLower = this.currentFilter.search.toLowerCase();
                const descLower = photo.description.toLowerCase();
                const authorLower = photo.author.toLowerCase();

                if (!descLower.includes(searchLower) && !authorLower.includes(searchLower)) {
                    return false;
                }
            }

            // Testament filter (could be enhanced with actual place data)
            // For now, "all" shows everything
            if (this.currentFilter.testament !== 'all') {
                // TODO: Cross-reference with places.json to filter by testament
            }

            return true;
        });
    }

    refreshGrid() {
        const gridContainer = document.getElementById('photo-grid-container');
        if (gridContainer) {
            // Update count
            const countDisplay = document.querySelector('.photo-search-bar div:last-child');
            if (countDisplay) {
                countDisplay.textContent = `Showing ${this.filteredPhotos.length} photos`;
            }

            // Rebuild grid
            gridContainer.innerHTML = '';
            this.filteredPhotos.forEach((photo, index) => {
                const photoCard = this.createPhotoCard(photo, index);
                gridContainer.appendChild(photoCard);
            });

            if (this.filteredPhotos.length === 0) {
                gridContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #00CED1;">
                        No photos found matching your search.
                    </div>
                `;
            }
        }
    }
}
