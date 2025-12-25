// Command Parser for Bible Terminal

class CommandParser {
    constructor(terminal) {
        this.terminal = terminal;
    }

    async execute(input) {
        const command = input.trim().toLowerCase();

        // Empty command
        if (!command) {
            return;
        }

        // Quit command
        if (command === 'quit' || command === 'q' || command === 'exit') {
            this.terminal.printLine('<span class="success-message">May God bless you! Goodbye.</span>');
            this.terminal.printLine('<span class="gray">Refresh the page to restart.</span>');
            this.terminal.disableInput();
            return;
        }

        // Daily verse
        if (command === 'daily') {
            this.showDailyVerse();
            return;
        }

        // List translations
        if (command === 'translations') {
            this.listTranslations();
            return;
        }

        // Switch translation
        if (command.startsWith('translation ')) {
            const code = input.trim().split(' ')[1].toUpperCase();
            this.switchTranslation(code);
            return;
        }

        // Theme toggle
        if (command === 't') {
            this.terminal.cycleTheme();
            return;
        }

        // Help command
        if (command === 'help' || command === '?') {
            this.showHelp();
            return;
        }

        // Search command
        if (command.startsWith('search ')) {
            const keyword = input.trim().substring(7);
            this.searchKeyword(keyword);
            return;
        }

        // Try to parse as verse reference (e.g., "John 3:16")
        if (this.isVerseReference(input)) {
            this.displayVerse(input);
            return;
        }

        // Try to parse as chapter reference (e.g., "Psalms 23")
        if (this.isChapterReference(input)) {
            const parts = input.trim().split(' ');
            const book = parts.slice(0, -1).join(' ');
            const chapter = parts[parts.length - 1];
            this.displayChapter(book, chapter);
            return;
        }

        // Default: treat as keyword search
        this.searchKeyword(input);
    }

    isVerseReference(input) {
        // Check if input matches book chapter:verse pattern
        return /^[a-z0-9\s]+\d+:\d+$/i.test(input.trim());
    }

    isChapterReference(input) {
        // Check if input matches book chapter pattern
        return /^[a-z0-9\s]+\d+$/i.test(input.trim()) && !input.includes(':');
    }

    displayVerse(reference) {
        const verse = bibleData.getVerse(reference);

        if (!verse) {
            this.terminal.printLine(`<span class="error-message">✗ Verse not found: ${reference}</span>`);
            this.terminal.printLine('<span class="gray">Try: "John 3:16" or "Psalms 23:1"</span>');
            return;
        }

        // Display verse box
        this.terminal.printLine('<div class="verse-box">');
        this.terminal.printLine(`  <div class="verse-title">${reference}</div>`);
        this.terminal.printLine(`  <div class="verse-text">${this.wrapText(verse, 60)}</div>`);
        this.terminal.printLine('</div>');

        // Display cross-references
        const crossRefs = bibleData.getCrossReferences(reference);
        if (crossRefs.length > 0) {
            this.terminal.printLine('<div class="cross-ref-box">');
            this.terminal.printLine('  <div class="cross-ref-title">★ Related Verses (Cross-References)</div>');

            const maxRefs = Math.min(crossRefs.length, 10);
            for (let i = 0; i < maxRefs; i++) {
                const refText = bibleData.getVerse(crossRefs[i]);
                if (refText) {
                    const preview = refText.substring(0, 60) + (refText.length > 60 ? '...' : '');
                    this.terminal.printLine(`  <div class="cross-ref-item">[${i + 1}] <span class="cross-ref-verse">${crossRefs[i]}</span><br>      ${preview}</div>`);
                }
            }

            if (crossRefs.length > 10) {
                this.terminal.printLine(`  <div class="gray">      ... and ${crossRefs.length - 10} more related verses</div>`);
            }

            this.terminal.printLine('</div>');
        }
    }

    displayChapter(book, chapterNum) {
        const verses = bibleData.getChapter(book, chapterNum);

        if (verses.length === 0) {
            this.terminal.printLine(`<span class="error-message">✗ Chapter not found: ${book} ${chapterNum}</span>`);
            this.terminal.printLine('<span class="gray">Try: "Genesis 1" or "Psalms 23"</span>');
            return;
        }

        this.terminal.printLine('<div class="verse-box">');
        this.terminal.printLine(`  <div class="verse-title">${book} ${chapterNum}</div>`);

        for (const verse of verses) {
            const verseNum = verse.ref.split(':')[1];
            this.terminal.printLine(`  <div class="verse-text"><span class="gold">${verseNum}.</span> ${this.wrapText(verse.text, 60)}</div>`);
        }

        this.terminal.printLine('</div>');
        this.terminal.printLine(`<span class="success-message">✓ Displayed ${verses.length} verses from ${book} ${chapterNum}</span>`);
    }

    searchKeyword(keyword) {
        if (!keyword || keyword.length < 3) {
            this.terminal.printLine('<span class="error-message">✗ Search keyword must be at least 3 characters</span>');
            return;
        }

        const results = bibleData.searchKeyword(keyword);

        if (results.length === 0) {
            this.terminal.printLine(`<span class="error-message">✗ No results found for "${keyword}"</span>`);
            return;
        }

        this.terminal.printLine(`<span class="cyan">╔══════════════════════════════════════════════════════════════════╗</span>`);
        this.terminal.printLine(`<span class="cyan">║</span>  <span class="gold">Search Results for "${keyword}"</span> - Found ${results.length} verses${' '.repeat(Math.max(0, 38 - keyword.length))} <span class="cyan">║</span>`);
        this.terminal.printLine(`<span class="cyan">╚══════════════════════════════════════════════════════════════════╝</span>`);

        const maxResults = Math.min(results.length, 20);
        for (let i = 0; i < maxResults; i++) {
            const result = results[i];
            const highlightedText = this.highlightKeyword(result.text, keyword);
            this.terminal.printLine(`<div class="search-result">`);
            this.terminal.printLine(`  <div class="search-result-ref">${result.ref}</div>`);
            this.terminal.printLine(`  <div class="search-result-text">${highlightedText}</div>`);
            this.terminal.printLine(`</div>`);
        }

        if (results.length > 20) {
            this.terminal.printLine(`<span class="gray">... and ${results.length - 20} more results</span>`);
        }

        this.terminal.printLine(`<span class="success-message">✓ Search completed</span>`);
    }

    showDailyVerse() {
        const verse = bibleData.getRandomVerse();
        this.terminal.printLine('<div class="daily-verse">');
        this.terminal.printLine('  <div class="daily-verse-title">📖 Daily Inspirational Verse</div>');
        this.terminal.printLine(`  <div class="verse-text"><span class="cyan">${verse.ref}</span><br>${this.wrapText(verse.text, 60)}</div>`);
        this.terminal.printLine('</div>');
    }

    listTranslations() {
        this.terminal.printLine('<span class="cyan">╔══════════════════════════════════════════════════════════════════╗</span>');
        this.terminal.printLine('<span class="cyan">║</span>  <span class="gold">Available Bible Translations</span>                                    <span class="cyan">║</span>');
        this.terminal.printLine('<span class="cyan">╚══════════════════════════════════════════════════════════════════╝</span>');

        for (const code in bibleData.translationInfo) {
            const info = bibleData.translationInfo[code];
            const current = code === bibleData.currentTranslation ? ' <span class="green">← CURRENT</span>' : '';
            this.terminal.printLine(`  <span class="gold">${code}</span> - ${info.name} (${info.year})${current}`);
        }

        this.terminal.printLine('<br><span class="gray">To switch: type "translation KJV" or "translation ASV"</span>');
    }

    switchTranslation(code) {
        if (bibleData.switchTranslation(code)) {
            const info = bibleData.translationInfo[code];
            this.terminal.printLine(`<span class="success-message">✓ Switched to ${code} - ${info.name}</span>`);
            this.terminal.updateTranslationDisplay();
        } else {
            this.terminal.printLine(`<span class="error-message">✗ Unknown translation: ${code}</span>`);
            this.terminal.printLine('<span class="gray">Type "translations" to see available versions</span>');
        }
    }

    showHelp() {
        this.terminal.printLine('<span class="cyan">╔══════════════════════════════════════════════════════════════════╗</span>');
        this.terminal.printLine('<span class="cyan">║</span>  <span class="gold">★ COMMANDS</span>                                                        <span class="cyan">║</span>');
        this.terminal.printLine('<span class="cyan">╚══════════════════════════════════════════════════════════════════╝</span>');
        this.terminal.printLine('');
        this.terminal.printLine('  <span class="purple">►</span> <span class="white">Type a verse</span>          <span class="gray">(e.g., \'John 3:16\')</span>');
        this.terminal.printLine('  <span class="purple">►</span> <span class="white">Type a chapter</span>        <span class="gray">(e.g., \'Genesis 1\' or \'Psalms 23\')</span>');
        this.terminal.printLine('  <span class="purple">►</span> <span class="white">Search keyword</span>        <span class="gray">(e.g., \'love\', \'faith\', \'grace\')</span>');
        this.terminal.printLine('  <span class="purple">►</span> <span class="white">Type \'daily\'</span>          <span class="gray">(Show new daily verse)</span>');
        this.terminal.printLine('  <span class="purple">►</span> <span class="white">Type \'translations\'</span>   <span class="gray">(List all Bible versions)</span>');
        this.terminal.printLine('  <span class="purple">►</span> <span class="white">Type \'translation XXX\'</span> <span class="gray">(Switch version, e.g., \'translation ASV\')</span>');
        this.terminal.printLine('  <span class="purple">►</span> <span class="white">Type \'quit\'</span>           <span class="gray">(Exit program)</span>');
        this.terminal.printLine('');
    }

    wrapText(text, maxLength) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + word).length > maxLength) {
                if (currentLine) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    lines.push(word);
                    currentLine = '';
                }
            } else {
                currentLine += word + ' ';
            }
        }

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines.join('<br>      ');
    }

    highlightKeyword(text, keyword) {
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
}
