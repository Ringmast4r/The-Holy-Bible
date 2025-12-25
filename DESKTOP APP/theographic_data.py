"""
Theographic Bible Metadata Loader
Loads people, places, events, and enhanced biblical data
"""

import json
import os


class TheographicDataLoader:
    """Loads and provides access to theographic Bible metadata"""

    def __init__(self, data_dir='../shared-data/theographic'):
        self.data_dir = data_dir
        self.people = None
        self.places = None
        self.events = None
        self.periods = None
        self.people_groups = None
        self.books = None
        self.easton = None
        self.is_loaded = False

    def load(self):
        """Load all theographic data files"""
        try:
            # Get absolute path
            base_path = os.path.dirname(os.path.abspath(__file__))
            data_path = os.path.join(base_path, self.data_dir)

            # Load people data
            with open(os.path.join(data_path, 'people.json'), 'r', encoding='utf-8') as f:
                self.people = json.load(f)
                print(f"✓ Loaded {len(self.people)} biblical people")

            # Load places data
            with open(os.path.join(data_path, 'places.json'), 'r', encoding='utf-8') as f:
                self.places = json.load(f)
                print(f"✓ Loaded {len(self.places)} geographic places")

            # Load events data
            with open(os.path.join(data_path, 'events.json'), 'r', encoding='utf-8') as f:
                self.events = json.load(f)
                print(f"✓ Loaded {len(self.events)} historical events")

            # Load periods data
            with open(os.path.join(data_path, 'periods.json'), 'r', encoding='utf-8') as f:
                self.periods = json.load(f)
                print(f"✓ Loaded {len(self.periods)} time periods")

            # Load people groups
            with open(os.path.join(data_path, 'peopleGroups.json'), 'r', encoding='utf-8') as f:
                self.people_groups = json.load(f)
                print(f"✓ Loaded {len(self.people_groups)} people groups")

            # Load Easton's Dictionary (optional - large file)
            try:
                with open(os.path.join(data_path, 'easton.json'), 'r', encoding='utf-8') as f:
                    self.easton = json.load(f)
                    print(f"✓ Loaded {len(self.easton)} Easton's Dictionary entries")
            except Exception as e:
                print(f"⚠ Easton's Dictionary not loaded: {e}")

            self.is_loaded = True
            print("✓ Theographic data loaded successfully!")
            return True

        except Exception as e:
            print(f"✗ Error loading theographic data: {e}")
            return False

    def get_people(self):
        """Get all people"""
        return self.people or []

    def get_places(self):
        """Get all places"""
        return self.places or []

    def get_events(self):
        """Get all events"""
        return self.events or []

    def get_periods(self):
        """Get all periods"""
        return self.periods or []

    def get_people_groups(self):
        """Get all people groups"""
        return self.people_groups or []

    def get_places_with_coords(self):
        """Get places that have valid GPS coordinates"""
        if not self.places:
            return []

        places_with_coords = []
        for place in self.places:
            fields = place.get('fields', {})
            lat = fields.get('latitude')
            lon = fields.get('longitude')

            if lat and lon:
                try:
                    lat_f = float(lat)
                    lon_f = float(lon)
                    places_with_coords.append({
                        'name': fields.get('displayTitle') or fields.get('kjvName') or fields.get('esvName', 'Unknown'),
                        'lat': lat_f,
                        'lon': lon_f,
                        'type': fields.get('featureType', 'Unknown'),
                        'verses': fields.get('verseCount', 0)
                    })
                except (ValueError, TypeError):
                    continue

        return places_with_coords

    def get_people_with_locations(self):
        """Get people who have birth or death places"""
        if not self.people:
            return []

        people_with_locations = []
        for person in self.people:
            fields = person.get('fields', {})
            if fields.get('birthPlace') or fields.get('deathPlace'):
                people_with_locations.append({
                    'name': fields.get('name', 'Unknown'),
                    'gender': fields.get('gender', 'Unknown'),
                    'verses': fields.get('verseCount', 0),
                    'birth_place': fields.get('birthPlace'),
                    'death_place': fields.get('deathPlace')
                })

        return people_with_locations

    def get_people_for_network(self, limit=200):
        """Get top people by verse count for network visualization"""
        if not self.people:
            return []

        # Sort by verse count and get top N
        sorted_people = sorted(
            self.people,
            key=lambda p: p.get('fields', {}).get('verseCount', 0),
            reverse=True
        )[:limit]

        people_list = []
        for person in sorted_people:
            fields = person.get('fields', {})
            people_list.append({
                'id': person.get('id'),
                'name': fields.get('name', 'Unknown'),
                'gender': fields.get('gender', 'Unknown'),
                'verses': fields.get('verseCount', 0),
                'groups': fields.get('memberOf', [])
            })

        return people_list

    def get_events_timeline(self):
        """Get events sorted by chronological period"""
        if not self.events or not self.periods:
            return []

        # Create period lookup
        period_lookup = {p.get('id'): p.get('fields', {}) for p in self.periods}

        timeline_events = []
        for event in self.events:
            fields = event.get('fields', {})
            period_ids = fields.get('period', [])

            if period_ids and len(period_ids) > 0:
                period_id = period_ids[0]
                period_info = period_lookup.get(period_id, {})

                timeline_events.append({
                    'name': fields.get('name', 'Unknown'),
                    'period': period_info.get('name', 'Unknown'),
                    'year': period_info.get('yearNum'),
                    'verses': fields.get('verseCount', 0)
                })

        # Sort by year
        timeline_events.sort(key=lambda e: e.get('year') or 0)
        return timeline_events

    def get_stats(self):
        """Get statistics about theographic data"""
        return {
            'total_people': len(self.people) if self.people else 0,
            'total_places': len(self.places) if self.places else 0,
            'total_events': len(self.events) if self.events else 0,
            'total_periods': len(self.periods) if self.periods else 0,
            'places_with_coords': len(self.get_places_with_coords()),
            'people_with_locations': len(self.get_people_with_locations())
        }


# Global instance
theographic_loader = TheographicDataLoader()
