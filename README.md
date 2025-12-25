# THE HOLY BIBLE
### Cross-Reference Analysis & Visualization Tools

```
    ✝
   ═╬═
    ║
```

A collection of tools for exploring and visualizing the interconnected nature of Biblical scripture using data from the Treasury of Scripture Knowledge.

**[Live Demo](https://ringmast4r.github.io/The-Holy-Bible/)**

---

## Statistics

| Metric | Count |
|--------|-------|
| Verse References | 344,799 |
| Cross-Reference Connections | 190,522 |
| Books | 66 |
| Translations | 4 (KJV, ASV, WEB, BBE) |

---

## Tools

### 1. Web Visualizer
Interactive browser-based visualizations powered by D3.js.

**Features:**
- Arc Diagram - Linear verse connections
- Network Graph - Force-directed relationship mapping
- Chord Diagram - Book-to-book connection density
- Heatmap - Chapter correlation matrix
- Sunburst Chart - Hierarchical Bible structure
- Statistics Dashboard - Data insights

**Tech:** D3.js, JavaScript, HTML5, CSS3

**Location:** `WEB APP/`

---

### 2. Desktop GUI
Professional desktop application with 3D visualization capabilities.

**Features:**
- 3D interactive Plotly graphs
- High-resolution PNG/SVG export
- Ultrawide monitor support (21:9)
- Dark theme interface

**Tech:** Python, PyQt5, Plotly

**Location:** `DESKTOP APP/`

**Run:**
```bash
cd "DESKTOP APP"
pip install -r requirements.txt
python visualizer_app.py
```

---

### 3. CMD CLI Reader
Terminal-based Bible reader with retro aesthetics.

**Features:**
- Animated ASCII splash screen
- Verse lookup by reference
- Keyword search across translations
- Cross-reference display
- 4 translation support

**Tech:** Python, Colorama (or browser-based HTML/JS version)

**Location:** `CMD CLI APP/`

---

### 4. Book of Kells CMD
Psalm 84 visualization inspired by medieval illuminated manuscripts.

**Features:**
- Celtic knot ASCII borders
- Decorated drop caps
- Illuminated manuscript aesthetic
- Terminal-based art display

**Tech:** Python, ASCII Art

**Location:** `book-of-kells-cmd/`

---

## Data Sources

- **Treasury of Scripture Knowledge (TSK)** - 340,000+ cross-references compiled over 30 years by R.A. Torrey
- **Theographic Bible Data** - People, places, events, and periods
- **OpenBible.info** - Geocoding data for Biblical locations

---

## Themes

The web interface includes 4 visual themes:

| Theme | Style |
|-------|-------|
| Sin City | Monochrome black & white |
| Dark Night | Dark grays |
| From Dusk Till Dawn | Crimson & blood red |
| Grindhouse | Dark with color punches |

---

## Project Structure

```
The-Holy-Bible/
├── index.html              # Hub page
├── WEB APP/                # D3.js web visualizer
├── DESKTOP APP/            # PyQt5 desktop application
├── CMD CLI APP/            # Terminal Bible reader
├── book-of-kells-cmd/      # Psalm 84 ASCII art
└── _misc/                  # Additional resources
    ├── tools/
    ├── data/
    ├── docs/
    ├── assets/
    └── personal/
```

---

## License

MIT License

Data from Treasury of Scripture Knowledge (Public Domain)

---

## Author

[@Ringmast4r](https://github.com/Ringmast4r)
