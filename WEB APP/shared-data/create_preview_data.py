#!/usr/bin/env python3
"""
Create Preview Data for Instant Loading
Extracts top 200 connections from graph_data.json for instant visualization
"""

import json
import os

def create_preview_data():
    """Extract top connections and create preview JavaScript file"""

    # Load full graph data
    graph_data_path = os.path.join('processed', 'graph_data.json')
    print(f"Loading full dataset from {graph_data_path}...")

    with open(graph_data_path, 'r', encoding='utf-8') as f:
        full_data = json.load(f)

    print(f"[OK] Loaded {len(full_data['connections'])} connections")

    # Sort connections by weight (descending) and take top 200
    sorted_connections = sorted(
        full_data['connections'],
        key=lambda x: x['weight'],
        reverse=True
    )

    top_connections = sorted_connections[:200]
    print(f"[OK] Extracted top 200 connections (weight range: {top_connections[0]['weight']} - {top_connections[-1]['weight']})")

    # Get unique chapter indices used in top connections
    chapter_indices = set()
    for conn in top_connections:
        chapter_indices.add(conn['source'])
        chapter_indices.add(conn['target'])

    # Extract only chapters that are referenced in top connections
    # AND create a mapping from old index to new index
    preview_chapters = []
    old_to_new_index = {}  # Maps original chapter index to new preview array index

    for new_idx, old_idx in enumerate(sorted(chapter_indices)):
        if old_idx < len(full_data['chapters']):
            chapter = full_data['chapters'][old_idx]
            preview_chapters.append(chapter)
            old_to_new_index[old_idx] = new_idx

    print(f"[OK] Extracted {len(preview_chapters)} chapters")

    # Remap connections to use new indices
    remapped_connections = []
    for conn in top_connections:
        remapped_connections.append({
            'source': old_to_new_index[conn['source']],
            'target': old_to_new_index[conn['target']],
            'weight': conn['weight']
        })

    print(f"[OK] Remapped {len(remapped_connections)} connections to new indices")

    # Create preview data structure
    preview_data = {
        'metadata': {
            'total_books': full_data['metadata']['total_books'],
            'total_chapters': len(preview_chapters),
            'total_connections': len(remapped_connections),
            'total_verse_refs': full_data['metadata']['total_verse_refs'],
            'is_preview': True,
            'preview_description': 'Top 200 connections by weight for instant loading'
        },
        'books': full_data['books'],  # Keep all book metadata
        'chapters': preview_chapters,
        'connections': remapped_connections,
        'book_matrix': full_data.get('book_matrix', [])  # Keep book matrix for heatmap
    }

    # Generate JavaScript file
    output_path = os.path.join('..', 'bible-visualizer-web', 'js', 'preview-data.js')
    print(f"Writing preview data to {output_path}...")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('// Bible Cross-Reference Preview Data\n')
        f.write('// Auto-generated from graph_data.json\n')
        f.write('// Contains top 200 connections for instant loading\n')
        f.write('// Full dataset (190K connections) loads in background\n\n')
        f.write('const PREVIEW_DATA = ')
        json.dump(preview_data, f, indent=2)
        f.write(';\n\n')
        f.write('// Export for use in data-loader.js\n')
        f.write('if (typeof module !== "undefined" && module.exports) {\n')
        f.write('    module.exports = PREVIEW_DATA;\n')
        f.write('}\n')

    # Calculate sizes
    preview_size = os.path.getsize(output_path) / 1024
    full_size = os.path.getsize(graph_data_path) / 1024 / 1024

    print(f"\n[SUCCESS] Preview data created successfully!")
    print(f"   Preview size: {preview_size:.1f} KB")
    print(f"   Full size: {full_size:.1f} MB")
    print(f"   Reduction: {(1 - preview_size/1024/full_size) * 100:.1f}%")
    print(f"   Top connections: {len(top_connections)}")
    print(f"   Chapters included: {len(preview_chapters)}")
    print(f"\n[STATS] Preview Statistics:")
    print(f"   Highest weight: {top_connections[0]['weight']} connections")
    print(f"   Lowest weight: {top_connections[-1]['weight']} connections")

    return preview_data

if __name__ == '__main__':
    create_preview_data()
