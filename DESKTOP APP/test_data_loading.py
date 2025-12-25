"""
Test script to diagnose data loading issues
"""

import json
import sys
from pathlib import Path
from theographic_data import TheographicDataLoader

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("=" * 60)
print("TESTING DATA LOADING")
print("=" * 60)

# Test 1: Load graph data
print("\n1. Testing graph data loading...")
try:
    data_path = Path(__file__).parent.parent / 'shared-data' / 'processed' / 'graph_data.json'
    stats_path = Path(__file__).parent.parent / 'shared-data' / 'processed' / 'stats.json'

    print(f"   Graph data path: {data_path}")
    print(f"   Graph data exists: {data_path.exists()}")

    print(f"   Stats path: {stats_path}")
    print(f"   Stats exists: {stats_path.exists()}")

    if data_path.exists():
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"   ✓ Loaded graph data: {len(data.get('chapters', []))} chapters, {len(data.get('connections', []))} connections")

    if stats_path.exists():
        with open(stats_path, 'r', encoding='utf-8') as f:
            stats = json.load(f)
        print(f"   ✓ Loaded stats: {stats.get('total_connections', 0)} total connections")
        print(f"   Stats keys: {list(stats.keys())}")

except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 2: Load theographic data
print("\n2. Testing theographic data loading...")
try:
    loader = TheographicDataLoader()
    success = loader.load()

    if success:
        print(f"   ✓ Theographic data loaded successfully")
        print(f"   People: {len(loader.get_people())}")
        print(f"   Places: {len(loader.get_places())}")
        print(f"   Places with coords: {len(loader.get_places_with_coords())}")
        print(f"   Events: {len(loader.get_events())}")
        print(f"   Periods: {len(loader.get_periods())}")
    else:
        print(f"   ✗ Failed to load theographic data")

except Exception as e:
    print(f"   ✗ Error: {e}")
    import traceback
    traceback.print_exc()

# Test 3: Test component imports
print("\n3. Testing component imports...")
try:
    from components.network_view import NetworkView
    print("   ✓ NetworkView imported")
except Exception as e:
    print(f"   ✗ NetworkView import failed: {e}")

try:
    from components.stats_view import StatsView
    print("   ✓ StatsView imported")
except Exception as e:
    print(f"   ✗ StatsView import failed: {e}")

try:
    from components.geographic_map_view import GeographicMapView
    print("   ✓ GeographicMapView imported")
except Exception as e:
    print(f"   ✗ GeographicMapView import failed: {e}")

try:
    from components.timeline_view import TimelineView
    print("   ✓ TimelineView imported")
except Exception as e:
    print(f"   ✗ TimelineView import failed: {e}")

try:
    from components.people_network_view import PeopleNetworkView
    print("   ✓ PeopleNetworkView imported")
except Exception as e:
    print(f"   ✗ PeopleNetworkView import failed: {e}")

print("\n" + "=" * 60)
print("TESTING COMPLETE")
print("=" * 60)
