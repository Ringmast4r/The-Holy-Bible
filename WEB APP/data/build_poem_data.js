const fs = require('fs');
const data = JSON.parse(fs.readFileSync('asv-bible.json', 'utf8'));

const stopWords = new Set([
    'the', 'and', 'of', 'to', 'a', 'in', 'that', 'he', 'it', 'was',
    'for', 'is', 'with', 'as', 'his', 'they', 'be', 'at', 'one',
    'have', 'this', 'from', 'by', 'but', 'not', 'are', 'or', 'were',
    'been', 'their', 'which', 'an', 'had', 'them', 'him', 'her', 'all',
    'there', 'when', 'who', 'will', 'more', 'out', 'up', 'into', 'do',
    'if', 'shall', 'me', 'my', 'thee', 'thy', 'ye', 'unto', 'upon', 
    'said', 'came', 'went', 'did', 'made', 'o'
]);

const wordIndex = new Map();

data.verses.forEach(verse => {
    const words = verse.text.toLowerCase().replace(/[^\w\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 0);
    words.forEach(word => {
        word = word.replace(/^[']+|[']+$/g, '');
        if (word.length === 0) return;
        if (!wordIndex.has(word)) wordIndex.set(word, 0);
        wordIndex.set(word, wordIndex.get(word) + 1);
    });
});

// Get ALL words sorted by frequency
const allWords = Array.from(wordIndex.entries())
    .sort((a, b) => b[1] - a[1]);

// Top 50 filtered (no stop words, length > 2)
const top50filtered = allWords
    .filter(([word]) => !stopWords.has(word) && word.length > 2)
    .slice(0, 50);

// Top 100 filtered
const top100filtered = allWords
    .filter(([word]) => !stopWords.has(word) && word.length > 2)
    .slice(0, 100);

console.log('=== TAB 1: TOP 50 FILTERED (NO STOP WORDS) ===\n');
top50filtered.forEach(([word, count], i) => {
    process.stdout.write(word.toUpperCase());
    if (i < top50filtered.length - 1) process.stdout.write(', ');
    if ((i + 1) % 10 === 0) process.stdout.write('\n\n');
});

console.log('\n\n=== TAB 2: TOP 50 WITH STOP WORDS MIXED IN ===');
console.log('(Showing position among ALL words, filtered words in CAPS)\n');

// Get positions of filtered words among all words
const filteredSet = new Set(top50filtered.map(([word]) => word));
let count = 0;
let line = [];
for (let i = 0; i < allWords.length && count < 50; i++) {
    const [word] = allWords[i];
    if (filteredSet.has(word)) {
        line.push(word.toUpperCase());
        count++;
    } else if (!stopWords.has(word) || word.length <= 2) {
        continue; // Skip other non-stop words
    } else {
        line.push(word); // stop word lowercase
    }
    
    if (line.length >= 10) {
        console.log(line.join(', '));
        console.log('');
        line = [];
    }
}
if (line.length > 0) console.log(line.join(', '));

console.log('\n\n=== TAB 3: TOP 100 FILTERED (EXTENDED) ===');
console.log('(Words 51-100 shown separately)\n');

console.log('WORDS 1-50 (same as Tab 1):');
top50filtered.forEach(([word], i) => {
    process.stdout.write(word.toUpperCase());
    if (i < top50filtered.length - 1) process.stdout.write(', ');
    if ((i + 1) % 10 === 0) process.stdout.write('\n\n');
});

console.log('\n\nWORDS 51-100 (continuing):');
top100filtered.slice(50).forEach(([word], i) => {
    process.stdout.write(word.toUpperCase());
    if (i < 49) process.stdout.write(', ');
    if ((i + 1) % 10 === 0) process.stdout.write('\n\n');
});
