// Geographic Map Visualization
// Real OpenStreetMap showing 1,600+ biblical places with GPS coordinates

class GeographicMap {
    constructor(containerId, tooltipId) {
        this.containerId = containerId;
        this.tooltipId = tooltipId;
        this.map = null;
        this.markers = [];
        this.currentLayer = null;
        this.mapLayers = this.initializeMapLayers();
    }

    initializeMapLayers() {
        return {
            // FREE MAPS (No API Key Required) - Top of Menu
            'National Geographic': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri NatGeo',
                    maxZoom: 16
                })
            },
            'Ancient Terrain': {
                layer: null,
                init: () => L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    attribution: 'OpenTopoMap',
                    maxZoom: 17,
                    subdomains: 'abc'
                })
            },
            'Satellite': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Satellite',
                    maxZoom: 18
                })
            },
            'Physical Map': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Physical',
                    maxZoom: 8
                })
            },
            'Shaded Relief': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Relief',
                    maxZoom: 13
                })
            },
            'Ocean Base': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Ocean',
                    maxZoom: 13
                })
            },
            'Topo Map': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Topo',
                    maxZoom: 19
                })
            },
            'Street Map': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Streets',
                    maxZoom: 19
                })
            },
            'Dark Canvas': {
                layer: null,
                init: () => L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: 'CartoDB Dark',
                    maxZoom: 19
                })
            },
            'Light Canvas': {
                layer: null,
                init: () => L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: 'CartoDB Light',
                    maxZoom: 19
                })
            },
            'Voyager': {
                layer: null,
                init: () => L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    attribution: 'CartoDB Voyager',
                    maxZoom: 19
                })
            },
            'OpenStreetMap': {
                layer: null,
                init: () => L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'OpenStreetMap',
                    maxZoom: 19
                })
            },
            'Terrain Labels': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Terrain',
                    maxZoom: 13
                })
            },
            'Gray Canvas': {
                layer: null,
                init: () => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Esri Gray',
                    maxZoom: 16
                })
            },

            // STADIA MAPS (Require API Key) - Bottom of Menu
            'Watercolor': {
                layer: null,
                init: () => {
                    // Create layer group with watercolor tiles + labels overlay
                    const watercolorTiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                        attribution: 'Stamen Watercolor',
                        maxZoom: 16
                    });

                    // Add country/place labels overlay on top
                    const labelsOverlay = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}.png?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                        attribution: 'Labels',
                        maxZoom: 16,
                        opacity: 0.9
                    });

                    return L.layerGroup([watercolorTiles, labelsOverlay]);
                }
            },
            'Toner': {
                layer: null,
                init: () => L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                    attribution: 'Stamen Toner',
                    maxZoom: 18
                })
            },
            'Stamen Terrain': {
                layer: null,
                init: () => L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                    attribution: 'Stamen Terrain',
                    maxZoom: 18
                })
            },
            'Alidade Smooth': {
                layer: null,
                init: () => L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                    attribution: 'Stadia Alidade Smooth',
                    maxZoom: 20
                })
            },
            'Alidade Smooth Dark': {
                layer: null,
                init: () => L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                    attribution: 'Stadia Alidade Dark',
                    maxZoom: 20
                })
            },
            'Alidade Satellite': {
                layer: null,
                init: () => L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                    attribution: 'Stadia Satellite',
                    maxZoom: 20
                })
            },
            'Outdoors': {
                layer: null,
                init: () => L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                    attribution: 'Stadia Outdoors',
                    maxZoom: 20
                })
            },
            'OSM Bright': {
                layer: null,
                init: () => L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png?api_key=45d84ab2-ae92-4ff6-98a0-18ef16aa06ea', {
                    attribution: 'Stadia OSM Bright',
                    maxZoom: 20
                })
            }
        };
    }

    async render(filters = {}) {
        const container = document.getElementById(this.containerId);

        // Clear container
        container.innerHTML = '';

        // Check if theographic data is loaded - if not, load it NOW
        if (!theographicLoader || !theographicLoader.isLoaded) {
            this.showLoading(container);

            // Actually trigger the load!
            try {
                await theographicLoader.load('data/');
                console.log('✅ Theographic loaded! Rendering geomap');
                // Recursively call render again now that data is loaded
                return this.render(filters);
            } catch (error) {
                console.error('❌ Failed to load theographic data:', error);
                this.showError(container, 'Failed to load geographic data');
                return;
            }
        }

        let places = theographicLoader.getPlacesWithCoordinates();
        if (!places || places.length === 0) {
            this.showError(container, 'No geographic data available');
            return;
        }

        // Apply minConnections filter (interpreted as minimum verse mentions)
        const minConnections = filters.minConnections || 1;
        const originalCount = places.length;

        if (minConnections > 1) {
            places = places.filter(p => (p.fields?.verseCount || 0) >= minConnections);
            console.log(`🗺️ Geographic Map: Filtering places with >= ${minConnections} verse mentions | Showing ${places.length} of ${originalCount} places`);
        }

        // Check if we have places after filtering
        if (places.length === 0) {
            this.showError(container, `No places found with >= ${minConnections} verse mentions. Try lowering the slider.`);
            return;
        }

        // Initialize Leaflet map (or reset if already exists)
        if (this.map) {
            this.map.remove(); // Remove existing map
        }

        // Create Leaflet map centered on Middle East
        this.map = L.map(this.containerId, {
            center: [31.5, 35.0], // Israel/Palestine
            zoom: 6,
            minZoom: 2,
            maxZoom: 19,
            zoomControl: true
        });

        // Initialize first layer (National Geographic - no API key needed)
        this.currentLayer = this.mapLayers['National Geographic'].init();
        this.currentLayer.addTo(this.map);

        // Add hamburger menu for map style selection
        this.addMapStyleMenu();

        // Add legend for place types
        this.addLegend();

        // Add markers for biblical places
        this.addPlaceMarkers(places, filters);

        // Add controls explanation
        this.addControlsInfo(container, places.length, originalCount, minConnections);

        console.log(`✅ Leaflet map rendered with ${places.length} biblical places`);
    }

    addMapStyleMenu() {
        // Create hamburger menu control
        const mapStyleControl = L.control({ position: 'topright' });

        mapStyleControl.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control map-style-control');
            div.innerHTML = `
                <button class="map-style-toggle" title="Change Map Style">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div class="map-style-panel" style="display: none;">
                    ${Object.keys(this.mapLayers).map(styleName => `
                        <div class="map-style-option" data-style="${styleName}">
                            ${styleName}
                        </div>
                    `).join('')}
                </div>
            `;

            // Toggle menu
            const toggle = div.querySelector('.map-style-toggle');
            const panel = div.querySelector('.map-style-panel');

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!div.contains(e.target)) {
                    panel.style.display = 'none';
                }
            });

            // Layer switching
            div.querySelectorAll('.map-style-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const styleName = e.target.dataset.style;
                    this.switchMapStyle(styleName);
                    panel.style.display = 'none';
                });
            });

            // Prevent map clicks and scrolling when interacting with menu
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(panel);

            return div;
        };

        mapStyleControl.addTo(this.map);

        // Add CSS for menu
        this.addMapStyleCSS();
    }

    switchMapStyle(styleName) {
        if (this.currentLayer) {
            this.map.removeLayer(this.currentLayer);
        }

        // Initialize layer if not already done
        if (!this.mapLayers[styleName].layer) {
            this.mapLayers[styleName].layer = this.mapLayers[styleName].init();
        }

        this.currentLayer = this.mapLayers[styleName].layer;
        this.currentLayer.addTo(this.map);

        console.log(`🗺️ Switched to map style: ${styleName}`);
    }

    addMapStyleCSS() {
        if (document.getElementById('map-style-css')) return;

        const style = document.createElement('style');
        style.id = 'map-style-css';
        style.textContent = `
            .map-style-control {
                background: white;
                border-radius: 4px;
                box-shadow: 0 1px 5px rgba(0,0,0,0.4);
            }

            .map-style-toggle {
                width: 30px;
                height: 30px;
                background: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }

            .map-style-toggle:hover {
                background: #f4f4f4;
            }

            .map-style-panel {
                position: absolute;
                top: 0;
                right: 40px;
                background: white;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                min-width: 150px;
                max-height: 500px;
                overflow-y: auto;
                z-index: 10000;
            }

            .map-style-option {
                padding: 10px 15px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                font-size: 14px;
            }

            .map-style-option:last-child {
                border-bottom: none;
            }

            .map-style-option:hover {
                background: #f0f0f0;
            }
        `;
        document.head.appendChild(style);
    }

    addLegend() {
        const legend = L.control({ position: 'bottomleft' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML = `
                <div style="background: rgba(255, 255, 255, 0.9); padding: 10px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-family: Arial, sans-serif; font-size: 12px;">
                    <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">Place Types</div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 14px; height: 14px; background: #FF4444; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(255,68,68,0.5);"></div>
                        <span>Cities</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 14px; height: 14px; background: #4444FF; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(68,68,255,0.5);"></div>
                        <span>Regions</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 14px; height: 14px; background: #00DDFF; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(0,221,255,0.5);"></div>
                        <span>Water</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 14px; height: 14px; background: #AA44FF; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(170,68,255,0.5);"></div>
                        <span>Mountains</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 14px; height: 14px; background: #00AAFF; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(0,170,255,0.5);"></div>
                        <span>Rivers</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 14px; height: 14px; background: #88FF44; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(136,255,68,0.5);"></div>
                        <span>Valleys</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 14px; height: 14px; background: #FFAA44; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(255,170,68,0.5);"></div>
                        <span>Deserts</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div style="width: 14px; height: 14px; background: #FFD700; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 0 4px rgba(255,215,0,0.5);"></div>
                        <span>Other</span>
                    </div>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">
                        <em>Size = Verse mentions</em>
                    </div>
                </div>
            `;
            return div;
        };

        legend.addTo(this.map);
    }

    addPlaceMarkers(places, filters) {
        console.log('🗺️ [GeoMap Debug] addPlaceMarkers called');
        console.log(`🗺️ [GeoMap Debug] Total places passed: ${places.length}`);

        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        let validCoordinates = 0;
        let invalidCoordinates = 0;
        let markersCreated = 0;

        // DEBUG: Show full structure of first place
        if (places.length > 0) {
            console.log('🗺️ [GeoMap Debug] FULL FIRST PLACE OBJECT:', places[0]);
            console.log('🗺️ [GeoMap Debug] First place keys:', Object.keys(places[0]));
            if (places[0].fields) {
                console.log('🗺️ [GeoMap Debug] First place.fields keys:', Object.keys(places[0].fields));
            }
        }

        // Add circle marker for each place (ancient map style - no pins)
        places.forEach((place, index) => {
            // FIXED: Use correct property names (latitude/longitude, not lat/lon)
            const latitude = place.fields?.latitude;
            const longitude = place.fields?.longitude;
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            // Debug first 5 places with ACTUAL VALUES
            if (index < 5) {
                console.log(`🗺️ [GeoMap Debug] Place ${index}:`, {
                    name: place.fields?.name,
                    latitude: latitude,
                    longitude: longitude,
                    lat: lat,
                    lon: lon,
                    isValid: !isNaN(lat) && !isNaN(lon)
                });
            }

            if (!isNaN(lat) && !isNaN(lon)) {
                validCoordinates++;
                // Get name from multiple possible fields
                const name = place.fields?.displayTitle || place.fields?.kjvName || place.fields?.esvName || place.fields?.name || 'Unknown Place';
                const verseCount = place.fields?.verseCount || 0;
                const description = place.fields?.description || 'Biblical location';

                // Colorful markers based on place type with size based on importance
                const size = Math.min(20, 10 + Math.log(verseCount + 1) * 2); // Bigger for visibility
                const featureType = place.fields?.featureType || 'Unknown';

                // Bright vibrant colors by type
                const colorMap = {
                    'City': '#FF4444',        // Bright red for cities
                    'Region': '#4444FF',      // Bright blue for regions
                    'Water': '#00DDFF',       // Cyan for water
                    'Mountain': '#AA44FF',    // Purple for mountains
                    'River': '#00AAFF',       // Blue for rivers
                    'Valley': '#88FF44',      // Lime green for valleys
                    'Desert': '#FFAA44',      // Orange for deserts
                    'Unknown': '#FFD700'      // Gold for unknown
                };

                const color = colorMap[featureType] || '#FFD700';

                const icon = L.divIcon({
                    className: 'biblical-place-marker',
                    html: `<div style="width: ${size}px; height: ${size}px; background: ${color}; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 12px ${color}; cursor: pointer; opacity: 0.9;"></div>`,
                    iconSize: [size, size],
                    iconAnchor: [size/2, size/2]
                });

                const marker = L.marker([lat, lon], {
                    icon: icon,
                    zIndexOffset: 1000
                }).addTo(this.map);

                markersCreated++;

                // Debug first marker
                if (markersCreated === 1) {
                    console.log('🗺️ [GeoMap Debug] First marker created:', {
                        name: name,
                        coordinates: [lat, lon],
                        options: marker.options
                    });
                }
                // Create popup content (ancient manuscript style with dictionary link)
                const popupContent = `
                    <div style="font-family: 'Georgia', serif; background: #F4E8D0; padding: 8px; border: 2px solid #8B4513; border-radius: 4px;">
                        <h3 style="margin: 0 0 8px 0; color: #8B4513; font-size: 16px; font-weight: bold;">${name}</h3>
                        <p style="margin: 4px 0; color: #654321; font-size: 12px;">
                            <strong>Verses:</strong> ${verseCount}
                        </p>
                        <p style="margin: 4px 0; color: #654321; font-size: 11px; font-style: italic;">
                            ${description}
                        </p>
                        <p style="margin: 6px 0; display: flex; flex-direction: column; gap: 4px;">
                            <a href="#" onclick="window.showDictionaryEntry('${name.replace(/'/g, "\\'")}'); return false;"
                               style="color: #8B4513; text-decoration: underline; font-weight: bold; font-size: 12px;">
                                📚 View in Dictionary
                            </a>
                            <a href="#" onclick="window.showLocationPhotos('${place.id}', '${name.replace(/'/g, "\\'")}'); return false;"
                               style="color: #8B4513; text-decoration: underline; font-weight: bold; font-size: 12px;">
                                📷 View Photos
                            </a>
                        </p>
                        <p style="margin: 4px 0; color: #888; font-size: 10px;">
                            ${lat.toFixed(4)}, ${lon.toFixed(4)}
                        </p>
                    </div>
                `;

                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    className: 'biblical-place-popup'
                });

                // Tooltip on hover (just the name)
                marker.bindTooltip(name, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10]
                });

                this.markers.push(marker);
            } else {
                invalidCoordinates++;
            }
        });

        // Debug summary
        console.log('🗺️ [GeoMap Debug] Marker creation summary:', {
            totalPlaces: places.length,
            validCoordinates: validCoordinates,
            invalidCoordinates: invalidCoordinates,
            markersCreated: markersCreated,
            markersInArray: this.markers.length
        });

        // Fit map to show all markers
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            const bounds = group.getBounds();
            console.log('🗺️ [GeoMap Debug] Fitting to bounds:', bounds);
            this.map.fitBounds(bounds.pad(0.1));
        } else {
            console.warn('🗺️ [GeoMap Debug] NO MARKERS to fit! This is why nothing shows.');
        }
    }

    addControlsInfo(container, filteredCount, originalCount, minConnections) {
        // Add instruction text above map
        const filterActive = minConnections > 1;
        let infoText = `🗺️ Showing ${filteredCount.toLocaleString()} biblical places`;

        if (filterActive) {
            infoText += ` with ≥ ${minConnections} verse mentions (filtered from ${originalCount.toLocaleString()})`;
        }

        infoText += ' | Zoom and drag to explore | Click markers for details';

        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(26, 26, 46, 0.9); padding: 8px 16px; border-radius: 8px; color: ' + (filterActive ? '#FFD700' : '#00CED1') + '; font-size: 13px; z-index: 1000; pointer-events: none; max-width: 90%; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
        infoDiv.textContent = infoText;
        container.appendChild(infoDiv);
    }

    showLoading(container) {
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 600px;">
                <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                    <div style="color: #00CED1; font-size: 18px;">Loading geographic data...</div>
                </div>
            </div>
        `;
    }

    showError(container, message) {
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 600px;">
                <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <div style="color: #FFD700; font-size: 18px; font-weight: bold;">No Places Found</div>
                    <div style="color: #00CED1; font-size: 14px; margin-top: 8px;">${message}</div>
                </div>
            </div>
        `;
    }

    // Clean up when switching visualizations
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.markers = [];
    }
}
