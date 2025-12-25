#!/usr/bin/env python3
"""
Quick preview of Bible CMD Reader features
"""
import sys
from bible_reader import BibleReader, Colors

def preview():
    reader = BibleReader()

    print(f"\n{Colors.GOLD}╔══════════════════════════════════════════════════════════════════╗")
    print(f"║{Colors.RESET}  {Colors.TITLE}Bible Analysis Tool - Visual Preview{' ' * 30}{Colors.GOLD}║")
    print(f"╚══════════════════════════════════════════════════════════════════╝{Colors.RESET}\n")

    # Preview 1: Famous verse
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.RESET}")
    print(f"{Colors.TITLE}EXAMPLE 1: Reading a Verse with Cross-References{Colors.RESET}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.RESET}")
    reader.display_verse("John 3:16")

    # Preview 2: Chapter
    print(f"\n{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.RESET}")
    print(f"{Colors.TITLE}EXAMPLE 2: Reading an Entire Chapter{Colors.RESET}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.RESET}")
    reader.display_chapter("Psalms", "23")

    # Preview 3: Search
    print(f"\n{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.RESET}")
    print(f"{Colors.TITLE}EXAMPLE 3: Searching for Keywords{Colors.RESET}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.RESET}")
    reader.search_keyword("grace", limit=3)

    print(f"\n{Colors.GOLD}╔══════════════════════════════════════════════════════════════════╗")
    print(f"║{Colors.RESET}  {Colors.SUCCESS}Ready to use the full interactive application!{' ' * 19}{Colors.GOLD}║")
    print(f"╚══════════════════════════════════════════════════════════════════╝{Colors.RESET}\n")

    print(f"{Colors.WHITE}To launch the full Bible reader:{Colors.RESET}")
    print(f"  {Colors.CYAN}►{Colors.RESET} {Colors.VERSE_REF}python bible_reader.py{Colors.RESET}")
    print(f"  {Colors.CYAN}►{Colors.RESET} {Colors.VERSE_REF}Double-click bible.bat{Colors.RESET}\n")

if __name__ == "__main__":
    try:
        preview()
    except Exception as e:
        print(f"{Colors.ERROR}Error: {e}{Colors.RESET}")
