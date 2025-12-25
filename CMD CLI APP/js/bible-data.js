// Bible Data Loader for Web Terminal

class BibleDataLoader {
    constructor() {
        this.translations = {};
        this.crossRefs = {};
        this.currentTranslation = 'KJV';
        this.isLoaded = false;

        this.translationInfo = {
            'KJV': { name: 'King James Version', year: '1611' },
            'ASV': { name: 'American Standard Version', year: '1901' },
            'WEB': { name: 'World English Bible', year: '2000' },
            'YLT': { name: "Young's Literal Translation", year: '1898' }
        };
    }

    async load() {
        if (this.isLoaded) return;

        try {
            // Load KJV (primary translation)
            const kjvResponse = await fetch('../bible-analysis-tool/bible-kjv-converted.json');
            this.translations['KJV'] = await kjvResponse.json();

            // Load ASV
            const asvResponse = await fetch('../bible-analysis-tool/bible-asv-converted.json');
            this.translations['ASV'] = await asvResponse.json();

            // Load WEB
            const webResponse = await fetch('../bible-analysis-tool/bible-web-converted.json');
            this.translations['WEB'] = await webResponse.json();

            // Load YLT
            const yltResponse = await fetch('../bible-analysis-tool/bible-ylt-converted.json');
            this.translations['YLT'] = await yltResponse.json();

            // Load cross-references
            const crossRefResponse = await fetch('../bible-analysis-tool/cross_references.txt');
            const crossRefText = await crossRefResponse.text();
            this.parseCrossReferences(crossRefText);

            this.isLoaded = true;
            console.log('Bible data loaded successfully');
        } catch (error) {
            console.error('Error loading Bible data:', error);
            throw error;
        }
    }

    parseCrossReferences(text) {
        const lines = text.split('\n');
        for (const line of lines) {
            if (!line.trim()) continue;

            const parts = line.split('\t');
            if (parts.length < 2) continue;

            const source = this.convertRef(parts[0]);
            const targets = parts.slice(1).map(ref => this.convertRef(ref)).filter(r => r);

            if (source && targets.length > 0) {
                if (!this.crossRefs[source]) {
                    this.crossRefs[source] = [];
                }
                this.crossRefs[source].push(...targets);
            }
        }
    }

    convertRef(ref) {
        // Convert Gen.1.1 to Genesis 1:1
        const bookMap = {
            'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers',
            'Deut': 'Deuteronomy', 'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth',
            '1Sam': '1 Samuel', '2Sam': '2 Samuel', '1Kgs': '1 Kings', '2Kgs': '2 Kings',
            '1Chr': '1 Chronicles', '2Chr': '2 Chronicles', 'Ezra': 'Ezra', 'Neh': 'Nehemiah',
            'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms', 'Prov': 'Proverbs',
            'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
            'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
            'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah',
            'Jonah': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk',
            'Zeph': 'Zephaniah', 'Hag': 'Haggai', 'Zech': 'Zechariah', 'Mal': 'Malachi',
            'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John',
            'Acts': 'Acts', 'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians',
            'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians',
            '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy',
            '2Tim': '2 Timothy', 'Titus': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews',
            'Jas': 'James', '1Pet': '1 Peter', '2Pet': '2 Peter', '1John': '1 John',
            '2John': '2 John', '3John': '3 John', 'Jude': 'Jude', 'Rev': 'Revelation'
        };

        // Handle ranges
        if (ref.includes('-')) {
            ref = ref.split('-')[0];
        }

        const parts = ref.split('.');
        if (parts.length < 3) return null;

        const bookAbbrev = parts[0];
        const chapter = parts[1];
        const verse = parts[2];

        const bookName = bookMap[bookAbbrev];
        if (!bookName) return null;

        return `${bookName} ${chapter}:${verse}`;
    }

    getVerse(reference) {
        const bible = this.translations[this.currentTranslation];
        if (!bible) return null;

        // Try exact match first
        if (bible[reference]) {
            return bible[reference];
        }

        // Try case-insensitive match
        for (const key in bible) {
            if (key.toLowerCase() === reference.toLowerCase()) {
                return bible[key];
            }
        }

        return null;
    }

    getCrossReferences(reference) {
        return this.crossRefs[reference] || [];
    }

    getChapter(book, chapterNum) {
        const bible = this.translations[this.currentTranslation];
        const verses = [];

        for (const key in bible) {
            const regex = new RegExp(`^${book}\\s+${chapterNum}:(\\d+)$`, 'i');
            if (regex.test(key)) {
                verses.push({ ref: key, text: bible[key] });
            }
        }

        return verses.sort((a, b) => {
            const aNum = parseInt(a.ref.split(':')[1]);
            const bNum = parseInt(b.ref.split(':')[1]);
            return aNum - bNum;
        });
    }

    searchKeyword(keyword) {
        const bible = this.translations[this.currentTranslation];
        const results = [];
        const searchTerm = keyword.toLowerCase();

        for (const ref in bible) {
            const text = bible[ref];
            if (text.toLowerCase().includes(searchTerm)) {
                results.push({ ref, text });
            }
        }

        return results;
    }

    switchTranslation(code) {
        if (this.translations[code]) {
            this.currentTranslation = code;
            return true;
        }
        return false;
    }

    getRandomVerse() {
        const bible = this.translations[this.currentTranslation];
        const keys = Object.keys(bible);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return { ref: randomKey, text: bible[randomKey] };
    }
}

// Global instance
const bibleData = new BibleDataLoader();
