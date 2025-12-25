#!/usr/bin/env python3
"""
Create CSV files for Tableau Bible Arc Diagram
Based on original structure by Robert Rouse (viz.bible)
"""

import json
import csv
from pathlib import Path

print("="*60)
print("Creating Tableau CSV Files for Bible Arc Diagram")
print("="*60)
print()

# Load graph data
print("[1/4] Loading graph data...")
with open('shared-data/processed/graph_data.json', 'r', encoding='utf-8') as f:
    graph_data = json.load(f)

# Load Bible text (KJV)
print("[2/4] Loading Bible text...")
with open('bible-analysis-tool/bible-kjv-converted.json', 'r', encoding='utf-8') as f:
    kjv_data = json.load(f)

print(f"      Loaded {len(graph_data['chapters'])} chapters")
print(f"      Loaded {len(graph_data['connections'])} connections")
print(f"      Loaded {len(kjv_data)} verses")
print()

# ============================================================
# 1. CREATE BOOKS.CSV
# ============================================================
print("[3/4] Creating Books.csv...")

books = {}
book_order = []

for ch in graph_data['chapters']:
    book_name = ch['book']
    if book_name not in books:
        books[book_name] = {
            'id': len(books) + 1,
            'name': book_name,
            'testament': ch.get('testament', 'OT'),
            'max_chapter': ch['chapter']
        }
        book_order.append(book_name)
    else:
        books[book_name]['max_chapter'] = max(books[book_name]['max_chapter'], ch['chapter'])

# Write Books.csv
with open('Books.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['BookID', 'BookName', 'NumOfChapters', 'BookDiv', 'ShortName'])

    for book_name in book_order:
        b = books[book_name]
        # Create short name (first 3-4 letters)
        short_name = book_name[:4] if len(book_name) > 4 else book_name
        writer.writerow([b['id'], book_name, b['max_chapter'], b['testament'], short_name])

print(f"      [OK] Books.csv created ({len(books)} books)")

# ============================================================
# 2. CREATE CHAPTERINDEXES.CSV
# ============================================================
print("      Creating chapterIndexes.csv...")

with open('chapterIndexes.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f, delimiter='\t')  # Tab-delimited like original
    writer.writerow(['Book ID', 'Chapter', 'chapSeq'])

    for idx, ch in enumerate(graph_data['chapters'], start=1):
        book_id = books[ch['book']]['id']
        writer.writerow([book_id, ch['chapter'], idx])

print(f"      [OK] chapterIndexes.csv created ({len(graph_data['chapters'])} chapters)")

# ============================================================
# 3. CREATE VERSES.CSV
# ============================================================
print("      Creating Verses.csv...")

verse_id = 1
verses_data = []

for verse_ref, verse_text in kjv_data.items():
    # Parse "Genesis 1:1" format
    try:
        # Handle various formats
        if ':' in verse_ref:
            parts = verse_ref.rsplit(' ', 1)  # Split from right to get chapter:verse
            book_name = parts[0]
            chapter_verse = parts[1].split(':')

            if len(chapter_verse) == 2:
                chapter = int(chapter_verse[0])
                verse_num = int(chapter_verse[1])

                if book_name in books:
                    book_id = books[book_name]['id']
                    # Truncate verse text to reasonable length for Tableau
                    text_truncated = verse_text[:200] if len(verse_text) > 200 else verse_text
                    verses_data.append([verse_id, book_id, chapter, verse_num, text_truncated])
                    verse_id += 1
    except Exception as e:
        # Skip malformed references
        pass

# Write Verses.csv
with open('Verses.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['VerseID', 'BookID', 'Chapter', 'VerseNum', 'VerseText'])
    for v in verses_data:
        writer.writerow(v)

print(f"      [OK] Verses.csv created ({len(verses_data)} verses)")

# ============================================================
# 4. CREATE CROSSREFINDEX.CSV
# ============================================================
print("      Creating CrossRefIndex.csv...")

# Create verse lookup: "Genesis 1:1" -> VerseID
verse_lookup = {}
for i, verse_ref in enumerate(kjv_data.keys(), start=1):
    verse_lookup[verse_ref] = i

# Create chapter -> first verse mapping
chapter_first_verse = {}
for verse_ref in kjv_data.keys():
    try:
        if ':' in verse_ref:
            parts = verse_ref.rsplit(' ', 1)
            book_name = parts[0]
            chapter_verse = parts[1].split(':')

            if len(chapter_verse) == 2:
                chapter = int(chapter_verse[0])
                verse_num = int(chapter_verse[1])

                if book_name in books:
                    key = f"{book_name}_{chapter}"
                    if key not in chapter_first_verse or verse_num < chapter_first_verse[key][1]:
                        chapter_first_verse[key] = (verse_ref, verse_num)
    except:
        pass

# Convert chapter connections to verse connections
crossref_pairs = []
for conn in graph_data['connections']:
    source_ch = next((ch for ch in graph_data['chapters'] if ch['id'] == conn['source']), None)
    target_ch = next((ch for ch in graph_data['chapters'] if ch['id'] == conn['target']), None)

    if source_ch and target_ch:
        source_key = f"{source_ch['book']}_{source_ch['chapter']}"
        target_key = f"{target_ch['book']}_{target_ch['chapter']}"

        source_verse_ref = chapter_first_verse.get(source_key, [None])[0]
        target_verse_ref = chapter_first_verse.get(target_key, [None])[0]

        if source_verse_ref and target_verse_ref:
            source_id = verse_lookup.get(source_verse_ref)
            target_id = verse_lookup.get(target_verse_ref)

            if source_id and target_id:
                crossref_pairs.append([source_id, target_id])

# Write CrossRefIndex.csv
with open('CrossRefIndex.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['VerseID', 'VerseRefID'])
    for pair in crossref_pairs:
        writer.writerow(pair)

print(f"      [OK] CrossRefIndex.csv created ({len(crossref_pairs)} cross-references)")

# ============================================================
# SUMMARY
# ============================================================
print()
print("="*60)
print("[SUCCESS] ALL CSV FILES CREATED SUCCESSFULLY!")
print("="*60)
print()
print("Files created in current directory:")
print("  1. Books.csv                 - 66 Bible books")
print("  2. chapterIndexes.csv        - 1,189 chapters with sequential IDs")
print("  3. Verses.csv                - All Bible verses")
print("  4. CrossRefIndex.csv         - Cross-reference connections")
print()
print("NEXT STEPS:")
print("  1. Open Tableau Desktop")
print("  2. Connect to CrossRefIndex.csv")
print("  3. Add joins to other CSV files (see TABLEAU_ARC_DIAGRAM_GUIDE.md)")
print("  4. Create calculated fields")
print("  5. Build the arc diagram visualization")
print()
print("See TABLEAU_ARC_DIAGRAM_GUIDE.md for complete instructions!")
print("="*60)
