#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bible Analysis Tool
A beautiful command-line Bible analysis tool with search and cross-reference features
"""

import json
import re
import os
import sys
import time
import random
from collections import defaultdict
from colorama import init, Fore, Back, Style

# Enable Windows VT100 terminal for better Unicode support
if sys.platform == 'win32':
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        # Enable ANSI escape code processing (Windows 10+)
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
        # Set UTF-8 output encoding
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        # Fallback for older Windows versions
        os.system('chcp 65001 > nul')
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')

# Initialize colorama for Windows color support
init(autoreset=True)

# RGB color helper functions (DEATH-STAR style)
def rgb(r, g, b):
    """Create RGB color escape code for vibrant terminal colors"""
    return f'\033[38;2;{r};{g};{b}m'

def rgb_bg(r, g, b):
    """Create RGB background color escape code"""
    return f'\033[48;2;{r};{g};{b}m'

RESET = '\033[0m'

# Theme definitions (DEATH-STAR inspired multi-theme system)
THEMES = {
    "professional": {
        "name": "Professional",
        "primary": rgb(70, 130, 180),      # Steel blue
        "secondary": rgb(176, 196, 222),   # Light steel blue
        "accent": rgb(255, 215, 0),        # Gold
        "success": rgb(60, 179, 113),      # Medium sea green
        "error": rgb(220, 20, 60),         # Crimson
        "text": rgb(240, 240, 240),        # Off-white
        "dim": rgb(169, 169, 169),         # Dark gray
        "highlight_bg": rgb(255, 215, 0),  # Gold
        "highlight_fg": rgb(0, 0, 0),      # Black
    },
    "vibrant": {
        "name": "Vibrant",
        "primary": rgb(0, 255, 255),       # Electric cyan
        "secondary": rgb(255, 0, 255),     # Hot magenta
        "accent": rgb(255, 215, 0),        # Bright gold
        "success": rgb(0, 255, 65),        # Neon green
        "error": rgb(255, 0, 0),           # Bright red
        "text": rgb(255, 255, 255),        # Pure white
        "dim": rgb(128, 128, 128),         # Medium gray
        "highlight_bg": rgb(255, 255, 0),  # Yellow
        "highlight_fg": rgb(0, 0, 0),      # Black
    },
    "matrix": {
        "name": "Matrix",
        "primary": rgb(0, 255, 65),        # Matrix green
        "secondary": rgb(0, 150, 40),      # Dark green
        "accent": rgb(0, 255, 127),        # Spring green
        "success": rgb(50, 205, 50),       # Lime green
        "error": rgb(255, 0, 0),           # Red
        "text": rgb(200, 255, 200),        # Light green
        "dim": rgb(100, 100, 100),         # Gray
        "highlight_bg": rgb(0, 255, 65),   # Matrix green
        "highlight_fg": rgb(0, 0, 0),      # Black
    },
    "sunset": {
        "name": "Sunset",
        "primary": rgb(255, 127, 80),      # Coral
        "secondary": rgb(255, 165, 0),     # Orange
        "accent": rgb(255, 215, 0),        # Gold
        "success": rgb(255, 140, 0),       # Dark orange
        "error": rgb(178, 34, 34),         # Firebrick
        "text": rgb(255, 250, 240),        # Floral white
        "dim": rgb(160, 160, 160),         # Gray
        "highlight_bg": rgb(255, 140, 0),  # Dark orange
        "highlight_fg": rgb(255, 255, 255),# White
    },
    "royal": {
        "name": "Royal",
        "primary": rgb(138, 43, 226),      # Blue-violet
        "secondary": rgb(147, 112, 219),   # Medium purple
        "accent": rgb(255, 215, 0),        # Gold
        "success": rgb(72, 61, 139),       # Dark slate blue
        "error": rgb(220, 20, 60),         # Crimson
        "text": rgb(248, 248, 255),        # Ghost white
        "dim": rgb(169, 169, 169),         # Dark gray
        "highlight_bg": rgb(255, 215, 0),  # Gold
        "highlight_fg": rgb(75, 0, 130),   # Indigo
    },
    "ocean": {
        "name": "Ocean",
        "primary": rgb(0, 191, 255),       # Deep sky blue
        "secondary": rgb(64, 224, 208),    # Turquoise
        "accent": rgb(0, 255, 255),        # Cyan
        "success": rgb(32, 178, 170),      # Light sea green
        "error": rgb(220, 20, 60),         # Crimson
        "text": rgb(240, 255, 255),        # Azure
        "dim": rgb(119, 136, 153),         # Light slate gray
        "highlight_bg": rgb(0, 255, 255),  # Cyan
        "highlight_fg": rgb(0, 0, 0),      # Black
    }
}

# Default static color class for loading screen (always professional)
class LoadingColors:
    """Professional colors for loading screen"""
    GOLD = rgb(70, 130, 180)           # Steel blue
    CYAN = rgb(176, 196, 222)          # Light steel blue
    GREEN = rgb(60, 179, 113)          # Medium sea green
    WHITE = rgb(240, 240, 240)         # Off-white
    GRAY = rgb(169, 169, 169)          # Dark gray
    SUCCESS = rgb(60, 179, 113)        # Medium sea green
    ERROR = rgb(220, 20, 60)           # Crimson
    RESET = RESET

# Dynamic color class (changes with theme)
class Colors:
    """Dynamic colors that change based on current theme"""

    @staticmethod
    def set_theme(theme_name):
        """Update colors based on theme"""
        theme = THEMES.get(theme_name, THEMES["professional"])

        Colors.BRIGHT_GOLD = theme["accent"]
        Colors.BRIGHT_CYAN = theme["primary"]
        Colors.BRIGHT_GREEN = theme["success"]
        Colors.BRIGHT_MAGENTA = theme["secondary"]
        Colors.BRIGHT_BLUE = theme["primary"]
        Colors.BRIGHT_WHITE = theme["text"]
        Colors.BRIGHT_RED = theme["error"]
        Colors.ORANGE = theme["accent"]
        Colors.LIME = theme["success"]
        Colors.PINK = theme["secondary"]
        Colors.PURPLE = theme["secondary"]
        Colors.YELLOW = theme["accent"]

        Colors.GRAY = theme["dim"]
        Colors.DIM_CYAN = theme["secondary"]
        Colors.DIM_GOLD = theme["accent"]

        # Legacy names
        Colors.GOLD = Colors.BRIGHT_GOLD
        Colors.CYAN = Colors.BRIGHT_CYAN
        Colors.GREEN = Colors.BRIGHT_GREEN
        Colors.RED = Colors.BRIGHT_RED
        Colors.BLUE = Colors.BRIGHT_BLUE
        Colors.MAGENTA = Colors.BRIGHT_MAGENTA
        Colors.WHITE = Colors.BRIGHT_WHITE

        # Special combinations
        Colors.TITLE = Colors.BRIGHT_CYAN
        Colors.VERSE_REF = Colors.BRIGHT_GOLD
        Colors.VERSE_TEXT = Colors.BRIGHT_WHITE
        Colors.CROSS_REF = Colors.BRIGHT_MAGENTA
        Colors.HIGHLIGHT = rgb_bg(*_rgb_tuple(theme["highlight_bg"])) + rgb(*_rgb_tuple(theme["highlight_fg"]))
        Colors.SUCCESS = Colors.BRIGHT_GREEN
        Colors.ERROR = Colors.BRIGHT_RED
        Colors.PROMPT = Colors.BRIGHT_CYAN

        Colors.RESET = RESET

def _rgb_tuple(color_code):
    """Extract RGB values from color code string"""
    # Parse '\033[38;2;R;G;Bm' format
    import re
    match = re.search(r'38;2;(\d+);(\d+);(\d+)', color_code)
    if match:
        return (int(match.group(1)), int(match.group(2)), int(match.group(3)))
    return (255, 255, 255)

# Initialize with professional theme
Colors.set_theme("professional")

# Border helper functions
def make_border_top(width=78):
    """Create top border"""
    return f"╔{'═' * width}╗"

def make_border_bottom(width=78):
    """Create bottom border"""
    return f"╚{'═' * width}╝"

def make_border_line(text, width=78, align='left'):
    """Create a bordered line with proper padding"""
    # Remove ANSI codes for width calculation
    visible_text = re.sub(r'\033\[[0-9;]+m', '', text)
    visible_len = len(visible_text)

    padding_total = width - visible_len - 2  # -2 for spaces around text

    if align == 'center':
        left_pad = padding_total // 2
        right_pad = padding_total - left_pad
        return f"║ {' ' * left_pad}{text}{' ' * right_pad} ║"
    elif align == 'right':
        return f"║ {' ' * padding_total}{text} ║"
    else:  # left
        return f"║ {text}{' ' * padding_total} ║"

# Beautiful ASCII Art
ASCII_CROSS = f"""{Colors.GOLD}
            ╔═══╗
            ║   ║
        ════╬═══╬════
            ║   ║
            ║   ║
            ║   ║
            ╚═══╝
{Colors.RESET}"""

ASCII_BIBLE = f"""{Colors.CYAN}
        ┌─────────────────────┐
        │  _______________    │
        │ │               │   │
        │ │  HOLY BIBLE   │   │
        │ │_______________│   │
        │                     │
        └─────────────────────┘
{Colors.RESET}"""

class BibleReader:
    def __init__(self):
        self.translations = {}
        self.current_translation = 'KJV'
        self.cross_refs = defaultdict(list)
        self.daily_verses = [
            "John 3:16", "Psalms 23:1", "Philippians 4:13", "Jeremiah 29:11",
            "Romans 8:28", "Proverbs 3:5", "Isaiah 40:31", "Matthew 5:16",
            "1 Corinthians 13:4", "Psalms 46:1", "Joshua 1:9", "Romans 12:2"
        ]

        # Translation metadata
        self.translation_info = {
            'KJV': {'name': 'King James Version', 'year': '1611'},
            'ASV': {'name': 'American Standard Version', 'year': '1901'},
            'WEB': {'name': 'World English Bible', 'year': '2000'},
            'YLT': {'name': "Young's Literal Translation", 'year': '1898'}
        }

        # Theme system
        self.theme_list = ["professional", "vibrant", "matrix", "sunset", "royal", "ocean"]
        self.current_theme = "professional"
        Colors.set_theme(self.current_theme)

        print(f"\n{Colors.CYAN}╔══════════════════════════════════════════════════════════════════╗")
        print(f"║                    Loading Bible Data...                     ║")
        print(f"╚══════════════════════════════════════════════════════════════════╝{Colors.RESET}\n")

        self.load_all_translations()
        self.load_cross_references()

    def load_all_translations(self):
        """Load all available Bible translations"""
        translation_files = {
            'KJV': 'bible-kjv-converted.json',
            'ASV': 'bible-asv-converted.json',
            'WEB': 'bible-web-converted.json',
            'YLT': 'bible-ylt-converted.json'
        }

        for abbrev, filename in translation_files.items():
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    self.translations[abbrev] = json.load(f)
                info = self.translation_info.get(abbrev, {})
                print(f"{Colors.SUCCESS}  ✓ {abbrev} loaded - {info.get('name', abbrev)} ({len(self.translations[abbrev]):,} verses){Colors.RESET}")
            except FileNotFoundError:
                if abbrev == 'KJV':
                    # Fallback to original KJV file
                    try:
                        with open('bible-kjv.json', 'r', encoding='utf-8') as f:
                            self.translations[abbrev] = json.load(f)
                        print(f"{Colors.SUCCESS}  ✓ {abbrev} loaded - King James Version ({len(self.translations[abbrev]):,} verses){Colors.RESET}")
                    except:
                        print(f"{Colors.ERROR}  ✗ Error loading {abbrev}{Colors.RESET}")
            except Exception as e:
                print(f"{Colors.ERROR}  ✗ Error loading {abbrev}: {e}{Colors.RESET}")

        if not self.translations:
            print(f"{Colors.ERROR}  ✗ No translations loaded! Please check your files.{Colors.RESET}")
        else:
            print(f"\n{Colors.GOLD}  → Current translation: {self.current_translation} ({self.translation_info[self.current_translation]['name']}){Colors.RESET}\n")

    @property
    def bible_data(self):
        """Get current translation data"""
        return self.translations.get(self.current_translation, {})

    def expand_book_name(self, abbrev):
        """Expand book abbreviation to full name"""
        book_map = {
            'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
            'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
            '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
            'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms',
            'Prov': 'Proverbs', 'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
            'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
            'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah', 'Jonah': 'Jonah',
            'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai',
            'Zech': 'Zechariah', 'Mal': 'Malachi', 'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke',
            'John': 'John', 'Acts': 'Acts', 'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians',
            'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians',
            '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy',
            'Titus': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter',
            '2Pet': '2 Peter', '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude',
            'Rev': 'Revelation'
        }
        return book_map.get(abbrev, abbrev)

    def convert_ref_format(self, ref):
        """Convert Gen.1.1 or Ps.23.1-Ps.23.2 format to Genesis 1:1 format"""
        if '-' in ref:
            parts = ref.split('-')
            start = self.convert_ref_format(parts[0])
            return start

        parts = ref.split('.')
        if len(parts) >= 3:
            book = self.expand_book_name(parts[0])
            chapter = parts[1]
            verse = parts[2]
            return f"{book} {chapter}:{verse}"
        return ref

    def load_cross_references(self):
        """Load cross-reference data"""
        try:
            with open('cross_references.txt', 'r', encoding='utf-8') as f:
                lines = f.readlines()[1:]
                for line in lines:
                    parts = line.strip().split('\t')
                    if len(parts) >= 3:
                        from_verse = self.convert_ref_format(parts[0])
                        to_verse = self.convert_ref_format(parts[1])
                        try:
                            votes = int(parts[2])
                            self.cross_refs[from_verse].append({
                                'verse': to_verse,
                                'votes': votes
                            })
                        except ValueError:
                            pass

            for verse in self.cross_refs:
                self.cross_refs[verse].sort(key=lambda x: x['votes'], reverse=True)

            print(f"{Colors.SUCCESS}  ✓ Cross-references loaded - {len(self.cross_refs):,} verses with connections{Colors.RESET}")
        except Exception as e:
            print(f"{Colors.ERROR}  ✗ Error loading cross-references: {e}{Colors.RESET}")

    def format_verse_text(self, text):
        """Format verse text with colors"""
        text = text.replace('# ', '')
        # Color italic words (words in brackets) in gray
        text = re.sub(r'\[([^\]]+)\]', f'{Colors.GRAY}[\\1]{Colors.RESET}', text)
        return text

    def get_verse(self, reference):
        """Get a specific verse by reference"""
        if reference in self.bible_data:
            return self.bible_data[reference]
        for key in self.bible_data.keys():
            if key.lower() == reference.lower():
                return self.bible_data[key]
        return None

    def display_verse(self, reference, show_refs=True):
        """Display a verse with beautiful formatting, metadata panel, and cross-references"""
        text = self.get_verse(reference)

        if text:
            # Parse reference for metadata
            parts = reference.split()
            book = ' '.join(parts[:-1]) if len(parts) > 1 else reference
            chapter_verse = parts[-1] if len(parts) > 1 else ''

            # Get translation info
            trans_info = self.translation_info.get(self.current_translation, {})
            trans_name = trans_info.get('name', self.current_translation)
            trans_year = trans_info.get('year', 'N/A')

            # Count characters and words
            plain_text = re.sub(r'\[([^\]]+)\]', r'\1', text)
            char_count = len(plain_text)
            word_count = len(plain_text.split())

            # Metadata panel
            header = f"{Colors.BRIGHT_GOLD}VERSE DETAILS{Colors.RESET}"
            ref_line = f"{Colors.DIM_CYAN}Reference:{Colors.RESET}  {Colors.BRIGHT_WHITE}{reference}{Colors.RESET}"
            book_line = f"{Colors.DIM_CYAN}Book:{Colors.RESET}       {Colors.BRIGHT_WHITE}{book}{Colors.RESET}"
            trans_line = f"{Colors.DIM_CYAN}Translation:{Colors.RESET} {Colors.ORANGE}{trans_name} ({trans_year}){Colors.RESET}"
            stats_line = f"{Colors.DIM_CYAN}Stats:{Colors.RESET}      {Colors.LIME}{word_count} words{Colors.RESET}, {Colors.PINK}{char_count} characters{Colors.RESET}"

            print(f"\n{Colors.BRIGHT_CYAN}{make_border_top()}")
            print(make_border_line(header, align='center'))
            print(f"╠{'═' * 78}╣")
            print(make_border_line(ref_line))
            print(make_border_line(book_line))
            print(make_border_line(trans_line))
            print(make_border_line(stats_line))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

            # Verse text panel
            text_header = f"{Colors.BRIGHT_WHITE}TEXT{Colors.RESET}"
            print(f"{Colors.BRIGHT_GOLD}{make_border_top()}")
            print(make_border_line(text_header, align='center'))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

            # Word wrap for long verses
            formatted = self.format_verse_text(text)
            words = formatted.split()
            lines = []
            current_line = ""

            for word in words:
                test_line = current_line + " " + word if current_line else word
                # Account for ANSI codes in length check
                visible_length = len(re.sub(r'\033\[[0-9;]+m', '', test_line))
                if visible_length <= 74:
                    current_line = test_line
                else:
                    lines.append(current_line)
                    current_line = word
            if current_line:
                lines.append(current_line)

            for line in lines:
                print(f"  {Colors.VERSE_TEXT}{line}{Colors.RESET}")
            print()

            if show_refs:
                self.display_cross_references(reference)
        else:
            error_header = f"{Colors.BRIGHT_WHITE}ERROR{Colors.RESET}"
            error_msg = f"{Colors.WHITE}Verse not found: {reference}{Colors.RESET}"
            print(f"\n{Colors.BRIGHT_RED}{make_border_top()}")
            print(make_border_line(error_header, align='center'))
            print(f"╠{'═' * 78}╣")
            print(make_border_line(error_msg))
            print(f"╚════════════════════════════════════════════════════════════════════════════╝{Colors.RESET}\n")

    def display_cross_references(self, reference, limit=5):
        """Display cross-references with statistics panel"""
        refs = self.cross_refs.get(reference, [])

        if refs:
            total_refs = len(refs)
            showing = min(limit, total_refs)

            # Stats panel
            header = f"{Colors.BRIGHT_GOLD}CROSS-REFERENCES{Colors.RESET}"
            total_line = f"{Colors.DIM_CYAN}Total Found:{Colors.RESET}  {Colors.LIME}{total_refs} related verses{Colors.RESET}"
            showing_line = f"{Colors.DIM_CYAN}Showing:{Colors.RESET}      {Colors.ORANGE}Top {showing} most voted{Colors.RESET}"

            print(f"{Colors.BRIGHT_MAGENTA}{make_border_top()}")
            print(make_border_line(header, align='center'))
            print(f"╠{'═' * 78}╣")
            print(make_border_line(total_line))
            print(make_border_line(showing_line))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

            for i, ref in enumerate(refs[:limit], 1):
                verse_text = self.get_verse(ref['verse'])
                if verse_text:
                    preview = verse_text[:65] + "..." if len(verse_text) > 65 else verse_text
                    preview = preview.replace('# ', '')
                    preview = re.sub(r'\[([^\]]+)\]', r'\1', preview)
                    votes = ref.get('votes', 0)

                    print(f"  {Colors.BRIGHT_MAGENTA}[{i}]{Colors.RESET} {Colors.BRIGHT_GOLD}{ref['verse']}{Colors.RESET} {Colors.GRAY}({votes} votes){Colors.RESET}")
                    print(f"      {Colors.DIM_CYAN}↳{Colors.RESET} {Colors.WHITE}{preview}{Colors.RESET}\n")

            if len(refs) > limit:
                print(f"{Colors.GRAY}{'─' * 80}")
                print(f"  💡 {len(refs) - limit} more references available")
                print(f"{'─' * 80}{Colors.RESET}\n")

    def search_keyword(self, keyword, limit=15):
        """Search for verses containing a keyword"""
        keyword_lower = keyword.lower()
        results = []

        for ref, text in self.bible_data.items():
            if keyword_lower in text.lower():
                results.append((ref, text))

        if results:
            total_found = len(results)
            showing = min(limit, total_found)

            # Search statistics panel
            header = f"{Colors.BRIGHT_GOLD}SEARCH RESULTS{Colors.RESET}"
            trans_info = self.translation_info[self.current_translation]
            search_line = f"{Colors.DIM_CYAN}Search Term:{Colors.RESET}   {Colors.ORANGE}'{keyword}'{Colors.RESET}"
            trans_line = f"{Colors.DIM_CYAN}Translation:{Colors.RESET}  {Colors.PURPLE}{self.current_translation} - {trans_info['name']}{Colors.RESET}"
            total_line = f"{Colors.DIM_CYAN}Total Found:{Colors.RESET}   {Colors.LIME}{total_found} verses{Colors.RESET}"
            showing_line = f"{Colors.DIM_CYAN}Showing:{Colors.RESET}       {Colors.PINK}{showing} of {total_found} results{Colors.RESET}"

            print(f"\n{Colors.BRIGHT_GREEN}{make_border_top()}")
            print(make_border_line(header, align='center'))
            print(f"╠{'═' * 78}╣")
            print(make_border_line(search_line))
            print(make_border_line(trans_line))
            print(make_border_line(total_line))
            print(make_border_line(showing_line))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

            for i, (ref, text) in enumerate(results[:limit], 1):
                text_display = text.replace('# ', '')
                # Highlight keyword
                pattern = re.compile(re.escape(keyword), re.IGNORECASE)

                # Find the keyword and create highlighted version
                matches = list(pattern.finditer(text_display))
                if matches:
                    highlighted_text = ""
                    last_end = 0
                    for match in matches:
                        highlighted_text += text_display[last_end:match.start()]
                        highlighted_text += f"{Colors.HIGHLIGHT}{match.group()}{Colors.RESET}{Colors.VERSE_TEXT}"
                        last_end = match.end()
                    highlighted_text += text_display[last_end:]
                    text_display = highlighted_text

                # Result entry with preview
                preview = text_display[:75] + "..." if len(text_display) > 75 else text_display
                print(f"  {Colors.BRIGHT_GREEN}[{i}]{Colors.RESET} {Colors.BRIGHT_GOLD}{ref}{Colors.RESET}")
                print(f"      {Colors.DIM_CYAN}↳{Colors.RESET} {Colors.VERSE_TEXT}{preview}{Colors.RESET}\n")

            if len(results) > limit:
                print(f"{Colors.GRAY}{'─' * 80}")
                print(f"  💡 {len(results) - limit} more verses match your search")
                print(f"  📌 Tip: Type a specific verse reference to see the full text")
                print(f"{'─' * 80}{Colors.RESET}\n")
        else:
            header = f"{Colors.BRIGHT_WHITE}NO RESULTS{Colors.RESET}"
            msg1 = f"{Colors.WHITE}No verses found containing '{keyword}'{Colors.RESET}"
            msg2 = f"{Colors.GRAY}Try a different search term or check spelling{Colors.RESET}"

            print(f"\n{Colors.BRIGHT_RED}{make_border_top()}")
            print(make_border_line(header, align='center'))
            print(f"╠{'═' * 78}╣")
            print(make_border_line(msg1))
            print(make_border_line(msg2))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

    def display_chapter(self, book, chapter):
        """Display an entire chapter with beautiful formatting"""
        chapter_verses = []
        pattern = f"{book} {chapter}:"

        for ref, text in self.bible_data.items():
            if ref.startswith(pattern):
                chapter_verses.append((ref, text))

        if chapter_verses:
            # Calculate stats
            verse_count = len(chapter_verses)
            total_words = sum(len(text.split()) for _, text in chapter_verses)
            avg_words = total_words // verse_count if verse_count > 0 else 0

            # Get translation info
            trans_info = self.translation_info.get(self.current_translation, {})
            trans_name = trans_info.get('name', self.current_translation)

            # Chapter info panel
            header = f"{Colors.BRIGHT_GOLD}CHAPTER READING{Colors.RESET}"
            book_line = f"{Colors.DIM_CYAN}Book & Chapter:{Colors.RESET} {Colors.BRIGHT_WHITE}{book} {chapter}{Colors.RESET}"
            trans_line = f"{Colors.DIM_CYAN}Translation:{Colors.RESET}    {Colors.PURPLE}{trans_name}{Colors.RESET}"
            verses_line = f"{Colors.DIM_CYAN}Total Verses:{Colors.RESET}   {Colors.LIME}{verse_count} verses{Colors.RESET}"
            words_line = f"{Colors.DIM_CYAN}Total Words:{Colors.RESET}    {Colors.PINK}{total_words} words{Colors.RESET}"
            avg_line = f"{Colors.DIM_CYAN}Avg Words/Verse:{Colors.RESET} {Colors.ORANGE}~{avg_words} words{Colors.RESET}"

            print(f"\n{Colors.BRIGHT_BLUE}{make_border_top()}")
            print(make_border_line(header, align='center'))
            print(f"╠{'═' * 78}╣")
            print(make_border_line(book_line))
            print(make_border_line(trans_line))
            print(make_border_line(verses_line))
            print(make_border_line(words_line))
            print(make_border_line(avg_line))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

            # Chapter text panel
            text_header = f"{Colors.BRIGHT_WHITE}TEXT{Colors.RESET}"
            print(f"{Colors.BRIGHT_GOLD}{make_border_top()}")
            print(make_border_line(text_header, align='center'))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

            for ref, text in chapter_verses:
                verse_num = ref.split(':')[-1]
                formatted_text = self.format_verse_text(text)

                if text.startswith('# '):
                    print()

                print(f"{Colors.BRIGHT_GOLD}{verse_num:>4}.{Colors.RESET} {Colors.VERSE_TEXT}{formatted_text}{Colors.RESET}")

            print(f"\n{Colors.BRIGHT_BLUE}{'═' * 80}")
            print(f"{Colors.GRAY}  📖 End of {book} {chapter} ({verse_count} verses)")
            print(f"{'═' * 80}{Colors.RESET}\n")
        else:
            error_header = f"{Colors.BRIGHT_WHITE}ERROR{Colors.RESET}"
            error_msg = f"{Colors.WHITE}Chapter not found: {book} {chapter}{Colors.RESET}"

            print(f"\n{Colors.BRIGHT_RED}{make_border_top()}")
            print(make_border_line(error_header, align='center'))
            print(f"╠{'═' * 78}╣")
            print(make_border_line(error_msg))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

    def show_daily_verse(self):
        """Show a random inspirational verse with vibrant colors"""
        verse_ref = random.choice(self.daily_verses)
        daily_header = f"{Colors.BRIGHT_GOLD}VERSE OF THE DAY{Colors.RESET}"

        print(f"\n{Colors.BRIGHT_MAGENTA}{make_border_top()}")
        print(make_border_line(daily_header, align='center'))
        print(f"{make_border_bottom()}{Colors.RESET}\n")
        self.display_verse(verse_ref, show_refs=False)

    def switch_translation(self, abbrev):
        """Switch to a different Bible translation"""
        abbrev = abbrev.upper()
        if abbrev in self.translations:
            self.current_translation = abbrev
            info = self.translation_info.get(abbrev, {})
            print(f"\n{Colors.SUCCESS}✓ Switched to {abbrev} - {info.get('name', abbrev)} ({info.get('year', '')}){Colors.RESET}")
            print(f"{Colors.GRAY}  {len(self.translations[abbrev]):,} verses loaded{Colors.RESET}\n")
        else:
            print(f"\n{Colors.ERROR}✗ Translation '{abbrev}' not available{Colors.RESET}")
            self.list_translations()

    def list_translations(self):
        """List all available translations"""
        header = f"{Colors.GOLD}Available Translations{Colors.RESET}"

        print(f"\n{Colors.CYAN}{make_border_top()}")
        print(make_border_line(header, align='center'))
        print(f"{make_border_bottom()}{Colors.RESET}\n")

        for abbrev in sorted(self.translations.keys()):
            info = self.translation_info.get(abbrev, {})
            current = " ← Current" if abbrev == self.current_translation else ""
            print(f"  {Colors.VERSE_REF}{abbrev:6}{Colors.RESET} {Colors.WHITE}{info.get('name', abbrev):40}{Colors.RESET} {Colors.GRAY}({info.get('year', 'N/A')}){Colors.RESET}{Colors.GOLD}{current}{Colors.RESET}")

        print(f"\n{Colors.GRAY}  Type 'translation [CODE]' to switch (e.g., 'translation ASV'){Colors.RESET}\n")

    def cycle_theme(self):
        """Cycle to next theme and redraw screen"""
        current_index = self.theme_list.index(self.current_theme)
        next_index = (current_index + 1) % len(self.theme_list)
        self.current_theme = self.theme_list[next_index]
        Colors.set_theme(self.current_theme)

        # Clear screen and redraw dashboard with new theme
        print("\033[2J\033[H", end='', flush=True)

        # Redraw dashboard header
        title = f"{Colors.BRIGHT_GOLD}✟  BIBLE ANALYSIS TOOL  ✟{Colors.RESET}"
        print(f"\n{Colors.BRIGHT_CYAN}{make_border_top()}")
        print(make_border_line(title, align='center'))
        print(f"{make_border_bottom()}{Colors.RESET}\n")

        info = self.translation_info.get(self.current_translation, {})
        trans_line = f"Translation: {self.current_translation} - {info.get('name', '')} ({info.get('year', '')})"
        theme_name = THEMES[self.current_theme]["name"]
        print(f"{Colors.GRAY}  {trans_line}")
        print(f"  Theme: {Colors.BRIGHT_GOLD}{theme_name}{Colors.RESET} {Colors.GRAY}(Press 't' to change)")
        print(f"  Created by {Colors.CYAN}@Ringmast4r{Colors.RESET}\n")

    def animated_splash(self):
        """Display animated pixelate-in splash screen (skippable with Enter)"""
        # Clear screen
        print("\033[2J\033[H", end='', flush=True)

        # ASCII art splash - Custom Bible Design
        splash_art = f"""{Colors.CYAN}
                          ..::..::::::::::::.::.
                         ..:+=.:*######*#**#::.
                         ..:=:=%-:-+#+::*+:*::.
                          .:=#*.:%=#::-#+:+*::..
                        ...:-#:*--+-**#-=+**.-....
                     ...:::.:#=+:+=+++=-*:+*.=.:-....
                 ....::::=#::#-:#**.:#**.:#*.***=:.-:..
               ...:::-+#+++=.%:+:.+*#-.+*=:*.**+=+*+:::...
              ..:::=*+=====+.#=+:*==+:#==+-+.**++=+=++-:::..
            ..:::=#+====+=.-.*+:***:-#**::*+.+:.++=====+=:::..
           ..::-*+=====.:+#*.=-=*::=*+::*%:+:-.=+::++====+-::..
         ..:.:=*+====.-#+..-::--=***++**+=-=::....=-.=+=+==+:::..
         .-::++===*::#+.. .:::=:--======--::-:..  ..=::+====+::-..
        .:::++====.-#..  ..-:=+-:-=++++=-:.==--:.  ...-:=+===+:::.
        .::=*===+.-*.....-:=-:++=-:-=*+---=+-:+--..   .=:-=====:::
.::::::.-==*++++==%:...::-=:+*==*+**+-=*+=+=:#=:=-:.....--+=====--.::::::.
.:-=---:::::::...:::::::-=-=:=*##-:+*+#:=+#*====:+-:::-----=====+++++++=::
.:=.:=+-:-+-:::=+=:::==:-:=:#:+=-+#-+*:+*#--+#*-=-=:*:.:=+:-::==::.==::=.:
.:+=:+-+=*-+#-+==*==*#:-:+--#+:-***.:+--====-=*:=:--.=+*+-=*===-*+=+-*:+.:
::+*+-+++=-+*=+:=**--*:=:+*-:-##+*+**+*****+++::*=:+:*-=**=:***+:+=*-:*+.:
::*-.#::***-:***--*#-#:+:++:=++=-:.:-+--**=:-+-+==:=:+=%=:+##=:+**+:=+:*.:
::+*.-+#=.=*#=:-**+:=*:--=+:#*-:=**=:#:=++++-:#=-::-.#-:***::*#+-:**+.*+.:
::=+-++--*=*-:***-:#::=:::*:=::#=-+-:**-*+::#+*:-:=:#:=#:=-#+:==**:=+#-=:-
::=..:=#=:.+#-..*#-:-:+-:-:*-:.#*=::*+++::*#+::+:-:-:--:#*-.:+#*:.-#*::-.-
-.:-::::::::::::::::::::.:+:+*:-#*#*-:=+***#==+.-:......::::::::::::::::.-
.:::--==++-=*****-:=----:+.=-.++.::::-+#+-=*-::-.#+:..::--*+=++-:-:::::::.
     ..  .:.==---=.:-.. ..:=:-+:::+#*+=+*::.*::+*... .:::*==-=-.=.
        ..::.+-:-:=-.+.......::.::*%#*#%*::.:.=..  ..-:-+=--==.-:.
         ...:.--:--=+.:+... .:=++%%*+==*%#*::-:. ..:::*+---=-.=-.
           ..:..=:::-=+.:=..:.*+.=*:..:+:.+#.+::.=::#+=-==+:.*-..
            ..:..:=---==+=.:-.*+.+.#=-*:=+.*#=.::-*=----==.-*..
             ...=..:+=--===+#.#*..#*#.:+*#::+=:=+-----=*.:*-..
                ..:-..==---=-:*++-=*:=@-=:*-.+.=-=--=-..*+.
                   ..=:..=+=-:*-#*::+*+::*#*:*.====..=#-.
                      ..=+.:::++:*=#=.#=%-.*=#.-..*#-..
                          ..::+*:-*+++:+*+=.+*.=...
                          ..::+==--*.-#-=::+:=--:
                          ..-:#.+*-.****.:*#--=:-
                           .-:#.=:-%:-*:=%::==*.-
                          ..-:#+:++**:.***+:.**.-.
                          ..-:*:+:=+:==:++--:=*.-.
                          ..:---**-.**++=:=#+-+.-.
                          .::=::*::#:+=--#::+-+:-.
                          .-.*+:-=#**::**+*-.=+:-.
                          .-.#+=:=*+-+=--+=--.*--..
                          .=.#:=#+-:*+**-::**::--..
                          .-:%:++-++:+=-:#-.=-:--:
                          .::#--***#:.:+**++::*=:-.
                          .:-**-:+=+-+::==+---:+.=.
                          ..-*:*+=:.=#*+--::*=:*.+.
                          .:=*.#*:-*:==+-:+-*=-*.+.
                          .:=*:--=*++.:=+#*=.-=*:=.
                         ..:=*+:=+===-+--=+++::+-::
                         .::==:+=-+:.+**+-=.:#:=+.:
                         .::+..#*::*=*==+-.+-*::+.:
                         .-:#..-:+**-.:+:.##-.-*=.-.
                         .-.#*.:*====*-.-*++*=.++:-.
                         .-.#:*::-+=:.+#=-+=:-*.*:=.
                         .::+.***+:.-#**+:.:**+:-.+.
                         .::+...::=#:...-##**+.:=.=.
                         ..:####**++++*++*+++***#.-:.
                         .+*#######################..
{Colors.RESET}

{Colors.WHITE}
 ██████╗ ██╗██████╗ ██╗     ███████╗     █████╗ ███╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗██╗███████╗
 ██╔══██╗██║██╔══██╗██║     ██╔════╝    ██╔══██╗████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝██╔════╝██║██╔════╝
 ██████╔╝██║██████╔╝██║     █████╗      ███████║██╔██╗ ██║███████║██║   ╚████╔╝ ███████╗██║███████╗
 ██╔══██╗██║██╔══██╗██║     ██╔══╝      ██╔══██║██║╚██╗██║██╔══██║██║    ╚██╔╝  ╚════██║██║╚════██║
 ██████╔╝██║██████╔╝███████╗███████╗    ██║  ██║██║ ╚████║██║  ██║███████╗██║   ███████║██║███████║
 ╚═════╝ ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚═╝╚══════╝
                                   ████████╗ ██████╗  ██████╗ ██╗
                                   ╚══██╔══╝██╔═══██╗██╔═══██╗██║
                                      ██║   ██║   ██║██║   ██║██║
                                      ██║   ╚██████╔╝╚██████╔╝███████╗
                                      ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
{Colors.RESET}
{Colors.GRAY}                      Explore 340,000+ Scripture Cross-References
                            4 Bible Translations Available
{Colors.RESET}"""

        lines = splash_art.split('\n')
        skip_animation = False

        def check_skip():
            """Check if Enter was pressed to skip animation"""
            if sys.platform == 'win32':
                try:
                    import msvcrt
                    if msvcrt.kbhit():
                        key = msvcrt.getch()
                        if key in (b'\r', b'\n', b' '):
                            return True
                except:
                    pass
            return False

        # Stage 1: 20% visible
        print("\033[2J\033[H", end='', flush=True)
        for line in lines:
            pixelated = ''.join(c if random.random() < 0.20 else ' ' for c in line)
            print(pixelated)
        sys.stdout.flush()
        if check_skip():
            skip_animation = True

        if not skip_animation:
            time.sleep(0.3)

            # Stage 2: 40% visible
            print("\033[2J\033[H", end='', flush=True)
            for line in lines:
                pixelated = ''.join(c if random.random() < 0.40 else ' ' for c in line)
                print(pixelated)
            sys.stdout.flush()
            if check_skip():
                skip_animation = True

        if not skip_animation:
            time.sleep(0.3)

            # Stage 3: 60% visible
            print("\033[2J\033[H", end='', flush=True)
            for line in lines:
                pixelated = ''.join(c if random.random() < 0.60 else ' ' for c in line)
                print(pixelated)
            sys.stdout.flush()
            if check_skip():
                skip_animation = True

        if not skip_animation:
            time.sleep(0.3)

            # Stage 4: 80% visible
            print("\033[2J\033[H", end='', flush=True)
            for line in lines:
                pixelated = ''.join(c if random.random() < 0.80 else ' ' for c in line)
                print(pixelated)
            sys.stdout.flush()
            if check_skip():
                skip_animation = True

        if not skip_animation:
            time.sleep(0.3)

        # Final: 100% visible
        print("\033[2J\033[H", end='', flush=True)
        print(splash_art)
        sys.stdout.flush()

        if not skip_animation:
            time.sleep(3.0)  # Pause so users can see the art
            # Prompt to continue (prevents scrolling away)
            print(f"\n{Colors.GRAY}                    Press Enter to continue...{Colors.RESET}")
            try:
                input()
            except:
                pass  # Handle timeout or EOF gracefully

    def main_menu(self):
        """Display beautiful main menu and handle user input"""
        # Show animated splash screen
        self.animated_splash()

        # Clear screen before showing main menu (user feedback: clean dashboard)
        print("\033[2J\033[H", end='', flush=True)

        # Show main dashboard header
        title = f"{Colors.BRIGHT_GOLD}✟  BIBLE ANALYSIS TOOL  ✟{Colors.RESET}"
        print(f"\n{Colors.BRIGHT_CYAN}{make_border_top()}")
        print(make_border_line(title, align='center'))
        print(f"{make_border_bottom()}{Colors.RESET}\n")

        info = self.translation_info.get(self.current_translation, {})
        trans_line = f"Translation: {self.current_translation} - {info.get('name', '')} ({info.get('year', '')})"
        theme_name = THEMES[self.current_theme]["name"]
        print(f"{Colors.GRAY}  {trans_line}")
        print(f"  Theme: {Colors.BRIGHT_GOLD}{theme_name}{Colors.RESET} {Colors.GRAY}(Press 't' to change)")
        print(f"  Created by {Colors.CYAN}@Ringmast4r{Colors.RESET}\n")

        # Show daily verse
        self.show_daily_verse()

        while True:
            # Bright, colorful command menu (DEATH-STAR inspired)
            menu_title = f"{Colors.BRIGHT_GOLD}BIBLE ANALYSIS COMMANDS{Colors.RESET}"
            print(f"\n{Colors.BRIGHT_CYAN}{make_border_top()}")
            print(make_border_line(menu_title, align='center'))
            print(f"{make_border_bottom()}{Colors.RESET}\n")

            # Color-coded command categories
            print(f"  {Colors.BRIGHT_GOLD}📖 VERSE LOOKUP{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Type verse reference{Colors.RESET}    {Colors.GRAY}(e.g., {Colors.ORANGE}'John 3:16'{Colors.GRAY} or {Colors.ORANGE}'Romans 8:28'{Colors.GRAY}){Colors.RESET}\n")

            print(f"  {Colors.BRIGHT_CYAN}📚 CHAPTER READING{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Type book and chapter{Colors.RESET}   {Colors.GRAY}(e.g., {Colors.LIME}'Genesis 1'{Colors.GRAY} or {Colors.LIME}'Psalms 23'{Colors.GRAY}){Colors.RESET}\n")

            print(f"  {Colors.BRIGHT_GREEN}🔍 KEYWORD SEARCH{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Search across all translations{Colors.RESET}  {Colors.GRAY}(e.g., {Colors.PINK}'love'{Colors.GRAY}, {Colors.PINK}'faith'{Colors.GRAY}, {Colors.PINK}'grace'{Colors.GRAY}){Colors.RESET}\n")

            print(f"  {Colors.BRIGHT_MAGENTA}🌟 DAILY INSPIRATION{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Type {Colors.ORANGE}'daily'{Colors.DIM_CYAN} for random verse{Colors.RESET}\n")

            print(f"  {Colors.PURPLE}🔄 BIBLE TRANSLATIONS{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Type {Colors.ORANGE}'translations'{Colors.DIM_CYAN} to list all versions{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Type {Colors.ORANGE}'translation XXX'{Colors.DIM_CYAN} to switch (e.g., {Colors.ORANGE}'translation ASV'{Colors.DIM_CYAN}){Colors.RESET}\n")

            print(f"  {Colors.BRIGHT_GOLD}🎨 THEME TOGGLE{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Type {Colors.ORANGE}'t'{Colors.DIM_CYAN} to cycle through color themes{Colors.RESET}\n")

            print(f"  {Colors.BRIGHT_RED}❌ EXIT PROGRAM{Colors.RESET}")
            print(f"     {Colors.DIM_CYAN}Type {Colors.ORANGE}'quit'{Colors.DIM_CYAN} or {Colors.ORANGE}'exit'{Colors.DIM_CYAN} to close{Colors.RESET}\n")

            print(f"{Colors.BRIGHT_GOLD}{'═' * 80}{Colors.RESET}")
            choice = input(f"\n{Colors.BRIGHT_CYAN}⊳ Enter your choice:{Colors.RESET} ").strip()

            if not choice:
                continue

            # Check for quit
            if choice.lower() in ['quit', 'exit', 'q']:
                goodbye_msg = f"{Colors.BRIGHT_CYAN}May God bless you on your journey!{Colors.RESET}"
                print(f"\n{Colors.BRIGHT_GOLD}{make_border_top()}")
                print(make_border_line(goodbye_msg, align='center'))
                print(f"{make_border_bottom()}{Colors.RESET}\n")
                break

            # Theme toggle
            if choice.lower() == 't':
                self.cycle_theme()

            # Daily verse
            elif choice.lower() == 'daily':
                self.show_daily_verse()

            # List translations
            elif choice.lower() == 'translations':
                self.list_translations()

            # Switch translation
            elif choice.lower().startswith('translation '):
                abbrev = choice[12:].strip()
                if abbrev:
                    self.switch_translation(abbrev)
                else:
                    self.list_translations()

            # Check if it's a verse reference (contains a colon)
            elif ':' in choice:
                self.display_verse(choice)

            # Check if it's a chapter reference
            elif re.match(r'^[A-Za-z]+ \d+$', choice) or re.match(r'^\d? ?[A-Za-z]+ \d+$', choice):
                parts = choice.rsplit(' ', 1)
                if len(parts) == 2:
                    book, chapter = parts
                    self.display_chapter(book, chapter)

            # Otherwise treat as search keyword
            else:
                self.search_keyword(choice)

if __name__ == "__main__":
    try:
        reader = BibleReader()
        reader.main_menu()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.GOLD}May God bless you! Goodbye.{Colors.RESET}\n")
    except Exception as e:
        print(f"\n{Colors.ERROR}An error occurred: {e}{Colors.RESET}\n")
