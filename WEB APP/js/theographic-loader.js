// Theographic Bible Metadata Loader
// Loads people, places, events, and enhanced verse data

class TheographicDataLoader {
    constructor() {
        this.people = null;
        this.places = null;
        this.events = null;
        this.periods = null;
        this.peopleGroups = null;
        this.chapters = null;
        this.verses = null;
        this.books = null;
        this.easton = null;
        this.isLoaded = false;
        this.loadingProgress = 0;
        this.progressCallbacks = [];
    }

    /**
     * Register a callback for loading progress updates
     * @param {Function} callback - Called with (percentage, message)
     */
    onProgress(callback) {
        this.progressCallbacks.push(callback);
    }

    updateProgress(percentage, message) {
        this.loadingProgress = percentage;
        this.progressCallbacks.forEach(cb => cb(percentage, message));
    }

    async load(specificData = null) {
        if (this.isLoaded && !specificData) return;

        try {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            // Use local data directory for both local and production
            // Data is served via GitHub Pages from bible-visualizer-web/data/
            const basePath = 'data/';

            console.log('Loading theographic data from:', basePath);

            // LAZY LOADING: Only load specific data if requested
            if (specificData) {
                return await this.loadSpecificData(basePath, specificData);
            }

            // Load books first (small file)
            this.updateProgress(5, 'Loading books metadata...');
            const booksStart = performance.now();
            const booksResponse = await fetch(basePath + 'books.json');
            this.books = await booksResponse.json();
            console.log(`✓ Loaded ${this.books.length} books in ${(performance.now() - booksStart).toFixed(0)}ms`);

            // Load people data
            this.updateProgress(15, 'Loading biblical people...');
            const peopleStart = performance.now();
            const peopleResponse = await fetch(basePath + 'people.json');
            this.people = await peopleResponse.json();
            console.log(`✓ Loaded ${this.people.length} people in ${(performance.now() - peopleStart).toFixed(0)}ms`);

            // Load places data with coordinates
            this.updateProgress(30, 'Loading places with GPS coordinates...');
            const placesStart = performance.now();
            const placesResponse = await fetch(basePath + 'places.json');
            this.places = await placesResponse.json();
            console.log(`✓ Loaded ${this.places.length} places in ${(performance.now() - placesStart).toFixed(0)}ms`);

            // Load events
            this.updateProgress(45, 'Loading biblical events...');
            const eventsResponse = await fetch(basePath + 'events.json');
            this.events = await eventsResponse.json();
            console.log('✓ Loaded', this.events.length, 'events');

            // Load periods (for timeline)
            this.updateProgress(55, 'Loading historical periods...');
            const periodsResponse = await fetch(basePath + 'periods.json');
            this.periods = await periodsResponse.json();
            console.log('✓ Loaded', this.periods.length, 'periods');

            // Load people groups
            this.updateProgress(65, 'Loading people groups...');
            const groupsResponse = await fetch(basePath + 'peopleGroups.json');
            this.peopleGroups = await groupsResponse.json();
            console.log('✓ Loaded', this.peopleGroups.length, 'people groups');

            // Load Easton's Bible Dictionary
            this.updateProgress(75, 'Loading Easton\'s Dictionary...');
            const eastonResponse = await fetch(basePath + 'easton.json');
            this.easton = await eastonResponse.json();
            console.log('✓ Loaded', this.easton.length, 'dictionary entries');

            // Load chapters metadata
            this.updateProgress(85, 'Loading chapters metadata...');
            const chaptersResponse = await fetch(basePath + 'chapters.json');
            this.chapters = await chaptersResponse.json();
            console.log('✓ Loaded', this.chapters.length, 'chapters');

            // Skip verses.json for now (36MB) - load on demand
            // this.updateProgress(90, 'Loading verse metadata (36MB)...');
            // const versesResponse = await fetch(basePath + 'verses.json');
            // this.verses = await versesResponse.json();
            // console.log('✓ Loaded', this.verses.length, 'verses');

            this.isLoaded = true;
            this.updateProgress(100, 'Theographic data loaded!');

            console.log('✓ Theographic data fully loaded:', {
                people: this.people.length,
                places: this.places.length,
                events: this.events.length,
                periods: this.periods.length
            });

            return true;
        } catch (error) {
            console.error('Error loading theographic data:', error);
            throw error;
        }
    }

    // Getter methods
    getPeople() {
        return this.people || [];
    }

    getPlaces() {
        return this.places || [];
    }

    getEvents() {
        return this.events || [];
    }

    getPeriods() {
        return this.periods || [];
    }

    getPeopleGroups() {
        return this.peopleGroups || [];
    }

    getBooks() {
        return this.books || [];
    }

    getChapters() {
        return this.chapters || [];
    }

    getEastonDictionary() {
        return this.easton || [];
    }

    // Search methods
    searchPerson(name) {
        if (!this.people) return null;
        const lowerName = name.toLowerCase();
        return this.people.find(p =>
            p.fields.name && p.fields.name.toLowerCase().includes(lowerName)
        );
    }

    searchPlace(name) {
        if (!this.places) return null;
        const lowerName = name.toLowerCase();
        return this.places.find(p =>
            (p.fields.kjvName && p.fields.kjvName.toLowerCase().includes(lowerName)) ||
            (p.fields.esvName && p.fields.esvName.toLowerCase().includes(lowerName))
        );
    }

    searchEvent(name) {
        if (!this.events) return null;
        const lowerName = name.toLowerCase();
        return this.events.find(e =>
            e.fields.name && e.fields.name.toLowerCase().includes(lowerName)
        );
    }

    // Get places with valid GPS coordinates for mapping
    getPlacesWithCoordinates() {
        if (!this.places) return [];
        return this.places.filter(place => {
            const lat = parseFloat(place.fields.latitude);
            const lon = parseFloat(place.fields.longitude);
            return !isNaN(lat) && !isNaN(lon);
        });
    }

    // Get people with birth/death locations
    getPeopleWithLocations() {
        if (!this.people) return [];
        return this.people.filter(person =>
            person.fields.birthPlace || person.fields.deathPlace
        );
    }

    // Get events sorted by period
    getEventsTimeline() {
        if (!this.events) {
            console.warn('[getEventsTimeline] No events loaded');
            return [];
        }

        console.log('[getEventsTimeline] Processing', this.events.length, 'events');
        console.log('[getEventsTimeline] Sample event:', this.events[0]);
        console.log('[getEventsTimeline] Event fields:', this.events[0]?.fields);

        // Return ALL events, with period info created from event data
        const processed = this.events
            .map((event, idx) => {
                let periodInfo = null;

                // Parse startDate from event (e.g., "-4003" -> -4003)
                const startDate = event.fields.startDate;
                if (startDate !== undefined) {
                    const yearNum = parseInt(startDate);
                    if (!isNaN(yearNum)) {
                        // Try to find matching period
                        if (this.periods) {
                            const matchingPeriod = this.periods.find(p => {
                                const periodYear = parseInt(p.fields.yearNum);
                                return !isNaN(periodYear) && periodYear === yearNum;
                            });
                            if (matchingPeriod) {
                                periodInfo = matchingPeriod;
                            }
                        }

                        // If no matching period, create period info from event data
                        if (!periodInfo) {
                            periodInfo = {
                                fields: {
                                    name: event.fields.title || 'Biblical Event',
                                    yearNum: yearNum
                                }
                            };
                        }
                    }
                }

                // Normalize event fields for timeline
                const normalizedEvent = {
                    ...event,
                    fields: {
                        ...event.fields,
                        name: event.fields.title || event.fields.name, // Use title as name
                        verseCount: event.fields.verses?.length || 0,  // Count verses array
                        description: event.fields.description || `Event: ${event.fields.title || 'Unknown'}`
                    },
                    periodInfo: periodInfo
                };

                if (idx === 0) {
                    console.log('[getEventsTimeline] First event normalized:', normalizedEvent);
                }

                return normalizedEvent;
            })
            .filter(e => e.periodInfo && e.periodInfo.fields.yearNum !== undefined); // Only show events with dates

        console.log('[getEventsTimeline] After filtering:', processed.length, 'events have dates');
        if (processed.length > 0) {
            console.log('[getEventsTimeline] Sample processed event:', processed[0]);
        }

        return processed.sort((a, b) => {
            return (a.periodInfo.fields.yearNum || 0) - (b.periodInfo.fields.yearNum || 0);
        });
    }

    // Get statistics
    getStats() {
        if (!this.isLoaded) return {};

        return {
            totalPeople: this.people?.length || 0,
            totalPlaces: this.places?.length || 0,
            totalEvents: this.events?.length || 0,
            totalPeriods: this.periods?.length || 0,
            placesWithCoords: this.getPlacesWithCoordinates().length,
            peopleWithLocations: this.getPeopleWithLocations().length,
            dictionaryEntries: this.easton?.length || 0
        };
    }

    // LAZY LOADING - Load only specific data on demand
    async loadSpecificData(basePath, dataType) {
        console.log(`[Lazy Load] Loading ${dataType} data...`);

        switch (dataType) {
            case 'places':
                if (!this.places) {
                    const response = await fetch(basePath + 'places.json');
                    this.places = await response.json();
                    console.log('✓ Loaded', this.places.length, 'places');
                }
                return this.places;

            case 'people':
                if (!this.people) {
                    const response = await fetch(basePath + 'people.json');
                    this.people = await response.json();
                    console.log('✓ Loaded', this.people.length, 'people');
                }
                return this.people;

            case 'events':
                if (!this.events) {
                    const response = await fetch(basePath + 'events.json');
                    this.events = await response.json();
                    console.log('✓ Loaded', this.events.length, 'events');
                }
                return this.events;

            case 'periods':
                if (!this.periods) {
                    const response = await fetch(basePath + 'periods.json');
                    this.periods = await response.json();
                    console.log('✓ Loaded', this.periods.length, 'periods');
                }
                return this.periods;

            case 'easton':
                if (!this.easton) {
                    const response = await fetch(basePath + 'easton.json');
                    this.easton = await response.json();
                    console.log('✓ Loaded', this.easton.length, 'dictionary entries');
                }
                return this.easton;

            default:
                console.warn(`Unknown data type: ${dataType}`);
                return null;
        }
    }
}

// Global theographic data loader instance
const theographicLoader = new TheographicDataLoader();
