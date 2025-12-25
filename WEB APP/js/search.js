// Bible Connection Search

class BibleSearch {
    constructor(containerId) {
        this.containerId = containerId;
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.resultsDiv = document.getElementById('search-results');

        this.initializeSearch();
    }

    initializeSearch() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            this.showError('Please enter a search term');
            return;
        }

        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError('Data not loaded yet. Please wait...');
            return;
        }

        const results = this.searchConnections(query);
        this.displayResults(results, query);
    }

    searchConnections(query) {
        const chapters = dataLoader.getChapters();
        const connections = dataLoader.getConnections();

        // Normalize query
        const normalizedQuery = query.toLowerCase().replace(/\s+/g, ' ');

        // Search for exact chapter match
        const chapterIndex = chapters.findIndex(ch =>
            ch.label.toLowerCase() === normalizedQuery ||
            ch.label.toLowerCase().includes(normalizedQuery)
        );

        if (chapterIndex !== -1) {
            // Found exact chapter - get all its connections
            const chapter = chapters[chapterIndex];
            const chapterConnections = connections.filter(conn =>
                conn.source === chapterIndex || conn.target === chapterIndex
            );

            return {
                type: 'chapter',
                chapter: chapter,
                connections: chapterConnections.map(conn => {
                    const isSource = conn.source === chapterIndex;
                    const otherIndex = isSource ? conn.target : conn.source;
                    const otherChapter = chapters[otherIndex];

                    return {
                        direction: isSource ? 'outgoing' : 'incoming',
                        chapter: otherChapter,
                        weight: conn.weight,
                        connection: conn
                    };
                }).sort((a, b) => b.weight - a.weight)
            };
        }

        // Search for book
        const bookResults = chapters.filter(ch =>
            ch.book.toLowerCase().includes(normalizedQuery)
        );

        if (bookResults.length > 0) {
            const bookName = bookResults[0].book;
            const bookChapters = chapters.filter(ch => ch.book === bookName);
            const bookIndices = new Set(bookChapters.map(ch => ch.id));

            const bookConnections = connections.filter(conn =>
                bookIndices.has(conn.source) || bookIndices.has(conn.target)
            );

            // Group connections by whether they're internal or external
            const internal = bookConnections.filter(conn =>
                bookIndices.has(conn.source) && bookIndices.has(conn.target)
            );
            const external = bookConnections.filter(conn =>
                !(bookIndices.has(conn.source) && bookIndices.has(conn.target))
            );

            return {
                type: 'book',
                book: bookName,
                chapters: bookChapters,
                internal: internal,
                external: external
            };
        }

        // If no matches found
        return {
            type: 'none',
            query: query
        };
    }

    displayResults(results, query) {
        if (!this.resultsDiv) return;

        if (results.type === 'none') {
            this.resultsDiv.innerHTML = `
                <div class="search-no-results">
                    <p>No results found for "${query}"</p>
                    <p>Try searching for:</p>
                    <ul>
                        <li>Book names (e.g., "Genesis", "John")</li>
                        <li>Book and chapter (e.g., "Genesis 1", "John 3")</li>
                    </ul>
                </div>
            `;
            return;
        }

        if (results.type === 'chapter') {
            const { chapter, connections } = results;

            let html = `
                <div class="search-chapter-results">
                    <h3>${chapter.label}</h3>
                    <p class="search-info">
                        Book: ${chapter.book} |
                        Testament: ${chapter.testament} |
                        Total Connections: ${connections.length}
                    </p>

                    <div class="connections-grid">
                        <div class="connection-column" style="width: 48%;">
                            <h4>Incoming Connections (${connections.filter(c => c.direction === 'incoming').length} total)</h4>
                            <ul class="connection-list" style="max-height: 500px; overflow-y: auto; border: 1px solid #333; padding: 10px; border-radius: 5px;">
            `;

            // Show ALL connections, not limited
            const allIncoming = connections.filter(c => c.direction === 'incoming');
            const allOutgoing = connections.filter(c => c.direction === 'outgoing');

            // Display ALL incoming connections
            allIncoming.forEach(conn => {
                html += `
                    <li style="cursor: pointer;" onclick="document.getElementById('search-input').value='${conn.chapter.label}'; document.getElementById('search-btn').click();" title="Click to search ${conn.chapter.label}">
                        <span class="conn-chapter" style="color: #00CED1; text-decoration: underline;">${conn.chapter.label}</span>
                        <span class="conn-weight">${conn.weight} refs</span>
                    </li>
                `;
            });

            html += `
                            </ul>
                        </div>
                        <div class="connection-column" style="width: 48%;">
                            <h4>Outgoing Connections (${allOutgoing.length} total)</h4>
                            <ul class="connection-list" style="max-height: 500px; overflow-y: auto; border: 1px solid #333; padding: 10px; border-radius: 5px;">
            `;

            // Display ALL outgoing connections
            allOutgoing.forEach(conn => {
                html += `
                    <li style="cursor: pointer;" onclick="document.getElementById('search-input').value='${conn.chapter.label}'; document.getElementById('search-btn').click();" title="Click to search ${conn.chapter.label}">
                        <span class="conn-chapter" style="color: #00CED1; text-decoration: underline;">${conn.chapter.label}</span>
                        <span class="conn-weight">${conn.weight} refs</span>
                    </li>
                `;
            });

            html += `
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            this.resultsDiv.innerHTML = html;
        }

        if (results.type === 'book') {
            const { book, chapters, internal, external } = results;

            // Calculate statistics
            const totalConnections = internal.length + external.length;
            const avgWeight = (internal.reduce((sum, c) => sum + c.weight, 0) +
                             external.reduce((sum, c) => sum + c.weight, 0)) / totalConnections;

            // Find most connected external books
            const externalByBook = {};
            const chapterMap = dataLoader.getChapters();

            external.forEach(conn => {
                const externalChapterIdx = chapters.some(ch => ch.id === conn.source)
                    ? conn.target
                    : conn.source;
                const externalChapter = chapterMap[externalChapterIdx];
                const externalBook = externalChapter.book;

                if (!externalByBook[externalBook]) {
                    externalByBook[externalBook] = {
                        book: externalBook,
                        testament: externalChapter.testament,
                        connections: 0,
                        weight: 0
                    };
                }

                externalByBook[externalBook].connections++;
                externalByBook[externalBook].weight += conn.weight;
            });

            const topExternalBooks = Object.values(externalByBook)
                .sort((a, b) => b.weight - a.weight)
                .slice(0, 10);

            let html = `
                <div class="search-book-results">
                    <h3>📖 ${book}</h3>
                    <div class="book-stats">
                        <div class="stat-item">
                            <span class="stat-label">Chapters:</span>
                            <span class="stat-value">${chapters.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Internal Connections:</span>
                            <span class="stat-value">${internal.length.toLocaleString()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">External Connections:</span>
                            <span class="stat-value">${external.length.toLocaleString()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Average Weight:</span>
                            <span class="stat-value">${avgWeight.toFixed(1)}</span>
                        </div>
                    </div>

                    <h4>Most Connected Books</h4>
                    <ul class="book-connection-list">
            `;

            topExternalBooks.forEach(extBook => {
                const color = extBook.testament === 'OT' ? '#2ecc71' : '#00CED1';
                html += `
                    <li>
                        <span class="book-name" style="color: ${color}">${extBook.book}</span>
                        <span class="book-stats">
                            ${extBook.connections} connections |
                            ${extBook.weight.toLocaleString()} total refs
                        </span>
                    </li>
                `;
            });

            html += `
                    </ul>
                </div>
            `;

            this.resultsDiv.innerHTML = html;
        }
    }

    showError(message) {
        if (this.resultsDiv) {
            this.resultsDiv.innerHTML = `
                <div class="search-error">
                    <p>⚠️ ${message}</p>
                </div>
            `;
        }
    }

    render(filters = {}) {
        // Search doesn't use filters, but implements for consistency
        if (this.searchInput) {
            this.searchInput.focus();
        }
    }

    updateFilters(filters) {
        // Search doesn't use filters
    }
}