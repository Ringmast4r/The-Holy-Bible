# 🎨 Bible Cross-Reference Visualizer - Web Browser

> Interactive web-based visualizations of 340,000+ Bible cross-references using D3.js

**Created by [@Ringmast4r](https://github.com/Ringmast4r)**

> **📌 Note:** This is **one of four ways** to explore Bible cross-references in this project!
> - **🌐 This Tool (Web Visualizer)** - Beautiful interactive browser visualizations
> - **💻 [CMD Reader](../bible-analysis-tool/)** - Text-based reading and search
> - **🖥️ [Desktop GUI](../bible-visualizer-desktop/)** - 3D graphs and offline analysis
> - **⌨️ [Web Terminal](../bible-cmd-web/)** - Browser-based CMD demo

---

## Why Use the Web Visualizer?

**Best for:**
- 🎨 Beautiful, stunning visualizations
- 🖱️ Interactive exploration with mouse/touch
- 📊 Seeing patterns and connections visually
- 🎯 Presentations and demonstrations
- 🌐 Easy sharing (just send a link to localhost)
- 📱 Works in any modern browser

**Need text reading?** Use the [CMD Reader](../bible-analysis-tool/) instead!
**Want 3D graphs?** Try the [Desktop GUI](../bible-visualizer-desktop/) instead!

---

## 🚀 Quick Start

### Option 1: Local Server (Recommended)

**Windows:**
```bash
# Double-click this file:
launch-server.bat

# Or run manually:
cd bible-visualizer-web
python -m http.server 8000
# Then open: http://localhost:8000/index.html
```

**Mac/Linux:**
```bash
cd bible-visualizer-web
python3 -m http.server 8000
# Then open: http://localhost:8000/index.html
```

### Option 2: Direct File Opening (Limited)

**Note:** Opening `index.html` directly may not load data due to browser CORS restrictions. Use Option 1 instead.

### What You'll See

1. **Dark themed dashboard** with 6 visualization tabs
2. **Interactive filters** at the top
3. **Beautiful visualizations** that respond to your mouse
4. **Export buttons** to save as SVG

## ✨ Features

### Current Visualizations

#### ✅ Arc Diagram
- **190,522 chapter-level connections** displayed as flowing arcs
- Color-coded by testament (Green=OT, Cyan=NT, Purple=Cross-Testament)
- Interactive hover to see connection details
- Filter by testament, book, or minimum connections
- Arc thickness represents connection strength

#### ✅ Network Graph
- **Force-directed interactive graph** with physics simulation
- Drag nodes to reposition them
- Zoom and pan with mouse/trackpad
- Top 200 most connected chapters for performance
- Hover highlighting of connections
- Reset zoom button

#### ✅ Chord Diagram
- **Circular visualization** of 66 Bible books
- Interactive ribbons showing book-to-book connections
- Hover over arcs or ribbons for details
- Testament filtering (OT, NT, or both)
- Book labels around the perimeter

#### ✅ Heatmap
- **66x66 book connection matrix**
- Color intensity shows connection strength (Yellow→Orange→Red)
- Testament dividers (gold lines)
- Hover to highlight row/column
- Interactive cell tooltips

#### ✅ Sunburst
- **Hierarchical view**: Testament → Book → Chapter
- Click to zoom into sections
- Breadcrumb navigation at bottom
- Multi-level color coding (darker = deeper level)
- Click center to zoom back out

#### ✅ Statistics Dashboard
- Top books and chapters by connections
- Testament distribution pie chart
- Connection weight histogram
- Key metrics and counts

## 📊 Data

- **344,799** verse-level cross-references
- **190,522** chapter-level connections
- **66** Bible books
- **1,189** chapters total

Data source: Treasury of Scripture Knowledge via OpenBible.info

## 🎨 Color Scheme

- **Gold (#FFD700)** - Headers, highlights
- **Cyan (#00CED1)** - New Testament, accents
- **Green (#2ecc71)** - Old Testament
- **Purple (#9370DB)** - Cross-testament connections
- **Dark Background** - For optimal contrast

## 🖱️ Controls

| Control | Function |
|---------|----------|
| **Testament Filter** | Show only OT, NT, or cross-testament refs |
| **Book Focus** | Highlight connections for specific book |
| **Min Connections** | Filter out weak connections |
| **Reset View** | Clear all filters |
| **Export SVG** | Download current visualization |

## 💻 Technical Stack

- **D3.js v7** - Data visualization
- **Vanilla JavaScript** - No framework overhead
- **CSS Grid** - Responsive layout
- **SVG** - Scalable vector graphics

## 📂 File Structure

```
bible-visualizer-web/
├── index.html              # Main dashboard
├── css/
│   └── styles.css          # Beautiful styling
├── js/
│   ├── main.js             # App controller
│   ├── data-loader.js      # Data management
│   ├── arc-diagram.js      # Arc visualization ✓
│   ├── network-graph.js    # Network (placeholder)
│   ├── chord-diagram.js    # Chord (placeholder)
│   ├── heatmap.js          # Heatmap (placeholder)
│   └── sunburst.js         # Sunburst (placeholder)
└── README.md               # This file
```

## 🌐 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## 🎯 Usage Tips

1. **Start with "All"** testament filter to see full picture
2. **Focus on a book** to explore its specific connections
3. **Increase min connections** to see only strong relationships
4. **Hover over arcs** to see verse details
5. **Hover over chapter bars** to highlight related arcs

## 🔮 Future Enhancements

- [x] Complete network graph with physics simulation ✅
- [x] Interactive chord diagram with animations ✅
- [x] Clickable heatmap cells with verse lists ✅
- [x] Sunburst with zoom functionality ✅
- [ ] Search by verse reference
- [ ] Save/share visualization states
- [ ] Custom color themes
- [ ] Mobile optimization
- [ ] Click nodes to show verse text
- [ ] Export to high-res PNG

## 🔧 Troubleshooting

### No Visualizations Showing?

**✅ FIXED IN SESSION 7** - If you're seeing blank screens:

1. **Hard Refresh Browser** - Use `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Check Browser Console** (F12) for errors
3. **Verify Files Exist**:
   - `js/preview-data.js` (97KB - instant load)
   - `../shared-data/processed/graph_data.json` (15MB - full dataset)
4. **Use HTTP Server** - Don't open as `file://` (CORS issues)

### Common Issues:

**"Data not loaded" Error:**
- Make sure you're running an HTTP server (not opening directly)
- Check that `graph_data.json` and `stats.json` exist in `../shared-data/processed/`
- Wait for preview mode banner to appear (should be instant)

**Blank Screens on Tabs:**
- This was the Session 7 bug - update to latest version
- All 5 visualizations must be initialized in `main.js`
- Check browser console for "Visualizations initialized successfully"

**Slow Loading:**
- Preview mode (200 connections) loads instantly
- Full dataset (190K connections) loads in background (10-30 seconds)
- Banner will update when full data loads

**GitHub Pages Not Updating:**
- Wait 1-2 minutes for GitHub Actions to rebuild
- Hard refresh browser to clear cache
- Check deployment status: https://github.com/Ringmast4r/PROJECT-BIBLE-A-Proselytize-Project/actions

### Developer Notes:

**Data Access Pattern:**
```javascript
// ✅ CORRECT
if (!dataLoader || !dataLoader.isLoaded) return;
const chapters = dataLoader.getChapters();
const connections = dataLoader.getConnections();

// ❌ WRONG
const data = window.bibleData;  // Doesn't exist!
```

**All Visualizations Must Be Initialized:**
```javascript
// In main.js initializeVisualizations()
this.visualizations.arc = new ArcDiagram(...);
this.visualizations.network = new NetworkGraph(...);
this.visualizations.chord = new ChordDiagram(...);
this.visualizations.heatmap = new Heatmap(...);
this.visualizations.sunburst = new Sunburst(...);
```

See `SESSION-7-SUMMARY.md` for full details on the critical bug fix.

---

## 📝 Notes

- **Data Processing**: Run `../shared-data/data_processor.py` if data files missing
- **Performance**: Large datasets may be slow on older browsers
- **Internet Required**: For D3.js CDN (or download D3.js locally)
- **Production Status**: ✅ ALL 6 TABS WORKING (as of Session 7)

## 🙏 Credits

- **Treasury of Scripture Knowledge** - Cross-reference data
- **OpenBible.info** - Data digitization
- **D3.js** - Visualization library
- **You!** - For using this tool to explore God's Word

---

**Open `index.html` in your browser to begin exploring!** 🚀
