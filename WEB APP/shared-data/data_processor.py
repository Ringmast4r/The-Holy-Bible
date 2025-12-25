#!/usr/bin/env python3
"""
Bible Cross-Reference Data Processor
Converts cross_references.txt into visualization-ready formats
"""

import json
import re
from collections import defaultdict

# Bible book metadata
BIBLE_BOOKS = [
    {'name': 'Genesis', 'abbrev': 'Gen', 'chapters': 50, 'testament': 'OT'},
    {'name': 'Exodus', 'abbrev': 'Exod', 'chapters': 40, 'testament': 'OT'},
    {'name': 'Leviticus', 'abbrev': 'Lev', 'chapters': 27, 'testament': 'OT'},
    {'name': 'Numbers', 'abbrev': 'Num', 'chapters': 36, 'testament': 'OT'},
    {'name': 'Deuteronomy', 'abbrev': 'Deut', 'chapters': 34, 'testament': 'OT'},
    {'name': 'Joshua', 'abbrev': 'Josh', 'chapters': 24, 'testament': 'OT'},
    {'name': 'Judges', 'abbrev': 'Judg', 'chapters': 21, 'testament': 'OT'},
    {'name': 'Ruth', 'abbrev': 'Ruth', 'chapters': 4, 'testament': 'OT'},
    {'name': '1 Samuel', 'abbrev': '1Sam', 'chapters': 31, 'testament': 'OT'},
    {'name': '2 Samuel', 'abbrev': '2Sam', 'chapters': 24, 'testament': 'OT'},
    {'name': '1 Kings', 'abbrev': '1Kgs', 'chapters': 22, 'testament': 'OT'},
    {'name': '2 Kings', 'abbrev': '2Kgs', 'chapters': 25, 'testament': 'OT'},
    {'name': '1 Chronicles', 'abbrev': '1Chr', 'chapters': 29, 'testament': 'OT'},
    {'name': '2 Chronicles', 'abbrev': '2Chr', 'chapters': 36, 'testament': 'OT'},
    {'name': 'Ezra', 'abbrev': 'Ezra', 'chapters': 10, 'testament': 'OT'},
    {'name': 'Nehemiah', 'abbrev': 'Neh', 'chapters': 13, 'testament': 'OT'},
    {'name': 'Esther', 'abbrev': 'Esth', 'chapters': 10, 'testament': 'OT'},
    {'name': 'Job', 'abbrev': 'Job', 'chapters': 42, 'testament': 'OT'},
    {'name': 'Psalms', 'abbrev': 'Ps', 'chapters': 150, 'testament': 'OT'},
    {'name': 'Proverbs', 'abbrev': 'Prov', 'chapters': 31, 'testament': 'OT'},
    {'name': 'Ecclesiastes', 'abbrev': 'Eccl', 'chapters': 12, 'testament': 'OT'},
    {'name': 'Song of Solomon', 'abbrev': 'Song', 'chapters': 8, 'testament': 'OT'},
    {'name': 'Isaiah', 'abbrev': 'Isa', 'chapters': 66, 'testament': 'OT'},
    {'name': 'Jeremiah', 'abbrev': 'Jer', 'chapters': 52, 'testament': 'OT'},
    {'name': 'Lamentations', 'abbrev': 'Lam', 'chapters': 5, 'testament': 'OT'},
    {'name': 'Ezekiel', 'abbrev': 'Ezek', 'chapters': 48, 'testament': 'OT'},
    {'name': 'Daniel', 'abbrev': 'Dan', 'chapters': 12, 'testament': 'OT'},
    {'name': 'Hosea', 'abbrev': 'Hos', 'chapters': 14, 'testament': 'OT'},
    {'name': 'Joel', 'abbrev': 'Joel', 'chapters': 3, 'testament': 'OT'},
    {'name': 'Amos', 'abbrev': 'Amos', 'chapters': 9, 'testament': 'OT'},
    {'name': 'Obadiah', 'abbrev': 'Obad', 'chapters': 1, 'testament': 'OT'},
    {'name': 'Jonah', 'abbrev': 'Jonah', 'chapters': 4, 'testament': 'OT'},
    {'name': 'Micah', 'abbrev': 'Mic', 'chapters': 7, 'testament': 'OT'},
    {'name': 'Nahum', 'abbrev': 'Nah', 'chapters': 3, 'testament': 'OT'},
    {'name': 'Habakkuk', 'abbrev': 'Hab', 'chapters': 3, 'testament': 'OT'},
    {'name': 'Zephaniah', 'abbrev': 'Zeph', 'chapters': 3, 'testament': 'OT'},
    {'name': 'Haggai', 'abbrev': 'Hag', 'chapters': 2, 'testament': 'OT'},
    {'name': 'Zechariah', 'abbrev': 'Zech', 'chapters': 14, 'testament': 'OT'},
    {'name': 'Malachi', 'abbrev': 'Mal', 'chapters': 4, 'testament': 'OT'},
    {'name': 'Matthew', 'abbrev': 'Matt', 'chapters': 28, 'testament': 'NT'},
    {'name': 'Mark', 'abbrev': 'Mark', 'chapters': 16, 'testament': 'NT'},
    {'name': 'Luke', 'abbrev': 'Luke', 'chapters': 24, 'testament': 'NT'},
    {'name': 'John', 'abbrev': 'John', 'chapters': 21, 'testament': 'NT'},
    {'name': 'Acts', 'abbrev': 'Acts', 'chapters': 28, 'testament': 'NT'},
    {'name': 'Romans', 'abbrev': 'Rom', 'chapters': 16, 'testament': 'NT'},
    {'name': '1 Corinthians', 'abbrev': '1Cor', 'chapters': 16, 'testament': 'NT'},
    {'name': '2 Corinthians', 'abbrev': '2Cor', 'chapters': 13, 'testament': 'NT'},
    {'name': 'Galatians', 'abbrev': 'Gal', 'chapters': 6, 'testament': 'NT'},
    {'name': 'Ephesians', 'abbrev': 'Eph', 'chapters': 6, 'testament': 'NT'},
    {'name': 'Philippians', 'abbrev': 'Phil', 'chapters': 4, 'testament': 'NT'},
    {'name': 'Colossians', 'abbrev': 'Col', 'chapters': 4, 'testament': 'NT'},
    {'name': '1 Thessalonians', 'abbrev': '1Thess', 'chapters': 5, 'testament': 'NT'},
    {'name': '2 Thessalonians', 'abbrev': '2Thess', 'chapters': 3, 'testament': 'NT'},
    {'name': '1 Timothy', 'abbrev': '1Tim', 'chapters': 6, 'testament': 'NT'},
    {'name': '2 Timothy', 'abbrev': '2Tim', 'chapters': 4, 'testament': 'NT'},
    {'name': 'Titus', 'abbrev': 'Titus', 'chapters': 3, 'testament': 'NT'},
    {'name': 'Philemon', 'abbrev': 'Phlm', 'chapters': 1, 'testament': 'NT'},
    {'name': 'Hebrews', 'abbrev': 'Heb', 'chapters': 13, 'testament': 'NT'},
    {'name': 'James', 'abbrev': 'Jas', 'chapters': 5, 'testament': 'NT'},
    {'name': '1 Peter', 'abbrev': '1Pet', 'chapters': 5, 'testament': 'NT'},
    {'name': '2 Peter', 'abbrev': '2Pet', 'chapters': 3, 'testament': 'NT'},
    {'name': '1 John', 'abbrev': '1John', 'chapters': 5, 'testament': 'NT'},
    {'name': '2 John', 'abbrev': '2John', 'chapters': 1, 'testament': 'NT'},
    {'name': '3 John', 'abbrev': '3John', 'chapters': 1, 'testament': 'NT'},
    {'name': 'Jude', 'abbrev': 'Jude', 'chapters': 1, 'testament': 'NT'},
    {'name': 'Revelation', 'abbrev': 'Rev', 'chapters': 22, 'testament': 'NT'}
]

# Create lookup dictionaries
ABBREV_TO_BOOK = {b['abbrev']: b for b in BIBLE_BOOKS}
BOOK_TO_INDEX = {b['name']: i for i, b in enumerate(BIBLE_BOOKS)}

class BibleDataProcessor:
    def __init__(self, cross_ref_file):
        self.cross_ref_file = cross_ref_file
        self.verse_refs = []
        self.chapter_refs = []
        self.book_refs = []

    def parse_reference(self, ref_str):
        """Parse Gen.1.1 format to structured data"""
        # Handle ranges like Ps.23.1-Ps.23.2
        if '-' in ref_str:
            ref_str = ref_str.split('-')[0]

        parts = ref_str.split('.')
        if len(parts) >= 3:
            abbrev = parts[0]
            chapter = int(parts[1])
            verse = int(parts[2])

            book_info = ABBREV_TO_BOOK.get(abbrev)
            if book_info:
                return {
                    'book': book_info['name'],
                    'book_abbrev': abbrev,
                    'chapter': chapter,
                    'verse': verse,
                    'book_index': BOOK_TO_INDEX[book_info['name']],
                    'testament': book_info['testament'],
                    'full_ref': f"{book_info['name']} {chapter}:{verse}"
                }
        return None

    def load_cross_references(self):
        """Load and parse cross-references"""
        print("Loading cross-references...")

        with open(self.cross_ref_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()[1:]  # Skip header

        for line in lines:
            parts = line.strip().split('\t')
            if len(parts) >= 3:
                from_ref = self.parse_reference(parts[0])
                to_ref = self.parse_reference(parts[1])

                try:
                    votes = int(parts[2])
                except:
                    votes = 0

                if from_ref and to_ref:
                    self.verse_refs.append({
                        'from': from_ref,
                        'to': to_ref,
                        'votes': votes
                    })

        print(f"Loaded {len(self.verse_refs)} verse-level cross-references")

    def aggregate_to_chapters(self):
        """Aggregate verse references to chapter level"""
        print("Aggregating to chapter level...")

        chapter_connections = defaultdict(lambda: defaultdict(int))

        for ref in self.verse_refs:
            from_chapter = f"{ref['from']['book']} {ref['from']['chapter']}"
            to_chapter = f"{ref['to']['book']} {ref['to']['chapter']}"

            if from_chapter != to_chapter:
                chapter_connections[from_chapter][to_chapter] += abs(ref['votes'])

        # Convert to list
        for from_ch, connections in chapter_connections.items():
            for to_ch, weight in connections.items():
                self.chapter_refs.append({
                    'from': from_ch,
                    'to': to_ch,
                    'weight': weight
                })

        print(f"Created {len(self.chapter_refs)} chapter-level connections")

    def aggregate_to_books(self):
        """Aggregate to book level for matrix visualization"""
        print("Aggregating to book level...")

        book_connections = defaultdict(lambda: defaultdict(int))

        for ref in self.verse_refs:
            from_book = ref['from']['book']
            to_book = ref['to']['book']

            if from_book != to_book:
                book_connections[from_book][to_book] += abs(ref['votes'])

        # Convert to matrix format
        matrix = [[0] * 66 for _ in range(66)]

        for from_book, connections in book_connections.items():
            from_idx = BOOK_TO_INDEX.get(from_book)
            if from_idx is not None:
                for to_book, count in connections.items():
                    to_idx = BOOK_TO_INDEX.get(to_book)
                    if to_idx is not None:
                        matrix[from_idx][to_idx] = count

        self.book_refs = matrix
        print(f"Created 66x66 book connection matrix")

    def export_for_web(self, output_file):
        """Export data in web-friendly JSON format"""
        print(f"Exporting web data to {output_file}...")

        # Prepare chapter nodes (for arc diagram)
        chapter_nodes = []
        chapter_index = 0

        for book in BIBLE_BOOKS:
            for ch in range(1, book['chapters'] + 1):
                chapter_nodes.append({
                    'id': chapter_index,
                    'label': f"{book['name']} {ch}",
                    'book': book['name'],
                    'chapter': ch,
                    'book_index': BOOK_TO_INDEX[book['name']],
                    'testament': book['testament']
                })
                chapter_index += 1

        # Prepare edges with node indices
        chapter_map = {node['label']: node['id'] for node in chapter_nodes}

        edges = []
        for ref in self.chapter_refs:
            if ref['from'] in chapter_map and ref['to'] in chapter_map:
                edges.append({
                    'source': chapter_map[ref['from']],
                    'target': chapter_map[ref['to']],
                    'weight': ref['weight']
                })

        web_data = {
            'metadata': {
                'total_books': 66,
                'total_chapters': len(chapter_nodes),
                'total_connections': len(edges),
                'total_verse_refs': len(self.verse_refs)
            },
            'books': BIBLE_BOOKS,
            'chapters': chapter_nodes,
            'connections': edges,
            'book_matrix': self.book_refs
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(web_data, f, indent=2)

        print(f"[OK] Web data exported successfully")

    def export_stats(self, output_file):
        """Export statistical summary"""
        print(f"Generating statistics...")

        # Top referenced books
        book_in_refs = defaultdict(int)
        book_out_refs = defaultdict(int)

        for ref in self.verse_refs:
            book_out_refs[ref['from']['book']] += 1
            book_in_refs[ref['to']['book']] += 1

        top_in = sorted(book_in_refs.items(), key=lambda x: x[1], reverse=True)[:10]
        top_out = sorted(book_out_refs.items(), key=lambda x: x[1], reverse=True)[:10]

        stats = {
            'total_verse_references': len(self.verse_refs),
            'total_chapter_connections': len(self.chapter_refs),
            'most_referenced_books': [{'book': b, 'count': c} for b, c in top_in],
            'most_referencing_books': [{'book': b, 'count': c} for b, c in top_out],
            'testament_distribution': {
                'OT_to_OT': sum(1 for r in self.verse_refs if r['from']['testament'] == 'OT' and r['to']['testament'] == 'OT'),
                'OT_to_NT': sum(1 for r in self.verse_refs if r['from']['testament'] == 'OT' and r['to']['testament'] == 'NT'),
                'NT_to_OT': sum(1 for r in self.verse_refs if r['from']['testament'] == 'NT' and r['to']['testament'] == 'OT'),
                'NT_to_NT': sum(1 for r in self.verse_refs if r['from']['testament'] == 'NT' and r['to']['testament'] == 'NT')
            }
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(stats, f, indent=2)

        print(f"[OK] Statistics exported")

def main():
    print("Bible Cross-Reference Data Processor")
    print("=" * 50)

    processor = BibleDataProcessor('../cross_references.txt')

    # Process data
    processor.load_cross_references()
    processor.aggregate_to_chapters()
    processor.aggregate_to_books()

    # Export
    processor.export_for_web('processed/graph_data.json')
    processor.export_stats('processed/stats.json')

    print("\n[OK] All data processing complete!")
    print("\nGenerated files:")
    print("  - processed/graph_data.json  (for web visualizer)")
    print("  - processed/stats.json       (statistics)")

if __name__ == "__main__":
    main()
