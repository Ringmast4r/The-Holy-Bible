/**
 * Global Bible Verse Loader
 * Loads ASV Bible data ONCE and provides lookup functions for all visualizations
 * Data: American Standard Version (1901) - 31,102 verses
 */

class BibleVerseLoader {
    constructor() {
        this.verses = null;
        this.verseIndex = null; // Fast lookup by book:chapter:verse
        this.loading = false;
        this.loaded = false;
        console.log('📖 BibleVerseLoader initialized');
    }

    /**
     * Load Bible data (call once at app startup)
     */
    async load() {
        if (this.loaded) {
            console.log('📖 Bible data already loaded');
            return this.verses;
        }

        if (this.loading) {
            console.log('📖 Bible data already loading, waiting...');
            // Wait for existing load to complete
            while (this.loading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.verses;
        }

        try {
            this.loading = true;
            console.log('📖 Loading ASV Bible data...');
            const startTime = performance.now();

            const response = await fetch('data/asv-bible.json');
            const data = await response.json();

            this.verses = data.verses;
            this.buildIndex();

            const loadTime = (performance.now() - startTime).toFixed(2);
            console.log(`✅ Loaded ${this.verses.length} verses in ${loadTime}ms`);

            this.loaded = true;
            this.loading = false;
            return this.verses;

        } catch (error) {
            console.error('❌ Failed to load Bible data:', error);
            this.loading = false;
            throw error;
        }
    }

    /**
     * Build fast lookup index
     */
    buildIndex() {
        console.log('🔨 Building verse index...');
        const startTime = performance.now();

        this.verseIndex = new Map();

        this.verses.forEach((verse, idx) => {
            const key = `${verse.book_name}:${verse.chapter}:${verse.verse}`;
            this.verseIndex.set(key, idx);
        });

        const indexTime = (performance.now() - startTime).toFixed(2);
        console.log(`✅ Indexed ${this.verseIndex.size} verses in ${indexTime}ms`);
    }

    /**
     * Get verse by reference (e.g., "John", 3, 16)
     */
    getVerse(bookName, chapter, verse) {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return null;
        }

        const key = `${bookName}:${chapter}:${verse}`;
        const idx = this.verseIndex.get(key);

        if (idx === undefined) {
            return null;
        }

        return this.verses[idx];
    }

    /**
     * Get all verses for a chapter
     */
    getChapter(bookName, chapter) {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return [];
        }

        return this.verses.filter(v =>
            v.book_name === bookName && v.chapter === chapter
        );
    }

    /**
     * Get all verses for a book
     */
    getBook(bookName) {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return [];
        }

        return this.verses.filter(v => v.book_name === bookName);
    }

    /**
     * Search verses containing a word/phrase
     */
    search(searchTerm, caseSensitive = false) {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return [];
        }

        const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();

        return this.verses.filter(v => {
            const text = caseSensitive ? v.text : v.text.toLowerCase();
            return text.includes(term);
        });
    }

    /**
     * Get verse context (verses before and after)
     */
    getContext(bookName, chapter, verse, beforeCount = 2, afterCount = 2) {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return [];
        }

        const chapterVerses = this.getChapter(bookName, chapter);
        const verseIdx = chapterVerses.findIndex(v => v.verse === verse);

        if (verseIdx === -1) {
            return [];
        }

        const start = Math.max(0, verseIdx - beforeCount);
        const end = Math.min(chapterVerses.length, verseIdx + afterCount + 1);

        return chapterVerses.slice(start, end);
    }

    /**
     * Format verse reference as string
     */
    formatReference(verse) {
        if (!verse) return '';
        return `${verse.book_name} ${verse.chapter}:${verse.verse}`;
    }

    /**
     * Get book list
     */
    getBookList() {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return [];
        }

        const books = [...new Set(this.verses.map(v => v.book_name))];
        return books;
    }

    /**
     * Get chapter count for a book
     */
    getChapterCount(bookName) {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return 0;
        }

        const bookVerses = this.getBook(bookName);
        const chapters = [...new Set(bookVerses.map(v => v.chapter))];
        return chapters.length;
    }

    /**
     * Get verse count for a chapter
     */
    getVerseCount(bookName, chapter) {
        if (!this.loaded) {
            console.warn('⚠️ Bible data not loaded yet');
            return 0;
        }

        return this.getChapter(bookName, chapter).length;
    }
}

// Create global singleton instance
window.bibleVerseLoader = new BibleVerseLoader();
