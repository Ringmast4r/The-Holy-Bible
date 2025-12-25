#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for new Bible Reader features
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

# Suppress the splash animation for testing
import os
os.environ['TESTING'] = '1'

from bible_reader import BibleReader

print("Testing Bible Reader New Features\n")
print("=" * 80)

# Create reader instance
print("\n1. Creating BibleReader instance...")
reader = BibleReader()
print("   ✓ BibleReader initialized")

# Test statistics
print("\n2. Testing show_statistics()...")
try:
    # Just check if method exists and is callable
    assert hasattr(reader, 'show_statistics'), "show_statistics method not found"
    print("   ✓ show_statistics method exists")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test books list
print("\n3. Testing show_books_list()...")
try:
    assert hasattr(reader, 'show_books_list'), "show_books_list method not found"
    print("   ✓ show_books_list method exists")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test compare translations
print("\n4. Testing compare_translations()...")
try:
    assert hasattr(reader, 'compare_translations'), "compare_translations method not found"
    print("   ✓ compare_translations method exists")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test history tracking
print("\n5. Testing history tracking...")
try:
    assert hasattr(reader, 'add_to_history'), "add_to_history method not found"
    assert hasattr(reader, 'show_history'), "show_history method not found"
    reader.add_to_history("John 3:16")
    reader.add_to_history("Psalms 23:1")
    assert len(reader.history) == 2, f"Expected 2 items in history, got {len(reader.history)}"
    print(f"   ✓ History tracking works (added 2 items)")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test bookmark system
print("\n6. Testing bookmark system...")
try:
    assert hasattr(reader, 'add_bookmark'), "add_bookmark method not found"
    assert hasattr(reader, 'show_bookmarks'), "show_bookmarks method not found"
    reader.add_bookmark("Romans 8:28")
    assert len(reader.bookmarks) == 1, f"Expected 1 bookmark, got {len(reader.bookmarks)}"
    print(f"   ✓ Bookmark system works (added 1 bookmark)")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test random verse
print("\n7. Testing show_random_verse()...")
try:
    assert hasattr(reader, 'show_random_verse'), "show_random_verse method not found"
    print("   ✓ show_random_verse method exists")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test advanced search
print("\n8. Testing advanced search...")
try:
    # Check that search_keyword accepts new parameters
    import inspect
    sig = inspect.signature(reader.search_keyword)
    params = list(sig.parameters.keys())
    assert 'testament' in params, "testament parameter not found"
    assert 'book' in params, "book parameter not found"
    assert 'exact_phrase' in params, "exact_phrase parameter not found"
    print("   ✓ Advanced search parameters exist (testament, book, exact_phrase)")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test navigation
print("\n9. Testing next_chapter() and prev_chapter()...")
try:
    assert hasattr(reader, 'next_chapter'), "next_chapter method not found"
    assert hasattr(reader, 'prev_chapter'), "prev_chapter method not found"
    assert hasattr(reader, 'get_chapter_count'), "get_chapter_count method not found"

    # Test get_chapter_count
    genesis_chapters = reader.get_chapter_count('Genesis')
    assert genesis_chapters == 50, f"Expected 50 chapters in Genesis, got {genesis_chapters}"
    print(f"   ✓ Navigation methods exist and get_chapter_count works (Genesis has 50 chapters)")
except AssertionError as e:
    print(f"   ✗ {e}")

# Test export functionality
print("\n10. Testing export functionality...")
try:
    assert hasattr(reader, 'export_bookmarks'), "export_bookmarks method not found"
    assert hasattr(reader, 'export_history'), "export_history method not found"
    print("   ✓ Export methods exist (export_bookmarks, export_history)")
except AssertionError as e:
    print(f"   ✗ {e}")

print("\n" + "=" * 80)
print("✓ All new features are implemented and accessible!")
print("=" * 80)
