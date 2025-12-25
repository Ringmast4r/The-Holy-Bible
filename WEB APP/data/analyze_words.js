const fs = require('fs');
const data = JSON.parse(fs.readFileSync('asv-bible.json', 'utf8'));

const wordIndex = new Map();

data.verses.forEach(verse => {
    const words = verse.text
        .toLowerCase()
        .replace(/[^\w\s'-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 0);

    words.forEach(word => {
        word = word.replace(/^[']+|[']+$/g, '');
        if (word.length === 0) return;
        
        if (!wordIndex.has(word)) {
            wordIndex.set(word, 0);
        }
        wordIndex.set(word, wordIndex.get(word) + 1);
    });
});

const top50 = Array.from(wordIndex.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

console.log('TOP 50 WORDS IN ASV BIBLE (INCLUDING STOP WORDS):\n');
top50.forEach(([word, count], i) => {
    const rank = String(i + 1).padStart(2);
    const wordPad = word.padEnd(15);
    const countPad = count.toLocaleString().padStart(8);
    console.log(`${rank}. ${wordPad} ${countPad} refs`);
});
