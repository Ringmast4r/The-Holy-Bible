# Development Memory & Notes

This document contains important technical notes, gotchas, and instructions for maintaining and developing the Bible Analysis Tool.

---

## 🎯 PROJECT OVERVIEW: Three Different Interfaces

This project provides **three completely independent ways** to explore the same Bible cross-reference dataset:

### 1. **CMD Reader** (This Folder: bible-analysis-tool/)
- **Technology:** Python with Colorama for terminal colors
- **Purpose:** Text-based Bible reading and keyword search
- **Best for:** Reading verses, studying cross-references, quick lookups
- **Launch:** `python bible_reader.py`
- **Data:** Loads JSON Bible files and cross_references.txt directly

### 2. **Web Visualizer** (Folder: ../bible-visualizer-web/)
- **Technology:** D3.js v7, vanilla JavaScript, HTML5/CSS3
- **Purpose:** Interactive visual exploration in browser
- **Best for:** Beautiful visualizations, presentations, pattern discovery
- **Launch:** `python -m http.server 8000` then open http://localhost:8000
- **Data:** Loads from ../shared-data/processed/graph_data.json via HTTP

### 3. **Desktop GUI** (Folder: ../bible-visualizer-desktop/)
- **Technology:** PyQt5, Plotly, NetworkX, Matplotlib
- **Purpose:** Professional 3D visualizations and offline analysis
- **Best for:** 3D graphs, high-res exports, complex analysis
- **Launch:** `python visualizer_app.py`
- **Data:** Loads from ../shared-data/processed/ via file system

**All three use the same underlying data** (340,000+ cross-references from Treasury of Scripture Knowledge), just presented in different ways for different use cases.

---

## 🔧 Technical Architecture

### Core Components

1. **bible_reader.py** - Main application
   - `BibleReader` class manages all functionality
   - Uses `@property` decorator for `bible_data` to dynamically return current translation
   - Supports multiple translations stored in `self.translations` dict

2. **Data Files**
   - `bible-kjv-converted.json` - King James Version
   - `bible-asv-converted.json` - American Standard Version
   - `bible-web-converted.json` - World English Bible
   - `bible-ylt-converted.json` - Young's Literal Translation
   - `cross_references.txt` - TSK cross-reference data

3. **Utilities**
   - `convert_translations.py` - Converts different Bible JSON formats to uniform structure
   - `preview.py` - Demonstrates features without user interaction
   - `bible.bat` - Windows launcher script

---

## 🐛 Known Gotchas & Bugs

### Windows Console Encoding Issues

**Problem**: Windows CMD doesn't handle UTF-8 by default, causing Unicode characters to fail.

**Solution Applied:**
```python
# Set UTF-8 encoding for Windows
if sys.platform == 'win32':
    os.system('chcp 65001 > nul')
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
```

**Location**: Lines 17-20 in `bible_reader.py`

### Colorama Compatibility

**Problem**: ANSI escape codes don't work on Windows without special handling.

**Solution**: Use `colorama` library with `init(autoreset=True)`

**Installation**: `pip install colorama`

**Import**: `from colorama import init, Fore, Back, Style`

### Cross-Reference Format Conversion

**Problem**: OpenBible.info uses "Gen.1.1" format, but our verses use "Genesis 1:1"

**Solution**: `convert_ref_format()` method converts abbreviations to full names

**Book Map**: Lines 134-151 in `bible_reader.py` contains full mapping

### Translation Data Formats

**Problem**: Different Bible sources use different JSON structures:

1. **KJV Format** (farskipper/kjv):
   ```json
   {
     "Genesis 1:1": "In the beginning..."
   }
   ```

2. **GetBible Format** (WEB, YLT):
   ```json
   {
     "books": [{
       "chapters": [{
         "verses": [{
           "name": "Genesis 1:1",
           "text": "..."
         }]
       }]
     }]
   }
   ```

3. **BibleAPI Format** (ASV):
   ```json
   {
     "resultset": {
       "row": [{
         "field": [id, book_num, chapter, verse, text]
       }]
     }
   }
   ```

**Solution**: `convert_translations.py` normalizes all to simple key-value format

### Property-Based Translation Access

**Important**: `bible_data` is a `@property`, not a regular attribute!

```python
@property
def bible_data(self):
    """Get current translation data"""
    return self.translations.get(self.current_translation, {})
```

This means `self.bible_data` dynamically returns the current translation without needing to update multiple references.

---

## 📝 How To: Common Tasks

### Add a New Bible Translation

1. **Download the Bible JSON**:
   ```bash
   curl -o bible-newversion.json [URL]
   ```

2. **Add conversion logic** to `convert_translations.py` if format differs

3. **Update `bible_reader.py`**:
   ```python
   # In translation_info dict (line ~83)
   'NEW': {'name': 'New Version Name', 'year': 'YYYY'}

   # In load_all_translations() dict (line ~99)
   'NEW': 'bible-new-converted.json'
   ```

4. **Run converter**:
   ```bash
   python convert_translations.py
   ```

### Fix Color Display Issues

If colors aren't showing:

1. **Check colorama is installed**:
   ```bash
   pip install colorama
   ```

2. **Verify initialization** (line 23):
   ```python
   init(autoreset=True)
   ```

3. **Windows**: Ensure UTF-8 encoding is set (lines 17-20)

### Update Cross-References

1. **Download new data** from OpenBible.info:
   ```bash
   curl -o cross-references.zip https://a.openbible.info/data/cross-references.zip
   ```

2. **Extract**:
   ```bash
   powershell -Command "Expand-Archive -Path cross-references.zip -Force"
   ```

3. **Restart application** - cross-references loaded at startup

### Test Without User Input

Use the `preview.py` script:
```bash
python preview.py
```

Shows examples of:
- Verse display with cross-references
- Chapter reading
- Keyword search

### Create Windows Executable (Optional)

Using PyInstaller:
```bash
pip install pyinstaller
pyinstaller --onefile --name BibleAnalysisTool bible_reader.py
```

**Note**: Include all JSON files in the same directory as the .exe

---

## 🔍 Code Patterns & Conventions

### Color Usage

```python
Colors.GOLD      # Borders, decorative elements
Colors.CYAN      # Section headers, titles
Colors.VERSE_REF # Verse references (bright yellow)
Colors.VERSE_TEXT # Main verse content (white)
Colors.CROSS_REF # Cross-reference markers (magenta)
Colors.HIGHLIGHT # Search keyword highlighting (yellow background)
Colors.SUCCESS   # Success messages (bright green)
Colors.ERROR     # Error messages (bright red)
Colors.GRAY      # Italic text, secondary info
```

### Box Drawing Characters

```
╔═══╗  ║  ╚═══╝  # Double-line boxes (headers)
┌───┐  │  └───┘  # Single-line boxes (sections)
━━━━━           # Thick horizontal lines
─────           # Thin horizontal lines
```

### Word Wrapping Logic

Lines 184-194 in `bible_reader.py`:
- Wraps text to 62 characters max
- Accounts for ANSI color codes in length calculation
- Uses regex to strip escape codes: `r'\033\[[0-9;]+m'`

---

## 🚨 Troubleshooting

### Problem: "Verse not found"

**Cause**: Case sensitivity or format mismatch

**Solution**: The code handles this with fallback:
```python
def get_verse(self, reference):
    if reference in self.bible_data:
        return self.bible_data[reference]
    for key in self.bible_data.keys():
        if key.lower() == reference.lower():
            return self.bible_data[key]
    return None
```

### Problem: Chapter not displaying

**Cause**: Book name mismatch (e.g., "Psalm" vs "Psalms")

**Check**: Use exact names from JSON keys
- ✓ Correct: `Psalms 23`
- ✗ Wrong: `Psalm 23`

### Problem: Cross-references missing

**Causes**:
1. Verse not in cross_references.txt
2. Format conversion error in book abbreviations

**Debug**: Check `self.cross_refs` dict after loading

### Problem: Colors not showing on Windows

**Solution Checklist**:
1. Run `chcp 65001` in CMD before starting
2. Install colorama: `pip install colorama`
3. Check lines 17-20 in bible_reader.py are present
4. Use Windows Terminal instead of CMD for better support

---

## 📊 Data Statistics

| Item | Count |
|------|-------|
| KJV Verses | 31,102 |
| ASV Verses | 31,103 |
| WEB Verses | 31,095 |
| YLT Verses | 31,102 |
| Cross-References | 340,000+ |
| Verses with Cross-Refs | 29,364 |
| Bible Books | 66 |

---

## 🔮 Future Development Notes

### Performance Optimization Ideas

1. **Lazy Loading**: Load translations on-demand instead of all at startup
2. **Caching**: Cache frequently accessed verses
3. **Indexing**: Create search index for faster keyword queries
4. **Compression**: Use gzip for JSON files

### Feature Implementation Notes

**Verse Comparison**:
- Create new method `compare_verses(ref, translations_list)`
- Display side-by-side with aligned formatting
- Highlight differences between translations

**Bookmarks**:
- Store in `bookmarks.json`
- Add to BibleReader: `self.bookmarks = []`
- Commands: `bookmark add`, `bookmark list`, `bookmark remove`

**Study Notes**:
- Use SQLite database: `notes.db`
- Schema: `(verse_ref TEXT, note TEXT, date TIMESTAMP)`
- Commands: `note add [ref]`, `note view [ref]`

---

## 🗂️ File Locations Reference

```
C:\Users\Squir\Desktop\bible-cmd-reader\
├── bible_reader.py              # Main app - run this
├── bible-kjv-converted.json     # 4.7 MB
├── bible-asv-converted.json     # 5.2 MB
├── bible-web-converted.json     # 8.6 MB
├── bible-ylt-converted.json     # 8.7 MB
├── cross_references.txt         # 1.9 MB
├── convert_translations.py      # Run to convert new translations
└── preview.py                   # Run to see demo
```

---

## ⚙️ Environment Setup

### Fresh Installation

```bash
# Clone or download project
cd bible-cmd-reader

# Install dependencies
pip install colorama

# Test
python preview.py

# Run
python bible_reader.py
```

### Dependencies

```requirements.txt
colorama>=0.4.6
```

---

## 📞 Quick Reference

### Common Commands (in app)

```
John 3:16          # Read verse
Psalms 23          # Read chapter
love               # Search keyword
translations       # List versions
translation ASV    # Switch to ASV
daily              # New daily verse
quit               # Exit
```

### Common File Operations

```bash
# Test without interaction
python preview.py

# Convert new translation
python convert_translations.py

# Launch on Windows
bible.bat

# Check file sizes
dir *.json
```

---

**Last Updated**: 2025-01-06 (Added Visualizer Project Info)

**Maintainer Notes**: Keep this file updated when making architectural changes, discovering new bugs, or implementing workarounds.

---

## 🎨 VISUALIZER PROJECT (NEW!)

### Project Reorganization

The project has been split into **three main components**:

1. **bible-analysis-tool/** - Original CMD tool (this folder)
2. **bible-visualizer-web/** - Web-based visualizations
3. **bible-visualizer-desktop/** - Python GUI visualizer (in progress)
4. **shared-data/** - Shared data files and processor

### Visualizer Architecture

```
bible-cmd-reader/
├── bible-analysis-tool/       # CMD tool (you are here)
├── bible-visualizer-web/      # Web visualizations
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── main.js            # App controller
│       ├── data-loader.js     # Data management
│       ├── arc-diagram.js     # ✅ WORKING
│       └── (other viz...)
├── bible-visualizer-desktop/  # Python desktop app
│   ├── requirements.txt
│   └── (to be built)
└── shared-data/               # Shared between all tools
    ├── cross_references.txt
    ├── data_processor.py      # Converts to graph format
    └── processed/
        ├── graph_data.json    # 190,522 connections
        └── stats.json
```

### Data Processing Pipeline

**Script:** `../shared-data/data_processor.py`

**What it does:**
1. Reads `cross_references.txt` (340,799 verse refs)
2. Aggregates to chapter level (190,522 connections)
3. Creates 66x66 book matrix
4. Exports `graph_data.json` for web visualizer
5. Exports `stats.json` for statistics

**Run when:** Data files are missing or need updating
```bash
cd ../shared-data
python data_processor.py
```

### Web Visualizer Status ✅ COMPLETE!

**All 5 Visualizations Working:**
- ✅ Arc Diagram - Beautiful flowing arcs showing all connections
- ✅ Network Graph - Force-directed with drag, zoom, and pan
- ✅ Chord Diagram - Circular book-to-book relationships
- ✅ Heatmap - 66x66 book connection matrix with color scale
- ✅ Sunburst - Hierarchical Testament→Book→Chapter with zoom
- ✅ Statistics Dashboard - Charts and metrics
- ✅ Interactive filters (testament, book, min connections)
- ✅ SVG export for all visualizations

**Launch:** Open `../bible-visualizer-web/index.html` in browser

**Implementation Notes:**
- Network graph limits to top 200 chapters for performance
- Chord diagram uses D3's chord layout with interactive ribbons
- Heatmap uses sequential color scale (Yellow-Orange-Red)
- Sunburst supports click-to-zoom with breadcrumb navigation
- All visualizations share same color scheme (OT=Green, NT=Cyan)

### Desktop Visualizer ✅ COMPLETE!

**Dependencies:** See `../bible-visualizer-desktop/requirements.txt`
- PyQt5 (GUI framework)
- PyQtWebEngine (Web rendering for Plotly)
- Plotly (3D graphs)
- NetworkX (graph algorithms)
- Matplotlib (2D charts)
- Seaborn (heatmaps)

**To Run:**
1. `cd ../bible-visualizer-desktop`
2. `pip install -r requirements.txt` (if not already installed)
3. `python visualizer_app.py` or double-click `launch.bat` (Windows)

**Architecture:**
- `visualizer_app.py` - Main PyQt5 application with tabs
- `components/network_view.py` - 3D interactive network (Plotly in QWebEngineView)
- `components/arc_view.py` - 2D arc diagram (Matplotlib canvas)
- `components/heatmap_view.py` - 66x66 book matrix (Seaborn)
- `components/stats_view.py` - Statistics dashboard with charts

**Key Features:**
- Tabbed interface for switching visualizations
- Filter controls (testament, min connections)
- Export all views to PNG/SVG
- Dark theme matching web/CMD tools
- 3D network with rotate/zoom/pan
- Real-time filtering updates all views

### Visualizer Gotchas

**Data File Paths:**
- Web viz uses relative path: `../shared-data/processed/graph_data.json`
- If files moved, update paths in `data-loader.js`

**Graph Data Size:**
- graph_data.json is ~7.5 MB
- Contains 190,522 connections
- May be slow on older browsers
- Consider filtering for performance

**D3.js Version:**
- Using D3.js v7 (loaded from CDN)
- Arc diagram uses `d3.scaleLinear()`, `d3.scaleOrdinal()`
- For offline use, download D3.js to `lib/` folder

**Color Scheme:**
- Same gold/cyan theme as CMD tool
- OT = Green (#2ecc71)
- NT = Cyan (#00CED1)
- Cross-testament = Purple (#9370DB)

### Quick Reference: Visualizations

**Arc Diagram Code Location:**
`../bible-visualizer-web/js/arc-diagram.js`

**Key Features:**
- Quadratic bezier curves for arcs
- Hover tooltips with verse details
- Chapter bars at bottom
- Dynamic filtering
- Testament color coding

**Network Graph Implementation:**
- Uses `d3.forceSimulation()` with link, charge, center, and collision forces
- Drag behavior with `d3.drag()` - nodes can be repositioned
- Zoom/pan with `d3.zoom()` - includes reset button
- Limits to top 200 most connected chapters for performance
- Interactive highlighting on hover
- File: `../bible-visualizer-web/js/network-graph.js`

### Desktop Visualizer Gotchas

**PyQtWebEngine Required:**
- Must install separately: `pip install PyQtWebEngine`
- Needed for rendering Plotly HTML in QWebEngineView
- Without it, 3D network view won't display

**Matplotlib Backend:**
- Uses `FigureCanvasQTAgg` for embedding in PyQt5
- Backend is automatically set by importing `backend_qt5agg`
- Don't call `plt.show()` - use `canvas.draw()` instead

**Filter Performance:**
- 3D network can be slow with all 1,189 chapters
- Recommend min_connections >= 5 for smooth rotation
- Arc diagram handles full dataset well
- Heatmap always shows all 66 books (fast)

**Data Loading:**
- Uses relative path: `Path(__file__).parent.parent / 'shared-data' / 'processed'`
- If files not found, shows error in status bar
- Must run `data_processor.py` before first launch

**Export Issues:**
- Export dialog may appear behind main window
- Save location defaults to current directory
- PNG exports are 300 DPI (high quality, large file size)
- SVG exports preserve vector quality

---

**Last Updated**: 2025-10-06 (All Visualizations Complete - Project 100% Done!)

**Maintainer Notes**: Keep this file updated when making architectural changes, discovering new bugs, or implementing workarounds.

**IMPORTANT:** See `../PROJECT_STATUS.md` for current session status and next steps!

---

## 🎉 PROJECT COMPLETE!

All planned features have been successfully implemented:
- ✅ CMD Bible Reader (4 translations, search, cross-references)
- ✅ Web Visualizer (5 interactive D3.js visualizations)
- ✅ Desktop Visualizer (4 PyQt5/Plotly visualizations)
- ✅ Data Processing Pipeline (190,522 connections processed)
- ✅ Complete Documentation (README, MEMORY, STATUS, LICENSE)

The project is ready for use and distribution!

