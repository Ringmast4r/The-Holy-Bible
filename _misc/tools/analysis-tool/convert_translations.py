#!/usr/bin/env python3
"""
Convert different Bible translation formats to uniform JSON format
"""

import json

def convert_getbible_format(input_file, output_file):
    """Convert GetBible API format (WEB, YLT) to simple verse format"""
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    verses = {}

    for book in data.get('books', []):
        book_name = book.get('name', '')
        for chapter in book.get('chapters', []):
            for verse in chapter.get('verses', []):
                ref = verse.get('name', '')
                text = verse.get('text', '')
                if ref and text:
                    verses[ref] = text

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(verses, f, ensure_ascii=False, indent=2)

    print(f"Converted {input_file} -> {output_file}: {len(verses)} verses")

def convert_bibleapi_format(input_file, output_file):
    """Convert bibleapi format (ASV) to simple verse format"""
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    verses = {}

    # ASV format: resultset -> row -> field
    rows = data.get('resultset', {}).get('row', [])

    # Book name mapping (book number to name)
    book_map = {
        1: 'Genesis', 2: 'Exodus', 3: 'Leviticus', 4: 'Numbers', 5: 'Deuteronomy',
        6: 'Joshua', 7: 'Judges', 8: 'Ruth', 9: '1 Samuel', 10: '2 Samuel',
        11: '1 Kings', 12: '2 Kings', 13: '1 Chronicles', 14: '2 Chronicles',
        15: 'Ezra', 16: 'Nehemiah', 17: 'Esther', 18: 'Job', 19: 'Psalms',
        20: 'Proverbs', 21: 'Ecclesiastes', 22: 'Song of Solomon', 23: 'Isaiah',
        24: 'Jeremiah', 25: 'Lamentations', 26: 'Ezekiel', 27: 'Daniel',
        28: 'Hosea', 29: 'Joel', 30: 'Amos', 31: 'Obadiah', 32: 'Jonah',
        33: 'Micah', 34: 'Nahum', 35: 'Habakkuk', 36: 'Zephaniah', 37: 'Haggai',
        38: 'Zechariah', 39: 'Malachi', 40: 'Matthew', 41: 'Mark', 42: 'Luke',
        43: 'John', 44: 'Acts', 45: 'Romans', 46: '1 Corinthians', 47: '2 Corinthians',
        48: 'Galatians', 49: 'Ephesians', 50: 'Philippians', 51: 'Colossians',
        52: '1 Thessalonians', 53: '2 Thessalonians', 54: '1 Timothy', 55: '2 Timothy',
        56: 'Titus', 57: 'Philemon', 58: 'Hebrews', 59: 'James', 60: '1 Peter',
        61: '2 Peter', 62: '1 John', 63: '2 John', 64: '3 John', 65: 'Jude',
        66: 'Revelation'
    }

    for row in rows:
        fields = row.get('field', [])
        if len(fields) >= 5:
            # field format: [id, book_num, chapter, verse, text]
            book_num = fields[1]
            chapter = fields[2]
            verse = fields[3]
            text = fields[4]

            book_name = book_map.get(book_num, f'Book{book_num}')
            ref = f"{book_name} {chapter}:{verse}"
            verses[ref] = text

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(verses, f, ensure_ascii=False, indent=2)

    print(f"Converted {input_file} -> {output_file}: {len(verses)} verses")

if __name__ == "__main__":
    print("Converting Bible translations to uniform format...\n")

    # Convert WEB
    convert_getbible_format('bible-web.json', 'bible-web-converted.json')

    # Convert YLT
    convert_getbible_format('bible-ylt.json', 'bible-ylt-converted.json')

    # Convert ASV
    convert_bibleapi_format('bible-asv.json', 'bible-asv-converted.json')

    print("\n✓ All translations converted successfully!")
