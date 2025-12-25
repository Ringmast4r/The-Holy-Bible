# Bible Cross-Reference Visualizer - Desktop GUI

> Interactive desktop application for exploring Bible cross-references with 3D and 2D visualizations using PyQt5 and Plotly

**Created by [@Ringmast4r](https://github.com/Ringmast4r)**

> **📌 Note:** This is **one of four ways** to explore Bible cross-references in this project!
> - **🖥️ This Tool (Desktop GUI)** - Professional 3D graphs and offline analysis
> - **💻 [CMD Reader](../bible-analysis-tool/)** - Text-based reading and search
> - **🌐 [Web Visualizer](../bible-visualizer-web/)** - Interactive browser visualizations
> - **⌨️ [Web Terminal](../bible-cmd-web/)** - Browser-based CMD demo

---

## Why Use the Desktop GUI?

**Best for:**
- 🎮 3D interactive network graphs (rotate, zoom, pan)
- 💼 Professional analysis and presentations
- 📴 Offline work (no web server needed)
- 📸 High-resolution exports (300 DPI PNG/SVG)
- 🖥️ Native desktop experience
- 📊 Complex filtering and data manipulation

**Need text reading?** Use the [CMD Reader](../bible-analysis-tool/) instead!
**Want browser-based?** Try the [Web Visualizer](../bible-visualizer-web/) instead!

---

## Features

### Current Visualizations

- **3D Network Graph** - Interactive force-directed graph using Plotly
  - Rotate, zoom, and pan through 3D space
  - Color-coded by testament (Green=OT, Cyan=NT)
  - Hover tooltips with chapter details
  - Physics-based layout

- **Arc Diagram** - Beautiful 2D arc visualization
  - Flowing arcs showing cross-references
  - Color-coded connections
  - Testament filtering

- **Heatmap** - 66x66 book connection matrix
  - Intensity-based visualization
  - Testament dividers
  - Book-to-book relationships

- **Statistics Dashboard** - Comprehensive metrics
  - Top books by connections
  - Testament distribution
  - Connection weight analysis
  - Top chapters

## Installation

### Requirements

- Python 3.8+
- Windows/Mac/Linux

### Setup

1. **Install dependencies:**
   ```bash
   cd bible-visualizer-desktop
   pip install -r requirements.txt
   ```

2. **Verify data files exist:**
   - Ensure `../shared-data/processed/graph_data.json` exists
   - If not, run: `cd ../shared-data && python data_processor.py`

## Usage

### Launch Application

```bash
python visualizer_app.py
```

Or on Windows, double-click `launch.bat`

### Controls

**Filters Panel:**
- **Testament Filter** - Show only OT, NT, or cross-testament connections
- **Min Connections Slider** - Filter weak connections
- **Reset Filters** - Clear all filters
- **Export Current View** - Save visualization as image

**3D Network Graph:**
- **Left Click + Drag** - Rotate view
- **Scroll** - Zoom in/out
- **Right Click + Drag** - Pan view
- **Hover** - Show chapter details

**Tab Navigation:**
- Switch between different visualization types
- Each view updates based on filter settings

## Data

- **Source**: Treasury of Scripture Knowledge via OpenBible.info
- **Connections**: 190,522 chapter-level cross-references
- **Chapters**: 1,189 total chapters
- **Books**: 66 Bible books

## Color Scheme

Matches the CMD tool and web visualizer:
- **Gold (#FFD700)** - Headers, highlights
- **Cyan (#00CED1)** - New Testament
- **Green (#2ecc71)** - Old Testament
- **Purple (#9370DB)** - Cross-testament connections
- **Dark Background** - For optimal contrast

## Technical Stack

- **PyQt5** - GUI framework
- **Plotly** - 3D interactive graphs
- **Matplotlib** - 2D static visualizations
- **NetworkX** - Graph algorithms and layouts
- **Seaborn** - Statistical visualizations
- **Pandas/NumPy** - Data processing

## Project Structure

```
bible-visualizer-desktop/
├── visualizer_app.py       # Main application
├── requirements.txt        # Python dependencies
├── launch.bat              # Windows launcher (optional)
├── components/
│   ├── network_view.py     # 3D network graph
│   ├── arc_view.py         # 2D arc diagram
│   ├── heatmap_view.py     # Book heatmap
│   └── stats_view.py       # Statistics dashboard
└── README.md               # This file
```

## Exporting Visualizations

All views support export:
1. Select the visualization tab
2. Click "Export Current View"
3. Choose PNG or SVG format
4. High-resolution output (300 DPI)

## Troubleshooting

### Application won't start
- Check Python version: `python --version` (need 3.8+)
- Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

### "Data files not found" error
- Run data processor: `cd ../shared-data && python data_processor.py`
- Verify `graph_data.json` exists in `../shared-data/processed/`

### 3D graph not displaying
- Ensure PyQtWebEngine is installed: `pip install PyQtWebEngine`
- Try updating Plotly: `pip install --upgrade plotly`

### Slow performance
- Increase minimum connections filter to reduce graph complexity
- Filter by testament to show fewer nodes
- Close other applications to free memory

## Performance Notes

- **3D Network**: May be slow with all 1,189 chapters
  - Recommended: Use filters to show subset
  - Minimum connections slider helps performance

- **Heatmap**: Fast, shows all 66 books simultaneously

- **Arc Diagram**: Performance depends on connection count
  - Filter to improve rendering speed

## Future Enhancements

- [ ] Community detection coloring (Louvain algorithm)
- [ ] Search by verse reference
- [ ] Click nodes to show verse text
- [ ] Animation of cross-reference patterns
- [ ] Save/load filter presets
- [ ] Export to interactive HTML
- [ ] Standalone executable (.exe)

## Related Projects

- **bible-analysis-tool** - Original CMD reader
- **bible-visualizer-web** - Web-based visualizations
- **shared-data** - Data processing scripts

## Credits

- **Treasury of Scripture Knowledge** - Cross-reference data
- **OpenBible.info** - Data digitization
- **D3.js, Plotly, NetworkX** - Visualization libraries

---

**May this tool help you explore the beautiful interconnections in God's Word!**
