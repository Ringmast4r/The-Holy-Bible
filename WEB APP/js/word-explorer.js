/**
 * Word Explorer Visualization
 * Search Bible words with frequency analysis, distribution charts, and concordance
 * Data: ASV Bible (American Standard Version, 1901)
 */

class WordExplorer {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.bibleData = null;
        this.wordIndex = null;
        this.searchResults = [];
        this.currentWord = '';

        console.log('📖 WordExplorer initialized');
    }

    async render() {
        console.log('📖 WordExplorer rendering...');

        // Load Bible data
        if (!this.bibleData) {
            await this.loadBibleData();
        }

        // Build search interface
        this.buildSearchInterface();

        console.log('✅ WordExplorer ready');
    }

    async loadBibleData() {
        try {
            console.log('📖 Loading ASV Bible data...');
            const startTime = performance.now();

            const response = await fetch('data/asv-bible.json');
            const data = await response.json();

            this.bibleData = data.verses;

            const loadTime = (performance.now() - startTime).toFixed(2);
            console.log(`✅ Loaded ${this.bibleData.length} verses in ${loadTime}ms`);

            // Build word index for fast searching
            this.buildWordIndex();

        } catch (error) {
            console.error('❌ Failed to load Bible data:', error);
            this.container.html(`
                <div class="error-message">
                    <h3>❌ Failed to load Bible data</h3>
                    <p>${error.message}</p>
                </div>
            `);
        }
    }

    buildWordIndex() {
        console.log('🔨 Building word index...');
        const startTime = performance.now();

        this.wordIndex = new Map();

        this.bibleData.forEach((verse, verseIdx) => {
            const words = verse.text
                .toLowerCase()
                .replace(/[^\w\s'-]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length > 0);

            words.forEach(word => {
                // Remove trailing punctuation and apostrophes at edges
                word = word.replace(/^[']+|[']+$/g, '');

                if (word.length === 0) return;

                if (!this.wordIndex.has(word)) {
                    this.wordIndex.set(word, []);
                }
                this.wordIndex.get(word).push(verseIdx);
            });
        });

        const indexTime = (performance.now() - startTime).toFixed(2);
        console.log(`✅ Indexed ${this.wordIndex.size} unique words in ${indexTime}ms`);
    }

    buildSearchInterface() {
        this.container.html('');

        // Create main layout
        const mainDiv = this.container.append('div')
            .attr('class', 'word-explorer-container');

        // Search box
        const searchBox = mainDiv.append('div')
            .attr('class', 'word-search-box');

        searchBox.append('h2')
            .text('📖 Bible Word Explorer');

        searchBox.append('p')
            .attr('class', 'subtitle')
            .html('Search 31,102 verses from the American Standard Version (1901)');

        const inputGroup = searchBox.append('div')
            .attr('class', 'search-input-group');

        const input = inputGroup.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Enter a word to search (e.g., "love", "faith", "god")...')
            .attr('class', 'word-search-input')
            .on('keyup', (event) => {
                if (event.key === 'Enter') {
                    this.searchWord(input.node().value);
                }
            });

        inputGroup.append('button')
            .attr('class', 'search-button')
            .text('🔍 Search')
            .on('click', () => this.searchWord(input.node().value));

        inputGroup.append('button')
            .attr('class', 'clear-button')
            .html('&times;')
            .attr('title', 'Clear search')
            .style('background', '#FF6B6B')
            .style('color', 'white')
            .style('border', 'none')
            .style('padding', '10px 15px')
            .style('border-radius', '5px')
            .style('cursor', 'pointer')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .on('click', () => {
                input.node().value = '';
                this.showPopularWords();
            });

        // Results container
        this.resultsContainer = mainDiv.append('div')
            .attr('class', 'word-results-container');

        // Show popular words as suggestions
        this.showPopularWords();
    }

    showPopularWords() {
        this.resultsContainer.html('');

        const suggestions = this.resultsContainer.append('div')
            .attr('class', 'popular-words');

        suggestions.append('h3')
            .text('📊 Top 50 Most Referenced Words in the Bible:');

        // Get top words by frequency (excluding common stop words)
        const stopWords = new Set([
            'the', 'and', 'of', 'to', 'a', 'in', 'that', 'he', 'it', 'was',
            'for', 'is', 'with', 'as', 'his', 'they', 'be', 'at', 'one',
            'have', 'this', 'from', 'by', 'but', 'not', 'are', 'or', 'were',
            'been', 'their', 'which', 'an', 'had', 'them', 'him', 'her', 'all',
            'there', 'when', 'who', 'will', 'more', 'out', 'up', 'into', 'do',
            'if', 'shall', 'me', 'my', 'thee', 'thy', 'ye', 'thee', 'thou',
            'unto', 'upon', 'said', 'came', 'went', 'did', 'made', 'o'
        ]);

        const wordFrequencies = Array.from(this.wordIndex.entries())
            .filter(([word]) => !stopWords.has(word) && word.length > 2)
            .map(([word, verses]) => ({ word, count: verses.length }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 50);

        const wordGrid = suggestions.append('div')
            .attr('class', 'word-suggestions-grid');

        wordGrid.selectAll('.suggestion-word')
            .data(wordFrequencies)
            .enter()
            .append('button')
            .attr('class', 'suggestion-word')
            .html(d => `<strong>${d.word}</strong><br><span style="font-size: 11px; color: #888;">${d.count.toLocaleString()} refs</span>`)
            .on('click', (event, d) => this.searchWord(d.word));
    }

    searchWord(word) {
        word = word.trim().toLowerCase();

        if (!word || word.length === 0) {
            alert('Please enter a word to search');
            return;
        }

        console.log(`🔍 Searching for: "${word}"`);
        this.currentWord = word;

        const startTime = performance.now();

        // Get all verses containing this word
        const verseIndices = this.wordIndex.get(word) || [];

        if (verseIndices.length === 0) {
            this.showNoResults(word);
            return;
        }

        this.searchResults = verseIndices.map(idx => this.bibleData[idx]);

        const searchTime = (performance.now() - startTime).toFixed(2);
        console.log(`✅ Found ${this.searchResults.length} verses in ${searchTime}ms`);

        this.displayResults();
    }

    showNoResults(word) {
        this.resultsContainer.html('');

        const noResults = this.resultsContainer.append('div')
            .attr('class', 'no-results');

        noResults.append('h3')
            .text(`❌ No results found for "${word}"`);

        noResults.append('p')
            .text('Try a different word or check your spelling.');

        this.showPopularWords();
    }

    displayResults() {
        this.resultsContainer.html('');

        // Summary section
        const summary = this.resultsContainer.append('div')
            .attr('class', 'search-summary');

        summary.append('h3')
            .html(`Results for "<span class="search-term">${this.currentWord}</span>"`);

        summary.append('p')
            .attr('class', 'result-count')
            .text(`Found ${this.searchResults.length} verses`);

        // Create tabs for different views
        const tabsContainer = this.resultsContainer.append('div')
            .attr('class', 'results-tabs-container');

        const tabs = tabsContainer.append('div')
            .attr('class', 'results-tabs');

        const tabButtons = [
            { id: 'frequency', label: '📊 Frequency Chart' },
            { id: 'distribution', label: '📈 Book Distribution' },
            { id: 'concordance', label: '📖 Concordance' }
        ];

        tabs.selectAll('.tab-button')
            .data(tabButtons)
            .enter()
            .append('button')
            .attr('class', (d, i) => `tab-button ${i === 0 ? 'active' : ''}`)
            .attr('data-tab', d => d.id)
            .text(d => d.label)
            .on('click', (event, d) => this.switchTab(d.id));

        // Tab content containers
        const tabContent = this.resultsContainer.append('div')
            .attr('class', 'tab-content-container');

        this.frequencyTab = tabContent.append('div')
            .attr('class', 'tab-content active')
            .attr('id', 'frequency-tab');

        this.distributionTab = tabContent.append('div')
            .attr('class', 'tab-content')
            .attr('id', 'distribution-tab');

        this.concordanceTab = tabContent.append('div')
            .attr('class', 'tab-content')
            .attr('id', 'concordance-tab');

        // Render each view
        this.renderFrequencyChart();
        this.renderDistributionChart();
        this.renderConcordance();
    }

    switchTab(tabId) {
        // Update button states
        d3.selectAll('.tab-button').classed('active', false);
        d3.select(`[data-tab="${tabId}"]`).classed('active', true);

        // Update content visibility
        d3.selectAll('.tab-content').classed('active', false);
        d3.select(`#${tabId}-tab`).classed('active', true);
    }

    renderFrequencyChart() {
        // Count occurrences by book
        const bookCounts = new Map();

        this.searchResults.forEach(verse => {
            const book = verse.book_name;
            bookCounts.set(book, (bookCounts.get(book) || 0) + 1);
        });

        const data = Array.from(bookCounts.entries())
            .map(([book, count]) => ({ book, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20); // Top 20 books

        // Create bar chart
        const margin = { top: 40, right: 30, bottom: 100, left: 60 };
        const width = 900 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        this.frequencyTab.html('');

        this.frequencyTab.append('h4')
            .text(`Top 20 Books Containing "${this.currentWord}"`);

        const svg = this.frequencyTab.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.book))
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);

        // Color scale
        const color = d3.scaleSequential()
            .domain([0, data.length])
            .interpolator(d3.interpolateViridis);

        // Bars
        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.book))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.count))
            .attr('height', d => height - y(d.count))
            .attr('fill', (d, i) => color(i))
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 1)
            .on('mouseover', function(event, d) {
                d3.select(this).attr('opacity', 0.7);
            })
            .on('mouseout', function(event, d) {
                d3.select(this).attr('opacity', 1);
            });

        // Value labels on bars
        svg.selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => x(d.book) + x.bandwidth() / 2)
            .attr('y', d => y(d.count) - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '12px')
            .text(d => d.count);

        // X Axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('fill', '#FFFFFF');

        // Y Axis
        svg.append('g')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .attr('fill', '#FFFFFF');

        // Axis labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '14px')
            .text('Bible Books');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -margin.left + 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '14px')
            .text('Occurrence Count');
    }

    renderDistributionChart() {
        // Group by Testament and Book
        const testamentData = {
            'Old Testament': new Map(),
            'New Testament': new Map()
        };

        // List of OT books (39)
        const otBooks = [
            'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
            'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
            '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
            'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
            'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
            'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
            'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
            'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
        ];

        this.searchResults.forEach(verse => {
            const testament = otBooks.includes(verse.book_name) ? 'Old Testament' : 'New Testament';
            const book = verse.book_name;

            const map = testamentData[testament];
            map.set(book, (map.get(book) || 0) + 1);
        });

        // Calculate totals
        const otTotal = Array.from(testamentData['Old Testament'].values()).reduce((a, b) => a + b, 0);
        const ntTotal = Array.from(testamentData['New Testament'].values()).reduce((a, b) => a + b, 0);

        this.distributionTab.html('');

        this.distributionTab.append('h4')
            .text(`Distribution of "${this.currentWord}" Across Testaments`);

        // Summary stats
        const statsDiv = this.distributionTab.append('div')
            .attr('class', 'distribution-stats');

        statsDiv.append('div')
            .attr('class', 'stat-box')
            .html(`
                <strong>Old Testament:</strong> ${otTotal} verses (${((otTotal / this.searchResults.length) * 100).toFixed(1)}%)
            `);

        statsDiv.append('div')
            .attr('class', 'stat-box')
            .html(`
                <strong>New Testament:</strong> ${ntTotal} verses (${((ntTotal / this.searchResults.length) * 100).toFixed(1)}%)
            `);

        // Create heatmap-style visualization
        const margin = { top: 20, right: 20, bottom: 20, left: 150 };
        const cellHeight = 25;
        const cellWidth = 80;

        const allBooks = [
            ...Array.from(testamentData['Old Testament'].entries()),
            ...Array.from(testamentData['New Testament'].entries())
        ].map(([book, count]) => ({ book, count }))
          .sort((a, b) => b.count - a.count);

        const height = allBooks.length * cellHeight + margin.top + margin.bottom;
        const width = cellWidth + margin.left + margin.right;

        const svg = this.distributionTab.append('svg')
            .attr('width', width)
            .attr('height', Math.min(height, 800)) // Max height
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Color scale
        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(allBooks, d => d.count)])
            .interpolator(d3.interpolateYlOrRd);

        // Cells
        svg.selectAll('.dist-cell')
            .data(allBooks)
            .enter()
            .append('rect')
            .attr('class', 'dist-cell')
            .attr('x', 0)
            .attr('y', (d, i) => i * cellHeight)
            .attr('width', cellWidth)
            .attr('height', cellHeight - 2)
            .attr('fill', d => colorScale(d.count))
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 1);

        // Book labels
        svg.selectAll('.book-label')
            .data(allBooks)
            .enter()
            .append('text')
            .attr('class', 'book-label')
            .attr('x', -10)
            .attr('y', (d, i) => i * cellHeight + cellHeight / 2)
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .attr('fill', '#FFFFFF')
            .attr('font-size', '12px')
            .text(d => d.book);

        // Count labels
        svg.selectAll('.count-label')
            .data(allBooks)
            .enter()
            .append('text')
            .attr('class', 'count-label')
            .attr('x', cellWidth / 2)
            .attr('y', (d, i) => i * cellHeight + cellHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', '#000000')
            .attr('font-weight', 'bold')
            .attr('font-size', '12px')
            .text(d => d.count);
    }

    renderConcordance() {
        this.concordanceTab.html('');

        this.concordanceTab.append('h4')
            .text(`All ${this.searchResults.length} verses containing "${this.currentWord}"`);

        // Add download button
        const controls = this.concordanceTab.append('div')
            .attr('class', 'concordance-controls');

        controls.append('button')
            .attr('class', 'download-button')
            .text('📥 Download as Text')
            .on('click', () => this.downloadConcordance());

        // Verse list (show first 100, with load more button)
        const verseList = this.concordanceTab.append('div')
            .attr('class', 'concordance-list');

        const displayCount = Math.min(100, this.searchResults.length);

        this.searchResults.slice(0, displayCount).forEach(verse => {
            const verseDiv = verseList.append('div')
                .attr('class', 'concordance-verse');

            verseDiv.append('div')
                .attr('class', 'verse-reference')
                .text(`${verse.book_name} ${verse.chapter}:${verse.verse}`);

            // Highlight the search word
            const highlightedText = this.highlightWord(verse.text, this.currentWord);

            verseDiv.append('div')
                .attr('class', 'verse-text')
                .html(highlightedText);
        });

        // Load more button if needed
        if (this.searchResults.length > displayCount) {
            verseList.append('button')
                .attr('class', 'load-more-button')
                .text(`Load ${Math.min(100, this.searchResults.length - displayCount)} more verses...`)
                .on('click', function() {
                    // Remove button and show more
                    d3.select(this).remove();
                    // This would need more implementation for pagination
                });
        }
    }

    highlightWord(text, word) {
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    downloadConcordance() {
        let content = `Concordance for "${this.currentWord}"\n`;
        content += `American Standard Version (ASV)\n`;
        content += `${this.searchResults.length} verses found\n`;
        content += `Generated: ${new Date().toLocaleString()}\n\n`;
        content += '='.repeat(80) + '\n\n';

        this.searchResults.forEach(verse => {
            content += `${verse.book_name} ${verse.chapter}:${verse.verse}\n`;
            content += `${verse.text}\n\n`;
        });

        // Create download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `concordance-${this.currentWord}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}
